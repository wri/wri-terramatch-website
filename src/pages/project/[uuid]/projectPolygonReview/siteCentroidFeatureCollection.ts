import type { Feature, FeatureCollection, Point } from "geojson";

import { SiteReviewRollupRow } from "./useProjectSiteRollup";

export type SiteCentroidFeatureProperties = {
  uuid: string;
  siteId: string;
  kind: "site";
  name: string;
  polygons: number;
  polygonsLabel: string;
  // Site-level anomaly indicator for the rollup map: a site is flagged if any of its polygons failed
  // validation or has an overlap. SiteRollupMap colors flagged sites and the label shows the count.
  hasAnomaly: boolean;
  failed: number;
  overlapCount: number;
};

// "748 polygons" or, when the site has anomalies, "748 polygons · ⚠ 12 failed" / "· ⚠ 3 overlaps".
const buildPolygonsLabel = (activeTotal: number, failed: number, overlapCount: number): string => {
  const base = `${activeTotal.toLocaleString()} polygons`;
  if (failed > 0) return `${base} · ⚠ ${failed.toLocaleString()} failed`;
  if (overlapCount > 0) return `${base} · ⚠ ${overlapCount.toLocaleString()} overlap${overlapCount === 1 ? "" : "s"}`;
  return base;
};

export type SiteCentroidFeature = Feature<Point, SiteCentroidFeatureProperties>;
export type SiteCentroidFeatureCollection = FeatureCollection<Point, SiteCentroidFeatureProperties>;

/**
 * Builds the site-centroid GeoJSON that SiteRollupMap draws — one Point per site, at the center of
 * its bounding box (`centroidLat`/`centroidLong` on the rollup row), labelled "{name} / N polygons".
 * Feature shape matches what the prototype's DrilldownMap expects (`kind: "site"`, `uuid === siteId`
 * so a click resolves straight to the site) — see
 * `design/project-data-experience:src/components/semanticZoom/useSemanticZoom.ts` ~167-178.
 *
 * Rows with no centroid (e.g. a site with no polygons yet, so no bounding box) are skipped — an
 * invented [0, 0] point would be a confident wrong location, worse than omitting the site from the
 * map (it still appears in ProjectSiteRollupTable).
 */
export const buildSiteCentroidFeatureCollection = (rows: SiteReviewRollupRow[]): SiteCentroidFeatureCollection => ({
  type: "FeatureCollection",
  features: rows
    .filter(
      (row): row is SiteReviewRollupRow & { centroidLat: number; centroidLong: number } =>
        Number.isFinite(row.centroidLat) && Number.isFinite(row.centroidLong)
    )
    .map(
      (row): SiteCentroidFeature => ({
        type: "Feature",
        properties: {
          uuid: row.siteUuid,
          siteId: row.siteUuid,
          kind: "site",
          name: row.siteName === "" ? "Unnamed site" : row.siteName,
          polygons: row.activeTotal,
          polygonsLabel: buildPolygonsLabel(row.activeTotal, row.failed, row.overlapCount),
          hasAnomaly: row.failed > 0 || row.overlapCount > 0,
          failed: row.failed,
          overlapCount: row.overlapCount
        },
        geometry: { type: "Point", coordinates: [row.centroidLong, row.centroidLat] }
      })
    )
});
