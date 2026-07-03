import { Map as MapboxMap } from "mapbox-gl";

import {
  getPolygonGeometryFillLayerConfigs,
  getPolygonGeometryLineLayerConfigs
} from "@/components/elements/Map-mapbox/layers/polygonLayers";
import Log from "@/utils/log";

// Edited geometry lives in MapboxDraw; every polygon still on tile layers is a neighbor.
export const EDIT_NEIGHBOR_FILL_DIM_FACTOR = 2 / 5;
export const EDIT_NEIGHBOR_LINE_OPACITY = 0.5;
const BASE_LINE_OPACITY = 1;

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

/** Dim or restore every polygon tile layer (neighbors only while geometry is in MapboxDraw). */
export function applyPolygonNeighborDimming(map: MapboxMap, active: boolean): void {
  const fillConfigs = getPolygonGeometryFillLayerConfigs();
  const lineConfigs = getPolygonGeometryLineLayerConfigs();

  for (const { layerId, baseFillOpacity } of fillConfigs) {
    if (map.getLayer(layerId) == null) continue;
    try {
      map.setPaintProperty(
        layerId,
        "fill-opacity",
        active ? baseFillOpacity * EDIT_NEIGHBOR_FILL_DIM_FACTOR : baseFillOpacity
      );
    } catch (error) {
      if (!isTransientMapboxError(error)) {
        Log.warn("applyPolygonNeighborDimming: set fill-opacity failed", { layerId, active, error });
      }
    }
  }

  for (const { layerId } of lineConfigs) {
    if (map.getLayer(layerId) == null) continue;
    try {
      map.setPaintProperty(layerId, "line-opacity", active ? EDIT_NEIGHBOR_LINE_OPACITY : BASE_LINE_OPACITY);
    } catch (error) {
      if (!isTransientMapboxError(error)) {
        Log.warn("applyPolygonNeighborDimming: set line-opacity failed", { layerId, active, error });
      }
    }
  }
}
