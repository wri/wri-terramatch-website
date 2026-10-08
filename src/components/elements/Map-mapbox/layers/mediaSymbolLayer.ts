import type { FeatureCollection, Point } from "geojson";
import { GeoJSONSource, Map as MapboxMap, MapMouseEvent, Popup } from "mapbox-gl";
import { createElement } from "react";
import { createRoot } from "react-dom/client";

import { LAYERS_NAMES } from "@/constants/layers";

import { MediaPopup } from "../components/MediaPopup";
import { clearActivePopup, setActivePopup } from "../interactions/popupCoordinator";
import { registerPopup, removePopups } from "../interactions/popups";
import { getPulsingDot } from "../pulsing.dot";
import { MapMedia, MediaCallbacks } from "./mediaTypes";

const PULSING_DOT_IMAGE = "pulsing-dot";

function stringFromGeoJsonProperty(value: unknown): string {
  return typeof value === "string" ? value : "";
}

type MediaFeatureProperties = Pick<MapMedia, "uuid" | "name" | "createdAt" | "thumbUrl">;

const mediaClickHandlers = new WeakMap<MapboxMap, (e: MapMouseEvent) => void>();
// The click handler is registered once per map, so it reads the latest callbacks from here.
const mediaCallbacks = new WeakMap<MapboxMap, MediaCallbacks>();

const isStyleAlive = (map: MapboxMap): boolean => {
  try {
    return map.getStyle() != null;
  } catch {
    return false;
  }
};

export const removeMediaSymbolLayer = (map: MapboxMap): void => {
  const layerName = LAYERS_NAMES.MEDIA_IMAGES;

  const existingHandler = mediaClickHandlers.get(map);
  if (existingHandler != null) {
    try {
      map.off("click", layerName, existingHandler);
    } catch {
      // noop
    }
    mediaClickHandlers.delete(map);
  }
  mediaCallbacks.delete(map);

  removePopups(map, "MEDIA");
  clearActivePopup(map, "MEDIA");

  if (!isStyleAlive(map)) return;

  if (map.getLayer(layerName) != null) map.removeLayer(layerName);
  if (map.getSource(layerName) != null) map.removeSource(layerName);
  if (map.hasImage(PULSING_DOT_IMAGE)) map.removeImage(PULSING_DOT_IMAGE);
};

const toFeatureCollection = (mediaFiles: MapMedia[]): FeatureCollection<Point, MediaFeatureProperties> => ({
  type: "FeatureCollection",
  features: mediaFiles.map(({ uuid, name, createdAt, thumbUrl, lng, lat }) => ({
    type: "Feature",
    geometry: { type: "Point", coordinates: [lng, lat] },
    properties: { uuid, name, createdAt, thumbUrl }
  }))
});

const createClickHandler =
  (map: MapboxMap) =>
  (e: MapMouseEvent): void => {
    e.preventDefault();
    const feature = e.features?.[0];
    const callbacks = mediaCallbacks.get(map);
    if (feature == null || callbacks == null) return;
    removePopups(map, "MEDIA");

    const popupContent = document.createElement("div");
    popupContent.className = "popup-content-media";
    const root = createRoot(popupContent);

    const props = feature.properties ?? {};
    const uuid = stringFromGeoJsonProperty(props.uuid);
    const name = stringFromGeoJsonProperty(props.name);
    root.render(
      createElement(MediaPopup, {
        uuid,
        name,
        created_date: stringFromGeoJsonProperty(props.createdAt),
        thumbUrl: stringFromGeoJsonProperty(props.thumbUrl),
        onClose: () => removePopups(map, "MEDIA"),
        handleDownload: () => callbacks.handleDownload(uuid, name),
        coverImage: () => callbacks.setImageCover(uuid),
        handleDelete: () => callbacks.handleDelete(uuid),
        openModalImageDetail: () => callbacks.openModalImageDetail(uuid),
        isProjectPath: callbacks.isProjectPath
      })
    );

    const coordinates = (feature.geometry as GeoJSON.Point).coordinates as [number, number];
    const mediaPopup = new Popup({ className: "popup-media", closeButton: false })
      .setLngLat(coordinates)
      .setDOMContent(popupContent)
      .addTo(map);
    mediaPopup.on("close", () => {
      queueMicrotask(() => root.unmount());
      clearActivePopup(map, "MEDIA");
    });

    registerPopup(map, "MEDIA", mediaPopup);
    setActivePopup(map, "MEDIA", () => removePopups(map, "MEDIA"));
  };

export const upsertMediaSymbolLayer = (
  map: MapboxMap,
  mediaFiles: MapMedia[],
  callbacks: MediaCallbacks,
  visible: boolean
): void => {
  const layerName = LAYERS_NAMES.MEDIA_IMAGES;
  mediaCallbacks.set(map, callbacks);

  if (!isStyleAlive(map)) return;

  const data = toFeatureCollection(mediaFiles);
  const source = map.getSource<GeoJSONSource>(layerName);
  if (source != null) {
    source.setData(data);
  } else {
    if (!map.hasImage(PULSING_DOT_IMAGE)) {
      map.addImage(PULSING_DOT_IMAGE, getPulsingDot(map, 120), { pixelRatio: 4 });
    }
    map.addSource(layerName, { type: "geojson", data });
  }

  if (map.getLayer(layerName) == null) {
    map.addLayer({ id: layerName, type: "symbol", source: layerName, layout: { "icon-image": PULSING_DOT_IMAGE } });
  }
  map.moveLayer(layerName);
  map.setLayoutProperty(layerName, "visibility", visible ? "visible" : "none");
  if (!visible) removePopups(map, "MEDIA");

  if (!mediaClickHandlers.has(map)) {
    const clickHandler = createClickHandler(map);
    map.on("click", layerName, clickHandler);
    mediaClickHandlers.set(map, clickHandler);
  }
};
