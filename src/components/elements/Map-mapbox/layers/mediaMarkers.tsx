import { Box, Flex } from "@chakra-ui/react";
import { Map as MapboxMap, Marker as MapboxMarker, Popup as MapboxPopup } from "mapbox-gl";
import { FC, memo, MutableRefObject, useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { createRoot, Root } from "react-dom/client";

import CloseButton from "@/redesignComponents/actions/Buttons/CloseButton/CloseButton";
import { PhotosIcon } from "@/redesignComponents/foundations/Icons";
import PointMarker from "@/redesignComponents/geospatial/PointMarker/PointMarker";

import PopupContentMedia from "../components/PopupMedia/PopupContentMedia";
import PopupFooterMedia from "../components/PopupMedia/PopupFooterMedia";
import PopupHeaderMedia from "../components/PopupMedia/PopupHeaderMedia";
import PopupProviders from "../components/PopupProviders";
import { clearActivePopup, setActivePopup } from "../interactions/popupCoordinator";
import { registerPopup, removePopups } from "../interactions/popups";
import { MapMedia, MediaCallbacks } from "./mediaTypes";

type SelectionListener = () => void;

type SelectionStore = {
  get: () => string | null;
  set: (uuid: string | null) => void;
  subscribe: (uuid: string, listener: SelectionListener) => () => void;
};

type CallbacksRef = MutableRefObject<MediaCallbacks>;

type VisibleRef = MutableRefObject<boolean>;

type MediaOverlayMount = {
  root: Root;
  update: (files: MapMedia[], callbacks: MediaCallbacks, visible: boolean, readOnly?: boolean) => void;
};

const MEDIA_MARKER_BG = "#2A698D";
const MARKER_CLASS = "media-photo-marker";
const ACTIVE_MARKER_Z_INDEX = "10";
const MEDIA_POPUP_OFFSET_PX = 24;

const overlayMounts = new WeakMap<MapboxMap, MediaOverlayMount>();
const selectionStores = new WeakMap<MapboxMap, SelectionStore>();

const applyMarkerElementVisibility = (el: HTMLElement, visible: boolean): void => {
  el.style.display = visible ? "" : "none";
  el.style.pointerEvents = visible ? "" : "none";
};

const setMountedMarkerElementsVisible = (map: MapboxMap, visible: boolean): void => {
  const markers = map.getContainer().querySelectorAll<HTMLElement>(`.${MARKER_CLASS}`);
  markers.forEach(el => applyMarkerElementVisibility(el, visible));
};

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
        removePopups(map, "MEDIA");
        return;
      }
      setActivePopup(map, "MEDIA", () => {
        if (selected == null) return;
        const stale = selected;
        selected = null;
        notifyUuid(stale);
        removePopups(map, "MEDIA");
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

type MediaPopupCardProps = {
  file: MapMedia;
  callbacksRef: CallbacksRef;
  readOnly: boolean;
  onClose: () => void;
};

const MediaPopupCard: FC<MediaPopupCardProps> = ({ file, callbacksRef, readOnly, onClose }) => {
  const popupFooter = useMemo(
    () =>
      readOnly ? null : (
        <PopupFooterMedia
          isProjectPath={callbacksRef.current.isProjectPath}
          onDownload={() => callbacksRef.current.handleDownload(file.uuid, file.name)}
          onEdit={() => callbacksRef.current.openModalImageDetail(file.uuid)}
          onMakeCover={() => callbacksRef.current.setImageCover(file.uuid)}
          onDelete={() => callbacksRef.current.handleDelete(file.uuid)}
        />
      ),
    [callbacksRef, file, readOnly]
  );

  return (
    <Box
      bg="neutral.100"
      borderWidth="1px"
      borderColor="neutral.300"
      borderRadius="0.5rem"
      overflow="hidden"
      width="fit-content"
      maxW="max-content"
      boxShadow="0 0.0625rem 0.125rem -0.0625rem rgba(0, 0, 0, 0.10), 0 0.0625rem 0.1875rem 0 rgba(0, 0, 0, 0.10)"
    >
      <Flex align="center" justify="space-between" gap={2} px={4} pt={4} pb={2}>
        <PopupHeaderMedia name={file.name} />
        <CloseButton onClick={onClose} />
      </Flex>
      <PopupContentMedia uuid={file.uuid} thumbUrl={file.thumbUrl ?? ""} createdAt={file.createdAt} />
      {popupFooter != null ? (
        <Box px={4} pb={4} pt={2}>
          {popupFooter}
        </Box>
      ) : null}
    </Box>
  );
};

const MemoMediaPopupCard = memo(MediaPopupCard);

type MediaMarkerViewProps = {
  file: MapMedia;
  store: SelectionStore;
  isOpen: boolean;
};

const MediaMarkerView: FC<MediaMarkerViewProps> = ({ file, store, isOpen }) => {
  const handleSelect = useCallback(() => store.set(file.uuid), [store, file.uuid]);

  return (
    <PointMarker
      ariaLabel={file.name}
      backgroundColor={MEDIA_MARKER_BG}
      icon={<PhotosIcon color="neutral.100" />}
      onClick={handleSelect}
      showFocusState={isOpen}
      size="sm"
      variant="icon"
    />
  );
};

const MemoMediaMarkerView = memo(MediaMarkerView);

type MediaMarkerPortalProps = {
  map: MapboxMap;
  file: MapMedia;
  store: SelectionStore;
  callbacksRef: CallbacksRef;
  readOnly: boolean;
  visibleRef: VisibleRef;
};

const MediaMarkerPortal: FC<MediaMarkerPortalProps> = ({ map, file, store, callbacksRef, readOnly, visibleRef }) => {
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

  applyMarkerElementVisibility(el, visibleRef.current);

  useEffect(() => {
    const marker = new MapboxMarker({ element: el }).setLngLat([file.lng, file.lat]).addTo(map);
    return () => {
      marker.remove();
    };
  }, [map, el, file.lng, file.lat]);

  useEffect(() => {
    el.style.zIndex = isOpen ? ACTIVE_MARKER_Z_INDEX : "";
  }, [el, isOpen]);

  useEffect(() => {
    if (!isOpen || !visibleRef.current) return;

    removePopups(map, "MEDIA");

    const container = document.createElement("div");
    container.className = "popup-content-map";
    const root = createRoot(container);
    const popup = new MapboxPopup({
      className: "popup-map no-tip",
      closeButton: false,
      closeOnClick: false,
      focusAfterOpen: false,
      maxWidth: "none",
      anchor: "left",
      offset: MEDIA_POPUP_OFFSET_PX
    })
      .setLngLat([file.lng, file.lat])
      .setDOMContent(container)
      .addTo(map);

    registerPopup(map, "MEDIA", popup);

    const handleClose = (): void => {
      if (store.get() === file.uuid) store.set(null);
    };

    root.render(
      <PopupProviders>
        <MemoMediaPopupCard file={file} callbacksRef={callbacksRef} readOnly={readOnly} onClose={handleClose} />
      </PopupProviders>
    );

    return () => {
      popup.remove();
      scheduleUnmount(root);
    };
  }, [isOpen, visibleRef, map, file, store, callbacksRef, readOnly]);

  return createPortal(<MemoMediaMarkerView file={file} store={store} isOpen={isOpen} />, el);
};

const MemoMediaMarkerPortal = memo(MediaMarkerPortal);

type MediaMarkersOverlayProps = {
  map: MapboxMap;
  files: MapMedia[];
  callbacksRef: CallbacksRef;
  store: SelectionStore;
  readOnly: boolean;
  visibleRef: VisibleRef;
};

const MediaMarkersOverlay: FC<MediaMarkersOverlayProps> = ({
  map,
  files,
  callbacksRef,
  store,
  readOnly,
  visibleRef
}) => (
  <>
    {files.map(file => (
      <MemoMediaMarkerPortal
        key={file.uuid}
        map={map}
        file={file}
        store={store}
        callbacksRef={callbacksRef}
        readOnly={readOnly}
        visibleRef={visibleRef}
      />
    ))}
  </>
);

const createOverlayMount = (map: MapboxMap): MediaOverlayMount => {
  const host = document.createElement("div");
  const root = createRoot(host);
  const store = getSelectionStore(map);

  const callbacksRef: CallbacksRef = { current: null as unknown as MediaCallbacks };
  const visibleRef: VisibleRef = { current: false };

  let lastFiles: MapMedia[] | null = null;
  let lastReadOnly = false;

  const render = (): void => {
    if (callbacksRef.current == null) return;
    root.render(
      <PopupProviders>
        <MediaMarkersOverlay
          map={map}
          files={lastFiles ?? []}
          callbacksRef={callbacksRef}
          store={store}
          readOnly={lastReadOnly}
          visibleRef={visibleRef}
        />
      </PopupProviders>
    );
  };

  return {
    root,
    update: (files, callbacks, visible, readOnly = false) => {
      const sameFiles = files === lastFiles;
      const readOnlyChanged = lastReadOnly !== readOnly;
      const visibilityChanged = visibleRef.current !== visible;
      const hadCallbacks = callbacksRef.current != null;

      lastFiles = files;
      lastReadOnly = readOnly;
      visibleRef.current = visible;
      callbacksRef.current = callbacks;

      if (!visible) {
        store.set(null);
      }

      if (visibilityChanged) {
        setMountedMarkerElementsVisible(map, visible);
      }

      if (hadCallbacks && sameFiles && !readOnlyChanged) return;

      render();
    }
  };
};

export const addMediaMarkers = (
  map: MapboxMap,
  mediaFiles: MapMedia[],
  callbacks: MediaCallbacks,
  visible = false,
  readOnly = false
): void => {
  let mount = overlayMounts.get(map);
  if (mount == null) {
    mount = createOverlayMount(map);
    overlayMounts.set(map, mount);
  }
  mount.update(mediaFiles, callbacks, visible, readOnly);
};

export const removeMediaMarkers = (map: MapboxMap): void => {
  const mount = overlayMounts.get(map);
  if (mount == null) return;
  selectionStores.get(map)?.set(null);
  removePopups(map, "MEDIA");
  scheduleUnmount(mount.root);
  overlayMounts.delete(map);
};
