import { Map as MapboxMap, Marker as MapboxMarker } from "mapbox-gl";
import {
  FC,
  memo,
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore
} from "react";
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

type SelectionListener = () => void;

type SelectionStore = {
  get: () => string | null;
  set: (uuid: string | null) => void;
  subscribe: (uuid: string, listener: SelectionListener) => () => void;
};

type CallbacksRef = MutableRefObject<MediaCallbacks>;

type MediaOverlayMount = {
  root: Root;
  update: (files: MediaDto[], callbacks: MediaCallbacks) => void;
};

const MEDIA_MARKER_BG = "#2A698D";
const MARKER_CLASS = "media-photo-marker";
const ACTIVE_MARKER_Z_INDEX = "10";

const overlayMounts = new WeakMap<MapboxMap, MediaOverlayMount>();
const selectionStores = new WeakMap<MapboxMap, SelectionStore>();

const isGeolocated = (file: MediaDto): file is GeolocatedMedia => file.lat != null && file.lng != null;

const scheduleUnmount = (root: Root): void => {
  queueMicrotask(() => root.unmount());
};

const createSelectionStore = (map: MapboxMap): SelectionStore => {
  let selected: string | null = null;
  const listenersByUuid = new Map<string, Set<SelectionListener>>();

  const notifyUuid = (uuid: string | null): void => {
    if (uuid == null) return;
    const set = listenersByUuid.get(uuid);
    if (set == null) return;
    set.forEach(listener => listener());
  };

  return {
    get: () => selected,
    set: uuid => {
      if (selected === uuid) return;
      const prev = selected;
      selected = uuid;
      notifyUuid(prev);
      notifyUuid(uuid);
      if (uuid == null) {
        clearActivePopup(map, "MEDIA");
        return;
      }
      setActivePopup(map, "MEDIA", () => {
        if (selected == null) return;
        const stale = selected;
        selected = null;
        notifyUuid(stale);
      });
    },
    subscribe: (uuid, listener) => {
      let set = listenersByUuid.get(uuid);
      if (set == null) {
        set = new Set();
        listenersByUuid.set(uuid, set);
      }
      set.add(listener);
      return () => {
        const target = listenersByUuid.get(uuid);
        if (target == null) return;
        target.delete(listener);
        if (target.size === 0) listenersByUuid.delete(uuid);
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

const stopPropagation = (event: Event): void => event.stopPropagation();

const getServerSnapshot = (): boolean => false;

type MediaMarkerViewProps = {
  file: GeolocatedMedia;
  store: SelectionStore;
  callbacksRef: CallbacksRef;
  isOpen: boolean;
};

const MediaMarkerView: FC<MediaMarkerViewProps> = ({ file, store, callbacksRef, isOpen }) => {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleSelect = useCallback(() => store.set(file.uuid), [store, file.uuid]);
  const handleOpenChange = useCallback(
    (next: boolean): void => {
      if (!next && store.get() === file.uuid) store.set(null);
    },
    [store, file.uuid]
  );

  const popupHeader = useMemo(() => <PopupHeaderMedia name={file.name} />, [file.name]);
  const popupContent = useMemo(
    () => <PopupContentMedia uuid={file.uuid} thumbUrl={file.thumbUrl ?? ""} createdAt={file.createdAt} />,
    [file.uuid, file.thumbUrl, file.createdAt]
  );
  const popupFooter = useMemo(
    () => (
      <PopupFooterMedia
        isProjectPath={callbacksRef.current.isProjectPath}
        onDownload={() => callbacksRef.current.handleDownload(file.uuid, file.name)}
        onEdit={() => callbacksRef.current.openModalImageDetail(file)}
        onMakeCover={() => callbacksRef.current.setImageCover(file.uuid)}
        onDelete={() => callbacksRef.current.handleDelete(file.uuid)}
      />
    ),
    [callbacksRef, file]
  );

  return (
    <>
      <PointMarker
        ariaLabel={file.name}
        backgroundColor={MEDIA_MARKER_BG}
        icon={<PhotosIcon color="neutral.100" />}
        onClick={handleSelect}
        showFocusState={isOpen}
        size="sm"
        triggerRef={triggerRef}
        variant="icon"
      />
      {isOpen ? (
        <MapPopUp
          anchorRef={triggerRef}
          open
          onOpenChange={handleOpenChange}
          placement="right"
          header={popupHeader}
          content={popupContent}
          footer={popupFooter}
        />
      ) : null}
    </>
  );
};

const MemoMediaMarkerView = memo(MediaMarkerView);

type MediaMarkerPortalProps = {
  map: MapboxMap;
  file: GeolocatedMedia;
  store: SelectionStore;
  callbacksRef: CallbacksRef;
};

const MediaMarkerPortal: FC<MediaMarkerPortalProps> = ({ map, file, store, callbacksRef }) => {
  const [el] = useState<HTMLDivElement>(() => {
    const div = document.createElement("div");
    div.className = MARKER_CLASS;
    div.addEventListener("click", stopPropagation);
    div.addEventListener("mousedown", stopPropagation);
    div.addEventListener("touchstart", stopPropagation);
    return div;
  });

  const subscribe = useCallback(
    (listener: SelectionListener) => store.subscribe(file.uuid, listener),
    [store, file.uuid]
  );
  const getSnapshot = useCallback(() => store.get() === file.uuid, [store, file.uuid]);
  const isOpen = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    const marker = new MapboxMarker({ element: el }).setLngLat([file.lng, file.lat]).addTo(map);
    return () => {
      marker.remove();
    };
  }, [map, el, file.lng, file.lat]);

  useEffect(() => {
    el.style.zIndex = isOpen ? ACTIVE_MARKER_Z_INDEX : "";
  }, [el, isOpen]);

  return createPortal(
    <MemoMediaMarkerView file={file} store={store} callbacksRef={callbacksRef} isOpen={isOpen} />,
    el
  );
};

const MemoMediaMarkerPortal = memo(MediaMarkerPortal);

type MediaMarkersOverlayProps = {
  map: MapboxMap;
  files: GeolocatedMedia[];
  callbacksRef: CallbacksRef;
  store: SelectionStore;
};

const MediaMarkersOverlay: FC<MediaMarkersOverlayProps> = ({ map, files, callbacksRef, store }) => (
  <>
    {files.map(file => (
      <MemoMediaMarkerPortal key={file.uuid} map={map} file={file} store={store} callbacksRef={callbacksRef} />
    ))}
  </>
);

const createOverlayMount = (map: MapboxMap): MediaOverlayMount => {
  const host = document.createElement("div");
  const root = createRoot(host);
  const store = getSelectionStore(map);

  const callbacksRef: CallbacksRef = { current: null as unknown as MediaCallbacks };

  let lastFiles: GeolocatedMedia[] = [];
  const render = (): void => {
    if (callbacksRef.current == null) return;
    root.render(
      <PopupProviders>
        <MediaMarkersOverlay map={map} files={lastFiles} callbacksRef={callbacksRef} store={store} />
      </PopupProviders>
    );
  };

  return {
    root,
    update: (files, callbacks) => {
      lastFiles = files.filter(isGeolocated);
      callbacksRef.current = callbacks;
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
