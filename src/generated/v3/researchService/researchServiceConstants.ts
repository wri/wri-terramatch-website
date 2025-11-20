import { StoreResourceMap } from "@/store/apiSlice";
import {
  SitePolygonLightDto,
  SitePolygonFullDto,
  DelayedJobDto,
  BoundingBoxDto,
  ValidationDto,
  ValidationSummaryDto
} from "./researchServiceSchemas";

export const RESEARCH_SERVICE_RESOURCES = [
  "sitePolygons",
  "delayedJobs",
  "boundingBoxes",
  "validations",
  "validationSummaries"
] as const;

export type ResearchServiceApiResources = {
  sitePolygons: StoreResourceMap<SitePolygonLightDto | SitePolygonFullDto>;
  delayedJobs: StoreResourceMap<DelayedJobDto>;
  boundingBoxes: StoreResourceMap<BoundingBoxDto>;
  validations: StoreResourceMap<ValidationDto>;
  validationSummaries: StoreResourceMap<ValidationSummaryDto>;
};
