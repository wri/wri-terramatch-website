import _ from "lodash";
import mapboxgl from "mapbox-gl";

import { LAYERS_NAMES, layersList } from "@/constants/layers";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import Log from "@/utils/log";

import { getGeoserverURL } from "../adapters/geoserver";
import type { LayerType, LayerWithStyle } from "../Map.d";
import { DashboardGetProjectsData } from "../Map.d";
import { getPulsingDot } from "../pulsing.dot";

export const getFeatureProperties = <T>(properties: GeoJSON.GeoJsonProperties, key: string): T | undefined => {
  return (properties?.[key] ?? properties?.[`user_${key}`]) as T | undefined;
};

const showPolygons = (
  styles: LayerWithStyle[],
  name: string,
  map: mapboxgl.Map,
  field: string,
  parsedPolygonData: Record<string, string[]> | undefined,
  zoomFilter?: number | undefined
) => {
  styles.forEach((style: LayerWithStyle, index: number) => {
    const layerName = `${name}-${index}`;
    if (!map.getLayer(layerName)) return;
    const polygonStatus = (style?.metadata as { polygonStatus?: string } | undefined)?.polygonStatus ?? "";
    const uuidFilter = [
      "in",
      ["get", field],
      ["literal", parsedPolygonData?.[polygonStatus] === undefined ? "" : parsedPolygonData[polygonStatus]]
    ];
    const completeFilter = (
      zoomFilter ? ["all", uuidFilter, [">", ["zoom"], zoomFilter]] : ["all", uuidFilter]
    ) as mapboxgl.FilterSpecification;
    map.setFilter(layerName, completeFilter);
    map.setLayoutProperty(layerName, "visibility", "visible");
  });
};

export const loadLayersInMap = (
  map: mapboxgl.Map,
  polygonsData: Record<string, string[]> | undefined,
  layer: LayerType,
  zoomFilter?: number | undefined
) => {
  if (map != null) {
    showPolygons(layer.styles, layer.name, map, "uuid", polygonsData, zoomFilter);
  }
};

export const addFilterOfPolygonsData = (map: mapboxgl.Map, polygonsData: Record<string, string[]> | undefined) => {
  if (map == null || polygonsData == null) return;
  layersList.forEach((layer: LayerType) => loadLayersInMap(map, polygonsData, layer));
};

export const addFilterOnLayer = (layer: LayerType, parsedPolygonData: Record<string, string[]>, map: mapboxgl.Map) => {
  addSourceToLayer(layer, map, parsedPolygonData);
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

  const keys = getCentroidSourceKeys(map);
  const cacheKey = `${existsPolygons ? "1" : "0"}:${computeCentroidsFingerprint(centroids)}:${zoomFilterValue ?? "n"}`;
  if (map.getSource(name) != null && keys[name] === cacheKey) return;

  if (map.getSource(name)) {
    styles?.forEach((_: unknown, index: number) => {
      const layerId = `${name}-${index}`;
      if (map.getLayer(layerId) != null) map.removeLayer(layerId);
    });
    map.removeSource(name);
  }

  if (existsPolygons) {
    keys[name] = cacheKey;
    return;
  }

  const features: GeoJSON.Feature[] = centroids
    .filter(centroid => {
      const lng = centroid.long ?? centroid.centroid?.long;
      const lat = centroid.lat ?? centroid.centroid?.lat;
      return lng != null && lat != null;
    })
    .map(centroid => ({
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [centroid.long ?? centroid.centroid!.long!, centroid.lat ?? centroid.centroid!.lat!]
      },
      properties: {
        uuid: centroid.uuid,
        name: centroid.name ?? centroid.uuid,
        type: centroid.type ?? "polygon_centroid"
      }
    }));

  map.addSource(name, { type: "geojson", data: { type: "FeatureCollection", features } });

  styles?.forEach((style: LayerWithStyle, index: number) => {
    addLayerGeojsonStyle(map, name, name, style, index);
  });
  keys[name] = cacheKey;
};

const centroidSourceKeys = new WeakMap<mapboxgl.Map, Record<string, string>>();

function getCentroidSourceKeys(map: mapboxgl.Map): Record<string, string> {
  if (!centroidSourceKeys.has(map)) centroidSourceKeys.set(map, {});
  return centroidSourceKeys.get(map)!;
}

function computeCentroidsFingerprint(centroids: DashboardGetProjectsData[]): string {
  let hash = 2166136261;
  for (const c of centroids) {
    const centroidData = c.centroid;
    const id = c.uuid ?? "";
    const lng = String(c.long ?? centroidData?.long ?? "");
    const lat = String(c.lat ?? centroidData?.lat ?? "");
    const value = `${id}|${lng}|${lat}`;
    for (let i = 0; i < value.length; i++) {
      hash ^= value.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
  }
  return `${hash >>> 0}:${centroids.length}`;
}

const sourceCacheKeys = new WeakMap<mapboxgl.Map, Record<string, string>>();

function getSourceCacheKeys(map: mapboxgl.Map): Record<string, string> {
  if (!sourceCacheKeys.has(map)) sourceCacheKeys.set(map, {});
  return sourceCacheKeys.get(map)!;
}

export const addSourceToLayer = (
  layer: LayerType,
  map: mapboxgl.Map,
  polygonsData: Record<string, string[]> | undefined,
  zoomFilter?: number | undefined,
  dashboardMode?: string | undefined,
  cacheKey: string = "0"
) => {
  const { name, geoserverLayerName, styles } = layer;
  try {
    if (map == null) return;

    const keys = getSourceCacheKeys(map);
    const sourceExists = map.getSource(name) != null;
    const keyChanged = keys[name] !== cacheKey;

    if (sourceExists && !keyChanged) {
      if (polygonsData) {
        loadLayersInMap(map, polygonsData, layer, zoomFilter);
      }
      return;
    }

    if (sourceExists) {
      styles?.forEach((_: unknown, index: number) => {
        const layerId = `${name}-${index}`;
        if (map.getLayer(layerId) != null) map.removeLayer(layerId);
      });
      map.removeSource(name);
    }

    const GEOSERVER_TILE_URL = getGeoserverURL(geoserverLayerName, dashboardMode, cacheKey);
    keys[name] = cacheKey;
    map.addSource(name, { type: "vector", tiles: [GEOSERVER_TILE_URL] });
    styles?.forEach((style: LayerWithStyle, index: number) => {
      addLayerStyle(map, name, geoserverLayerName, style, index, zoomFilter);
    });
    if (polygonsData) {
      loadLayersInMap(map, polygonsData, layer, zoomFilter);
    }
  } catch (e) {
    Log.warn("addSourceToLayer:", e);
  }
};

const loadDeleteLayer = (layer: LayerType, map: mapboxgl.Map, polygonsData: Record<string, string[]> | undefined) => {
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
    } as mapboxgl.LayerSpecification);
  });
  loadLayersInMap(map, polygonsData, layer);
};

export const addDeleteLayer = (
  layer: LayerType,
  map: mapboxgl.Map,
  polygonsData: Record<string, string[]> | undefined
) => {
  const { name, geoserverLayerName, styles } = layer;
  try {
    if (map == null) return;
    if (map.getSource(name)) {
      styles?.forEach((_: unknown, index: number) => {
        const layerId = `${name}-${index}`;
        if (map.getLayer(layerId) != null) map.removeLayer(layerId);
      });
      map.removeSource(name);
    }
    const GEOSERVER_TILE_URL = getGeoserverURL(geoserverLayerName);
    map.addSource(name, { type: "vector", tiles: [GEOSERVER_TILE_URL] });
    loadDeleteLayer(layer, map, polygonsData);
  } catch (e) {
    Log.warn("addDeleteLayer:", e);
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
  map.addLayer(
    { ...style, id: `${layerName}-${index}`, source: sourceName } as mapboxgl.LayerSpecification,
    beforeLayer
  );
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
    } as mapboxgl.LayerSpecification,
    beforeLayer
  );
  moveDeleteLayers(map);
};

export const addSourcesToLayers = (
  map: mapboxgl.Map,
  polygonsData: Record<string, string[]> | undefined,
  centroids: DashboardGetProjectsData[] | undefined,
  zoomFilter?: number | undefined,
  dashboardMode?: string | undefined,
  polygonsCentroids?: { uuid: string; long: number; lat: number }[] | undefined,
  cacheKey: string = "0"
) => {
  if (map == null) return;
  layersList.forEach((layer: LayerType) => {
    if (layer.name === LAYERS_NAMES.POLYGON_GEOMETRY) {
      addSourceToLayer(layer, map, polygonsData, zoomFilter, dashboardMode, cacheKey);
    }
    if (layer.name === LAYERS_NAMES.CENTROIDS && dashboardMode) {
      addGeojsonSourceToLayer(centroids, map, layer, zoomFilter, !_.isEmpty(polygonsData));
    }
  });
  if (dashboardMode) {
    addPolygonCentroidsLayer(map, polygonsCentroids ?? [], zoomFilter);
  }
};

export const addPolygonCentroidsLayer = (
  map: mapboxgl.Map,
  centroids: { uuid: string; long: number; lat: number }[],
  zoomFilterValue?: number
) => {
  if (map == null) return;

  const layerName = LAYERS_NAMES.POLYGON_CENTROIDS;

  try {
    if (map.getLayer(layerName) != null) map.removeLayer(layerName);
    if (map.getSource(layerName) != null) map.removeSource(layerName);
    if (map.hasImage("pulsing-dot-centroids")) map.removeImage("pulsing-dot-centroids");
  } catch (error) {
    Log.error("addPolygonCentroidsLayer: cleanup failed:", error);
  }

  if (centroids == null || centroids.length === 0) return;

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

  try {
    const features: GeoJSON.Feature[] = validCentroids.map(centroid => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [centroid.long, centroid.lat] },
      properties: { uuid: centroid.uuid }
    }));

    const pulsingDot = getPulsingDot(map, 120, "#72D961");
    map.addImage("pulsing-dot-centroids", pulsingDot, { pixelRatio: 4 });
    map.addSource(layerName, { type: "geojson", data: { type: "FeatureCollection", features } });

    const filter = (
      zoomFilterValue ? ["<=", ["zoom"], zoomFilterValue] : [">=", ["zoom"], 0]
    ) as mapboxgl.FilterSpecification;
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
