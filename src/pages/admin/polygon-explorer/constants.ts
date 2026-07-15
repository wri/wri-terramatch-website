import {
  POLYGON_APPROVED,
  POLYGON_DRAFT,
  POLYGON_INFORMATION_REQUIRED,
  POLYGON_PENDING_APPROVAL
} from "@/constants/polygonStatuses";
import { getThemedColor } from "@/lib/theme";
import { LANDSCAPE_MAPPINGS } from "@/utils/landscapeUtils";

/** Zoom level at which Geoserver polygon geometry becomes visible (mirrors the dashboard gate). */
export const GEOMETRY_MIN_ZOOM = 9;

/** Hard cap on UUIDs pushed into a Mapbox filter expression at once. */
export const MAX_VISIBLE_GEOMETRIES = 3000;

/** Extra viewport padding so polygons just off-screen are already filtered in. */
export const VIEWPORT_PADDING_RATIO = 0.2;

export const EXPLORER_PAGE_SIZE = 100;

/** Number of index pages fetched in parallel per batch during the background load. */
export const PARALLEL_PAGE_REQUESTS = 5;

/** Flush accumulated polygons to the map every N loaded pages (progress updates every batch). */
export const MAP_FLUSH_PAGE_INTERVAL = 10;

/** Debounce applied to filter changes before restarting the background load. */
export const FILTER_DEBOUNCE_MS = 400;

export const EXPLORER_CENTROID_SOURCE_ID = "explorer-polygon-centroids";
export const EXPLORER_CLUSTER_LAYER_ID = `${EXPLORER_CENTROID_SOURCE_ID}-clusters`;
export const EXPLORER_CLUSTER_COUNT_LAYER_ID = `${EXPLORER_CENTROID_SOURCE_ID}-cluster-count`;
export const EXPLORER_POINT_LAYER_ID = `${EXPLORER_CENTROID_SOURCE_ID}-point`;

/** Mirrors the fill colors in src/constants/layers.ts so centroids match the polygon legend. */
export const POLYGON_STATUS_COLORS: Record<string, string> = {
  [POLYGON_DRAFT]: getThemedColor("neutralActive", 3),
  [POLYGON_PENDING_APPROVAL]: getThemedColor("neutralActive", 1),
  [POLYGON_APPROVED]: getThemedColor("positive", 1),
  [POLYGON_INFORMATION_REQUIRED]: getThemedColor("attention", 1)
};

export const DEFAULT_CENTROID_COLOR = "#6B7280";

/**
 * Stable "nothing visible" polygon filter map. Keys must be present (even with empty arrays)
 * so `useMapLayers` keeps the Geoserver sources mounted while only centroids are shown.
 */
export const EMPTY_POLYGONS_DATA: Record<string, string[]> = {
  [POLYGON_DRAFT]: [],
  [POLYGON_PENDING_APPROVAL]: [],
  [POLYGON_APPROVED]: [],
  [POLYGON_INFORMATION_REQUIRED]: []
};

export const LANDSCAPE_OPTIONS = Object.entries(LANDSCAPE_MAPPINGS).map(([name, code]) => ({
  value: code,
  label: name
}));

/** Known project cohorts (from production data); a temp tool doesn't need a cohort API. */
export const COHORT_OPTIONS = [
  { value: "terrafund-cohort-1", label: "TerraFund Cohort 1" },
  { value: "terrafund-cohort-2", label: "TerraFund Cohort 2" },
  { value: "terrafund-cohort-3", label: "TerraFund Cohort 3" },
  { value: "terrafund-enterprises-rolling", label: "TerraFund Enterprises (Rolling)" },
  { value: "ppc", label: "PPC" },
  { value: "hbf", label: "HBF" },
  { value: "epa-ghana-pilot", label: "EPA Ghana Pilot" }
];
