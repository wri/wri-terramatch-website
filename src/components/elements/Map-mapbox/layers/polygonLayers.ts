import _ from "lodash";
import mapboxgl from "mapbox-gl";

import { LAYERS_NAMES, layersList } from "@/constants/layers";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import Log from "@/utils/log";

import { getGeoserverURL } from "../adapters/geoserver";
import type { LayerType, LayerWithStyle } from "../Map.d";
import { DashboardGetProjectsData } from "../Map.d";
import { getPulsingDot } from "../pulsing.dot";

export const getFeatureProperties = <T extends any>(properties: any, key: string): T | undefined => {
  return properties[key] ?? properties[`user_${key}`];
};

const showPolygons = (
  styles: LayerWithStyle[],
  name: string,
  map: mapboxgl.Map,
  field: string,
  parsedPolygonData: any,
  zoomFilter?: number | undefined
) => {
  styles.forEach((style: LayerWithStyle, index: number) => {
    const layerName = `${name}-${index}`;
    if (!map.getLayer(layerName)) {
      Log.warn(`Layer ${layerName} does not exist.`);
      return;
    }
    const polygonStatus = style?.metadata?.polygonStatus;
    const uuidFilter = [
      "in",
      ["get", field],
      ["literal", parsedPolygonData?.[polygonStatus] === undefined ? "" : parsedPolygonData[polygonStatus]]
    ];
    const completeFilter = zoomFilter ? ["all", uuidFilter, [">", ["zoom"], zoomFilter]] : ["all", uuidFilter];
    map.setFilter(layerName, completeFilter);
    map.setLayoutProperty(layerName, "visibility", "visible");
  });
};

export const loadLayersInMap = (
  map: mapboxgl.Map,
  polygonsData: Record<string, string[]> | undefined,
  layer: any,
  zoomFilter?: number | undefined
) => {
  if (map) {
    showPolygons(layer.styles, layer.name, map, "uuid", polygonsData, zoomFilter);
  }
};

// Called imperatively from onCancel (user interaction) — style is always loaded at this point.
// No defensive listeners needed; adding them would accumulate across cancellations (LC-4).
export const addFilterOfPolygonsData = (map: mapboxgl.Map, polygonsData: Record<string, string[]> | undefined) => {
  if (map == null || polygonsData == null) return;
  layersList.forEach((layer: LayerType) => loadLayersInMap(map, polygonsData, layer));
};

export const addFilterOnLayer = (layer: any, parsedPolygonData: Record<string, string[]>, map: mapboxgl.Map) => {
  addSourceToLayer(layer, map, parsedPolygonData);
};

export const setFilterCountry = (map: mapboxgl.Map, layerName: string, country: string) => {
  map.setFilter(layerName, ["==", ["get", "iso"], country]);
};

export const setFilterLandscape = (map: mapboxgl.Map, layerName: string, landscapes: string[]) => {
  map.setFilter(layerName, ["in", ["get", "landscape"], ["literal", landscapes]]);
};

export const addGeojsonSourceToLayer = (
  centroids: DashboardGetProjectsData[] | undefined,
  map: mapboxgl.Map,
  layer: LayerType,
  zoomFilterValue: number | undefined,
  existsPolygons: boolean
) => {
  const { name, styles } = layer;
  if (map == null || centroids == null || centroids.length === 0) return;

  if (map.getSource(name)) {
    styles?.forEach((_: unknown, index: number) => map.removeLayer(`${name}-${index}`));
    map.removeSource(name);
  }

  if (existsPolygons) return;

  const features: GeoJSON.Feature[] = centroids.map((centroid: any) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [centroid.long || centroid.centroid?.long, centroid.lat || centroid.centroid?.lat]
    },
    properties: {
      uuid: centroid.uuid,
      name: centroid.name || centroid.uuid,
      type: centroid.type || "polygon_centroid"
    }
  }));

  map.addSource(name, { type: "geojson", data: { type: "FeatureCollection", features } });

  styles?.forEach((style: LayerWithStyle, index: number) => {
    addLayerGeojsonStyle(map, name, name, style, index);
  });
};

export const addSourceToLayer = (
  layer: LayerType,
  map: mapboxgl.Map,
  polygonsData: Record<string, string[]> | undefined,
  zoomFilter?: number | undefined,
  isDashboard?: string | undefined
) => {
  const { name, geoserverLayerName, styles } = layer;
  try {
    if (map == null) return;
    if (map.getSource(name)) {
      styles?.forEach((_: unknown, index: number) => map.removeLayer(`${name}-${index}`));
      map.removeSource(name);
    }
    const GEOSERVER_TILE_URL = getGeoserverURL(geoserverLayerName, isDashboard);
    map.addSource(name, { type: "vector", tiles: [GEOSERVER_TILE_URL] });
    styles?.forEach((style: LayerWithStyle, index: number) => {
      addLayerStyle(map, name, geoserverLayerName, style, index, zoomFilter);
    });
    if (polygonsData) {
      loadLayersInMap(map, polygonsData, layer, zoomFilter);
    }
  } catch (e) {
    console.warn(e);
  }
};

const loadDeleteLayer = (layer: any, map: mapboxgl.Map, polygonsData: Record<string, string[]> | undefined) => {
  const { name, geoserverLayerName, styles } = layer;
  styles?.forEach((style: LayerWithStyle, index: number) => {
    if (map.getLayer(`${name}-${index}`)) {
      map.removeLayer(`${name}-${index}`);
    }
    map.addLayer({
      ...style,
      id: `${name}-${index}`,
      source: name,
      "source-layer": geoserverLayerName
    } as mapboxgl.AnyLayer);
  });
  loadLayersInMap(map, polygonsData, layer);
};

export const addDeleteLayer = (layer: any, map: mapboxgl.Map, polygonsData: Record<string, string[]> | undefined) => {
  const { name, geoserverLayerName, styles } = layer;
  try {
    if (map == null) return;
    if (map.getSource(name)) {
      styles?.forEach((_: unknown, index: number) => map.removeLayer(`${name}-${index}`));
      map.removeSource(name);
    }
    const GEOSERVER_TILE_URL = getGeoserverURL(geoserverLayerName);
    map.addSource(name, { type: "vector", tiles: [GEOSERVER_TILE_URL] });
    loadDeleteLayer(layer, map, polygonsData);
  } catch (e) {
    console.warn(e);
  }
};

const moveDeleteLayers = (map: mapboxgl.Map) => {
  const layers = layersList.filter(layer => layer.name === LAYERS_NAMES.DELETED_GEOMETRIES);
  layers.forEach(layer => {
    const { name, styles } = layer;
    styles?.forEach((_: unknown, index: number) => {
      if (map?.getLayer(`${name}-${index}`)) {
        map?.moveLayer(`${name}-${index}`);
      }
    });
  });
};

export const addLayerGeojsonStyle = (
  map: mapboxgl.Map,
  layerName: string,
  sourceName: string,
  style: LayerWithStyle,
  index: number
) => {
  const beforeLayer = map.getLayer(LAYERS_NAMES.MEDIA_IMAGES) ? LAYERS_NAMES.MEDIA_IMAGES : undefined;
  if (map.getLayer(`${layerName}-${index}`)) {
    map.removeLayer(`${layerName}-${index}`);
  }
  map.addLayer({ ...style, id: `${layerName}-${index}`, source: sourceName } as mapboxgl.AnyLayer, beforeLayer);
  moveDeleteLayers(map);
};

export const addLayerStyle = (
  map: mapboxgl.Map,
  layerName: string,
  sourceName: string,
  style: LayerWithStyle,
  index_suffix: number | string,
  zoomFilter?: number | undefined
) => {
  const beforeLayer = map.getLayer(LAYERS_NAMES.MEDIA_IMAGES) ? LAYERS_NAMES.MEDIA_IMAGES : undefined;
  if (map.getLayer(`${layerName}-${index_suffix}`)) {
    map.removeLayer(`${layerName}-${index_suffix}`);
  }
  map.addLayer(
    {
      ...style,
      id: `${layerName}-${index_suffix}`,
      source: sourceName,
      "source-layer": sourceName,
      ...(zoomFilter && {
        filter: ["all", style.filter || ["==", true, true], [">=", ["zoom"], zoomFilter]]
      })
    } as mapboxgl.AnyLayer,
    beforeLayer
  );
  moveDeleteLayers(map);
};

export const addSourcesToLayers = (
  map: mapboxgl.Map,
  polygonsData: Record<string, string[]> | undefined,
  centroids: DashboardGetProjectsData[] | undefined,
  zoomFilter?: number | undefined,
  isDashboard?: string | undefined,
  polygonsCentroids?: any[] | undefined
) => {
  if (map == null) return;
  layersList.forEach((layer: LayerType) => {
    if (layer.name === LAYERS_NAMES.POLYGON_GEOMETRY) {
      addSourceToLayer(layer, map, polygonsData, zoomFilter, isDashboard);
    }
    if (layer.name === LAYERS_NAMES.WORLD_COUNTRIES && isDashboard) {
      addSourceToLayer(layer, map, undefined, undefined);
    }
    if (layer.name === LAYERS_NAMES.CENTROIDS && isDashboard) {
      addGeojsonSourceToLayer(centroids, map, layer, zoomFilter, !_.isEmpty(polygonsData));
    }
  });
  if (isDashboard) {
    addPolygonCentroidsLayer(map, polygonsCentroids ?? [], zoomFilter);
  }
};

export const addPolygonCentroidsLayer = (
  map: mapboxgl.Map,
  centroids: { uuid: string; long: number; lat: number }[],
  zoomFilterValue?: number
) => {
  if (map == null || centroids == null || centroids.length === 0) return;

  const layerName = LAYERS_NAMES.POLYGON_CENTROIDS;
  const validCentroids = centroids.filter(
    c =>
      c != null &&
      typeof c.lat === "number" &&
      !isNaN(c.lat) &&
      typeof c.long === "number" &&
      !isNaN(c.long) &&
      typeof c.uuid === "string" &&
      c.uuid.length > 0
  );

  if (validCentroids.length === 0) return;

  // Called only after styleReady is true (from useMapLayers).
  // The style is already loaded — no polling needed.
  try {
    if (map.getLayer(layerName)) map.removeLayer(layerName);
    if (map.getSource(layerName)) map.removeSource(layerName);
    if (map.hasImage("pulsing-dot-centroids")) map.removeImage("pulsing-dot-centroids");

    const features: GeoJSON.Feature[] = validCentroids.map(centroid => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [centroid.long, centroid.lat] },
      properties: { uuid: centroid.uuid }
    }));

    const pulsingDot = getPulsingDot(map, 120, "#72D961");
    map.addImage("pulsing-dot-centroids", pulsingDot, { pixelRatio: 4 });
    map.addSource(layerName, { type: "geojson", data: { type: "FeatureCollection", features } });

    const filter = zoomFilterValue ? ["<=", ["zoom"], zoomFilterValue] : [">=", ["zoom"], 0];
    map.addLayer({
      id: layerName,
      type: "symbol",
      source: layerName,
      layout: { "icon-image": "pulsing-dot-centroids" },
      paint: {},
      filter
    });
  } catch (error) {
    Log.error("addPolygonCentroidsLayer: unexpected error (style may not be ready):", error);
  }
};

type DataPolygonOverview = { status: string; count: number }[];

export function parsePolygonDataV3(sitePolygonData: SitePolygonLightDto[] | undefined): Record<string, string[]> {
  return (sitePolygonData ?? []).reduce((acc: Record<string, string[]>, data: SitePolygonLightDto) => {
    if (data.status != null && data.polygonUuid != null) {
      if (acc[data.status] == null) acc[data.status] = [];
      acc[data.status].push(data.polygonUuid);
    }
    return acc;
  }, {});
}

export const countStatusesV3 = (sitePolygonData: SitePolygonLightDto[]): DataPolygonOverview => {
  const statusOrder = ["Draft", "Submitted", "Needs Info", "Approved"];
  const statusCountMap: Record<string, number> = {};

  sitePolygonData.forEach(item => {
    let statusKey = item.status?.toLowerCase();
    if (statusKey) {
      if (statusKey === "needs-more-information") {
        statusKey = "Needs Info";
      } else {
        statusKey = statusKey.replace(/\b\w/g, char => char.toUpperCase());
      }
      statusCountMap[statusKey] = (statusCountMap[statusKey] || 0) + 1;
    }
  });

  const unorderedData = Object.entries(statusCountMap).map(([status, count]) => ({ status, count }));
  return unorderedData.sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));
};
