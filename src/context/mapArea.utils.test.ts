import {
  isPolygonGeometryEditable,
  isPolygonReviewOnly,
  registerPolygonGeometryEditable,
  registerPolygonReviewOnly,
  resolvePolygonMapEditEnabled
} from "./mapArea.utils";

// These flags are module-level singletons, so restore the defaults after each test to avoid
// leaking state between cases (and into other suites that import this module).
afterEach(() => {
  registerPolygonGeometryEditable(true);
  registerPolygonReviewOnly(false);
});

describe("polygon geometry-editable gate", () => {
  it("defaults to editable so the site page's per-polygon edit drawer is unaffected", () => {
    expect(isPolygonGeometryEditable()).toBe(true);
  });

  it("round-trips register/is", () => {
    registerPolygonGeometryEditable(false);
    expect(isPolygonGeometryEditable()).toBe(false);
    registerPolygonGeometryEditable(true);
    expect(isPolygonGeometryEditable()).toBe(true);
  });
});

describe("polygon review-only gate", () => {
  it("defaults to false so the site page keeps its Edit tab", () => {
    expect(isPolygonReviewOnly()).toBe(false);
  });

  it("round-trips register/is", () => {
    registerPolygonReviewOnly(true);
    expect(isPolygonReviewOnly()).toBe(true);
  });
});

describe("resolvePolygonMapEditEnabled", () => {
  it("enters map edit mode when the drawer is open and geometry editing is enabled (site scope)", () => {
    // Default = editable (site scope).
    expect(resolvePolygonMapEditEnabled(true)).toBe(true);
  });

  it("never enters map edit mode when the drawer is closed", () => {
    expect(resolvePolygonMapEditEnabled(false)).toBe(false);
    registerPolygonGeometryEditable(false);
    expect(resolvePolygonMapEditEnabled(false)).toBe(false);
  });

  it("does NOT enter map edit mode when geometry editing is disabled, even with the drawer open (project review scope)", () => {
    // This is the project flat-review regression: the edit drawer opens for review, but the map
    // must not enter vertex-editing because that edit has no save path at project scope.
    registerPolygonGeometryEditable(false);
    expect(resolvePolygonMapEditEnabled(true)).toBe(false);
  });
});
