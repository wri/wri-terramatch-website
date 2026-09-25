import { StoreResourceMap } from "@/store/apiSlice";
import {
  SitePolygonLightDto,
  SitePolygonFullDto,
  ValidationDto,
  GeoJsonExportDto,
  SitePolygonMapIndexDto,
  SitePolygonSummaryDto,
  GeometryUploadComparisonSummaryDto,
  DelayedJobDto,
  BoundingBoxDto,
  ValidationSummaryDto,
  ClippedVersionDto,
  ProjectPolygonDto,
  AnrPlotGeometryDto,
  PolygonAttributeDefinitionDto,
  ResearchTreeCountDto
} from "./researchServiceSchemas";

export const RESEARCH_SERVICE_RESOURCES = [
  "sitePolygons",
  "validations",
  "geojsonExports",
  "sitePolygonMapIndexes",
  "sitePolygonSummaries",
  "geometryUploadComparisonSummaries",
  "delayedJobs",
  "boundingBoxes",
  "validationSummaries",
  "clippedVersions",
  "projectPolygons",
  "anrPlotGeometries",
  "polygonAttributeDefinitions",
  "researchTreeCounts"
] as const;

export type ResearchServiceApiResources = {
  sitePolygons: StoreResourceMap<SitePolygonLightDto | SitePolygonFullDto>;
  validations: StoreResourceMap<ValidationDto>;
  geojsonExports: StoreResourceMap<GeoJsonExportDto>;
  sitePolygonMapIndexes: StoreResourceMap<SitePolygonMapIndexDto>;
  sitePolygonSummaries: StoreResourceMap<SitePolygonSummaryDto>;
  geometryUploadComparisonSummaries: StoreResourceMap<GeometryUploadComparisonSummaryDto>;
  delayedJobs: StoreResourceMap<DelayedJobDto>;
  boundingBoxes: StoreResourceMap<BoundingBoxDto>;
  validationSummaries: StoreResourceMap<ValidationSummaryDto>;
  clippedVersions: StoreResourceMap<ClippedVersionDto>;
  projectPolygons: StoreResourceMap<ProjectPolygonDto>;
  anrPlotGeometries: StoreResourceMap<AnrPlotGeometryDto>;
  polygonAttributeDefinitions: StoreResourceMap<PolygonAttributeDefinitionDto>;
  researchTreeCounts: StoreResourceMap<ResearchTreeCountDto>;
};

export const PolygonAttributeDefinitionConstants = {
  INPUT_TYPES: ["single_select", "multi_select", "date"] as const
} as const;
