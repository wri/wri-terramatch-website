import type { Feature, FeatureCollection, Point, Polygon } from "geojson";

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

// A site's geometry on the rollup map is EITHER an approximate rectangular footprint (the bounding box
// of its active-polygon centroids) OR, when that box is degenerate, a single centroid marker.
export type SiteCentroidFeature = Feature<Point | Polygon, SiteCentroidFeatureProperties>;
export type SiteCentroidFeatureCollection = FeatureCollection<Point | Polygon, SiteCentroidFeatureProperties>;

const isFiniteNumber = (value: number | null): value is number => value != null && Number.isFinite(value);

/**
 * A closed rectangle ring from the bbox corners, or null when the box is degenerate. A single-polygon
 * site has min == max on both axes (a point); polygons collinear on one axis give a zero-area sliver.
 * Both cases fail here and the caller falls back to a centroid Point, because a zero-area polygon draws
 * nothing (no fill) yet still claims to be a footprint.
 */
const rectangleRing = (row: SiteReviewRollupRow): Polygon["coordinates"] | null => {
  const { bboxMinLat, bboxMaxLat, bboxMinLong, bboxMaxLong } = row;
  if (
    !isFiniteNumber(bboxMinLat) ||
    !isFiniteNumber(bboxMaxLat) ||
    !isFiniteNumber(bboxMinLong) ||
    !isFiniteNumber(bboxMaxLong)
  ) {
    return null;
  }
  if (bboxMaxLat <= bboxMinLat || bboxMaxLong <= bboxMinLong) return null;
  // GeoJSON is [lng, lat]; ring wound and closed (first === last).
  return [
    [
      [bboxMinLong, bboxMinLat],
      [bboxMaxLong, bboxMinLat],
      [bboxMaxLong, bboxMaxLat],
      [bboxMinLong, bboxMaxLat],
      [bboxMinLong, bboxMinLat]
    ]
  ];
};

/**
 * Builds the site GeoJSON that SiteRollupMap draws — one feature per site, labelled "{name} / N
 * polygons". Where a site has an approximate footprint (a non-degenerate bounding box of its active
 * polygon centroids) the feature is a Polygon rectangle; otherwise it falls back to a centroid Point
 * (`centroidLat`/`centroidLong`). Feature shape matches what the prototype's DrilldownMap expects
 * (`kind: "site"`, `uuid === siteId` so a click resolves straight to the site) — see
 * `design/project-data-experience:src/components/semanticZoom/useSemanticZoom.ts` ~167-178.
 *
 * Rows with neither a usable bbox nor a centroid (e.g. a site with no polygons yet) are skipped — an
 * invented [0, 0] location would be a confident wrong answer, worse than omitting the site from the
 * map (it still appears in ProjectSiteRollupTable).
 */
export const buildSiteCentroidFeatureCollection = (rows: SiteReviewRollupRow[]): SiteCentroidFeatureCollection => {
  const features: SiteCentroidFeature[] = [];

  for (const row of rows) {
    const properties: SiteCentroidFeatureProperties = {
      uuid: row.siteUuid,
      siteId: row.siteUuid,
      kind: "site",
      name: row.siteName === "" ? "Unnamed site" : row.siteName,
      polygons: row.activeTotal,
      polygonsLabel: buildPolygonsLabel(row.activeTotal, row.failed, row.overlapCount),
      hasAnomaly: row.failed > 0 || row.overlapCount > 0,
      failed: row.failed,
      overlapCount: row.overlapCount
    };

    const ring = rectangleRing(row);
    if (ring != null) {
      features.push({ type: "Feature", properties, geometry: { type: "Polygon", coordinates: ring } });
    } else if (isFiniteNumber(row.centroidLat) && isFiniteNumber(row.centroidLong)) {
      features.push({
        type: "Feature",
        properties,
        geometry: { type: "Point", coordinates: [row.centroidLong, row.centroidLat] }
      });
    }
  }

  return { type: "FeatureCollection", features };
};
