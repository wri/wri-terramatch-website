import type { BBox } from "./GeoJSON";

/** Client cache for fitBounds on selection; keyed by sorted polygon UUID selection key. */
export const polygonSelectionZoomBboxCache = new Map<string, BBox | null>();

export const clearPolygonSelectionZoomBboxCache = () => {
  polygonSelectionZoomBboxCache.clear();
};
