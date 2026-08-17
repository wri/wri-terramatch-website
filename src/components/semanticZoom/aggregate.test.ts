import { SiteIndicatorRollupDto } from "@/generated/v3/researchService/researchServiceSchemas";

import {
  aggregatePolygon,
  aggregateProject,
  aggregateSite,
  isPartial,
  polygonMeasurementsFrom,
  reconcile
} from "./aggregate";

const site = (over: Partial<SiteIndicatorRollupDto> = {}): SiteIndicatorRollupDto => ({
  siteUuid: "s1",
  siteName: "Site 1",
  inReviewCount: 0,
  polygons: 10,
  hectares: 100,
  treeCoverWeightedMeanPct: 20,
  treeCoverPolygonCount: 10,
  treeCoverCoverage: 1,
  treeCoverLossTotal: 5,
  treeCoverLossPolygonCount: 10,
  treeCoverLossCoverage: 1,
  ...over
});

describe("aggregateSite", () => {
  it("reports coverage rather than assuming it", () => {
    const result = aggregateSite(site({ polygons: 100, treeCoverPolygonCount: 89 }));
    expect(result.indicators.treeCover.coverage).toBeCloseTo(0.89);
    expect(isPartial(result.indicators.treeCover)).toBe(true);
  });

  it("keeps a null measurement null instead of zeroing it", () => {
    const result = aggregateSite(site({ treeCoverLossTotal: null, treeCoverLossPolygonCount: 0 }));
    expect(result.indicators.treeCoverLoss.value).toBeNull();
    expect(result.indicators.treeCoverLoss.value).not.toBe(0);
  });

  it("carries inReviewCount through so exclusions stay visible", () => {
    expect(aggregateSite(site({ inReviewCount: 2719 })).inReviewCount).toBe(2719);
  });

  it("never treats the three unmeasured indicators as zero", () => {
    const result = aggregateSite(site());
    for (const key of ["treeCount", "fieldMonitoring", "msuCarbon"] as const) {
      expect(result.indicators[key].value).toBeNull();
    }
  });
});

describe("aggregateProject", () => {
  it("sums hectares and polygons across sites", () => {
    const result = aggregateProject([
      site({ siteUuid: "a", polygons: 215, hectares: 30.68 }),
      site({ siteUuid: "b", polygons: 7293, hectares: 1126.33 })
    ]);
    expect(result.polygons).toBe(7508);
    expect(result.indicators.hectares.value).toBeCloseTo(1157.01, 2);
  });

  it("weights tree cover by hectares, not by site count", () => {
    // A naive mean of 10 and 20 is 15. Weighted by 1 ha against 99 ha it is 19.9 — the tiny site
    // must not drag the project figure toward itself.
    const result = aggregateProject([
      site({ siteUuid: "small", polygons: 1, hectares: 1, treeCoverWeightedMeanPct: 10, treeCoverPolygonCount: 1 }),
      site({ siteUuid: "big", polygons: 99, hectares: 99, treeCoverWeightedMeanPct: 20, treeCoverPolygonCount: 99 })
    ]);
    expect(result.indicators.treeCover.value).toBeCloseTo(19.9, 1);
    expect(result.indicators.treeCover.value).not.toBeCloseTo(15, 1);
  });

  it("excludes an unweightable site from the mean but keeps it in the coverage denominator", () => {
    const result = aggregateProject([
      site({ siteUuid: "ok", polygons: 10, hectares: 100, treeCoverWeightedMeanPct: 20, treeCoverPolygonCount: 10 }),
      site({ siteUuid: "noArea", polygons: 5, hectares: null, treeCoverWeightedMeanPct: 80, treeCoverPolygonCount: 5 })
    ]);
    expect(result.indicators.treeCover.value).toBeCloseTo(20);
    expect(result.indicators.treeCover.totalCount).toBe(15);
    expect(isPartial(result.indicators.treeCover)).toBe(true);
  });

  it("returns null, not zero, when no site has a measurement", () => {
    const result = aggregateProject([
      site({ hectares: null, treeCoverWeightedMeanPct: null, treeCoverLossTotal: null })
    ]);
    expect(result.indicators.hectares.value).toBeNull();
    expect(result.indicators.treeCover.value).toBeNull();
  });

  it("handles an empty project without dividing by zero", () => {
    const result = aggregateProject([]);
    expect(result.polygons).toBe(0);
    expect(result.indicators.hectares.value).toBeNull();
    expect(result.indicators.treeCover.coverage).toBeNull();
  });
});

describe("polygonMeasurementsFrom", () => {
  const cover = (yearOfAnalysis: number, percentCover: number | null) =>
    ({ indicatorSlug: "treeCover", yearOfAnalysis, percentCover } as never);

  it("prefers the latest year that actually has a value", () => {
    // The newest row is blank; falling back to 2023 beats reporting nothing.
    const result = polygonMeasurementsFrom([cover(2024, null), cover(2023, 12)], 5);
    expect(result.treeCoverPct).toBe(12);
  });

  it("takes the newest year when several have values", () => {
    expect(polygonMeasurementsFrom([cover(2022, 4), cover(2024, 9)], 5).treeCoverPct).toBe(9);
  });

  it("sums tree cover loss across years, matching the rollup's definition", () => {
    const loss = {
      indicatorSlug: "treeCoverLoss",
      yearOfAnalysis: 2026,
      value: { "2011": 3.5, "2012": 0, "2020": 1.5 }
    } as never;
    expect(polygonMeasurementsFrom([loss], 5).treeCoverLoss).toBeCloseTo(5);
  });

  it("ignores the fires slug, which is a separate indicator", () => {
    const fires = { indicatorSlug: "treeCoverLossFires", yearOfAnalysis: 2026, value: { "2011": 9 } } as never;
    expect(polygonMeasurementsFrom([fires], 5).treeCoverLoss).toBeNull();
  });

  it("returns nulls for a polygon with no indicators", () => {
    const result = polygonMeasurementsFrom([], null);
    expect(result.treeCoverPct).toBeNull();
    expect(result.treeCoverLoss).toBeNull();
    expect(result.hectares).toBeNull();
  });
});

describe("aggregatePolygon", () => {
  it("counts coverage as 1 of 1 when the value exists, 0 of 1 when it does not", () => {
    const measured = aggregatePolygon({ hectares: 2, treeCoverPct: 30, treeCoverLoss: null });
    expect(measured.indicators.hectares.measuredCount).toBe(1);
    expect(measured.indicators.treeCoverLoss.measuredCount).toBe(0);
    expect(measured.indicators.treeCoverLoss.value).toBeNull();
  });
});

describe("reconcile", () => {
  it("states the signed gap between claim and measurement", () => {
    const result = reconcile(533.13, 1200.35);
    expect(result?.delta).toBeCloseTo(667.22, 2);
    expect(result?.deltaFraction).toBeCloseTo(1.2515, 3);
  });

  it("returns null when either side is missing, rather than implying agreement", () => {
    expect(reconcile(null, 10)).toBeNull();
    expect(reconcile(10, null)).toBeNull();
  });

  it("avoids a meaningless ratio when the claim is zero", () => {
    expect(reconcile(0, 5)?.deltaFraction).toBeNull();
  });
});
