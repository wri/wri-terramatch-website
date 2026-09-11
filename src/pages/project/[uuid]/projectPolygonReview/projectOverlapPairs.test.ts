import { SitePolygonLightDto, ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";

import { buildProjectOverlapPairs } from "./projectOverlapPairs";

const polygon = (overrides: Partial<SitePolygonLightDto>): SitePolygonLightDto =>
  ({
    uuid: overrides.polygonUuid,
    status: "submitted",
    validationStatus: "failed",
    ...overrides
  } as unknown as SitePolygonLightDto);

const overlapValidation = (
  polygonUuid: string,
  partners: { polyUuid: string; polyName: string; siteName: string; percentage?: number; intersectionArea?: number }[]
): ValidationDto => ({
  polygonUuid,
  criteriaList: [
    {
      criteriaId: 3,
      validationType: "OVERLAPPING",
      valid: false,
      createdAt: null,
      extraInfo: partners.map(partner => ({
        polyUuid: partner.polyUuid,
        polyName: partner.polyName,
        percentage: partner.percentage ?? 2.5,
        intersectionArea: partner.intersectionArea ?? 0.01,
        intersectSmaller: false,
        siteName: partner.siteName
      }))
    }
  ]
});

describe("buildProjectOverlapPairs", () => {
  const polygonsData: SitePolygonLightDto[] = [
    polygon({ polygonUuid: "poly-a", name: "Polygon A", siteId: "site-1", siteName: "Site One" }),
    polygon({ polygonUuid: "poly-b", name: "Polygon B", siteId: "site-2", siteName: "Site Two" }),
    polygon({ polygonUuid: "poly-c", name: "Polygon C", siteId: "site-1", siteName: "Site One" })
  ];

  it("dedupes a symmetric cross-site overlap into a single pair", () => {
    const validations = new Map<string, ValidationDto>([
      ["poly-a", overlapValidation("poly-a", [{ polyUuid: "poly-b", polyName: "Polygon B", siteName: "Site Two" }])],
      ["poly-b", overlapValidation("poly-b", [{ polyUuid: "poly-a", polyName: "Polygon A", siteName: "Site One" }])]
    ]);

    const pairs = buildProjectOverlapPairs(validations, polygonsData);

    expect(pairs).toHaveLength(1);
    expect(pairs[0].crossSite).toBe(true);
    expect([pairs[0].aUuid, pairs[0].bUuid].sort()).toEqual(["poly-a", "poly-b"]);
  });

  it("keeps the larger overlap percentage/area regardless of Map iteration order", () => {
    // poly-b (smaller %) is iterated first; poly-a reports the authoritative 4.2% / 0.05.
    const validations = new Map<string, ValidationDto>([
      [
        "poly-b",
        overlapValidation("poly-b", [
          { polyUuid: "poly-a", polyName: "Polygon A", siteName: "Site One", percentage: 1.1, intersectionArea: 0.01 }
        ])
      ],
      [
        "poly-a",
        overlapValidation("poly-a", [
          { polyUuid: "poly-b", polyName: "Polygon B", siteName: "Site Two", percentage: 4.2, intersectionArea: 0.05 }
        ])
      ]
    ]);

    const pairs = buildProjectOverlapPairs(validations, polygonsData);

    expect(pairs).toHaveLength(1);
    expect(pairs[0].percentage).toBe(4.2);
    expect(pairs[0].intersectionArea).toBe(0.05);
  });

  it("marks a same-site overlap as not cross-site", () => {
    const validations = new Map<string, ValidationDto>([
      ["poly-a", overlapValidation("poly-a", [{ polyUuid: "poly-c", polyName: "Polygon C", siteName: "Site One" }])],
      ["poly-c", overlapValidation("poly-c", [{ polyUuid: "poly-a", polyName: "Polygon A", siteName: "Site One" }])]
    ]);

    const pairs = buildProjectOverlapPairs(validations, polygonsData);

    expect(pairs).toHaveLength(1);
    expect(pairs[0].crossSite).toBe(false);
  });

  it("dedupes multiple pairs and preserves percentage/intersectionArea from the failing side", () => {
    const validations = new Map<string, ValidationDto>([
      [
        "poly-a",
        overlapValidation("poly-a", [
          { polyUuid: "poly-b", polyName: "Polygon B", siteName: "Site Two", percentage: 4.2, intersectionArea: 0.2 },
          { polyUuid: "poly-c", polyName: "Polygon C", siteName: "Site One" }
        ])
      ],
      ["poly-b", overlapValidation("poly-b", [{ polyUuid: "poly-a", polyName: "Polygon A", siteName: "Site One" }])],
      ["poly-c", overlapValidation("poly-c", [{ polyUuid: "poly-a", polyName: "Polygon A", siteName: "Site One" }])]
    ]);

    const pairs = buildProjectOverlapPairs(validations, polygonsData);

    expect(pairs).toHaveLength(2);
    const crossSitePair = pairs.find(pair => pair.crossSite);
    expect(crossSitePair?.percentage).toBe(4.2);
    expect(crossSitePair?.intersectionArea).toBe(0.2);
  });

  it("falls back to comparing site names, and treats an unresolvable partner as cross-site", () => {
    // The partner polygon isn't in the loaded polygonsData (e.g. filtered out of the current page),
    // so its siteId can't be resolved — extraInfo only carries siteName.
    const validations = new Map<string, ValidationDto>([
      ["poly-a", overlapValidation("poly-a", [{ polyUuid: "poly-z", polyName: "Polygon Z", siteName: "" }])]
    ]);

    const pairs = buildProjectOverlapPairs(validations, polygonsData);

    expect(pairs).toHaveLength(1);
    expect(pairs[0].crossSite).toBe(true);
    expect(pairs[0].bName).toBe("Polygon Z");
  });

  it("returns no pairs when there are no overlap failures", () => {
    expect(buildProjectOverlapPairs(new Map(), polygonsData)).toEqual([]);
  });
});
