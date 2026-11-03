import type { FeatureCollection, Point as GeoJsonPoint } from "geojson";
import type {
  ExpressionSpecification,
  GeoJSONSource,
  Map as MapboxMap,
  MapMouseEvent,
  Point,
  SymbolLayerSpecification
} from "mapbox-gl";
import { Popup } from "mapbox-gl";
import { createRoot, Root } from "react-dom/client";

import MediaPopupCard from "../components/PopupMedia/MediaPopupCard";
import PopupProviders from "../components/PopupProviders";
import { clearActivePopup, setActivePopup } from "../interactions/popupCoordinator";
import { registerPopup, removePopups } from "../interactions/popups";
import { findMediaPhotoAt, MEDIA_PHOTO_BASE_LAYER_ID, MEDIA_PHOTO_SOURCE_ID } from "./mediaPhotoHitTest";
import {
  addMediaPhotoImages,
  getMediaPhotoImageName,
  MediaPhotoAppearance,
  removeMediaPhotoImages
} from "./mediaPhotoImages";
import { MapMedia, MediaCallbacks } from "./mediaTypes";
import { isStyleAlive } from "./styleGuards";

const MEDIA_POPUP_OFFSET_PX = 24;

type MediaPhotoStateKey = "hovered" | "selected";

const isHovered: ExpressionSpecification = ["boolean", ["feature-state", "hovered"], false];
const isSelected: ExpressionSpecification = ["boolean", ["feature-state", "selected"], false];

type PhotoLayer = {
  id: string;
  appearance: MediaPhotoAppearance;
  isShown: ExpressionSpecification;
};

const PHOTO_LAYERS: PhotoLayer[] = [
  { id: MEDIA_PHOTO_BASE_LAYER_ID, appearance: "default", isShown: ["!", ["any", isHovered, isSelected]] },
  { id: `${MEDIA_PHOTO_BASE_LAYER_ID}-hovered`, appearance: "hovered", isShown: ["all", isHovered, ["!", isSelected]] },
  {
    id: `${MEDIA_PHOTO_BASE_LAYER_ID}-selected`,
    appearance: "selected",
    isShown: ["all", isSelected, ["!", isHovered]]
  },
  {
    id: `${MEDIA_PHOTO_BASE_LAYER_ID}-selected-hovered`,
    appearance: "selectedHovered",
    isShown: ["all", isSelected, isHovered]
  }
];

const toLayerSpecification = ({ id, appearance, isShown }: PhotoLayer): SymbolLayerSpecification => ({
  id,
  type: "symbol",
  source: MEDIA_PHOTO_SOURCE_ID,
  layout: {
    "icon-image": getMediaPhotoImageName(appearance),
    "icon-allow-overlap": true,
    "icon-ignore-placement": true,
    "symbol-z-order": "source"
  },
  paint: { "icon-opacity": ["case", isShown, 1, 0] }
});

const toFeatureCollection = (files: MapMedia[]): FeatureCollection<GeoJsonPoint, Pick<MapMedia, "uuid">> => ({
  type: "FeatureCollection",
  features: files.map(({ uuid, lng, lat }) => ({
    type: "Feature",
    geometry: { type: "Point", coordinates: [lng, lat] },
    properties: { uuid }
  }))
});

export type MediaPhotoLayerOptions = {
  callbacks: MediaCallbacks;
  visible: boolean;
  readOnly: boolean;
  isDrawing: () => boolean;
};

type PhotoPopup = {
  popup: Popup;
  root: Root;
};

type MediaPhotoLayerState = Omit<MediaPhotoLayerOptions, "visible"> & {
  files: MapMedia[];
  filesByUuid: Map<string, MapMedia>;
  hoveredUuid: string | null;
  selectedUuid: string | null;
  popup: PhotoPopup | null;
  detachListeners: () => void;
};

const layerStates = new WeakMap<MapboxMap, MediaPhotoLayerState>();

const setPhotoState = (map: MapboxMap, uuid: string | null, key: MediaPhotoStateKey, value: boolean): void => {
  if (uuid == null || map.getSource(MEDIA_PHOTO_SOURCE_ID) == null) return;
  map.setFeatureState({ source: MEDIA_PHOTO_SOURCE_ID, id: uuid }, { [key]: value });
};

const setHoveredPhoto = (map: MapboxMap, state: MediaPhotoLayerState, uuid: string | null): void => {
  if (state.hoveredUuid === uuid) return;
  setPhotoState(map, state.hoveredUuid, "hovered", false);
  state.hoveredUuid = uuid;
  setPhotoState(map, uuid, "hovered", true);

  const containerStyle = map.getCanvasContainer().style;
  if (uuid == null) {
    containerStyle.removeProperty("cursor");
  } else {
    containerStyle.setProperty("cursor", "pointer");
  }
};

const closePhotoPopup = (state: MediaPhotoLayerState): void => {
  const current = state.popup;
  if (current == null) return;
  state.popup = null;
  current.popup.remove();
  queueMicrotask(() => current.root.unmount());
};

const renderPhotoPopup = (map: MapboxMap, state: MediaPhotoLayerState): void => {
  const file = state.selectedUuid == null ? undefined : state.filesByUuid.get(state.selectedUuid);
  if (state.popup == null || file == null) return;

  state.popup.popup.setLngLat([file.lng, file.lat]);
  state.popup.root.render(
    <PopupProviders>
      <MediaPopupCard
        file={file}
        readOnly={state.readOnly}
        isProjectPath={state.callbacks.isProjectPath}
        onClose={() => selectPhoto(map, state, null)}
        onDownload={() => state.callbacks.handleDownload(file.uuid, file.name)}
        onEdit={() => state.callbacks.openModalImageDetail(file.uuid)}
        onMakeCover={() => state.callbacks.setImageCover(file.uuid)}
        onDelete={() => state.callbacks.handleDelete(file.uuid)}
      />
    </PopupProviders>
  );
};

const openPhotoPopup = (map: MapboxMap, state: MediaPhotoLayerState, file: MapMedia): void => {
  removePopups(map, "MEDIA");

  const container = document.createElement("div");
  container.className = "popup-content-map";
  const popup = new Popup({
    className: "popup-map no-tip",
    closeButton: false,
    closeOnClick: false,
    focusAfterOpen: false,
    maxWidth: "none",
    anchor: "left",
    offset: MEDIA_POPUP_OFFSET_PX
  })
    .setLngLat([file.lng, file.lat])
    .setDOMContent(container);

  const photoPopup: PhotoPopup = { popup, root: createRoot(container) };
  popup.on("close", () => {
    if (state.popup === photoPopup) selectPhoto(map, state, null);
  });
  state.popup = photoPopup;

  renderPhotoPopup(map, state);
  popup.addTo(map);
  registerPopup(map, "MEDIA", popup);
};

const selectPhoto = (map: MapboxMap, state: MediaPhotoLayerState, uuid: string | null): void => {
  if (state.selectedUuid === uuid) return;
  closePhotoPopup(state);
  setPhotoState(map, state.selectedUuid, "selected", false);

  const file = uuid == null ? undefined : state.filesByUuid.get(uuid);
  state.selectedUuid = file?.uuid ?? null;
  if (file == null) {
    clearActivePopup(map, "MEDIA");
    return;
  }

  setPhotoState(map, file.uuid, "selected", true);
  openPhotoPopup(map, state, file);
  setActivePopup(map, "MEDIA", () => selectPhoto(map, state, null));
};

const attachListeners = (map: MapboxMap, state: MediaPhotoLayerState): (() => void) => {
  let pendingHoverPoint: Point | null = null;
  let hoverFrame: number | null = null;

  const onMouseMove = (e: MapMouseEvent): void => {
    const isIdlePointer = e.originalEvent.buttons === 0 && !state.isDrawing();
    pendingHoverPoint = isIdlePointer ? e.point : null;
    if (hoverFrame != null) return;
    hoverFrame = requestAnimationFrame(() => {
      hoverFrame = null;
      setHoveredPhoto(map, state, pendingHoverPoint == null ? null : findMediaPhotoAt(map, pendingHoverPoint));
    });
  };

  const onMouseOut = (): void => {
    if (hoverFrame != null) cancelAnimationFrame(hoverFrame);
    hoverFrame = null;
    setHoveredPhoto(map, state, null);
  };

  const onClick = (e: MapMouseEvent): void => {
    if (state.isDrawing()) return;
    const uuid = findMediaPhotoAt(map, e.point);
    if (uuid == null) return;
    e.preventDefault();
    selectPhoto(map, state, uuid);
  };

  map.on("mousemove", onMouseMove);
  map.on("mouseout", onMouseOut);
  map.on("click", onClick);

  return () => {
    map.off("mousemove", onMouseMove);
    map.off("mouseout", onMouseOut);
    map.off("click", onClick);
    if (hoverFrame != null) cancelAnimationFrame(hoverFrame);
  };
};

const getOrCreateState = (map: MapboxMap, options: MediaPhotoLayerOptions): MediaPhotoLayerState => {
  const existing = layerStates.get(map);
  if (existing != null) return existing;

  const state: MediaPhotoLayerState = {
    callbacks: options.callbacks,
    readOnly: options.readOnly,
    isDrawing: options.isDrawing,
    files: [],
    filesByUuid: new Map(),
    hoveredUuid: null,
    selectedUuid: null,
    popup: null,
    detachListeners: () => undefined
  };
  state.detachListeners = attachListeners(map, state);
  layerStates.set(map, state);
  return state;
};

const upsertSourceAndLayers = (map: MapboxMap, files: MapMedia[], filesChanged: boolean, visible: boolean): void => {
  addMediaPhotoImages(map);

  const source = map.getSource<GeoJSONSource>(MEDIA_PHOTO_SOURCE_ID);
  if (source == null) {
    map.addSource(MEDIA_PHOTO_SOURCE_ID, { type: "geojson", data: toFeatureCollection(files), promoteId: "uuid" });
  } else if (filesChanged) {
    source.setData(toFeatureCollection(files));
  }

  for (const layer of PHOTO_LAYERS) {
    if (map.getLayer(layer.id) == null) map.addLayer(toLayerSpecification(layer));
    map.moveLayer(layer.id);
    map.setLayoutProperty(layer.id, "visibility", visible ? "visible" : "none");
  }
};

export const upsertMediaPhotoLayer = (map: MapboxMap, files: MapMedia[], options: MediaPhotoLayerOptions): void => {
  const state = getOrCreateState(map, options);
  const filesChanged = files !== state.files;
  if (filesChanged) {
    state.files = files;
    state.filesByUuid = new Map(files.map(file => [file.uuid, file]));
  }
  state.callbacks = options.callbacks;
  state.readOnly = options.readOnly;
  state.isDrawing = options.isDrawing;

  upsertSourceAndLayers(map, files, filesChanged, options.visible);

  const isShown = (uuid: string | null): boolean => options.visible && uuid != null && state.filesByUuid.has(uuid);
  if (!isShown(state.hoveredUuid)) setHoveredPhoto(map, state, null);
  if (!isShown(state.selectedUuid)) selectPhoto(map, state, null);

  setPhotoState(map, state.hoveredUuid, "hovered", true);
  setPhotoState(map, state.selectedUuid, "selected", true);
  renderPhotoPopup(map, state);
};

export const removeMediaPhotoLayer = (map: MapboxMap): void => {
  const state = layerStates.get(map);
  if (state == null) return;
  layerStates.delete(map);
  state.detachListeners();
  closePhotoPopup(state);
  clearActivePopup(map, "MEDIA");
  map.getCanvasContainer().style.removeProperty("cursor");

  if (!isStyleAlive(map)) return;
  for (const { id } of [...PHOTO_LAYERS].reverse()) {
    if (map.getLayer(id) != null) map.removeLayer(id);
  }
  if (map.getSource(MEDIA_PHOTO_SOURCE_ID) != null) map.removeSource(MEDIA_PHOTO_SOURCE_ID);
  removeMediaPhotoImages(map);
};
