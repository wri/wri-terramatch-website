import { ExpressionSpecification, GeoJSONSource, Map as MapboxMap, MapMouseEvent } from "mapbox-gl";
import { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { computePolygonFingerprint } from "@/components/elements/Map-mapbox/hooks/useMapLayers";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import Log from "@/utils/log";

import {
  DEFAULT_CENTROID_COLOR,
  EMPTY_POLYGONS_DATA,
  EXPLORER_CENTROID_SOURCE_ID,
  EXPLORER_CLUSTER_COUNT_LAYER_ID,
  EXPLORER_CLUSTER_LAYER_ID,
  EXPLORER_POINT_LAYER_ID,
  GEOMETRY_MIN_ZOOM,
  MAX_VISIBLE_GEOMETRIES,
  POLYGON_STATUS_COLORS,
  VIEWPORT_PADDING_RATIO
} from "../constants";

/**
 * MapContainer creates the Mapbox instance after mount; poll the ref until it exists
 * (same pattern Map.tsx uses internally for style readiness).
 */
export const useExplorerMapInstance = (mapRef: MutableRefObject<MapboxMap | null>): MapboxMap | null => {
  const [mapInstance, setMapInstance] = useState<MapboxMap | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setMapInstance(prev => (mapRef.current === prev ? prev : mapRef.current));
    }, 200);
    return () => window.clearInterval(timer);
  }, [mapRef]);

  return mapInstance;
};

export type ExplorerViewportState = {
  /** Status → UUID map limited to the current viewport; drives the shared Geoserver layers. */
  polygonsData: Record<string, string[]>;
  /** UUIDs actually passed to Mapbox (post-cap). */
  visibleCount: number;
  /** Total loaded polygons whose centroid falls inside the padded viewport. */
  totalInViewport: number;
  /** True when the viewport holds more polygons than MAX_VISIBLE_GEOMETRIES. */
  truncated: boolean;
  /** True below GEOMETRY_MIN_ZOOM, where only centroids are displayed. */
  belowMinZoom: boolean;
};

const BELOW_ZOOM_STATE: ExplorerViewportState = {
  polygonsData: EMPTY_POLYGONS_DATA,
  visibleCount: 0,
  totalInViewport: 0,
  truncated: false,
  belowMinZoom: true
};

/**
 * Keeps the Mapbox `["in", uuid, [...]]` filters small by only including polygons whose
 * centroid is inside the padded viewport, capped at MAX_VISIBLE_GEOMETRIES. Recomputes on
 * moveend/zoomend and whenever a new batch of polygons is flushed from the loader.
 */
export const useExplorerViewportPolygons = (
  mapInstance: MapboxMap | null,
  polygons: SitePolygonLightDto[]
): ExplorerViewportState => {
  const [viewport, setViewport] = useState<ExplorerViewportState>(BELOW_ZOOM_STATE);
  const polygonsRef = useRef(polygons);
  const fingerprintRef = useRef("below");

  const recompute = useCallback(() => {
    if (mapInstance == null) return;

    if (mapInstance.getZoom() < GEOMETRY_MIN_ZOOM) {
      if (fingerprintRef.current !== "below") {
        fingerprintRef.current = "below";
        setViewport(BELOW_ZOOM_STATE);
      }
      return;
    }

    const bounds = mapInstance.getBounds();
    if (bounds == null) return;

    const lngPad = (bounds.getEast() - bounds.getWest()) * VIEWPORT_PADDING_RATIO;
    const latPad = (bounds.getNorth() - bounds.getSouth()) * VIEWPORT_PADDING_RATIO;
    const west = bounds.getWest() - lngPad;
    const east = bounds.getEast() + lngPad;
    const south = bounds.getSouth() - latPad;
    const north = bounds.getNorth() + latPad;

    const polygonsData: Record<string, string[]> = {
      ...Object.fromEntries(Object.keys(EMPTY_POLYGONS_DATA).map(status => [status, [] as string[]]))
    };
    let visibleCount = 0;
    let totalInViewport = 0;

    for (const polygon of polygonsRef.current) {
      const { lat, long, status, polygonUuid } = polygon;
      if (lat == null || long == null || status == null || polygonUuid == null) continue;
      if (lat < south || lat > north || long < west || long > east) continue;

      totalInViewport++;
      if (visibleCount >= MAX_VISIBLE_GEOMETRIES) continue;

      if (polygonsData[status] == null) polygonsData[status] = [];
      polygonsData[status].push(polygonUuid);
      visibleCount++;
    }

    const fingerprint = computePolygonFingerprint(polygonsData);
    if (fingerprint === fingerprintRef.current) return;
    fingerprintRef.current = fingerprint;

    setViewport({
      polygonsData,
      visibleCount,
      totalInViewport,
      truncated: totalInViewport > visibleCount,
      belowMinZoom: false
    });
  }, [mapInstance]);

  useEffect(() => {
    polygonsRef.current = polygons;
    recompute();
  }, [polygons, recompute]);

  useEffect(() => {
    if (mapInstance == null) return;
    const handler = () => recompute();
    mapInstance.on("moveend", handler);
    mapInstance.on("zoomend", handler);
    recompute();
    return () => {
      mapInstance.off("moveend", handler);
      mapInstance.off("zoomend", handler);
    };
  }, [mapInstance, recompute]);

  return viewport;
};

const buildCentroidCollection = (polygons: SitePolygonLightDto[]): GeoJSON.FeatureCollection => ({
  type: "FeatureCollection",
  features: polygons
    .filter(polygon => polygon.lat != null && polygon.long != null && polygon.polygonUuid != null)
    .map(polygon => ({
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [polygon.long as number, polygon.lat as number] },
      properties: { uuid: polygon.polygonUuid, status: polygon.status ?? "unknown" }
    }))
});

const statusColorExpression = (): ExpressionSpecification => {
  const pairs = Object.entries(POLYGON_STATUS_COLORS).flatMap(([status, color]) => [status, color]);
  return ["match", ["get", "status"], ...pairs, DEFAULT_CENTROID_COLOR] as ExpressionSpecification;
};

const ensureCentroidLayers = (map: MapboxMap, data: GeoJSON.FeatureCollection): void => {
  const existing = map.getSource(EXPLORER_CENTROID_SOURCE_ID) as GeoJSONSource | undefined;
  if (existing != null) {
    existing.setData(data);
  } else {
    map.addSource(EXPLORER_CENTROID_SOURCE_ID, {
      type: "geojson",
      data,
      cluster: true,
      clusterMaxZoom: GEOMETRY_MIN_ZOOM,
      clusterRadius: 50
    });
  }

  if (map.getLayer(EXPLORER_CLUSTER_LAYER_ID) == null) {
    map.addLayer({
      id: EXPLORER_CLUSTER_LAYER_ID,
      type: "circle",
      source: EXPLORER_CENTROID_SOURCE_ID,
      filter: ["has", "point_count"],
      maxzoom: GEOMETRY_MIN_ZOOM,
      paint: {
        "circle-color": ["step", ["get", "point_count"], "#7EC4E8", 100, "#4BA3D3", 1000, "#2C7FB8"],
        "circle-radius": ["step", ["get", "point_count"], 14, 100, 20, 1000, 26],
        "circle-opacity": 0.85,
        "circle-stroke-width": 1,
        "circle-stroke-color": "#FFFFFF"
      }
    });
  }

  if (map.getLayer(EXPLORER_CLUSTER_COUNT_LAYER_ID) == null) {
    map.addLayer({
      id: EXPLORER_CLUSTER_COUNT_LAYER_ID,
      type: "symbol",
      source: EXPLORER_CENTROID_SOURCE_ID,
      filter: ["has", "point_count"],
      maxzoom: GEOMETRY_MIN_ZOOM,
      layout: {
        "text-field": ["get", "point_count_abbreviated"],
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12
      },
      paint: { "text-color": "#FFFFFF" }
    });
  }

  if (map.getLayer(EXPLORER_POINT_LAYER_ID) == null) {
    map.addLayer({
      id: EXPLORER_POINT_LAYER_ID,
      type: "circle",
      source: EXPLORER_CENTROID_SOURCE_ID,
      filter: ["!", ["has", "point_count"]],
      maxzoom: GEOMETRY_MIN_ZOOM,
      paint: {
        "circle-color": statusColorExpression(),
        "circle-radius": 5,
        "circle-stroke-width": 1,
        "circle-stroke-color": "#FFFFFF"
      }
    });
  }
};

const removeCentroidLayers = (map: MapboxMap): void => {
  try {
    for (const layerId of [EXPLORER_CLUSTER_COUNT_LAYER_ID, EXPLORER_CLUSTER_LAYER_ID, EXPLORER_POINT_LAYER_ID]) {
      if (map.getLayer(layerId) != null) map.removeLayer(layerId);
    }
    if (map.getSource(EXPLORER_CENTROID_SOURCE_ID) != null) map.removeSource(EXPLORER_CENTROID_SOURCE_ID);
  } catch (e) {
    Log.warn("PolygonExplorer: failed to remove centroid layers", e);
  }
};

/**
 * Clustered centroid layers shown below GEOMETRY_MIN_ZOOM. Feature-local so the shared
 * Map-mapbox layer pipeline stays untouched. Clicking a cluster zooms into it; clicking a
 * single centroid zooms to where polygon geometry renders and is clickable.
 */
export const useExplorerCentroidLayers = (mapInstance: MapboxMap | null, polygons: SitePolygonLightDto[]): void => {
  const collection = useMemo(() => buildCentroidCollection(polygons), [polygons]);
  const collectionRef = useRef(collection);

  useEffect(() => {
    collectionRef.current = collection;
    if (mapInstance == null) return;
    try {
      if (mapInstance.isStyleLoaded()) ensureCentroidLayers(mapInstance, collection);
    } catch (e) {
      Log.warn("PolygonExplorer: failed to update centroid data", e);
    }
  }, [collection, mapInstance]);

  useEffect(() => {
    if (mapInstance == null) return;

    const addLayers = () => {
      try {
        ensureCentroidLayers(mapInstance, collectionRef.current);
      } catch (e) {
        Log.warn("PolygonExplorer: retrying centroid layers on idle", e);
        mapInstance.once("idle", () => {
          try {
            ensureCentroidLayers(mapInstance, collectionRef.current);
          } catch (retryError) {
            Log.warn("PolygonExplorer: centroid layer retry failed", retryError);
          }
        });
      }
    };

    const handleClusterClick = (event: MapMouseEvent) => {
      const feature = event.features?.[0];
      const clusterId = feature?.properties?.cluster_id as number | undefined;
      const source = mapInstance.getSource(EXPLORER_CENTROID_SOURCE_ID) as GeoJSONSource | undefined;
      if (feature == null || clusterId == null || source == null) return;
      source.getClusterExpansionZoom(clusterId, (error, zoom) => {
        if (error != null || zoom == null) return;
        mapInstance.easeTo({
          center: (feature.geometry as GeoJSON.Point).coordinates as [number, number],
          zoom: Math.min(zoom + 0.5, GEOMETRY_MIN_ZOOM + 1)
        });
      });
    };

    const handlePointClick = (event: MapMouseEvent) => {
      const feature = event.features?.[0];
      if (feature == null) return;
      mapInstance.easeTo({
        center: (feature.geometry as GeoJSON.Point).coordinates as [number, number],
        zoom: GEOMETRY_MIN_ZOOM + 0.5
      });
    };

    const setPointer = () => mapInstance.getCanvas()?.style.setProperty("cursor", "pointer");
    const clearPointer = () => mapInstance.getCanvas()?.style.removeProperty("cursor");

    if (mapInstance.isStyleLoaded()) addLayers();
    mapInstance.on("style.load", addLayers);
    mapInstance.on("click", EXPLORER_CLUSTER_LAYER_ID, handleClusterClick);
    mapInstance.on("click", EXPLORER_POINT_LAYER_ID, handlePointClick);
    for (const layerId of [EXPLORER_CLUSTER_LAYER_ID, EXPLORER_POINT_LAYER_ID]) {
      mapInstance.on("mouseenter", layerId, setPointer);
      mapInstance.on("mouseleave", layerId, clearPointer);
    }

    return () => {
      mapInstance.off("style.load", addLayers);
      mapInstance.off("click", EXPLORER_CLUSTER_LAYER_ID, handleClusterClick);
      mapInstance.off("click", EXPLORER_POINT_LAYER_ID, handlePointClick);
      for (const layerId of [EXPLORER_CLUSTER_LAYER_ID, EXPLORER_POINT_LAYER_ID]) {
        mapInstance.off("mouseenter", layerId, setPointer);
        mapInstance.off("mouseleave", layerId, clearPointer);
      }
      removeCentroidLayers(mapInstance);
    };
  }, [mapInstance]);
};
