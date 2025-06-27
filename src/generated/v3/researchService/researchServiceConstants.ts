import { StoreResourceMap } from "@/store/apiSlice";
import { SitePolygonFullDto, SitePolygonLightDto, BoundingBoxDto } from "./researchServiceSchemas";

export const RESEARCH_SERVICE_RESOURCES = ["sitePolygons", "boundingBoxes"] as const;

export type ResearchServiceApiResources = {
  sitePolygons: StoreResourceMap<SitePolygonFullDto | SitePolygonLightDto>;
  boundingBoxes: StoreResourceMap<BoundingBoxDto>;
};
