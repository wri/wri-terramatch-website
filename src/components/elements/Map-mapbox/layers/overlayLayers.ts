import {
  type DataDrivenPropertyValueSpecification,
  LayerSpecification,
  Map as MapboxMap,
  MapMouseEvent,
  Marker as MapboxMarker,
  VectorTileSource
} from "mapbox-gl";
import { createElement } from "react";
import { createRoot, Root } from "react-dom/client";

import { LAYERS_NAMES, layersList } from "@/constants/layers";
import { getThemedColor } from "@/lib/theme";
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
import PopupProviders from "../components/PopupProviders";
import {
  BASEMAP_CONFIGS,
  MapStyle,
  TERRAMATCH_SATELLITE_STYLE_ID,
  TERRAMATCH_STREET_STYLE_ID
} from "../MapControls/types";
import { setFilterLandscape } from "./polygonLayers";

const GOOGLE_RASTER_SOURCE_ID = "google-satellite-source";
const GOOGLE_RASTER_LAYER_ID = "google-satellite-layer";

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
  if (map == null) return;
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

    map.addSource(GOOGLE_RASTER_SOURCE_ID, {
      type: "raster",
      tiles: [config.rasterUrl],
      tileSize: 256,
      minzoom: 0,
      maxzoom: 22
    });

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

    if (hiddenSet.size > 0) {
      hiddenSet.forEach(layerId => {
        try {
          if (map.getLayer(layerId) != null && map.getLayoutProperty(layerId, "visibility") === "none") {
            map.setLayoutProperty(layerId, "visibility", "visible");
          }
        } catch (e) {
          Log.warn("Error restoring tracked layer visibility:", e);
        }
      });
      hiddenSet.clear();
    } else {
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
            }
          } catch (e) {
            Log.warn("Error restoring layer visibility (fallback):", e);
          }
        });
    }
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
      if (styleUrl === MapStyle.Street || styleUrl.includes(TERRAMATCH_STREET_STYLE_ID)) return MapStyle.Street;
      if (styleUrl === MapStyle.Satellite || styleUrl.includes(TERRAMATCH_SATELLITE_STYLE_ID))
        return MapStyle.Satellite;
    }
    const uri = styleFromSpec?.metadata?.["mapbox:uri"];
    if (typeof uri === "string") {
      if (uri === MapStyle.Street || uri.includes(TERRAMATCH_STREET_STYLE_ID)) return MapStyle.Street;
      if (uri === MapStyle.Satellite || uri.includes(TERRAMATCH_SATELLITE_STYLE_ID)) return MapStyle.Satellite;
    }
    if (styleFromSpec != null) {
      const blob = JSON.stringify(styleFromSpec);
      if (blob.includes(TERRAMATCH_STREET_STYLE_ID)) return MapStyle.Street;
      if (blob.includes(TERRAMATCH_SATELLITE_STYLE_ID)) return MapStyle.Satellite;
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
      addGoogleSatelliteLayer(map);
      updateMapProjection(map, targetStyle);
    } else {
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
      removeGoogleSatelliteLayer(map);
      setCurrentStyle(targetStyle);
      updateMapProjection(map, targetStyle);
      return;
    }
  }

  setCurrentStyle(targetStyle);
  map.setStyle(targetConfig.style);
  registerOnceStyleLoad(map, () => updateMapProjection(map, targetStyle));
};

type AnrPlotOverlayState = {
  clickHandler: ((e: MapMouseEvent) => void) | null;
  mouseEnterHandler: (() => void) | null;
  mouseLeaveHandler: (() => void) | null;
  marker: InstanceType<typeof MapboxMarker> | null;
  markerRoot: Root | null;
  pendingIdleRetry: { fn: () => void } | null;
  selectedPlotId: number | null;
  polygonStatus: string | null;
  polygonName: string | null;
};

// rgba baked — avoids fill-opacity multiplying unexpectedly
// slightly grayer than pure white: neutral-400 #C9C9C9 at 45% opacity
const ANR_DEFAULT_PLOT_FILL_RGBA: DataDrivenPropertyValueSpecification<string> = ["rgba", 201, 201, 201, 0.45];
const ANR_SELECTED_PLOT_FILL_RGBA: DataDrivenPropertyValueSpecification<string> = ["rgba", 80, 182, 226, 0.58];
const ANR_DEFAULT_PLOT_LINE_COLOR = "#C9C9C9";
const ANR_SELECTED_PLOT_LINE_COLOR = getThemedColor("primary", 700); // #11688D — darker than fill for contrast
const ANR_DEFAULT_PLOT_LINE_OPACITY = 0.95;
const ANR_SELECTED_PLOT_LINE_OPACITY = 1;
const ANR_SELECTED_PLOT_LINE_WIDTH = 3;
const ANR_DEFAULT_PLOT_LINE_WIDTH = 1.5;

const ANR_PLOT_SELECTED_EXPR: unknown[] = ["boolean", ["feature-state", "selected"], false];

function clearAnrPlotSelection(map: MapboxMap, plotId: number | null): void {
  if (plotId == null) return;
  try {
    map.removeFeatureState({ source: ANR_PLOT_SOURCE_ID, id: plotId }, "selected");
  } catch (e) {
    Log.warn("clearAnrPlotSelection:", e);
  }
}

function setAnrPlotSelection(map: MapboxMap, plotId: number | null): void {
  if (plotId == null) return;
  try {
    map.setFeatureState({ source: ANR_PLOT_SOURCE_ID, id: plotId }, { selected: true });
  } catch (e) {
    Log.warn("setAnrPlotSelection:", e);
  }
}

function parseAnrPlotId(value: unknown): number | null {
  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }
  if (value != null && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return null;
}

function applyAnrPlotLayerPaint(map: MapboxMap): void {
  if (map.getLayer(ANR_PLOT_FILL_LAYER_ID) == null || map.getLayer(ANR_PLOT_LINE_LAYER_ID) == null) {
    return;
  }

  const fillColor: DataDrivenPropertyValueSpecification<string> = [
    "case",
    ANR_PLOT_SELECTED_EXPR,
    ANR_SELECTED_PLOT_FILL_RGBA,
    ANR_DEFAULT_PLOT_FILL_RGBA
  ] as DataDrivenPropertyValueSpecification<string>;

  const lineColor: DataDrivenPropertyValueSpecification<string> = [
    "case",
    ANR_PLOT_SELECTED_EXPR,
    ANR_SELECTED_PLOT_LINE_COLOR,
    ANR_DEFAULT_PLOT_LINE_COLOR
  ] as DataDrivenPropertyValueSpecification<string>;

  const lineOpacity: DataDrivenPropertyValueSpecification<number> = [
    "case",
    ANR_PLOT_SELECTED_EXPR,
    ANR_SELECTED_PLOT_LINE_OPACITY,
    ANR_DEFAULT_PLOT_LINE_OPACITY
  ] as DataDrivenPropertyValueSpecification<number>;

  const lineWidth: DataDrivenPropertyValueSpecification<number> = [
    "case",
    ANR_PLOT_SELECTED_EXPR,
    ANR_SELECTED_PLOT_LINE_WIDTH,
    ANR_DEFAULT_PLOT_LINE_WIDTH
  ] as DataDrivenPropertyValueSpecification<number>;

  try {
    map.setPaintProperty(ANR_PLOT_FILL_LAYER_ID, "fill-color", fillColor);
    map.setPaintProperty(ANR_PLOT_FILL_LAYER_ID, "fill-opacity", 1);
    map.setPaintProperty(ANR_PLOT_FILL_LAYER_ID, "fill-antialias", false);
    map.setPaintProperty(ANR_PLOT_LINE_LAYER_ID, "line-color", lineColor);
    map.setPaintProperty(ANR_PLOT_LINE_LAYER_ID, "line-opacity", lineOpacity);
    map.setPaintProperty(ANR_PLOT_LINE_LAYER_ID, "line-width", lineWidth);
  } catch (e) {
    Log.warn("applyAnrPlotLayerPaint:", e);
  }
}

const anrPlotOverlayStateByMap = new WeakMap<MapboxMap, AnrPlotOverlayState>();

function getAnrPlotOverlayState(map: MapboxMap): AnrPlotOverlayState {
  const existing = anrPlotOverlayStateByMap.get(map);
  if (existing != null) return existing;
  const created: AnrPlotOverlayState = {
    clickHandler: null,
    mouseEnterHandler: null,
    mouseLeaveHandler: null,
    marker: null,
    markerRoot: null,
    pendingIdleRetry: null,
    selectedPlotId: null,
    polygonStatus: null,
    polygonName: null
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
    if (state.marker != null) {
      state.marker.remove();
      state.marker = null;
    }
    if (state.markerRoot != null) {
      state.markerRoot.unmount();
      state.markerRoot = null;
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

export function upsertAnrPlotGeometryOverlay(
  map: MapboxMap,
  geojson: unknown,
  options: { visible: boolean; polygonStatus?: string | null; polygonName?: string | null }
): void {
  if (map == null) return;
  removeAnrPlotGeometryOverlay(map);
  const state = getAnrPlotOverlayState(map);
  state.polygonStatus = options.polygonStatus ?? null;
  state.polygonName = options.polygonName ?? null;
  state.selectedPlotId = null;

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
    map.addSource(ANR_PLOT_SOURCE_ID, { type: "geojson", data: geojsonFormatted, promoteId: "plotId" });

    map.addLayer(
      {
        id: ANR_PLOT_FILL_LAYER_ID,
        type: "fill",
        source: ANR_PLOT_SOURCE_ID,
        layout: { visibility: "visible" },
        paint: {
          "fill-color": ANR_DEFAULT_PLOT_FILL_RGBA,
          "fill-opacity": 1,
          "fill-antialias": false
        }
      },
      beforeLayer
    );
    map.addLayer(
      {
        id: ANR_PLOT_LINE_LAYER_ID,
        type: "line",
        source: ANR_PLOT_SOURCE_ID,
        layout: { visibility: "visible" },
        paint: {
          "line-color": ANR_DEFAULT_PLOT_LINE_COLOR,
          "line-width": ANR_DEFAULT_PLOT_LINE_WIDTH,
          "line-opacity": ANR_DEFAULT_PLOT_LINE_OPACITY
        }
      },
      beforeLayer
    );

    applyAnrPlotLayerPaint(map);

    if (map.getLayer(LAYERS_NAMES.MEDIA_IMAGES) != null) {
      try {
        map.moveLayer(ANR_PLOT_FILL_LAYER_ID, LAYERS_NAMES.MEDIA_IMAGES);
        map.moveLayer(ANR_PLOT_LINE_LAYER_ID, LAYERS_NAMES.MEDIA_IMAGES);
      } catch (e) {
        Log.warn("moveLayer ANR plot overlay:", e);
      }
    }

    state.clickHandler = (e: MapMouseEvent) => {
      const feature = e.features?.[0];
      if (feature == null) return;

      const props = feature.properties ?? {};
      const plotId = parseAnrPlotId(props.plotId ?? props.plot_id);
      clearAnrPlotSelection(map, state.selectedPlotId);
      state.selectedPlotId = plotId;
      setAnrPlotSelection(map, plotId);

      if (state.marker != null) {
        state.marker.remove();
        state.marker = null;
      }
      if (state.markerRoot != null) {
        state.markerRoot.unmount();
        state.markerRoot = null;
      }

      const markerEl = document.createElement("div");
      markerEl.className = "anr-plot-marker";
      const root = createRoot(markerEl);
      state.markerRoot = root;

      const handleClose = () => {
        clearAnrPlotSelection(map, state.selectedPlotId);
        state.selectedPlotId = null;
        state.marker?.remove();
        state.marker = null;
        state.markerRoot?.unmount();
        state.markerRoot = null;
      };

      const resolvedPolygonName =
        state.polygonName != null && state.polygonName !== ""
          ? state.polygonName
          : props.name != null
          ? String(props.name)
          : "ANR monitoring plot";

      root.render(
        createElement(
          PopupProviders,
          null,
          createElement(AnrPlotMapPopup, {
            plotId: plotId ?? undefined,
            polygonName: resolvedPolygonName,
            onClose: handleClose
          })
        )
      );

      const marker = new MapboxMarker({ element: markerEl, anchor: "bottom" }).setLngLat(e.lngLat).addTo(map);
      state.marker = marker;
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
