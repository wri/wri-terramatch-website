import { StoreResourceMap } from "@/store/apiSlice";
import {
  SitePolygonLightDto,
  SitePolygonFullDto,
  ValidationDto,
  GeoJsonExportDto,
  DelayedJobDto,
  BoundingBoxDto,
  ValidationSummaryDto,
  ClippedVersionDto
} from "./researchServiceSchemas";

export const RESEARCH_SERVICE_RESOURCES = [
  "sitePolygons",
  "validations",
  "geojsonExports",
  "delayedJobs",
  "boundingBoxes",
  "validationSummaries",
  "clippedVersions"
] as const;

export type ResearchServiceApiResources = {
  sitePolygons: StoreResourceMap<SitePolygonLightDto | SitePolygonFullDto>;
  validations: StoreResourceMap<ValidationDto>;
  geojsonExports: StoreResourceMap<GeoJsonExportDto>;
  delayedJobs: StoreResourceMap<DelayedJobDto>;
  boundingBoxes: StoreResourceMap<BoundingBoxDto>;
  validationSummaries: StoreResourceMap<ValidationSummaryDto>;
  clippedVersions: StoreResourceMap<ClippedVersionDto>;
};
