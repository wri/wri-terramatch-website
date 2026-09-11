import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

import { mapSitePolygonToTableRow } from "./polygonTableRow.utils";

const t = (key: string) => key;

const basePolygon = {
  uuid: "sp-1",
  polygonUuid: "poly-1",
  name: "North block",
  siteName: "Balassou",
  status: "submitted",
  validationStatus: "passed",
  practice: [],
  distr: [],
  numTrees: 10,
  calcArea: 5
} as unknown as SitePolygonLightDto;

describe("mapSitePolygonToTableRow", () => {
  it("omits the Site column data at site scope (no includeSiteName)", () => {
    const row = mapSitePolygonToTableRow(basePolygon, t);
    expect(row).not.toHaveProperty("siteName");
    expect(row.id).toBe("poly-1");
    expect(row.polygonName).toBe("North block");
  });

  it("includes siteName at project scope when includeSiteName is set", () => {
    const row = mapSitePolygonToTableRow(basePolygon, t, { includeSiteName: true });
    expect(row.siteName).toBe("Balassou");
  });

  it("falls back to an em dash when the polygon has no site name at project scope", () => {
    const row = mapSitePolygonToTableRow({ ...basePolygon, siteName: undefined } as unknown as SitePolygonLightDto, t, {
      includeSiteName: true
    });
    expect(row.siteName).toBe("—");
  });
});
