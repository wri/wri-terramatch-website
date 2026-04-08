import MapboxDraw from "@mapbox/mapbox-gl-draw";
import mapboxgl from "mapbox-gl";
import { createElement } from "react";
import { createRoot } from "react-dom/client";

import { LAYERS_NAMES, layersList } from "@/constants/layers";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import Log from "@/utils/log";

import { ANR_PLOT_FILL_LAYER_ID } from "../adapters/geoserver";
import type { LayerType, TooltipType } from "../Map.d";

/**
 * Instance-scoped popup registries (contract LC-4).
 * Using WeakMap so each map instance has its own popup list;
 * no module-level singletons that bleed across mounts/unmounts.
 */
const popupRegistries = new WeakMap<mapboxgl.Map, Record<"POLYGON" | "MEDIA", mapboxgl.Popup[]>>();

function getPopupRegistry(map: mapboxgl.Map): Record<"POLYGON" | "MEDIA", mapboxgl.Popup[]> {
  if (!popupRegistries.has(map)) {
    popupRegistries.set(map, { POLYGON: [], MEDIA: [] });
  }
  return popupRegistries.get(map)!;
}

/**
 * Instance-scoped click handler registry (contract LC-4).
 * Keyed by layer ID within each map instance.
 */
const clickHandlerRegistries = new WeakMap<mapboxgl.Map, Record<string, (e: any) => void>>();

function getClickHandlers(map: mapboxgl.Map): Record<string, (e: any) => void> {
  if (!clickHandlerRegistries.has(map)) {
    clickHandlerRegistries.set(map, {});
  }
  return clickHandlerRegistries.get(map)!;
}

const handleLayerClick = (
  e: any,
  PopupComponent: any,
  map: mapboxgl.Map,
  setPolygonFromMap: any,
  sitePolygonData: SitePolygonLightDto[] | undefined,
  type: TooltipType,
  editPolygon: { isOpen: boolean; uuid: string; primary_uuid?: string },
  setEditPolygon: (value: { isOpen: boolean; uuid: string; primary_uuid?: string }) => void,
  layerName?: string,
  isDashboard?: string | undefined,
  setFilters?: any,
  dashboardCountries?: any,
  setLoader?: (value: boolean) => void,
  setMobilePopupData?: (value: any) => void
) => {
  const { lngLat, features } = e;
  const feature = features?.[0];
  if (!feature) {
    Log.warn("No feature found in click event");
    return;
  }

  if (setMobilePopupData != null && isDashboard != null) {
    setMobilePopupData({
      feature,
      layerName,
      type,
      setPolygonFromMap,
      sitePolygonData,
      isDashboard,
      editPolygon,
      setEditPolygon,
      setFilters,
      dashboardCountries
    });
    return;
  }

  if (layerName === LAYERS_NAMES.POLYGON_GEOMETRY && map.getLayer(ANR_PLOT_FILL_LAYER_ID) != null) {
    const anrHits = map.queryRenderedFeatures(e.point, { layers: [ANR_PLOT_FILL_LAYER_ID] });
    if (anrHits.length > 0) return;
  }

  removePopups(map, "POLYGON");

  const isCentroidLayer = layerName === LAYERS_NAMES.CENTROIDS;
  const popupOptions: mapboxgl.PopupOptions = {
    className: isCentroidLayer ? "popup-map no-tip" : "popup-map",
    offset: isCentroidLayer
      ? {
          top: [0, 9],
          "top-left": [0, 9],
          "top-right": [0, 9],
          bottom: [0, -9],
          "bottom-left": [0, -9],
          "bottom-right": [0, -9],
          left: [9, 0],
          right: [-9, 0]
        }
      : 0
  };

  const popupContent = document.createElement("div");
  popupContent.className = "popup-content-map";
  const root = createRoot(popupContent);
  const newPopup = new mapboxgl.Popup(popupOptions).setLngLat(lngLat).setDOMContent(popupContent);

  newPopup.addTo(map);
  getPopupRegistry(map)["POLYGON"].push(newPopup);

  root.render(
    createElement(PopupComponent, {
      feature,
      popup: newPopup,
      setPolygonFromMap,
      sitePolygonData,
      type,
      editPolygon,
      setEditPolygon
    })
  );
};

/** Registers a popup instance so removePopups can clean it up (used by mediaLayers). */
export const registerPopup = (map: mapboxgl.Map, key: "POLYGON" | "MEDIA", popup: mapboxgl.Popup): void => {
  getPopupRegistry(map)[key].push(popup);
};

/** Removes and clears all popups of the given type for this map instance (contract LC-4). */
export const removePopups = (map: mapboxgl.Map, key: "POLYGON" | "MEDIA"): void => {
  const registry = getPopupRegistry(map);
  if (registry[key] == null) return;
  registry[key].forEach(popup => popup.remove());
  registry[key] = [];
};

export const addPopupsToMap = (
  map: mapboxgl.Map,
  popupComponent: any,
  setPolygonFromMap: any,
  sitePolygonData: SitePolygonLightDto[] | undefined,
  type: TooltipType,
  editPolygon: { isOpen: boolean; uuid: string; primary_uuid?: string },
  setEditPolygon: (value: { isOpen: boolean; uuid: string; primary_uuid?: string }) => void,
  draw: MapboxDraw,
  isDashboard?: string | undefined,
  setFilters?: any,
  dashboardCountries?: any,
  setLoader?: (value: boolean) => void,
  selectedCountry?: string | null,
  setMobilePopupData?: (value: any) => void
): void => {
  if (!popupComponent) return;
  layersList.forEach((layer: LayerType) => {
    addPopupToLayer(
      map,
      popupComponent,
      layer,
      setPolygonFromMap,
      sitePolygonData,
      type,
      editPolygon,
      setEditPolygon,
      draw,
      isDashboard,
      setFilters,
      dashboardCountries,
      setLoader,
      selectedCountry,
      setMobilePopupData
    );
  });
};

export const addPopupToLayer = (
  map: mapboxgl.Map,
  popupComponent: any,
  layer: any,
  setPolygonFromMap: any,
  sitePolygonData: SitePolygonLightDto[] | undefined,
  type: TooltipType,
  editPolygon: { isOpen: boolean; uuid: string; primary_uuid?: string },
  setEditPolygon: (value: { isOpen: boolean; uuid: string; primary_uuid?: string }) => void,
  draw: MapboxDraw,
  isDashboard?: string | undefined,
  setFilters?: any,
  dashboardCountries?: any,
  setLoader?: (value: boolean) => void,
  selectedCountry?: string | null,
  setMobilePopupData?: (value: any) => void
): void => {
  if (!popupComponent) return;

  const { name } = layer;
  // map.getStyle() calls this.style.serialize() internally; throws if the internal
  // style object is null (mid-switch or after map.remove()). Guard defensively.
  let style: ReturnType<typeof map.getStyle>;
  try {
    style = map.getStyle();
  } catch {
    return;
  }
  if (style == null) return;
  let layers = style.layers ?? [];
  let targetLayers = layers.filter(l => l.id.startsWith(name));

  if (name === LAYERS_NAMES.CENTROIDS && targetLayers.length > 0) {
    targetLayers = targetLayers.filter(l => (l as any)?.metadata?.type === "big-circle");
  }

  const handlers = getClickHandlers(map);

  const clickHandler = (e: any) => {
    const currentMode = draw?.getMode();
    if (currentMode === "draw_polygon" || currentMode === "draw_line_string") return;
    if (name === LAYERS_NAMES.WORLD_COUNTRIES) return;

    handleLayerClick(
      e,
      popupComponent,
      map,
      setPolygonFromMap,
      sitePolygonData,
      type,
      editPolygon,
      setEditPolygon,
      name,
      isDashboard,
      setFilters,
      dashboardCountries,
      setLoader,
      setMobilePopupData
    );
  };

  targetLayers.forEach(targetLayer => {
    if (handlers[targetLayer.id] != null) {
      map.off("click", targetLayer.id, handlers[targetLayer.id]);
      map.off("touchend", targetLayer.id, handlers[targetLayer.id]);
      delete handlers[targetLayer.id];
    }
    handlers[targetLayer.id] = clickHandler;
    map.on("click", targetLayer.id, clickHandler);
    map.on("touchend", targetLayer.id, clickHandler);
  });
};
