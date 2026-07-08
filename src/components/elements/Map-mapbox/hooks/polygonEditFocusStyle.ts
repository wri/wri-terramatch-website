import type { DataDrivenPropertyValueSpecification } from "mapbox-gl";
import { Map as MapboxMap } from "mapbox-gl";

import {
  getPolygonGeometryFillLayerConfigs,
  getPolygonGeometryLineLayerConfigs
} from "@/components/elements/Map-mapbox/layers/polygonLayers";
import Log from "@/utils/log";

export const EDIT_NEIGHBOR_FILL_DIM_FACTOR = 2 / 5;
export const EDIT_NEIGHBOR_LINE_OPACITY = 0.5;
const BASE_LINE_OPACITY = 1;

const TILE_POLYGON_ID_EXPR: unknown[] = ["coalesce", ["get", "uuid"], ["get", "polygonUuid"]];

function buildNeighborDimFillOpacity(
  baseFillOpacity: number,
  active: boolean,
  editedPolygonUuid: string | null
): number | DataDrivenPropertyValueSpecification<number> {
  if (!active) return baseFillOpacity;

  const dimmedOpacity = baseFillOpacity * EDIT_NEIGHBOR_FILL_DIM_FACTOR;
  if (editedPolygonUuid == null || editedPolygonUuid === "") {
    return dimmedOpacity;
  }

  return [
    "case",
    ["==", TILE_POLYGON_ID_EXPR, editedPolygonUuid],
    baseFillOpacity,
    dimmedOpacity
  ] as DataDrivenPropertyValueSpecification<number>;
}

function buildNeighborDimLineOpacity(
  active: boolean,
  editedPolygonUuid: string | null
): number | DataDrivenPropertyValueSpecification<number> {
  if (!active) return BASE_LINE_OPACITY;

  if (editedPolygonUuid == null || editedPolygonUuid === "") {
    return EDIT_NEIGHBOR_LINE_OPACITY;
  }

  return [
    "case",
    ["==", TILE_POLYGON_ID_EXPR, editedPolygonUuid],
    BASE_LINE_OPACITY,
    EDIT_NEIGHBOR_LINE_OPACITY
  ] as DataDrivenPropertyValueSpecification<number>;
}

const TRANSIENT_MAPBOX_ERROR_PATTERNS = [
  "style is not done loading",
  "style not done loading",
  "style is not loaded",
  "style not loaded",
  "does not exist in the map's style"
] as const;

function isTransientMapboxError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? "");
  const lower = message.toLowerCase();
  return TRANSIENT_MAPBOX_ERROR_PATTERNS.some(pattern => lower.includes(pattern));
}

export function applyPolygonNeighborDimming(
  map: MapboxMap,
  active: boolean,
  editedPolygonUuid: string | null = null
): void {
  const fillConfigs = getPolygonGeometryFillLayerConfigs();
  const lineConfigs = getPolygonGeometryLineLayerConfigs();
  const excludeUuid = active ? editedPolygonUuid : null;

  for (const { layerId, baseFillOpacity } of fillConfigs) {
    if (map.getLayer(layerId) == null) continue;
    try {
      map.setPaintProperty(layerId, "fill-opacity", buildNeighborDimFillOpacity(baseFillOpacity, active, excludeUuid));
    } catch (error) {
      if (!isTransientMapboxError(error)) {
        Log.warn("applyPolygonNeighborDimming: set fill-opacity failed", { layerId, active, error });
      }
    }
  }

  for (const { layerId, baseLineWidth } of lineConfigs) {
    if (map.getLayer(layerId) == null) continue;
    try {
      map.setPaintProperty(layerId, "line-opacity", buildNeighborDimLineOpacity(active, excludeUuid));
      map.setPaintProperty(layerId, "line-width", baseLineWidth);
    } catch (error) {
      if (!isTransientMapboxError(error)) {
        Log.warn("applyPolygonNeighborDimming: set line style failed", { layerId, active, error });
      }
    }
  }
}
