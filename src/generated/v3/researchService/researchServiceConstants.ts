import { StoreResourceMap } from "@/store/apiSlice";
import {
  SitePolygonFullDto,
  SitePolygonLightDto,
  BoundingBoxDto,
  ValidationDto,
  ValidationSummaryDto,
  DelayedJobDto
} from "./researchServiceSchemas";

export const RESEARCH_SERVICE_RESOURCES = [
  "sitePolygons",
  "boundingBoxes",
  "validations",
  "validationSummaries",
  "delayedJobs"
] as const;

export type ResearchServiceApiResources = {
  sitePolygons: StoreResourceMap<SitePolygonFullDto | SitePolygonLightDto>;
  boundingBoxes: StoreResourceMap<BoundingBoxDto>;
  validations: StoreResourceMap<ValidationDto>;
  validationSummaries: StoreResourceMap<ValidationSummaryDto>;
  delayedJobs: StoreResourceMap<DelayedJobDto>;
};
