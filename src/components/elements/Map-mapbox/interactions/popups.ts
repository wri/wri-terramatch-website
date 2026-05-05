import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { LayerSpecification, Map as MapboxMap, MapMouseEvent, MapTouchEvent, Popup } from "mapbox-gl";
import React, { createElement } from "react";
import { createRoot } from "react-dom/client";

import { LAYERS_NAMES, layersList } from "@/constants/layers";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import Log from "@/utils/log";

import { ANR_PLOT_FILL_LAYER_ID } from "../adapters/geoserver";
import PopupProviders from "../components/PopupProviders";
import type {
  DashboardPopupContext,
  EditPolygonState,
  LayerType,
  MobilePopupData,
  PopupComponentProps,
  SetPolygonFromMap,
  TooltipType
} from "../Map.d";

type MapboxPopup = InstanceType<typeof Popup>;

const popupRegistries = new WeakMap<MapboxMap, Record<"POLYGON" | "MEDIA", MapboxPopup[]>>();

function getPopupRegistry(map: MapboxMap): Record<"POLYGON" | "MEDIA", MapboxPopup[]> {
  if (!popupRegistries.has(map)) {
    popupRegistries.set(map, { POLYGON: [], MEDIA: [] });
  }
  return popupRegistries.get(map)!;
}

// Mapbox click and touchend layer events share the same data shape (lngLat, features, point).
type MapLayerInteractionEvent = MapMouseEvent | MapTouchEvent;

const clickHandlerRegistries = new WeakMap<MapboxMap, Record<string, (e: MapLayerInteractionEvent) => void>>();

function getClickHandlers(map: MapboxMap): Record<string, (e: MapLayerInteractionEvent) => void> {
  if (!clickHandlerRegistries.has(map)) {
    clickHandlerRegistries.set(map, {});
  }
  return clickHandlerRegistries.get(map)!;
}

/** Options forwarded from useMapPopups down to every layer click handler. */
export type PopupHandlerOptions = {
  setPolygonFromMap?: SetPolygonFromMap;
  sitePolygonData?: SitePolygonLightDto[];
  type: TooltipType;
  editPolygon: EditPolygonState;
  setEditPolygon: (value: EditPolygonState) => void;
  /** Present only in dashboard mode; drives popup content and filter callbacks. */
  dashboard?: DashboardPopupContext;
  setLoader?: (value: boolean) => void;
  setMobilePopupData?: (value: MobilePopupData) => void;
  championsMap?: boolean;
};

const handleLayerClick = (
  e: MapLayerInteractionEvent,
  PopupComponent: React.ComponentType<PopupComponentProps>,
  map: MapboxMap,
  layerName: string | undefined,
  options: PopupHandlerOptions
): void => {
  const { lngLat, features } = e;
  const feature = features?.[0];
  if (feature == null) {
    Log.warn("No feature found in click event");
    return;
  }

  const {
    setPolygonFromMap,
    sitePolygonData,
    type,
    editPolygon,
    setEditPolygon,
    dashboard,
    setLoader,
    setMobilePopupData,
    championsMap
  } = options;

  if (setMobilePopupData != null && dashboard?.dashboardMode != null) {
    setMobilePopupData({
      feature,
      layerName,
      type,
      setPolygonFromMap,
      sitePolygonData,
      editPolygon,
      setEditPolygon,
      setLoader,
      setFilters: dashboard.setFilters,
      dashboardCountries: dashboard.dashboardCountries,
      dashboardMode: dashboard.dashboardMode
    });
    return;
  }

  if (layerName === LAYERS_NAMES.POLYGON_GEOMETRY && map.getLayer(ANR_PLOT_FILL_LAYER_ID) != null) {
    const anrHits = map.queryRenderedFeatures(e.point, { layers: [ANR_PLOT_FILL_LAYER_ID] });
    if (anrHits.length > 0) return;
  }

  removePopups(map, "POLYGON");

  const isCentroidLayer = layerName === LAYERS_NAMES.CENTROIDS;
  const popupOptions = {
    className: isCentroidLayer ? "popup-map no-tip" : "popup-map",
    closeButton: false,
    offset: isCentroidLayer
      ? {
          top: [0, 9] as [number, number],
          "top-left": [0, 9] as [number, number],
          "top-right": [0, 9] as [number, number],
          bottom: [0, -9] as [number, number],
          "bottom-left": [0, -9] as [number, number],
          "bottom-right": [0, -9] as [number, number],
          left: [9, 0] as [number, number],
          right: [-9, 0] as [number, number]
        }
      : 0
  };

  const popupContent = document.createElement("div");
  popupContent.className = "popup-content-map";
  const root = createRoot(popupContent);
  const newPopup = new Popup(popupOptions).setLngLat(lngLat).setDOMContent(popupContent);
  newPopup.on("close", () => {
    root.unmount();
  });

  newPopup.addTo(map);
  getPopupRegistry(map)["POLYGON"].push(newPopup);

  root.render(
    createElement(
      PopupProviders,
      null,
      createElement(PopupComponent, {
        feature,
        popup: newPopup,
        layerName,
        setFilters: dashboard?.setFilters,
        dashboardCountries: dashboard?.dashboardCountries,
        dashboardMode: dashboard?.dashboardMode,
        setPolygonFromMap,
        sitePolygonData,
        type,
        editPolygon,
        setEditPolygon,
        championsMap
      })
    )
  );
};

export const registerPopup = (map: MapboxMap, key: "POLYGON" | "MEDIA", popup: MapboxPopup): void => {
  getPopupRegistry(map)[key].push(popup);
};

export const removePopups = (map: MapboxMap, key: "POLYGON" | "MEDIA"): void => {
  const registry = getPopupRegistry(map);
  if (registry[key] == null) return;
  registry[key].forEach(popup => popup.remove());
  registry[key] = [];
};

export const addPopupsToMap = (
  map: MapboxMap,
  popupComponent: React.ComponentType<PopupComponentProps>,
  draw: MapboxDraw,
  options: PopupHandlerOptions
): void => {
  if (popupComponent == null) return;
  layersList.forEach((layer: LayerType) => {
    addPopupToLayer(map, popupComponent, layer, draw, options);
  });
};

export const addPopupToLayer = (
  map: MapboxMap,
  popupComponent: React.ComponentType<PopupComponentProps>,
  layer: LayerType,
  draw: MapboxDraw,
  options: PopupHandlerOptions
): void => {
  if (popupComponent == null) return;

  const { name } = layer;
  let style: ReturnType<typeof map.getStyle>;
  try {
    style = map.getStyle();
  } catch {
    return;
  }
  if (style == null) return;
  const layers = style.layers ?? [];
  let targetLayers = layers.filter(l => l.id.startsWith(name));

  if (name === LAYERS_NAMES.CENTROIDS && targetLayers.length > 0) {
    targetLayers = targetLayers.filter(
      l => (l as LayerSpecification & { metadata?: { type?: string } })?.metadata?.type === "big-circle"
    );
  }

  const handlers = getClickHandlers(map);

  const clickHandler = (e: MapLayerInteractionEvent) => {
    const currentMode = draw?.getMode();
    if (currentMode === "draw_polygon" || currentMode === "draw_line_string") return;
    handleLayerClick(e, popupComponent, map, name, options);
  };

  targetLayers.forEach(targetLayer => {
    if (handlers[targetLayer.id] != null) {
      map.off("click", targetLayer.id, handlers[targetLayer.id]);
      map.off("touchend", targetLayer.id, handlers[targetLayer.id]);
      delete handlers[targetLayer.id];
    }
    handlers[targetLayer.id] = clickHandler;
    map.on("click", targetLayer.id, clickHandler);
    if (name !== LAYERS_NAMES.CENTROIDS) {
      map.on("touchend", targetLayer.id, clickHandler);
    }
  });
};
