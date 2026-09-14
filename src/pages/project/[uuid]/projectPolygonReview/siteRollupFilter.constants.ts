import { SiteReviewRollupRow } from "./useProjectSiteRollup";

/**
 * Site-level filter model for the project polygon-review "rollup" view. Mirrors the polygon filter
 * pattern (see `src/pages/site/[uuid]/components/polygonFilter.constants.ts`) so site + polygon
 * filtering feel identical: a small serialisable state object, an EMPTY default, and pure predicates
 * that both the filter drawer and the read-only summary buckets share (so they can never disagree).
 */

export type SiteStatusBucket = "withFailures" | "fullyApprovable" | "notStarted";

// English labels are passed through `t(...)` at the call site; keeping them here keeps the drawer
// checkboxes, the toolbar tags and the summary tiles reading from one list.
export const SITE_STATUS_OPTIONS: { value: SiteStatusBucket; label: string }[] = [
  { value: "withFailures", label: "With failures" },
  { value: "fullyApprovable", label: "Fully approvable" },
  { value: "notStarted", label: "Not started" }
];

export const SITE_STATUS_LABELS: Record<SiteStatusBucket, string> = {
  withFailures: "With failures",
  fullyApprovable: "Fully approvable",
  notStarted: "Not started"
};

/**
 * The single source of truth for the three site status buckets. `ProjectSiteRollupSummary` counts
 * sites with these (its read-only tiles) and the filter drawer selects sites with these — reusing
 * the exact predicates guarantees the filters and the buckets always agree. Every bucket is scoped
 * to sites that actually hold polygons (`activeTotal > 0`), matching the summary's `withPolygons`
 * pre-filter: a site with no active polygons belongs to no bucket.
 */
export const SITE_STATUS_PREDICATES: Record<SiteStatusBucket, (row: SiteReviewRollupRow) => boolean> = {
  // Any polygon failed validation or is still awaiting a decision.
  withFailures: row => row.activeTotal > 0 && row.failed > 0,
  // Every active polygon is approvable (passed/partial): nothing failed, nothing unchecked.
  fullyApprovable: row => row.activeTotal > 0 && row.failed === 0 && row.notChecked === 0,
  // No validation has run yet — every polygon is still not-checked.
  notStarted: row => row.activeTotal > 0 && row.notChecked === row.activeTotal
};

export type SiteRollupFilterState = {
  status: SiteStatusBucket[];
  onlyOverlaps: boolean;
  // Optional numeric hectares range. Empty string = unbounded on that end. Kept as strings so the
  // text inputs stay controlled and a half-typed value doesn't collapse to NaN mid-edit.
  hectaresMin: string;
  hectaresMax: string;
};

export const EMPTY_SITE_ROLLUP_FILTERS: SiteRollupFilterState = {
  status: [],
  onlyOverlaps: false,
  hectaresMin: "",
  hectaresMax: ""
};

const parseBound = (value: string): number | null => {
  if (value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

/**
 * The one predicate the table rows and the map centroids are both filtered through, so they always
 * show the same set of sites. `search` is the toolbar site-name box (case-insensitive substring).
 */
export const siteMatchesRollupFilters = (
  row: SiteReviewRollupRow,
  filters: SiteRollupFilterState,
  search: string
): boolean => {
  const term = search.trim().toLowerCase();
  if (term !== "" && !(row.siteName || "").toLowerCase().includes(term)) return false;

  if (filters.onlyOverlaps && row.overlapCount <= 0) return false;

  // Multi-select status: a site matches if it falls in ANY selected bucket (OR), mirroring the
  // polygon drawer's status checkboxes.
  if (filters.status.length > 0 && !filters.status.some(bucket => SITE_STATUS_PREDICATES[bucket](row))) {
    return false;
  }

  const min = parseBound(filters.hectaresMin);
  const max = parseBound(filters.hectaresMax);
  if (min != null && row.hectares < min) return false;
  if (max != null && row.hectares > max) return false;

  return true;
};
