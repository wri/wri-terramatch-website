import type { BBox } from "./GeoJSON";

export const polygonSelectionZoomBboxCache = new Map<string, BBox | null>();

export const clearPolygonSelectionZoomBboxCache = () => {
  polygonSelectionZoomBboxCache.clear();
};

export const invalidatePolygonSelectionZoomBboxCache = (uuids: string[]): void => {
  if (uuids.length === 0) {
    return;
  }

  polygonSelectionZoomBboxCache.delete(uuids.slice().sort().join(","));
};
