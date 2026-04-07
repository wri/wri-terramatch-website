import MapboxDraw from "@mapbox/mapbox-gl-draw";
import _ from "lodash";
import mapboxgl from "mapbox-gl";
import { MutableRefObject, useEffect, useState } from "react";

import { LAYERS_NAMES, layersList } from "@/constants/layers";
import { DELETED_POLYGONS } from "@/constants/statuses";

import { addDeleteLayer, addFilterOnLayer, addSourcesToLayers } from "../layers/polygonLayers";
import { DashboardGetProjectsData } from "../Map.d";

type UseMapLayersParams = {
  map: MutableRefObject<mapboxgl.Map | null>;
  draw: MutableRefObject<MapboxDraw | null>;
  /** True when style.load has fired — from core/useMapReadiness. This is the single gate. */
  styleReady: boolean;
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
  polygonsData,
  centroids,
  polygonsCentroids,
  isDashboard,
  projectUUID,
  hasAccess,
  selectedPolygonsInCheckbox
}: UseMapLayersParams) {
  const [sourcesAdded, setSourcesAdded] = useState(false);

  useEffect(() => {
    if (!styleReady || map.current == null || (!isDashboard && _.isEmpty(polygonsData))) {
      setSourcesAdded(false);
      return;
    }

    const zoomFilter = isDashboard ? 9 : undefined;
    const polygonsDataToUse = isDashboard != null && projectUUID != null && hasAccess === false ? {} : polygonsData;

    addSourcesToLayers(map.current, polygonsDataToUse, centroids, zoomFilter, isDashboard, polygonsCentroids);
    setSourcesAdded(true);
  }, [map, styleReady, polygonsData, polygonsCentroids, centroids, isDashboard, projectUUID, hasAccess]);

  useEffect(() => {
    if (!styleReady || selectedPolygonsInCheckbox == null || map.current == null) return;
    addDeleteLayer(
      layersList.find(layer => layer.name === LAYERS_NAMES.DELETED_GEOMETRIES),
      map.current,
      { [DELETED_POLYGONS]: selectedPolygonsInCheckbox }
    );
  }, [map, selectedPolygonsInCheckbox, styleReady]);

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
