import { StoreResourceMap } from "@/store/apiSlice";
import {
  SitePolygonLightDto,
  SitePolygonFullDto,
  ValidationDto,
  SiteIndicatorRollupDto,
  TreeCoverLossTimelineDto,
  GeoJsonExportDto,
  GeometryUploadComparisonSummaryDto,
  DelayedJobDto,
  BoundingBoxDto,
  ValidationSummaryDto,
  ClippedVersionDto,
  ProjectPolygonDto,
  AnrPlotGeometryDto
} from "./researchServiceSchemas";

export const RESEARCH_SERVICE_RESOURCES = [
  "sitePolygons",
  "validations",
  "siteIndicatorRollups",
  "treeCoverLossTimelines",
  "geojsonExports",
  "geometryUploadComparisonSummaries",
  "delayedJobs",
  "boundingBoxes",
  "validationSummaries",
  "clippedVersions",
  "projectPolygons",
  "anrPlotGeometries"
] as const;

export type ResearchServiceApiResources = {
  sitePolygons: StoreResourceMap<SitePolygonLightDto | SitePolygonFullDto>;
  validations: StoreResourceMap<ValidationDto>;
  siteIndicatorRollups: StoreResourceMap<SiteIndicatorRollupDto>;
  treeCoverLossTimelines: StoreResourceMap<TreeCoverLossTimelineDto>;
  geojsonExports: StoreResourceMap<GeoJsonExportDto>;
  geometryUploadComparisonSummaries: StoreResourceMap<GeometryUploadComparisonSummaryDto>;
  delayedJobs: StoreResourceMap<DelayedJobDto>;
  boundingBoxes: StoreResourceMap<BoundingBoxDto>;
  validationSummaries: StoreResourceMap<ValidationSummaryDto>;
  clippedVersions: StoreResourceMap<ClippedVersionDto>;
  projectPolygons: StoreResourceMap<ProjectPolygonDto>;
  anrPlotGeometries: StoreResourceMap<AnrPlotGeometryDto>;
};
