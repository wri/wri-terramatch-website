/**
 * The entity levels that carry a drill-down, and the small per-level facts that differ between them.
 *
 * This is the seed of the "one page at different levels" idea: the level contract in `levelContract.ts`
 * already declares, per indicator, how each level aggregates; this declares the navigation and naming
 * that the rest of the entity-data layer switches on, so the difference between a project view and a
 * site view is data, not two parallel code paths.
 *
 * "polygon" is deliberately absent: a polygon is a leaf with no children to drill into, so it has no
 * drill-down source. It still renders indicators, via the shared IndicatorRow primitives.
 */
export type EntityLevel = "project" | "site";

/** Where a click on a child row/marker goes: a project's children are sites, a site's are polygons. */
export const childHref = (level: EntityLevel, projectUuid: string, childUuid: string): string =>
  level === "project" ? `/site/${childUuid}` : `/project/${projectUuid}/polygon/${childUuid}`;

/** Plural noun for a level's children, for subtitles and counts. */
export const childNoun = (level: EntityLevel): string => (level === "project" ? "sites" : "polygons");
