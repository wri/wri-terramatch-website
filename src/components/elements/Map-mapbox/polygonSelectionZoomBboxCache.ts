import type { BBox } from "./GeoJSON";

export const polygonSelectionZoomBboxCache = new Map<string, BBox | null>();

export const clearPolygonSelectionZoomBboxCache = () => {
  polygonSelectionZoomBboxCache.clear();
};
