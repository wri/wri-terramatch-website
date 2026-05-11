import { Map as MapboxMap, Marker as MapboxMarker } from "mapbox-gl";
import { FC, ReactNode, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { createRoot, Root } from "react-dom/client";

import { MediaDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { PhotosIcon } from "@/redesignComponents/foundations/Icons";
import MapPopUp from "@/redesignComponents/geospatial/MapPopUp/MapPopUp";
import PointMarker from "@/redesignComponents/geospatial/PointMarker/PointMarker";

import PopupContentMedia from "../components/PopupMedia/PopupContentMedia";
import PopupFooterMedia from "../components/PopupMedia/PopupFooterMedia";
import PopupHeaderMedia from "../components/PopupMedia/PopupHeaderMedia";
import PopupProviders from "../components/PopupProviders";
import { clearActivePopup, setActivePopup } from "../interactions/popupCoordinator";
import { MediaCallbacks } from "./mediaTypes";

type GeolocatedMedia = MediaDto & { lat: number; lng: number };

type SelectionListener = (selected: string | null) => void;
type SelectionStore = {
  get: () => string | null;
  set: (uuid: string | null) => void;
  subscribe: (listener: SelectionListener) => () => void;
};

/**
 * One React root per map; portals deliver each marker's React subtree into its
 * Mapbox-managed DOM container. Drastically lower mount cost than per-marker roots
 * (one Redux+Chakra provider tree instead of N).
 */
type MediaOverlayMount = {
  root: Root;
  update: (files: MediaDto[], callbacks: MediaCallbacks) => void;
};

const MEDIA_MARKER_BG = "#2A698D";
const MARKER_CLASS = "media-photo-marker";

const overlayMounts = new WeakMap<MapboxMap, MediaOverlayMount>();
const selectionStores = new WeakMap<MapboxMap, SelectionStore>();

const isGeolocated = (file: MediaDto): file is GeolocatedMedia => file.lat != null && file.lng != null;

// React 18 forbids synchronous unmount inside an effect cleanup or event handler; defer to a microtask.
const scheduleUnmount = (root: Root): void => {
  queueMicrotask(() => root.unmount());
};

const createSelectionStore = (map: MapboxMap): SelectionStore => {
  let selected: string | null = null;
  const listeners = new Set<SelectionListener>();
  const notify = (uuid: string | null): void => {
    listeners.forEach(listener => listener(uuid));
  };
  return {
    get: () => selected,
    set: uuid => {
      if (selected === uuid) return;
      selected = uuid;
      notify(uuid);
      if (uuid == null) {
        clearActivePopup(map, "MEDIA");
        return;
      }
      // Closer must dismiss locally without re-entering setActivePopup (avoids re-clearing other kinds).
      setActivePopup(map, "MEDIA", () => {
        if (selected !== null) {
          selected = null;
          notify(null);
        }
      });
    },
    subscribe: listener => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    }
  };
};

const getSelectionStore = (map: MapboxMap): SelectionStore => {
  let store = selectionStores.get(map);
  if (store == null) {
    store = createSelectionStore(map);
    selectionStores.set(map, store);
  }
  return store;
};

// Mapbox listens for click/mousedown/touchstart on its canvas container; our marker DOM bubbles up to it.
// Stop propagation here so a click on a media marker never triggers underlying layer click handlers
// (e.g. polygon popup) or starts a map drag/pan.
const stopPropagation = (event: Event): void => event.stopPropagation();

type MediaMarkerViewProps = {
  file: GeolocatedMedia;
  store: SelectionStore;
  callbacks: MediaCallbacks;
};

const MediaMarkerView: FC<MediaMarkerViewProps> = ({ file, store, callbacks }) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isOpen = useSyncExternalStore(
    store.subscribe,
    () => store.get() === file.uuid,
    () => false
  );

  return (
    <>
      <PointMarker
        ariaLabel={file.name}
        backgroundColor={MEDIA_MARKER_BG}
        icon={<PhotosIcon color="neutral.100" />}
        onClick={() => store.set(file.uuid)}
        showFocusState={isOpen}
        size="sm"
        triggerRef={triggerRef}
        variant="icon"
      />
      {isOpen ? (
        <MapPopUp
          anchorRef={triggerRef}
          open
          onOpenChange={next => {
            if (!next && store.get() === file.uuid) store.set(null);
          }}
          placement="right"
          header={<PopupHeaderMedia name={file.name} />}
          content={<PopupContentMedia uuid={file.uuid} thumbUrl={file.thumbUrl ?? ""} createdAt={file.createdAt} />}
          footer={
            <PopupFooterMedia
              isProjectPath={callbacks.isProjectPath}
              onDownload={() => callbacks.handleDownload(file.uuid, file.name)}
              onEdit={() => callbacks.openModalImageDetail(file)}
              onMakeCover={() => callbacks.setImageCover(file.uuid)}
              onDelete={() => callbacks.handleDelete(file.uuid)}
            />
          }
        />
      ) : null}
    </>
  );
};

type MediaMarkerPortalProps = {
  map: MapboxMap;
  lat: number;
  lng: number;
  children: ReactNode;
};

const MediaMarkerPortal: FC<MediaMarkerPortalProps> = ({ map, lat, lng, children }) => {
  // Lazy-init the host element exactly once per portal lifetime; Mapbox attaches/detaches it.
  const [el] = useState<HTMLDivElement>(() => {
    const div = document.createElement("div");
    div.className = MARKER_CLASS;
    div.addEventListener("click", stopPropagation);
    div.addEventListener("mousedown", stopPropagation);
    div.addEventListener("touchstart", stopPropagation);
    return div;
  });

  useEffect(() => {
    const marker = new MapboxMarker({ element: el }).setLngLat([lng, lat]).addTo(map);
    return () => {
      marker.remove();
    };
  }, [map, el, lng, lat]);

  return createPortal(children, el);
};

type MediaMarkersOverlayProps = {
  map: MapboxMap;
  files: GeolocatedMedia[];
  callbacks: MediaCallbacks;
  store: SelectionStore;
};

const MediaMarkersOverlay: FC<MediaMarkersOverlayProps> = ({ map, files, callbacks, store }) => (
  <>
    {files.map(file => (
      <MediaMarkerPortal key={file.uuid} map={map} lat={file.lat} lng={file.lng}>
        <MediaMarkerView file={file} store={store} callbacks={callbacks} />
      </MediaMarkerPortal>
    ))}
  </>
);

const createOverlayMount = (map: MapboxMap): MediaOverlayMount => {
  // Detached host: portals deliver content into Mapbox-managed marker DOM, this never enters the page.
  const host = document.createElement("div");
  const root = createRoot(host);
  const store = getSelectionStore(map);

  let lastFiles: GeolocatedMedia[] = [];
  let lastCallbacks: MediaCallbacks | null = null;
  const render = (): void => {
    if (lastCallbacks == null) return;
    root.render(
      <PopupProviders>
        <MediaMarkersOverlay map={map} files={lastFiles} callbacks={lastCallbacks} store={store} />
      </PopupProviders>
    );
  };

  return {
    root,
    update: (files, callbacks) => {
      lastFiles = files.filter(isGeolocated);
      lastCallbacks = callbacks;
      render();
    }
  };
};

export const addMediaMarkers = (map: MapboxMap, mediaFiles: MediaDto[], callbacks: MediaCallbacks): void => {
  let mount = overlayMounts.get(map);
  if (mount == null) {
    mount = createOverlayMount(map);
    overlayMounts.set(map, mount);
  }
  mount.update(mediaFiles, callbacks);
};

export const removeMediaMarkers = (map: MapboxMap): void => {
  const mount = overlayMounts.get(map);
  if (mount == null) return;
  selectionStores.get(map)?.set(null);
  scheduleUnmount(mount.root);
  overlayMounts.delete(map);
};
