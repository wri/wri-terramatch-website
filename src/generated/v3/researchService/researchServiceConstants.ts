import { StoreResourceMap } from "@/store/apiSlice";
import { SitePolygonFullDto, SitePolygonLightDto, BoundingBoxDto, ValidationDto } from "./researchServiceSchemas";

export const RESEARCH_SERVICE_RESOURCES = ["sitePolygons", "boundingBoxes", "validations"] as const;

export type ResearchServiceApiResources = {
  sitePolygons: StoreResourceMap<SitePolygonFullDto | SitePolygonLightDto>;
  boundingBoxes: StoreResourceMap<BoundingBoxDto>;
  validations: StoreResourceMap<ValidationDto>;
};
