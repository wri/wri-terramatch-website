import { StoreResourceMap } from "@/store/apiSlice";
import {
  SitePolygonLightDto,
  SitePolygonFullDto,
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
  sitePolygons: StoreResourceMap<SitePolygonLightDto | SitePolygonFullDto>;
  boundingBoxes: StoreResourceMap<BoundingBoxDto>;
  validations: StoreResourceMap<ValidationDto>;
  validationSummaries: StoreResourceMap<ValidationSummaryDto>;
  delayedJobs: StoreResourceMap<DelayedJobDto>;
};
