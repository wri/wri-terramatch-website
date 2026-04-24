import { Map as MapboxMap, MapMouseEvent, Popup } from "mapbox-gl";
import { createElement } from "react";
import { createRoot } from "react-dom/client";

import { LAYERS_NAMES } from "@/constants/layers";
import { MediaDto } from "@/generated/v3/entityService/entityServiceSchemas";

import { MediaPopup } from "../components/MediaPopup";
import { Feature, GeoJsonProperties, Geometry } from "../GeoJSON";
import { registerPopup, removePopups } from "../interactions/popups";
import { getPulsingDot } from "../pulsing.dot";

const mediaClickHandlers = new WeakMap<MapboxMap, (e: MapMouseEvent) => void>();

export const removeMediaLayer = (map: MapboxMap) => {
  const layerName = LAYERS_NAMES.MEDIA_IMAGES;

  const existingHandler = mediaClickHandlers.get(map);
  if (existingHandler != null) {
    map.off("click", layerName, existingHandler);
    mediaClickHandlers.delete(map);
  }

  map.getLayer(layerName) && map.removeLayer(layerName);
  map.getSource(layerName) && map.removeSource(layerName);
  map.hasImage("pulsing-dot") && map.removeImage("pulsing-dot");
};

export const addMediaSourceAndLayer = (
  map: MapboxMap,
  mediaFiles: MediaDto[],
  setImageCover: Function,
  handleDownload: Function,
  handleDelete: Function,
  openModalImageDetail: Function,
  isProjectPath: boolean
) => {
  const layerName = LAYERS_NAMES.MEDIA_IMAGES;
  removeMediaLayer(map);
  removePopups(map, "MEDIA");

  const modelFilesGeolocalized = mediaFiles.filter(f => f.lat != null && f.lng != null);
  if (modelFilesGeolocalized.length === 0) return;

  const features: Feature<Geometry, GeoJsonProperties>[] = modelFilesGeolocalized.map(modelFile => ({
    type: "Feature",
    geometry: { type: "Point", coordinates: [modelFile.lng, modelFile.lat] },
    properties: {
      uuid: modelFile.uuid,
      name: modelFile.name,
      created_date: modelFile.createdAt,
      thumbUrl: modelFile.thumbUrl,
      location: { lat: modelFile.lat, lng: modelFile.lng },
      is_cover: modelFile.isCover,
      is_public: modelFile.isPublic,
      photographer: modelFile.photographer,
      description: modelFile.description,
      mime_type: modelFile.mimeType,
      file_name: modelFile.fileName
    }
  }));

  const pulsingDot = getPulsingDot(map, 120);
  if (!map.hasImage("pulsing-dot")) {
    map.addImage("pulsing-dot", pulsingDot, { pixelRatio: 4 });
  }

  map.addSource(layerName, { type: "geojson", data: { type: "FeatureCollection", features } });
  map.addLayer({ id: layerName, type: "symbol", source: layerName, layout: { "icon-image": "pulsing-dot" } });
  map.moveLayer(layerName);

  const clickHandler = (e: MapMouseEvent) => {
    e.preventDefault();
    e.features!.forEach((feature: any) => {
      const popupContent = document.createElement("div");
      popupContent.className = "popup-content-media";
      const root = createRoot(popupContent);

      root.render(
        createElement(MediaPopup, {
          ...feature.properties,
          onClose: () => removePopups(map, "MEDIA"),
          handleDownload: () => handleDownload(feature?.properties?.uuid, feature?.properties?.name),
          coverImage: () => setImageCover(feature?.properties?.uuid),
          handleDelete: () => handleDelete(feature?.properties?.uuid),
          openModalImageDetail: () => openModalImageDetail(feature?.properties),
          isProjectPath
        })
      );

      const mediaPopup = new Popup({ className: "popup-media", closeButton: false })
        .setLngLat(feature.geometry.coordinates)
        .setDOMContent(popupContent)
        .addTo(map);
      mediaPopup.on("close", () => {
        root.unmount();
      });

      registerPopup(map, "MEDIA", mediaPopup);
    });
  };

  map.on("click", layerName, clickHandler);
  mediaClickHandlers.set(map, clickHandler);
};
