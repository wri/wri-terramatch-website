import { LayerSpecification, Map as MapboxMap, MapMouseEvent, Popup, VectorTileSource } from "mapbox-gl";
import { createElement } from "react";
import { createRoot, Root } from "react-dom/client";

import { LAYERS_NAMES, layersList } from "@/constants/layers";
import Log from "@/utils/log";

import { convertToAcceptedGEOJSON } from "../adapters/geojson";
import {
  ANR_PLOT_FILL_LAYER_ID,
  ANR_PLOT_LAYER_PREFIX,
  ANR_PLOT_LINE_LAYER_ID,
  ANR_PLOT_SOURCE_ID,
  getGeoserverURL
} from "../adapters/geoserver";
import { AnrPlotMapPopup } from "../components/AnrPlotMapPopup";
import { BASEMAP_CONFIGS, MapStyle } from "../MapControls/types";
import { setFilterLandscape } from "./polygonLayers";

const GOOGLE_RASTER_SOURCE_ID = "google-satellite-source";
const GOOGLE_RASTER_LAYER_ID = "google-satellite-layer";

// ---------------------------------------------------------------------------
// Cancellable once("style.load") registry
// Prevents stacked one-shot callbacks from rapid style switches. Each map
// instance keeps at most one pending handler; registering a new one cancels
// the previous.
// ---------------------------------------------------------------------------
const pendingStyleLoadHandlers = new WeakMap<MapboxMap, (() => void) | null>();

function registerOnceStyleLoad(map: MapboxMap, handler: () => void): void {
  const prev = pendingStyleLoadHandlers.get(map);
  if (prev != null) {
    map.off("style.load", prev);
  }
  const wrapped = () => {
    pendingStyleLoadHandlers.set(map, null);
    handler();
  };
  pendingStyleLoadHandlers.set(map, wrapped);
  map.once("style.load", wrapped);
}

// ---------------------------------------------------------------------------
// Hidden-layer tracking for Google Satellite overlay
// Records exactly which base-style layer IDs we set to visibility:"none" so
// removeGoogleSatelliteLayer restores only those layers and nothing else.
// ---------------------------------------------------------------------------
const hiddenBaseLayersByMap = new WeakMap<MapboxMap, Set<string>>();

function getHiddenBaseLayers(map: MapboxMap): Set<string> {
  if (!hiddenBaseLayersByMap.has(map)) hiddenBaseLayersByMap.set(map, new Set());
  return hiddenBaseLayersByMap.get(map)!;
}

export const addBorderLandscape = (map: MapboxMap, landscapes: string[]): void => {
  if (landscapes == null || landscapes.length === 0 || map == null) return;
  const landscapeLayer = layersList.find(layer => layer.name === LAYERS_NAMES.LANDSCAPES);
  if (landscapeLayer == null) return;
  const sourceName = landscapeLayer.name;
  const GEOSERVER_TILE_URL = getGeoserverURL(landscapeLayer.geoserverLayerName, undefined, "0");

  const existingSource = map.getSource(sourceName) as VectorTileSource | undefined;
  const existingTileUrl = existingSource?.tiles?.[0];
  if (existingTileUrl != null && existingTileUrl !== GEOSERVER_TILE_URL) {
    if (map.getLayer(sourceName)) map.removeLayer(sourceName);
    map.removeSource(sourceName);
  }

  if (!map.getSource(sourceName)) {
    map.addSource(sourceName, { type: "vector", tiles: [GEOSERVER_TILE_URL] });
  }
  if (map.getLayer(sourceName) == null) {
    const style = landscapeLayer.styles[0];
    map.addLayer({
      ...style,
      id: sourceName,
      source: sourceName,
      "source-layer": landscapeLayer.geoserverLayerName
    } as LayerSpecification);
  }
  setFilterLandscape(map, sourceName, landscapes);
};

export const removeBorderLandscape = (map: MapboxMap): void => {
  if (!map || !map.isStyleLoaded()) return;
  const layerName = LAYERS_NAMES.LANDSCAPES;
  try {
    if (map.getLayer(layerName)) map.removeLayer(layerName);
    if (map.getSource(layerName)) map.removeSource(layerName);
  } catch (error) {
    Log.warn("Error removing border landscape:", error);
  }
};

export const updateMapProjection = (map: MapboxMap, currentStyle: MapStyle): void => {
  const config = BASEMAP_CONFIGS[currentStyle];
  if (config?.projection) {
    map.setProjection(config.projection);
  }
};

export const addGoogleSatelliteLayer = (map: MapboxMap): void => {
  if (map == null) return;
  // Guard: getStyle() throws (or returns null) when the map is mid-transition.
  // We use try/catch rather than isStyleLoaded() because isStyleLoaded() can
  // return false inside style.load callbacks (pending transitions), which would
  // prevent the Google raster from being applied even in the correct callsite.
  let mapStyle: ReturnType<MapboxMap["getStyle"]>;
  try {
    mapStyle = map.getStyle();
  } catch {
    return;
  }
  if (mapStyle == null) return;

  removeGoogleSatelliteLayer(map);

  const config = BASEMAP_CONFIGS[MapStyle.GoogleSatellite];
  if (!config.rasterUrl) {
    Log.warn("Google satellite raster URL not configured");
    return;
  }

  try {
    const layers = map.getStyle().layers ?? [];
    const polygonLayerPrefixes = [
      LAYERS_NAMES.POLYGON_GEOMETRY,
      LAYERS_NAMES.DELETED_GEOMETRIES,
      LAYERS_NAMES.CENTROIDS,
      LAYERS_NAMES.POLYGON_CENTROIDS,
      ANR_PLOT_LAYER_PREFIX
    ];
    const isPolygonLayer = (layerId: string) => polygonLayerPrefixes.some(prefix => layerId.startsWith(prefix));

    const hiddenSet = getHiddenBaseLayers(map);
    hiddenSet.clear();

    layers
      .filter(
        layer =>
          (layer.type === "background" ||
            (layer.type === "fill" && !isPolygonLayer(layer.id)) ||
            (layer.type === "raster" && layer.id !== GOOGLE_RASTER_LAYER_ID)) &&
          !isPolygonLayer(layer.id)
      )
      .forEach(layer => {
        try {
          if (map.getLayoutProperty(layer.id, "visibility") !== "none") {
            map.setLayoutProperty(layer.id, "visibility", "none");
            hiddenSet.add(layer.id);
          }
        } catch (e) {
          Log.warn("Error setting layer visibility:", e);
        }
      });

    if (hiddenSet.size > 0) Log.info(`Hidden ${hiddenSet.size} Street layers for Google Satellite`);

    map.addSource(GOOGLE_RASTER_SOURCE_ID, {
      type: "raster",
      tiles: [config.rasterUrl],
      tileSize: 256,
      minzoom: 0,
      maxzoom: 22
    });

    // Insert raster above background but below all vector layers.
    // Re-query after removeGoogleSatelliteLayer so firstLayerId is fresh.
    const freshLayers = map.getStyle().layers ?? [];
    const firstLayerId = freshLayers.find(l => l.type !== "background")?.id;
    map.addLayer(
      { id: GOOGLE_RASTER_LAYER_ID, type: "raster", source: GOOGLE_RASTER_SOURCE_ID, paint: { "raster-opacity": 1 } },
      firstLayerId
    );
  } catch (error) {
    Log.error("Error adding Google satellite layer:", error);
  }
};

export const removeGoogleSatelliteLayer = (map: MapboxMap): void => {
  if (map == null) return;
  try {
    if (map.getStyle() == null) return;
  } catch {
    return;
  }
  try {
    if (map.getLayer(GOOGLE_RASTER_LAYER_ID) != null) map.removeLayer(GOOGLE_RASTER_LAYER_ID);
    if (map.getSource(GOOGLE_RASTER_SOURCE_ID) != null) map.removeSource(GOOGLE_RASTER_SOURCE_ID);

    const hiddenSet = getHiddenBaseLayers(map);
    let restoredCount = 0;

    if (hiddenSet.size > 0) {
      // Precise restore: only layers that addGoogleSatelliteLayer explicitly hid.
      hiddenSet.forEach(layerId => {
        try {
          if (map.getLayer(layerId) != null && map.getLayoutProperty(layerId, "visibility") === "none") {
            map.setLayoutProperty(layerId, "visibility", "visible");
            restoredCount++;
          }
        } catch (e) {
          Log.warn("Error restoring tracked layer visibility:", e);
        }
      });
      hiddenSet.clear();
    } else {
      // Fallback (hiddenSet empty — e.g. first call before tracking was populated):
      // restore all base-style layers that are currently hidden.
      const polygonLayerPrefixes = [
        LAYERS_NAMES.POLYGON_GEOMETRY,
        LAYERS_NAMES.DELETED_GEOMETRIES,
        LAYERS_NAMES.CENTROIDS,
        LAYERS_NAMES.POLYGON_CENTROIDS,
        ANR_PLOT_LAYER_PREFIX
      ];
      const isPolygonLayer = (id: string) => polygonLayerPrefixes.some(p => id.startsWith(p));
      const layers = map.getStyle()?.layers ?? [];
      layers
        .filter(l => {
          const isBase = l.type === "background" || l.type === "fill" || l.type === "raster";
          return isBase && !isPolygonLayer(l.id);
        })
        .forEach(l => {
          try {
            if (map.getLayoutProperty(l.id, "visibility") === "none") {
              map.setLayoutProperty(l.id, "visibility", "visible");
              restoredCount++;
            }
          } catch (e) {
            Log.warn("Error restoring layer visibility (fallback):", e);
          }
        });
    }

    if (restoredCount > 0) Log.info(`Restored ${restoredCount} Street layers after Google Satellite`);
  } catch (error) {
    Log.warn("Error removing Google satellite layer:", error);
  }
};

export const getCurrentMapStyle = (map: MapboxMap): MapStyle | undefined => {
  if (map == null) return undefined;
  try {
    if (map.getLayer(GOOGLE_RASTER_LAYER_ID)) return MapStyle.GoogleSatellite;
    const internalStyle = (map as MapboxMap & { style?: { url?: string; name?: string } }).style;
    const styleFromSpec = map.getStyle() as { name?: string; metadata?: { "mapbox:uri"?: string } } | null | undefined;
    const fromSpec = styleFromSpec?.name;
    const styleUrl = internalStyle?.url ?? internalStyle?.name ?? fromSpec;
    if (styleUrl) {
      if (styleUrl === MapStyle.Street || styleUrl.includes("clve3yxzq01w101pefkkg3rci")) return MapStyle.Street;
      if (styleUrl === MapStyle.Satellite || styleUrl.includes("clv3bkxut01y301pk317z5afu")) return MapStyle.Satellite;
    }
    const uri = styleFromSpec?.metadata?.["mapbox:uri"];
    if (typeof uri === "string") {
      if (uri === MapStyle.Street || uri.includes("clve3yxzq01w101pefkkg3rci")) return MapStyle.Street;
      if (uri === MapStyle.Satellite || uri.includes("clv3bkxut01y301pk317z5afu")) return MapStyle.Satellite;
    }
    // Last resort: v3+ may omit style.url; scan serialized spec for Terramatch style fragment ids
    if (styleFromSpec != null) {
      const blob = JSON.stringify(styleFromSpec);
      if (blob.includes("clve3yxzq01w101pefkkg3rci")) return MapStyle.Street;
      if (blob.includes("clv3bkxut01y301pk317z5afu")) return MapStyle.Satellite;
    }
  } catch (e) {
    Log.warn("Error getting current map style:", e);
  }
  return undefined;
};

export const setMapStyle = (
  targetStyle: MapStyle,
  map: MapboxMap,
  setCurrentStyle: (style: MapStyle) => void,
  currentStyle: string | MapStyle
): void => {
  if (map == null || currentStyle === targetStyle) return;

  const targetConfig = BASEMAP_CONFIGS[targetStyle];

  if (targetStyle === MapStyle.GoogleSatellite) {
    setCurrentStyle(targetStyle);

    if (currentStyle === MapStyle.Street) {
      // Street → Google: Street style is the base — apply raster overlay directly.
      // Do NOT gate on isStyleLoaded(): in Mapbox GL v3, isStyleLoaded() can return
      // false while tiles are loading even though the style spec is fully accessible.
      // addGoogleSatelliteLayer has its own try/catch guard.
      addGoogleSatelliteLayer(map);
      updateMapProjection(map, targetStyle);
    } else {
      // Non-Street (e.g. Satellite) → Google: swap to Street base first, then
      // apply the Google raster overlay once the base style fires style.load.
      // registerOnceStyleLoad cancels any previous stale once-handler.
      registerOnceStyleLoad(map, () => {
        addGoogleSatelliteLayer(map);
        updateMapProjection(map, targetStyle);
      });
      map.setStyle(targetConfig.style);
    }
    return;
  }

  if (currentStyle === MapStyle.GoogleSatellite) {
    if (targetStyle === MapStyle.Street) {
      // Google → Street: just remove the raster overlay — no style URL swap needed.
      // Do NOT gate on isStyleLoaded(): in Mapbox GL v3, isStyleLoaded() returns false
      // while Google satellite tiles are still loading. Gating causes the code to fall
      // into registerOnceStyleLoad(), but style.load never fires (no setStyle call),
      // leaving the map permanently stuck on Google. removeGoogleSatelliteLayer has
      // its own try/catch guard.
      removeGoogleSatelliteLayer(map);
      setCurrentStyle(targetStyle);
      updateMapProjection(map, targetStyle);
      return;
    }
  }

  // All other transitions (Street↔Satellite, Google→Satellite, etc.):
  // full Mapbox style URL swap.
  setCurrentStyle(targetStyle);
  map.setStyle(targetConfig.style);
  registerOnceStyleLoad(map, () => updateMapProjection(map, targetStyle));
};

type AnrPlotOverlayState = {
  clickHandler: ((e: MapMouseEvent) => void) | null;
  mouseEnterHandler: (() => void) | null;
  mouseLeaveHandler: (() => void) | null;
  popup: InstanceType<typeof Popup> | null;
  popupRoot: Root | null;
  pendingIdleRetry: { fn: () => void } | null;
};

const anrPlotOverlayStateByMap = new WeakMap<MapboxMap, AnrPlotOverlayState>();

function getAnrPlotOverlayState(map: MapboxMap): AnrPlotOverlayState {
  const existing = anrPlotOverlayStateByMap.get(map);
  if (existing != null) return existing;
  const created: AnrPlotOverlayState = {
    clickHandler: null,
    mouseEnterHandler: null,
    mouseLeaveHandler: null,
    popup: null,
    popupRoot: null,
    pendingIdleRetry: null
  };
  anrPlotOverlayStateByMap.set(map, created);
  return created;
}

function cancelAnrPendingRetry(map: MapboxMap) {
  const state = getAnrPlotOverlayState(map);
  if (state.pendingIdleRetry != null) {
    map.off("idle", state.pendingIdleRetry.fn);
    state.pendingIdleRetry = null;
  }
}

export function removeAnrPlotGeometryOverlay(map: MapboxMap | null | undefined): void {
  if (map == null) return;
  cancelAnrPendingRetry(map);
  const state = getAnrPlotOverlayState(map);
  try {
    if (state.popup != null) {
      state.popup.remove();
      state.popup = null;
    }
    if (state.popupRoot != null) {
      state.popupRoot.unmount();
      state.popupRoot = null;
    }
    if (state.clickHandler != null) {
      map.off("click", ANR_PLOT_FILL_LAYER_ID, state.clickHandler);
      state.clickHandler = null;
    }
    if (state.mouseEnterHandler != null) {
      map.off("mouseenter", ANR_PLOT_FILL_LAYER_ID, state.mouseEnterHandler);
      state.mouseEnterHandler = null;
    }
    if (state.mouseLeaveHandler != null) {
      map.off("mouseleave", ANR_PLOT_FILL_LAYER_ID, state.mouseLeaveHandler);
      state.mouseLeaveHandler = null;
    }
    if (map.getLayer(ANR_PLOT_LINE_LAYER_ID) != null) map.removeLayer(ANR_PLOT_LINE_LAYER_ID);
    if (map.getLayer(ANR_PLOT_FILL_LAYER_ID) != null) map.removeLayer(ANR_PLOT_FILL_LAYER_ID);
    if (map.getSource(ANR_PLOT_SOURCE_ID) != null) map.removeSource(ANR_PLOT_SOURCE_ID);
  } catch (e) {
    Log.warn("removeAnrPlotGeometryOverlay:", e);
  }
}

export function upsertAnrPlotGeometryOverlay(map: MapboxMap, geojson: unknown, options: { visible: boolean }): void {
  if (map == null) return;
  removeAnrPlotGeometryOverlay(map);
  const state = getAnrPlotOverlayState(map);

  if (!options.visible) return;

  const geojsonFormatted = convertToAcceptedGEOJSON(geojson) as GeoJSON.FeatureCollection;
  if (geojsonFormatted?.features == null || geojsonFormatted.features.length === 0) return;

  if (!map.isStyleLoaded()) {
    const retryFn = () => {
      const currentState = getAnrPlotOverlayState(map);
      currentState.pendingIdleRetry = null;
      upsertAnrPlotGeometryOverlay(map, geojson, options);
    };
    state.pendingIdleRetry = { fn: retryFn };
    map.once("idle", retryFn);
    return;
  }

  const beforeLayer = map.getLayer(LAYERS_NAMES.MEDIA_IMAGES) != null ? LAYERS_NAMES.MEDIA_IMAGES : undefined;

  try {
    map.addSource(ANR_PLOT_SOURCE_ID, { type: "geojson", data: geojsonFormatted });

    map.addLayer(
      {
        id: ANR_PLOT_FILL_LAYER_ID,
        type: "fill",
        source: ANR_PLOT_SOURCE_ID,
        layout: { visibility: "visible" },
        paint: { "fill-color": "#9ca3af", "fill-opacity": 0.7 }
      },
      beforeLayer
    );
    map.addLayer(
      {
        id: ANR_PLOT_LINE_LAYER_ID,
        type: "line",
        source: ANR_PLOT_SOURCE_ID,
        layout: { visibility: "visible" },
        paint: { "line-color": "#6b7280", "line-width": 1.95, "line-opacity": 0.9 }
      },
      beforeLayer
    );

    if (map.getLayer(LAYERS_NAMES.MEDIA_IMAGES) != null) {
      try {
        map.moveLayer(ANR_PLOT_LINE_LAYER_ID, LAYERS_NAMES.MEDIA_IMAGES);
        map.moveLayer(ANR_PLOT_FILL_LAYER_ID, ANR_PLOT_LINE_LAYER_ID);
      } catch (e) {
        Log.warn("moveLayer ANR plot overlay:", e);
      }
    }

    state.clickHandler = (e: MapMouseEvent) => {
      const feature = e.features?.[0];
      if (feature == null) return;
      if (state.popup != null) {
        state.popup.remove();
        state.popup = null;
      }
      if (state.popupRoot != null) {
        state.popupRoot.unmount();
        state.popupRoot = null;
      }

      const props = feature.properties ?? {};
      const popupContent = document.createElement("div");
      popupContent.className = "popup-content-map";
      const root = createRoot(popupContent);
      state.popupRoot = root;
      const rawPlotId = props.plotId;
      const rawArea = props.areaM2;
      const toNum = (v: unknown) =>
        typeof v === "number" ? v : v != null && !Number.isNaN(Number(v)) ? Number(v) : undefined;

      root.render(
        createElement(AnrPlotMapPopup, {
          plotId: toNum(rawPlotId),
          areaM2: toNum(rawArea),
          select: props.select != null ? String(props.select) : null,
          onClose: () => {
            state.popup?.remove();
            state.popup = null;
          }
        })
      );
      const popup = new Popup({ className: "popup-map", closeButton: false })
        .setLngLat(e.lngLat)
        .setDOMContent(popupContent)
        .addTo(map);
      state.popup = popup;
      popup.on("close", () => {
        state.popupRoot?.unmount();
        state.popupRoot = null;
        state.popup = null;
      });
    };

    map.on("click", ANR_PLOT_FILL_LAYER_ID, state.clickHandler);
    state.mouseEnterHandler = () => {
      map.getCanvas().style.cursor = "pointer";
    };
    state.mouseLeaveHandler = () => {
      map.getCanvas().style.cursor = "";
    };
    map.on("mouseenter", ANR_PLOT_FILL_LAYER_ID, state.mouseEnterHandler);
    map.on("mouseleave", ANR_PLOT_FILL_LAYER_ID, state.mouseLeaveHandler);
  } catch (e) {
    Log.warn("upsertAnrPlotGeometryOverlay:", e);
  }
}
