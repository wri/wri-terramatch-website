import { StoreResourceMap } from "@/store/apiSlice";
import {
  SitePolygonLightDto,
  SitePolygonFullDto,
  ValidationDto,
  DelayedJobDto,
  BoundingBoxDto,
  ValidationSummaryDto,
  ClippedVersionDto,
  IndicatorsSummaryDto
} from "./researchServiceSchemas";

export const RESEARCH_SERVICE_RESOURCES = [
  "sitePolygons",
  "validations",
  "delayedJobs",
  "boundingBoxes",
  "validationSummaries",
  "clippedVersions",
  "indicatorsSummary"
] as const;

export type ResearchServiceApiResources = {
  sitePolygons: StoreResourceMap<SitePolygonLightDto | SitePolygonFullDto>;
  validations: StoreResourceMap<ValidationDto>;
  delayedJobs: StoreResourceMap<DelayedJobDto>;
  boundingBoxes: StoreResourceMap<BoundingBoxDto>;
  validationSummaries: StoreResourceMap<ValidationSummaryDto>;
  clippedVersions: StoreResourceMap<ClippedVersionDto>;
  indicatorsSummary: StoreResourceMap<IndicatorsSummaryDto>;
};
