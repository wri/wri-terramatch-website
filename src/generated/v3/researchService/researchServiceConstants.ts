import { StoreResourceMap } from "@/store/apiSlice";
import { SitePolygonFullDto, SitePolygonLightDto } from "./researchServiceSchemas";

export const RESEARCH_SERVICE_RESOURCES = ["sitePolygons"] as const;

export type ResearchServiceApiResources = {
  sitePolygons: StoreResourceMap<SitePolygonFullDto | SitePolygonLightDto>;
};
