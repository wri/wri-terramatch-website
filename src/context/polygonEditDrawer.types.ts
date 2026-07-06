import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

export type PolygonEditDrawerTab = "edit" | "comments";

export type PolygonEditDrawerPolygon = {
  polygonUuid?: string;
  polygonName?: string;
  sitePolygon?: SitePolygonLightDto;
  defaultTab?: PolygonEditDrawerTab;
};
