import { SiteIndicatorRollupDto } from "@/generated/v3/researchService/researchServiceSchemas";

import { IndicatorKey, Level } from "./levelContract";

/**
 * The aggregation seam.
 *
 * Site figures come from the server (one GROUP BY over approved polygons). This module only rolls
 * the site rows up to the project, and normalises every level into one shape the panel can render
 * without knowing where a number came from.
 *
 * Every value is `Measurement`, never a bare number, because the three states that matter —
 * measured, not measured, and partially measured — are not distinguishable in a number alone.
 * A partial sum rendered as a complete one is the failure this whole feature exists to prevent.
 */
export type Measurement = {
  /** null means NOT MEASURED. It never means zero. */
  value: number | null;
  /** Units contributing to the value (polygons, at every level). */
  measuredCount: number;
  /** Units that could have contributed. */
  totalCount: number;
  /** measuredCount / totalCount, or null when totalCount is 0. */
  coverage: number | null;
};

export const NOT_MEASURED: Measurement = { value: null, measuredCount: 0, totalCount: 0, coverage: null };

const measurement = (value: number | null, measuredCount: number, totalCount: number): Measurement => ({
  value,
  measuredCount,
  totalCount,
  coverage: totalCount > 0 ? measuredCount / totalCount : null
});

export const isPartial = ({ value, coverage }: Measurement) => value != null && coverage != null && coverage < 1;

export type LevelAggregate = {
  level: Level;
  /** Approved polygons in scope. */
  polygons: number;
  /** Active polygons in scope that are not approved, and so contribute to nothing below. */
  inReviewCount: number;
  indicators: Record<IndicatorKey, Measurement>;
};

/** The three indicators with no data in this snapshot. Rendering 0 would be a claim. */
const EMPTY_INDICATORS = {
  treeCount: NOT_MEASURED,
  fieldMonitoring: NOT_MEASURED,
  msuCarbon: NOT_MEASURED
};

/**
 * One site row, as measured over its approved polygons.
 */
export const aggregateSite = (row: SiteIndicatorRollupDto): LevelAggregate => ({
  level: "site",
  polygons: row.polygons,
  inReviewCount: row.inReviewCount,
  indicators: {
    // Hectares is the one indicator every approved polygon carries, so coverage is total by
    // construction. It is still reported rather than assumed.
    hectares: measurement(row.hectares, row.hectares == null ? 0 : row.polygons, row.polygons),
    treeCover: measurement(row.treeCoverWeightedMeanPct, row.treeCoverPolygonCount, row.polygons),
    treeCoverLoss: measurement(row.treeCoverLossTotal, row.treeCoverLossPolygonCount, row.polygons),
    ...EMPTY_INDICATORS
  }
});

/**
 * Project level, rolled up from the site rows.
 *
 * Sums are sums. Tree cover is a percentage and cannot be summed or naively averaged across sites
 * of wildly different size — project 448 has sites of 215 and 7,293 polygons — so it is re-weighted
 * by each site's hectares. A site with no hectares figure cannot be weighted and is excluded from
 * the mean, which is why its polygons still count toward the denominator of coverage.
 */
export const aggregateProject = (rows: SiteIndicatorRollupDto[]): LevelAggregate => {
  const polygons = sum(rows.map(row => row.polygons));
  const inReviewCount = sum(rows.map(row => row.inReviewCount));

  const hectaresRows = rows.filter(row => row.hectares != null);
  const hectares = hectaresRows.length === 0 ? null : sum(hectaresRows.map(row => row.hectares as number));

  let weightNumerator = 0;
  let weightDenominator = 0;
  let treeCoverMeasured = 0;
  for (const row of rows) {
    if (row.treeCoverWeightedMeanPct == null || row.hectares == null || row.hectares <= 0) continue;
    weightNumerator += row.treeCoverWeightedMeanPct * row.hectares;
    weightDenominator += row.hectares;
    treeCoverMeasured += row.treeCoverPolygonCount;
  }

  const lossRows = rows.filter(row => row.treeCoverLossTotal != null);
  const treeCoverLoss = lossRows.length === 0 ? null : sum(lossRows.map(row => row.treeCoverLossTotal as number));

  return {
    level: "project",
    polygons,
    inReviewCount,
    indicators: {
      hectares: measurement(hectares, sum(hectaresRows.map(row => row.polygons)), polygons),
      treeCover: measurement(
        weightDenominator > 0 ? weightNumerator / weightDenominator : null,
        treeCoverMeasured,
        polygons
      ),
      treeCoverLoss: measurement(treeCoverLoss, sum(lossRows.map(row => row.treeCoverLossPolygonCount)), polygons),
      ...EMPTY_INDICATORS
    }
  };
};

/**
 * A single polygon. Nothing is aggregated here — this is the native level, and the point of
 * descending to it is to see the value that was actually recorded rather than a derived one.
 */
export type PolygonMeasurements = {
  hectares: number | null;
  treeCoverPct: number | null;
  treeCoverLoss: number | null;
};

export const aggregatePolygon = (polygon: PolygonMeasurements): LevelAggregate => ({
  level: "polygon",
  polygons: 1,
  inReviewCount: 0,
  indicators: {
    hectares: measurement(polygon.hectares, polygon.hectares == null ? 0 : 1, 1),
    treeCover: measurement(polygon.treeCoverPct, polygon.treeCoverPct == null ? 0 : 1, 1),
    treeCoverLoss: measurement(polygon.treeCoverLoss, polygon.treeCoverLoss == null ? 0 : 1, 1),
    ...EMPTY_INDICATORS
  }
});

/**
 * A claim (what was reported) set against a measurement (what was observed). They are never merged
 * into one number; the delta is the interesting part, and hiding it would be the whole problem.
 */
export type Reconciliation = {
  claim: number;
  measured: number;
  delta: number;
  /** Signed fraction of the claim. Null when the claim is 0 and a ratio would be meaningless. */
  deltaFraction: number | null;
};

export const reconcile = (claim: number | null, measured: number | null): Reconciliation | null => {
  if (claim == null || measured == null) return null;
  const delta = measured - claim;
  return { claim, measured, delta, deltaFraction: claim === 0 ? null : delta / claim };
};

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}
