import { StoreResourceMap } from "@/store/apiSlice";
import {
  SitePolygonLightDto,
  SitePolygonFullDto,
  ValidationDto,
  GeoJsonExportDto,
  DelayedJobDto,
  SitePolygonMapIndexDto,
  SitePolygonSummaryDto,
  GeometryUploadComparisonSummaryDto,
  BoundingBoxDto,
  ValidationSummaryDto,
  ClippedVersionDto,
  ProjectPolygonDto,
  AnrPlotGeometryDto,
  PolygonAttributeDefinitionDto,
  ResearchTreeCountDto,
  ProjectMapIndexDto
} from "./researchServiceSchemas";

export const RESEARCH_SERVICE_RESOURCES = [
  "sitePolygons",
  "validations",
  "geojsonExports",
  "delayedJobs",
  "sitePolygonMapIndexes",
  "sitePolygonSummaries",
  "geometryUploadComparisonSummaries",
  "boundingBoxes",
  "validationSummaries",
  "clippedVersions",
  "projectPolygons",
  "anrPlotGeometries",
  "polygonAttributeDefinitions",
  "researchTreeCounts",
  "projectMapIndexes"
] as const;

export type ResearchServiceApiResources = {
  sitePolygons: StoreResourceMap<SitePolygonLightDto | SitePolygonFullDto>;
  validations: StoreResourceMap<ValidationDto>;
  geojsonExports: StoreResourceMap<GeoJsonExportDto>;
  delayedJobs: StoreResourceMap<DelayedJobDto>;
  sitePolygonMapIndexes: StoreResourceMap<SitePolygonMapIndexDto>;
  sitePolygonSummaries: StoreResourceMap<SitePolygonSummaryDto>;
  geometryUploadComparisonSummaries: StoreResourceMap<GeometryUploadComparisonSummaryDto>;
  boundingBoxes: StoreResourceMap<BoundingBoxDto>;
  validationSummaries: StoreResourceMap<ValidationSummaryDto>;
  clippedVersions: StoreResourceMap<ClippedVersionDto>;
  projectPolygons: StoreResourceMap<ProjectPolygonDto>;
  anrPlotGeometries: StoreResourceMap<AnrPlotGeometryDto>;
  polygonAttributeDefinitions: StoreResourceMap<PolygonAttributeDefinitionDto>;
  researchTreeCounts: StoreResourceMap<ResearchTreeCountDto>;
  projectMapIndexes: StoreResourceMap<ProjectMapIndexDto>;
};

export const PolygonAttributeDefinitionConstants = {
  INPUT_TYPES: ["single_select", "multi_select", "date"] as const
} as const;
