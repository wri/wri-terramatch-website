import { PROJECT_SITE_ROLLUP_THRESHOLD, resolveProjectPolygonViewMode } from "./projectPolygonViewMode";

describe("resolveProjectPolygonViewMode", () => {
  const base = { isLoadingTotal: false, totalError: false };

  it("is loading while the total is still unknown and no error", () => {
    expect(resolveProjectPolygonViewMode({ ...base, isLoadingTotal: true, total: 0 })).toBe("loading");
  });

  it("is flat for a project just under the threshold", () => {
    expect(resolveProjectPolygonViewMode({ ...base, total: PROJECT_SITE_ROLLUP_THRESHOLD - 1 })).toBe("flat");
  });

  it("is rollup at exactly the threshold (>= 100 -> rollup)", () => {
    expect(resolveProjectPolygonViewMode({ ...base, total: PROJECT_SITE_ROLLUP_THRESHOLD })).toBe("rollup");
  });

  it("is rollup well above the threshold", () => {
    expect(resolveProjectPolygonViewMode({ ...base, total: PROJECT_SITE_ROLLUP_THRESHOLD + 5000 })).toBe("rollup");
  });

  it("FAIL-SAFE: a total error resolves to rollup — never falls through to the flat load-all", () => {
    expect(resolveProjectPolygonViewMode({ ...base, totalError: true, total: 0 })).toBe("rollup");
  });

  it("a total error wins even while still (nominally) loading", () => {
    expect(resolveProjectPolygonViewMode({ isLoadingTotal: true, totalError: true, total: 0 })).toBe("rollup");
  });

  it("respects a custom threshold", () => {
    expect(resolveProjectPolygonViewMode({ ...base, total: 30, threshold: 25 })).toBe("rollup");
    expect(resolveProjectPolygonViewMode({ ...base, total: 20, threshold: 25 })).toBe("flat");
  });
});
