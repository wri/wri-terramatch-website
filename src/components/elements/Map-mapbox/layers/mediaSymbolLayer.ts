import { Map as MapboxMap, MapMouseEvent, Popup } from "mapbox-gl";
import { createElement } from "react";
import { createRoot } from "react-dom/client";

import { LAYERS_NAMES } from "@/constants/layers";
import { MediaDto } from "@/generated/v3/entityService/entityServiceSchemas";

import { MediaPopup } from "../components/MediaPopup";
import { Feature, GeoJsonProperties, Geometry } from "../GeoJSON";
import { clearActivePopup, setActivePopup } from "../interactions/popupCoordinator";
import { registerPopup, removePopups } from "../interactions/popups";
import { getPulsingDot } from "../pulsing.dot";
import { MediaCallbacks } from "./mediaTypes";

const PULSING_DOT_IMAGE = "pulsing-dot";

function stringFromGeoJsonProperty(value: unknown): string {
  return typeof value === "string" ? value : "";
}

const mediaClickHandlers = new WeakMap<MapboxMap, (e: MapMouseEvent) => void>();

// Mapbox throws on style ops after `map.remove()` or during style swaps because `map.style` becomes undefined.
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
      // map may already be removed; safe to ignore
    }
    mediaClickHandlers.delete(map);
  }

  removePopups(map, "MEDIA");
  clearActivePopup(map, "MEDIA");

  if (!isStyleAlive(map)) return;

  if (map.getLayer(layerName) != null) map.removeLayer(layerName);
  if (map.getSource(layerName) != null) map.removeSource(layerName);
  if (map.hasImage(PULSING_DOT_IMAGE)) map.removeImage(PULSING_DOT_IMAGE);
};

export const addMediaSymbolLayer = (map: MapboxMap, mediaFiles: MediaDto[], callbacks: MediaCallbacks): void => {
  const layerName = LAYERS_NAMES.MEDIA_IMAGES;
  removeMediaSymbolLayer(map);

  if (!isStyleAlive(map)) return;

  const geolocated = mediaFiles.filter(file => file.lat != null && file.lng != null);
  if (geolocated.length === 0) return;

  const features: Feature<Geometry, GeoJsonProperties>[] = geolocated.map(file => ({
    type: "Feature",
    geometry: { type: "Point", coordinates: [file.lng as number, file.lat as number] },
    properties: {
      uuid: file.uuid,
      name: file.name,
      created_date: file.createdAt,
      thumbUrl: file.thumbUrl,
      location: { lat: file.lat, lng: file.lng },
      is_cover: file.isCover,
      is_public: file.isPublic,
      photographer: file.photographer,
      description: file.description,
      mime_type: file.mimeType,
      file_name: file.fileName
    }
  }));

  if (!map.hasImage(PULSING_DOT_IMAGE)) {
    map.addImage(PULSING_DOT_IMAGE, getPulsingDot(map, 120), { pixelRatio: 4 });
  }

  map.addSource(layerName, { type: "geojson", data: { type: "FeatureCollection", features } });
  map.addLayer({ id: layerName, type: "symbol", source: layerName, layout: { "icon-image": PULSING_DOT_IMAGE } });
  map.moveLayer(layerName);

  const clickHandler = (e: MapMouseEvent) => {
    e.preventDefault();
    const feature = e.features?.[0];
    if (feature == null) return;
    // Only one media popup at a time (matches champions UX). Close any prior media popup before opening.
    removePopups(map, "MEDIA");

    const popupContent = document.createElement("div");
    popupContent.className = "popup-content-media";
    const root = createRoot(popupContent);

    const props = feature.properties ?? {};
    const uuid = stringFromGeoJsonProperty(props.uuid);
    const name = stringFromGeoJsonProperty(props.name);
    const createdDate = stringFromGeoJsonProperty(props.created_date);
    const thumbUrl = typeof props.thumbUrl === "string" ? props.thumbUrl : "";
    root.render(
      createElement(MediaPopup, {
        uuid,
        name,
        created_date: createdDate,
        thumbUrl,
        onClose: () => removePopups(map, "MEDIA"),
        handleDownload: () => callbacks.handleDownload(uuid, name),
        coverImage: () => callbacks.setImageCover(uuid),
        handleDelete: () => callbacks.handleDelete(uuid),
        openModalImageDetail: () => callbacks.openModalImageDetail(props as unknown as MediaDto),
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
    // Coordinator: opening media closes any active popup of another kind (e.g. polygon).
    setActivePopup(map, "MEDIA", () => removePopups(map, "MEDIA"));
  };

  map.on("click", layerName, clickHandler);
  mediaClickHandlers.set(map, clickHandler);
};
