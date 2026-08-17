import { SiteIndicatorRollupDto, SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

import { computeAnomalies, ComputeAnomaliesInput } from "./computeAnomalies";
import { AnomalyType } from "./types";

// A fixed "now" so the plant-start heuristics are deterministic.
const NOW = new Date("2026-08-17T00:00:00Z");
const yearsAgo = (n: number) => new Date(NOW.getFullYear() - n, NOW.getMonth(), NOW.getDate()).toISOString();
const monthsAgo = (n: number) => new Date(NOW.getFullYear(), NOW.getMonth() - n, NOW.getDate()).toISOString();

const rollup = (over: Partial<SiteIndicatorRollupDto> = {}): SiteIndicatorRollupDto => ({
  siteUuid: "site-1",
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

const polygon = (over: Partial<SitePolygonLightDto> = {}): SitePolygonLightDto =>
  ({
    lightResource: true,
    name: "Polygon 1",
    status: "approved",
    siteId: "site-1",
    siteName: "Site 1",
    polygonUuid: "poly-geom-1",
    plantStart: null,
    calcArea: 10,
    numTrees: null,
    validationStatus: "passed",
    uuid: "poly-1",
    isActive: true,
    ...over
  } as SitePolygonLightDto);

const input = (over: Partial<ComputeAnomaliesInput> = {}): ComputeAnomaliesInput => ({
  project: {
    uuid: "project-1",
    name: "Project 1",
    totalHectaresRestoredGoal: 100,
    treesPlantedCount: null,
    treesGrownGoal: null
  },
  rollups: [rollup()],
  polygons: [polygon()],
  now: NOW,
  ...over
});

const types = (input: ComputeAnomaliesInput): AnomalyType[] => computeAnomalies(input).map(a => a.type);
const has = (input: ComputeAnomaliesInput, type: AnomalyType) => types(input).includes(type);

describe("computeAnomalies — a clean project", () => {
  it("returns no anomalies when everything is nominal", () => {
    // 100 ha mapped against a 100 ha goal, all polygons passed validation, no tree data.
    expect(computeAnomalies(input())).toEqual([]);
  });
});

describe("geometry validation (source 'validation')", () => {
  it("maps a failed polygon to a high-severity anomaly", () => {
    const result = computeAnomalies(input({ polygons: [polygon({ validationStatus: "failed" })] }));
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("geometryValidation");
    expect(result[0].source).toBe("validation");
    expect(result[0].level).toBe("polygon");
    expect(result[0].severity).toBe("high");
  });

  it("maps a partial polygon to a medium-severity anomaly", () => {
    const [anomaly] = computeAnomalies(input({ polygons: [polygon({ validationStatus: "partial" })] }));
    expect(anomaly.type).toBe("geometryValidation");
    expect(anomaly.severity).toBe("medium");
  });

  it("stays silent on passed and null (unvalidated) polygons", () => {
    expect(has(input({ polygons: [polygon({ validationStatus: "passed" })] }), "geometryValidation")).toBe(false);
    expect(has(input({ polygons: [polygon({ validationStatus: null })] }), "geometryValidation")).toBe(false);
  });

  it("gives each anomaly a deterministic id derived from type and entity", () => {
    const [anomaly] = computeAnomalies(input({ polygons: [polygon({ uuid: "poly-x", validationStatus: "failed" })] }));
    expect(anomaly.id).toBe("geometryValidation:polygon:poly-x");
  });
});

describe("underMapped / overMapped (project)", () => {
  it("fires high when mapped area is under half the hectare goal", () => {
    // 1.3 ha mapped against a 100 ha goal — the Rwanda 2023 shape.
    const result = computeAnomalies(
      input({ rollups: [rollup({ hectares: 1.3 })], project: { ...input().project, totalHectaresRestoredGoal: 100 } })
    );
    const underMapped = result.find(a => a.type === "underMapped");
    expect(underMapped?.severity).toBe("high");
    expect(underMapped?.title).toContain("1.3%");
  });

  it("fires medium when mapped area is over 1.5x the goal", () => {
    const result = computeAnomalies(input({ rollups: [rollup({ hectares: 200 })] }));
    const overMapped = result.find(a => a.type === "overMapped");
    expect(overMapped?.severity).toBe("medium");
  });

  it("skips both when the hectare goal is null (not measured, not zero)", () => {
    const cfg = input({
      rollups: [rollup({ hectares: 1 })],
      project: { ...input().project, totalHectaresRestoredGoal: null }
    });
    expect(has(cfg, "underMapped")).toBe(false);
    expect(has(cfg, "overMapped")).toBe(false);
  });

  it("skips at project level when no rollup carries a mapped-hectares value", () => {
    expect(has(input({ rollups: [rollup({ hectares: null })] }), "underMapped")).toBe(false);
  });
});

describe("implausibleDensity (polygon)", () => {
  it("fires when trees per hectare exceeds the threshold", () => {
    const cfg = input({ polygons: [polygon({ numTrees: 30000, calcArea: 10 })] }); // 3000/ha
    const density = computeAnomalies(cfg).find(a => a.type === "implausibleDensity");
    expect(density?.severity).toBe("medium");
  });

  it("skips polygons with null numTrees (the ~25% with no count — expected partial coverage)", () => {
    expect(has(input({ polygons: [polygon({ numTrees: null, calcArea: 10 })] }), "implausibleDensity")).toBe(false);
  });

  it("skips polygons with zero numTrees or zero area rather than dividing", () => {
    expect(has(input({ polygons: [polygon({ numTrees: 0, calcArea: 10 })] }), "implausibleDensity")).toBe(false);
    expect(has(input({ polygons: [polygon({ numTrees: 100, calcArea: 0 })] }), "implausibleDensity")).toBe(false);
  });

  it("stays silent at a plausible density", () => {
    expect(has(input({ polygons: [polygon({ numTrees: 1000, calcArea: 10 })] }), "implausibleDensity")).toBe(false);
  });
});

describe("noActivityAfterPlantStart (site)", () => {
  it("fires medium for a site with 0 approved polygons whose plant-start is in the past", () => {
    const cfg = input({
      rollups: [],
      polygons: [polygon({ status: "draft", plantStart: yearsAgo(1) })]
    });
    const anomaly = computeAnomalies(cfg).find(a => a.type === "noActivityAfterPlantStart");
    expect(anomaly?.severity).toBe("medium");
    expect(anomaly?.level).toBe("site");
  });

  it("stays silent when the site still has approved polygons", () => {
    const cfg = input({ rollups: [rollup({ polygons: 5 })], polygons: [polygon({ plantStart: yearsAgo(1) })] });
    expect(has(cfg, "noActivityAfterPlantStart")).toBe(false);
  });

  it("stays silent when the plant-start is still in the future", () => {
    const cfg = input({
      rollups: [],
      polygons: [polygon({ status: "draft", plantStart: new Date(NOW.getFullYear() + 1, 0, 1).toISOString() })]
    });
    expect(has(cfg, "noActivityAfterPlantStart")).toBe(false);
  });
});

describe("treesVsHectaresDesync (project)", () => {
  it("fires when trees progress and hectares progress diverge extremely", () => {
    // Trees at 100% of goal, hectares at 10% — a 90-point gap and a >2x factor.
    const cfg = input({
      rollups: [rollup({ hectares: 10 })],
      project: {
        uuid: "project-1",
        name: "Project 1",
        totalHectaresRestoredGoal: 100,
        treesPlantedCount: 1000,
        treesGrownGoal: 1000
      }
    });
    expect(has(cfg, "treesVsHectaresDesync")).toBe(true);
  });

  it("skips when the tree goal is null", () => {
    const cfg = input({
      rollups: [rollup({ hectares: 10 })],
      project: { ...input().project, treesPlantedCount: 1000, treesGrownGoal: null }
    });
    expect(has(cfg, "treesVsHectaresDesync")).toBe(false);
  });

  it("stays silent when the two progress figures track each other", () => {
    const cfg = input({
      rollups: [rollup({ hectares: 100 })],
      project: {
        uuid: "project-1",
        name: "Project 1",
        totalHectaresRestoredGoal: 100,
        treesPlantedCount: 1000,
        treesGrownGoal: 1000
      }
    });
    expect(has(cfg, "treesVsHectaresDesync")).toBe(false);
  });
});

describe("hectaresProgressOutlier (project)", () => {
  it("fires high when mapped hectares exceed 3x the goal", () => {
    const cfg = input({ rollups: [rollup({ hectares: 400 })] }); // 4x of 100
    const anomaly = computeAnomalies(cfg).find(a => a.type === "hectaresProgressOutlier");
    expect(anomaly?.severity).toBe("high");
  });

  it("fires medium when stuck at 0% long after plant-start", () => {
    const cfg = input({
      rollups: [],
      polygons: [polygon({ status: "draft", plantStart: monthsAgo(18) })]
    });
    const anomaly = computeAnomalies(cfg).find(a => a.type === "hectaresProgressOutlier");
    expect(anomaly?.severity).toBe("medium");
    expect(anomaly?.level).toBe("project");
  });

  it("does not fire stuck when the plant-start is within the heuristic window", () => {
    const cfg = input({ rollups: [], polygons: [polygon({ status: "draft", plantStart: monthsAgo(6) })] });
    expect(has(cfg, "hectaresProgressOutlier")).toBe(false);
  });
});

describe("site-level goal-relative checks (dormant without a site goal)", () => {
  it("stays silent for sites when no siteHectareGoals are provided", () => {
    const cfg = input({ rollups: [rollup({ siteUuid: "site-1", hectares: 1 })] });
    const siteAnomalies = computeAnomalies(cfg).filter(a => a.level === "site" && a.type === "underMapped");
    expect(siteAnomalies).toHaveLength(0);
  });

  it("fires a site-level underMapped once a site goal is supplied", () => {
    const cfg = input({
      rollups: [rollup({ siteUuid: "site-1", hectares: 1 })],
      siteHectareGoals: { "site-1": 100 }
    });
    const anomaly = computeAnomalies(cfg).find(a => a.level === "site" && a.type === "underMapped");
    expect(anomaly?.severity).toBe("high");
  });
});

describe("sort order", () => {
  it("orders high before medium, then project before site before polygon", () => {
    const cfg = input({
      rollups: [rollup({ hectares: 1.3 })], // project underMapped (high)
      project: {
        uuid: "project-1",
        name: "Project 1",
        totalHectaresRestoredGoal: 100,
        treesPlantedCount: null,
        treesGrownGoal: null
      },
      polygons: [
        polygon({ uuid: "p-fail", validationStatus: "failed" }), // polygon high
        polygon({ uuid: "p-partial", validationStatus: "partial" }) // polygon medium
      ],
      siteHectareGoals: {} // no site goals; keep site checks quiet
    });
    const result = computeAnomalies(cfg);

    const severities = result.map(a => a.severity);
    // All highs precede all mediums.
    expect(severities.indexOf("medium")).toBeGreaterThan(severities.lastIndexOf("high"));

    // Within the high bucket, the project underMapped precedes the polygon validation failure.
    const highs = result.filter(a => a.severity === "high");
    expect(highs[0].level).toBe("project");
    expect(highs[highs.length - 1].level).toBe("polygon");
  });
});
