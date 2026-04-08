import MapboxDraw from "@mapbox/mapbox-gl-draw";
import _ from "lodash";
import mapboxgl from "mapbox-gl";
import { MutableRefObject, useEffect, useRef, useState } from "react";

import { LAYERS_NAMES, layersList } from "@/constants/layers";
import { DELETED_POLYGONS } from "@/constants/statuses";

import { addDeleteLayer, addFilterOnLayer, addSourcesToLayers } from "../layers/polygonLayers";
import { DashboardGetProjectsData } from "../Map.d";

type UseMapLayersParams = {
  map: MutableRefObject<mapboxgl.Map | null>;
  draw: MutableRefObject<MapboxDraw | null>;
  /** True when style.load has fired — from core/useMapReadiness. */
  styleReady: boolean;
  /** Increments on every style.load — ensures effects re-run after each style switch. */
  styleVersion: number;
  polygonsData?: Record<string, string[]>;
  centroids?: DashboardGetProjectsData[];
  polygonsCentroids?: any[];
  isDashboard?: string;
  projectUUID?: string;
  hasAccess?: boolean;
  selectedPolygonsInCheckbox?: string[];
};

/**
 * Manages the polygon source/layer lifecycle (contracts PL-1 through PL-4).
 *
 * Gated on `styleReady` from core/useMapReadiness — the SINGLE readiness signal.
 * No internal idle listeners, no isStyleLoaded() calls, no rAF polling.
 *
 * - WHEN styleReady goes true → adds sources and filters (PL-1, PL-2)
 * - WHEN styleReady goes false (style switch) → resets sourcesAdded so overlays
 *   don't try to add border layers on top of a cleared style (PL-3)
 * - WHEN polygonsData changes while style is ready → re-adds sources with new data
 * - WHEN selectedPolygonsInCheckbox changes → updates deleted geometry layer (PL-4)
 *
 * Returns `sourcesAdded` as the gate for border/overlay hooks (PL-2).
 * Popup registration is handled separately in useMapPopups.
 */
export function useMapLayers({
  map,
  draw: _draw,
  styleReady,
  styleVersion,
  polygonsData,
  centroids,
  polygonsCentroids,
  isDashboard,
  projectUUID,
  hasAccess,
  selectedPolygonsInCheckbox
}: UseMapLayersParams) {
  const [sourcesAdded, setSourcesAdded] = useState(false);

  // Tile cache version: a stable string that only changes when polygon geometry
  // content (UUIDs) actually changes. This prevents re-fetching tiles on every
  // render while still busting the browser cache when new polygons arrive.
  const prevPolygonFingerprintRef = useRef<string>("");
  const tileVersionRef = useRef<string>("0");

  useEffect(() => {
    if (!styleReady || map.current == null || (!isDashboard && _.isEmpty(polygonsData))) {
      setSourcesAdded(false);
      return;
    }

    // Compute a content fingerprint from all polygon UUIDs.
    // Only bump the tile version (forcing a source URL change) when the actual
    // geometry set changes — not on every render with the same data.
    const fingerprint = Object.values(polygonsData ?? {})
      .flat()
      .sort()
      .join(",");
    if (fingerprint !== prevPolygonFingerprintRef.current) {
      prevPolygonFingerprintRef.current = fingerprint;
      tileVersionRef.current = String(Date.now());
    }

    const zoomFilter = isDashboard ? 9 : undefined;
    const polygonsDataToUse = isDashboard != null && projectUUID != null && hasAccess === false ? {} : polygonsData;

    addSourcesToLayers(
      map.current,
      polygonsDataToUse,
      centroids,
      zoomFilter,
      isDashboard,
      polygonsCentroids,
      tileVersionRef.current
    );
    setSourcesAdded(true);
    // styleVersion ensures this re-runs after every style switch, not just the first load.
  }, [map, styleReady, styleVersion, polygonsData, polygonsCentroids, centroids, isDashboard, projectUUID, hasAccess]);

  useEffect(() => {
    if (!styleReady || selectedPolygonsInCheckbox == null || map.current == null) return;
    addDeleteLayer(
      layersList.find(layer => layer.name === LAYERS_NAMES.DELETED_GEOMETRIES),
      map.current,
      { [DELETED_POLYGONS]: selectedPolygonsInCheckbox }
    );
  }, [map, selectedPolygonsInCheckbox, styleReady, styleVersion]);

  return { sourcesAdded };
}

/**
 * Filters a polygon UUID out of the current polygonsData and re-applies the layer filter.
 * Called when entering draw/edit mode for a specific polygon (contract DE-1).
 */
export function filterPolygonFromLayers(
  polygonuuid: string,
  polygonsData: Record<string, string[]> | undefined,
  map: mapboxgl.Map
) {
  if (polygonsData == null) return;
  const newPolygonData: Record<string, string[]> = JSON.parse(JSON.stringify(polygonsData));
  const statuses = ["submitted", "approved", "need-more-info", "draft", "form-polygons"];
  statuses.forEach(status => {
    if (newPolygonData[status] != null) {
      newPolygonData[status] = newPolygonData[status].filter((feature: string) => feature !== polygonuuid);
    }
  });
  addFilterOnLayer(
    layersList.find(layer => layer.name === LAYERS_NAMES.POLYGON_GEOMETRY),
    newPolygonData,
    map
  );
}
