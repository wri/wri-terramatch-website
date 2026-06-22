import { BBox } from "../GeoJSON";

const LARGE_EXTENT_LNG_SPAN_DEG = 15;
const LARGE_EXTENT_LAT_SPAN_DEG = 15;

export const isLargeExtentBbox = (bbox: BBox | undefined | null): boolean => {
  if (bbox == null || bbox.length < 4) {
    return false;
  }

  const [west, south, east, north] = bbox;
  const lngSpan = east - west;
  const latSpan = north - south;

  return lngSpan > LARGE_EXTENT_LNG_SPAN_DEG || latSpan > LARGE_EXTENT_LAT_SPAN_DEG;
};
