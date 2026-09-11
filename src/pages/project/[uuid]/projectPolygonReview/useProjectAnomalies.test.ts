import { renderHook } from "@testing-library/react";

import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

import { ProjectOverlapPair } from "./projectOverlapPairs";
import { useProjectAnomalies } from "./useProjectAnomalies";

const polygon = (overrides: Partial<SitePolygonLightDto>): SitePolygonLightDto =>
  ({
    uuid: overrides.polygonUuid,
    status: "submitted",
    ...overrides
  } as unknown as SitePolygonLightDto);

const pair = (overrides: Partial<ProjectOverlapPair>): ProjectOverlapPair => ({
  key: `${overrides.aUuid}|${overrides.bUuid}`,
  aUuid: "a",
  aName: "A",
  bUuid: "b",
  bName: "B",
  percentage: 2,
  intersectionArea: 0.01,
  crossSite: false,
  ...overrides
});

describe("useProjectAnomalies", () => {
  it("orders cross-site overlaps before same-site overlaps, failed, then partial", () => {
    const overlapPairs: ProjectOverlapPair[] = [
      pair({ aUuid: "same-a", bUuid: "same-b", crossSite: false }),
      pair({ aUuid: "cross-a", bUuid: "cross-b", crossSite: true })
    ];
    // All paired polygons are loaded (the realistic case) so they're steppable.
    const polygonsData: SitePolygonLightDto[] = [
      polygon({ polygonUuid: "cross-a", validationStatus: "failed" }),
      polygon({ polygonUuid: "cross-b", validationStatus: "failed" }),
      polygon({ polygonUuid: "same-a", validationStatus: "failed" }),
      polygon({ polygonUuid: "same-b", validationStatus: "failed" }),
      polygon({ polygonUuid: "failed-1", validationStatus: "failed" }),
      polygon({ polygonUuid: "partial-1", validationStatus: "partial" }),
      polygon({ polygonUuid: "passed-1", validationStatus: "passed" })
    ];

    const { result } = renderHook(() => useProjectAnomalies({ overlapPairs, polygonsData }));

    expect(result.current).toEqual(["cross-a", "cross-b", "same-a", "same-b", "failed-1", "partial-1"]);
  });

  it("dedupes a polygon that appears in more than one pair or list", () => {
    const overlapPairs: ProjectOverlapPair[] = [
      pair({ aUuid: "poly-1", bUuid: "poly-2", crossSite: true }),
      pair({ aUuid: "poly-1", bUuid: "poly-3", crossSite: true })
    ];
    const polygonsData: SitePolygonLightDto[] = [
      polygon({ polygonUuid: "poly-1", validationStatus: "failed" }),
      polygon({ polygonUuid: "poly-2", validationStatus: "failed" }),
      polygon({ polygonUuid: "poly-3", validationStatus: "failed" })
    ];

    const { result } = renderHook(() => useProjectAnomalies({ overlapPairs, polygonsData }));

    expect(result.current).toEqual(["poly-1", "poly-2", "poly-3"]);
  });

  it("excludes overlap partners that are not in the loaded polygon set (not steppable)", () => {
    // "cross-b" is an overlap partner filtered out of the current page — it has no loaded row, so the
    // stepper must not step to it. Only the loaded side ("cross-a") is included.
    const overlapPairs: ProjectOverlapPair[] = [pair({ aUuid: "cross-a", bUuid: "cross-b", crossSite: true })];
    const polygonsData: SitePolygonLightDto[] = [polygon({ polygonUuid: "cross-a", validationStatus: "failed" })];

    const { result } = renderHook(() => useProjectAnomalies({ overlapPairs, polygonsData }));

    expect(result.current).toEqual(["cross-a"]);
  });

  it("returns an empty list when there are no anomalies", () => {
    const { result } = renderHook(() =>
      useProjectAnomalies({
        overlapPairs: [],
        polygonsData: [polygon({ polygonUuid: "poly-1", validationStatus: "passed" })]
      })
    );

    expect(result.current).toEqual([]);
  });
});
