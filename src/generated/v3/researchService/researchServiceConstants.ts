import { StoreResourceMap } from "@/store/apiSlice";
import {
  SitePolygonLightDto,
  SitePolygonFullDto,
  ValidationDto,
  GeoJsonExportDto,
  GeometryUploadComparisonSummaryDto,
  DelayedJobDto,
  BoundingBoxDto,
  ValidationSummaryDto,
  ClippedVersionDto,
  ProjectPolygonDto,
  AnrPlotGeometryDto,
  PolygonAttributeDefinitionDto,
  SiteReviewRollupDto
} from "./researchServiceSchemas";

export const RESEARCH_SERVICE_RESOURCES = [
  "sitePolygons",
  "validations",
  "geojsonExports",
  "geometryUploadComparisonSummaries",
  "delayedJobs",
  "boundingBoxes",
  "validationSummaries",
  "clippedVersions",
  "projectPolygons",
  "anrPlotGeometries",
  "polygonAttributeDefinitions",
  // hand-added ahead of codegen for the project-level polygons site-rollup work
  "siteReviewRollups"
] as const;

export type ResearchServiceApiResources = {
  sitePolygons: StoreResourceMap<SitePolygonLightDto | SitePolygonFullDto>;
  validations: StoreResourceMap<ValidationDto>;
  geojsonExports: StoreResourceMap<GeoJsonExportDto>;
  geometryUploadComparisonSummaries: StoreResourceMap<GeometryUploadComparisonSummaryDto>;
  delayedJobs: StoreResourceMap<DelayedJobDto>;
  boundingBoxes: StoreResourceMap<BoundingBoxDto>;
  validationSummaries: StoreResourceMap<ValidationSummaryDto>;
  clippedVersions: StoreResourceMap<ClippedVersionDto>;
  projectPolygons: StoreResourceMap<ProjectPolygonDto>;
  anrPlotGeometries: StoreResourceMap<AnrPlotGeometryDto>;
  polygonAttributeDefinitions: StoreResourceMap<PolygonAttributeDefinitionDto>;
  siteReviewRollups: StoreResourceMap<SiteReviewRollupDto>;
};

export const PolygonAttributeDefinitionConstants = {
  INPUT_TYPES: ["single_select", "multi_select"] as const
} as const;
