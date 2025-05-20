import { StoreResourceMap } from "@/store/apiSlice";
import {
  ProjectPitchDto,
  ProjectLightDto,
  ProjectFullDto,
  SiteLightDto,
  SiteFullDto,
  NurseryLightDto,
  NurseryFullDto,
  ProjectReportLightDto,
  ProjectReportFullDto,
  NurseryReportLightDto,
  NurseryReportFullDto,
  SiteReportLightDto,
  SiteReportFullDto,
  DemographicDto,
  SeedingDto,
  TreeSpeciesDto,
  MediaDto,
  DisturbanceDto,
  InvasiveDto,
  StrataDto,
  ScientificNameDto,
  EstablishmentsTreesDto,
  TreeReportCountsDto,
  BoundingBoxDto
} from "./entityServiceSchemas";

export const ENTITY_SERVICE_RESOURCES = [
  "projectPitches",
  "projects",
  "sites",
  "nurseries",
  "projectReports",
  "nurseryReports",
  "siteReports",
  "demographics",
  "seedings",
  "treeSpecies",
  "media",
  "disturbances",
  "invasives",
  "stratas",
  "treeSpeciesScientificNames",
  "establishmentTrees",
  "treeReportCounts",
  "boundingBoxes"
] as const;

export type EntityServiceApiResources = {
  projectPitches: StoreResourceMap<ProjectPitchDto>;
  projects: StoreResourceMap<ProjectLightDto | ProjectFullDto>;
  sites: StoreResourceMap<SiteLightDto | SiteFullDto>;
  nurseries: StoreResourceMap<NurseryLightDto | NurseryFullDto>;
  projectReports: StoreResourceMap<ProjectReportLightDto | ProjectReportFullDto>;
  nurseryReports: StoreResourceMap<NurseryReportLightDto | NurseryReportFullDto>;
  siteReports: StoreResourceMap<SiteReportLightDto | SiteReportFullDto>;
  demographics: StoreResourceMap<DemographicDto>;
  seedings: StoreResourceMap<SeedingDto>;
  treeSpecies: StoreResourceMap<TreeSpeciesDto>;
  media: StoreResourceMap<MediaDto>;
  disturbances: StoreResourceMap<DisturbanceDto>;
  invasives: StoreResourceMap<InvasiveDto>;
  stratas: StoreResourceMap<StrataDto>;
  treeSpeciesScientificNames: StoreResourceMap<ScientificNameDto>;
  establishmentTrees: StoreResourceMap<EstablishmentsTreesDto>;
  treeReportCounts: StoreResourceMap<TreeReportCountsDto>;
  boundingBoxes: StoreResourceMap<BoundingBoxDto>;
};

export const SupportedEntities = {
  ENTITY_TYPES: ["projects", "sites", "nurseries", "projectReports", "siteReports", "nurseryReports"] as const
} as const;

export const DemographicCollections = {
  WORKDAYS_PROJECT: [
    "paid-project-management",
    "volunteer-project-management",
    "paid-nursery-operations",
    "volunteer-nursery-operations",
    "paid-other-activities",
    "volunteer-other-activities",
    "direct",
    "convergence"
  ] as const,
  WORKDAYS_PROJECT_PPC: [
    "paid-project-management",
    "volunteer-project-management",
    "paid-nursery-operations",
    "volunteer-nursery-operations",
    "paid-other-activities",
    "volunteer-other-activities"
  ] as const,
  WORKDAYS_PROJECT_OTHER: "paid-other-activities" as const,
  WORKDAYS_SITE: [
    "paid-site-establishment",
    "volunteer-site-establishment",
    "paid-planting",
    "volunteer-planting",
    "paid-site-maintenance",
    "volunteer-site-maintenance",
    "paid-site-monitoring",
    "volunteer-site-monitoring",
    "paid-other-activities",
    "volunteer-other-activities"
  ] as const,
  WORKDAYS_SITE_OTHER: "paid-other-activities" as const,
  RESTORATION_PARTNERS_PROJECT: [
    "direct-income",
    "indirect-income",
    "direct-benefits",
    "indirect-benefits",
    "direct-conservation-payments",
    "indirect-conservation-payments",
    "direct-market-access",
    "indirect-market-access",
    "direct-capacity",
    "indirect-capacity",
    "direct-training",
    "indirect-training",
    "direct-land-title",
    "indirect-land-title",
    "direct-livelihoods",
    "indirect-livelihoods",
    "direct-productivity",
    "indirect-productivity",
    "direct-other",
    "indirect-other"
  ] as const,
  RESTORATION_PARTNERS_PROJECT_OTHER: "direct-other" as const,
  JOBS_PROJECT: ["full-time", "part-time"] as const,
  VOLUNTEERS_PROJECT: ["volunteer"] as const,
  BENEFICIARIES_PROJECT_ALL: ["all"] as const,
  BENEFICIARIES_PROJECT_TRAINING: ["training"] as const
} as const;

export const TreeEntityTypes = {
  ESTABLISHMENT_ENTITIES: ["sites", "nurseries", "projectReports", "siteReports", "nurseryReports"] as const,
  REPORT_COUNT_ENTITIES: ["projects", "projectReports", "sites", "nurseries"] as const
} as const;
