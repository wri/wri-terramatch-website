import { buildSiteCentroidFeatureCollection } from "./siteCentroidFeatureCollection";
import { SiteReviewRollupRow } from "./useProjectSiteRollup";

const row = (overrides: Partial<SiteReviewRollupRow> = {}): SiteReviewRollupRow => ({
  siteUuid: "site-1",
  siteName: "Site One",
  siteStatus: "approved",
  activeTotal: 42,
  passed: 0,
  partial: 0,
  failed: 0,
  notChecked: 0,
  approved: 0,
  pendingApproval: 0,
  draft: 0,
  informationRequired: 0,
  overlapCount: 0,
  hectares: 12.5,
  centroidLat: 1.5,
  centroidLong: 2.5,
  // No footprint by default so the centroid-Point path is exercised; the rectangle tests opt in.
  bboxMinLat: null,
  bboxMaxLat: null,
  bboxMinLong: null,
  bboxMaxLong: null,
  ...overrides
});

describe("buildSiteCentroidFeatureCollection", () => {
  it("builds one Point feature per site with a centroid", () => {
    const collection = buildSiteCentroidFeatureCollection([row()]);
    expect(collection.type).toBe("FeatureCollection");
    expect(collection.features).toHaveLength(1);

    const [feature] = collection.features;
    expect(feature.type).toBe("Feature");
    expect(feature.geometry).toEqual({ type: "Point", coordinates: [2.5, 1.5] });
    expect(feature.properties).toEqual({
      uuid: "site-1",
      siteId: "site-1",
      kind: "site",
      name: "Site One",
      polygons: 42,
      polygonsLabel: "42 polygons",
      hasAnomaly: false,
      failed: 0,
      overlapCount: 0
    });
  });

  it("flags a site with failed polygons and shows the count in the label", () => {
    const [feature] = buildSiteCentroidFeatureCollection([row({ failed: 12 })]).features;
    expect(feature.properties.hasAnomaly).toBe(true);
    expect(feature.properties.failed).toBe(12);
    expect(feature.properties.polygonsLabel).toBe("42 polygons · ⚠ 12 failed");
  });

  it("flags a site with only overlaps (no failures) and pluralizes", () => {
    const [feature] = buildSiteCentroidFeatureCollection([row({ failed: 0, overlapCount: 1 })]).features;
    expect(feature.properties.hasAnomaly).toBe(true);
    expect(feature.properties.polygonsLabel).toBe("42 polygons · ⚠ 1 overlap");
  });

  it("uuid and siteId are both the site uuid, so a map click resolves straight to the site", () => {
    const [feature] = buildSiteCentroidFeatureCollection([row({ siteUuid: "abc" })]).features;
    expect(feature.properties.uuid).toBe("abc");
    expect(feature.properties.siteId).toBe("abc");
  });

  it("falls back to 'Unnamed site' for an empty name", () => {
    const [feature] = buildSiteCentroidFeatureCollection([row({ siteName: "" })]).features;
    expect(feature.properties.name).toBe("Unnamed site");
  });

  it("skips rows with no centroid rather than inventing one", () => {
    const rows = [row({ siteUuid: "no-lat", centroidLat: null }), row({ siteUuid: "no-long", centroidLong: null })];
    expect(buildSiteCentroidFeatureCollection(rows).features).toHaveLength(0);
  });

  it("skips rows with a non-finite centroid", () => {
    const rows = [row({ siteUuid: "nan", centroidLat: Number.NaN })];
    expect(buildSiteCentroidFeatureCollection(rows).features).toHaveLength(0);
  });

  it("returns an empty feature collection for no rows", () => {
    expect(buildSiteCentroidFeatureCollection([])).toEqual({ type: "FeatureCollection", features: [] });
  });

  it("builds a closed rectangle Polygon from a non-degenerate bbox", () => {
    const [feature] = buildSiteCentroidFeatureCollection([
      row({ bboxMinLat: 1, bboxMaxLat: 3, bboxMinLong: 10, bboxMaxLong: 14 })
    ]).features;
    expect(feature.geometry.type).toBe("Polygon");
    // [lng, lat] corners, wound and closed (first === last).
    expect(feature.geometry).toEqual({
      type: "Polygon",
      coordinates: [
        [
          [10, 1],
          [14, 1],
          [14, 3],
          [10, 3],
          [10, 1]
        ]
      ]
    });
  });

  it("falls back to a centroid Point when the bbox is a degenerate point (single polygon)", () => {
    const [feature] = buildSiteCentroidFeatureCollection([
      row({ bboxMinLat: 1.5, bboxMaxLat: 1.5, bboxMinLong: 2.5, bboxMaxLong: 2.5 })
    ]).features;
    expect(feature.geometry).toEqual({ type: "Point", coordinates: [2.5, 1.5] });
  });

  it("falls back to a centroid Point when the bbox is a zero-area sliver on one axis", () => {
    const [feature] = buildSiteCentroidFeatureCollection([
      row({ bboxMinLat: 1, bboxMaxLat: 3, bboxMinLong: 2.5, bboxMaxLong: 2.5 })
    ]).features;
    expect(feature.geometry).toEqual({ type: "Point", coordinates: [2.5, 1.5] });
  });

  it("skips a site with a degenerate bbox and no centroid", () => {
    const rows = [row({ bboxMinLat: 1, bboxMaxLat: 1, bboxMinLong: 2, bboxMaxLong: 2, centroidLat: null })];
    expect(buildSiteCentroidFeatureCollection(rows).features).toHaveLength(0);
  });
});
