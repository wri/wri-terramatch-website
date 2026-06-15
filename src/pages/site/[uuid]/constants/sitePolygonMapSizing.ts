import { resolveRemSizeValue } from "@/lib/sizing";

// Matches ResizeBox initialHeight in SitePolygonMapSection (100 * 0.25rem = 25rem).
export const SITE_POLYGON_MAP_INITIAL_HEIGHT_UNITS = 100;
export const SITE_POLYGON_MAP_INITIAL_HEIGHT = resolveRemSizeValue(SITE_POLYGON_MAP_INITIAL_HEIGHT_UNITS);
