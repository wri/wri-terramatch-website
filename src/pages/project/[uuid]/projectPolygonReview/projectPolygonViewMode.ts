// Above this many ACTIVE polygons, a project switches from the flat polygon list + map to a per-site
// rollup (site list + site-centroid map), with in-place drill-in into a chosen site's own review
// (see docs/plans/project-polygons-site-rollup-plan.md §3.1). This replaces the old load-gate/
// "pick a status" flow (projectPolygonLoadGate.ts, threshold 500) — a large project no longer prompts
// for a filter, it lands on a landing page scaled to the number of sites, not the number of polygons.
export const PROJECT_SITE_ROLLUP_THRESHOLD = 100;

export type ProjectPolygonViewMode = "loading" | "flat" | "rollup";

/**
 * Pure decision for which project polygon-review view to render. Kept pure + separate so the mode
 * switch is unit-tested independently of the heavy workspace components.
 *
 * The `total` here is the sum of active polygons across all of a project's sites — sourced from
 * `useProjectSiteRollup(...).total` (fires first, cheap, O(sites)) rather than from loading polygon
 * rows, so mode is known well before ProjectFlatPolygonsView's `useAllSitePolygons` would ever fire.
 *
 * Fail-safe on a rollup error: if the total failed to load we do NOT know the size, so we resolve to
 * "rollup" rather than falling through to the flat, load-everything view — same rationale the old
 * gate used (never auto-load an unknown-size project in full).
 */
export const resolveProjectPolygonViewMode = (params: {
  isLoadingTotal: boolean;
  totalError: boolean;
  total: number;
  threshold?: number;
}): ProjectPolygonViewMode => {
  const { isLoadingTotal, totalError, total, threshold = PROJECT_SITE_ROLLUP_THRESHOLD } = params;

  if (totalError) {
    return "rollup";
  }
  if (isLoadingTotal) {
    return "loading";
  }
  return total >= threshold ? "rollup" : "flat";
};
