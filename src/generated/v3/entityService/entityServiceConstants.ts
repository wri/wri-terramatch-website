import { StoreResourceMap } from "@/store/apiSlice";
import {
  ProjectPitchDto,
  ImpactStoryLightDto,
  ImpactStoryFullDto,
  TaskLightDto,
  TaskFullDto,
  ProjectReportLightDto,
  ProjectReportFullDto,
  SiteReportLightDto,
  SiteReportFullDto,
  NurseryReportLightDto,
  NurseryReportFullDto,
  SrpReportLightDto,
  SrpReportFullDto,
  MediaDto,
  ScientificNameDto,
  EstablishmentsTreesDto,
  TreeReportCountsDto,
  DemographicDto,
  DisturbanceDto,
  ProjectLightDto,
  ProjectFullDto,
  SiteLightDto,
  SiteFullDto,
  NurseryLightDto,
  NurseryFullDto,
  FinancialReportLightDto,
  FinancialReportFullDto,
  DisturbanceReportLightDto,
  DisturbanceReportFullDto,
  SeedingDto,
  TreeSpeciesDto,
  InvasiveDto,
  StrataDto,
  OptionLabelDto,
  LinkedFieldDto
} from "./entityServiceSchemas";

export const ENTITY_SERVICE_RESOURCES = [
  "projectPitches",
  "impactStories",
  "tasks",
  "projectReports",
  "siteReports",
  "nurseryReports",
  "srpReports",
  "media",
  "treeSpeciesScientificNames",
  "establishmentTrees",
  "treeReportCounts",
  "demographics",
  "disturbances",
  "projects",
  "sites",
  "nurseries",
  "financialReports",
  "disturbanceReports",
  "seedings",
  "treeSpecies",
  "invasives",
  "stratas",
  "optionLabels",
  "linkedFields"
] as const;

export type EntityServiceApiResources = {
  projectPitches: StoreResourceMap<ProjectPitchDto>;
  impactStories: StoreResourceMap<ImpactStoryLightDto | ImpactStoryFullDto>;
  tasks: StoreResourceMap<TaskLightDto | TaskFullDto>;
  projectReports: StoreResourceMap<ProjectReportLightDto | ProjectReportFullDto>;
  siteReports: StoreResourceMap<SiteReportLightDto | SiteReportFullDto>;
  nurseryReports: StoreResourceMap<NurseryReportLightDto | NurseryReportFullDto>;
  srpReports: StoreResourceMap<SrpReportLightDto | SrpReportFullDto>;
  media: StoreResourceMap<MediaDto>;
  treeSpeciesScientificNames: StoreResourceMap<ScientificNameDto>;
  establishmentTrees: StoreResourceMap<EstablishmentsTreesDto>;
  treeReportCounts: StoreResourceMap<TreeReportCountsDto>;
  demographics: StoreResourceMap<DemographicDto>;
  disturbances: StoreResourceMap<DisturbanceDto>;
  projects: StoreResourceMap<ProjectLightDto | ProjectFullDto>;
  sites: StoreResourceMap<SiteLightDto | SiteFullDto>;
  nurseries: StoreResourceMap<NurseryLightDto | NurseryFullDto>;
  financialReports: StoreResourceMap<FinancialReportLightDto | FinancialReportFullDto>;
  disturbanceReports: StoreResourceMap<DisturbanceReportLightDto | DisturbanceReportFullDto>;
  seedings: StoreResourceMap<SeedingDto>;
  treeSpecies: StoreResourceMap<TreeSpeciesDto>;
  invasives: StoreResourceMap<InvasiveDto>;
  stratas: StoreResourceMap<StrataDto>;
  optionLabels: StoreResourceMap<OptionLabelDto>;
  linkedFields: StoreResourceMap<LinkedFieldDto>;
};

export const TreeEntityTypes = {
  ESTABLISHMENT_ENTITIES: [
    "sites",
    "nurseries",
    "projectReports",
    "siteReports",
    "nurseryReports",
    "financialReports",
    "disturbanceReports",
    "srpReports"
  ] as const,
  REPORT_COUNT_ENTITIES: ["projects", "projectReports", "sites", "nurseries"] as const
} as const;

export const SupportedEntities = {
  ENTITY_TYPES: [
    "projects",
    "sites",
    "nurseries",
    "projectReports",
    "siteReports",
    "nurseryReports",
    "financialReports",
    "disturbanceReports",
    "srpReports"
  ] as const
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
  JOBS_PROJECT: ["all", "full-time", "full-time-clt", "part-time", "part-time-clt"] as const,
  VOLUNTEERS_PROJECT: ["volunteer"] as const,
  BENEFICIARIES_PROJECT_ALL: ["all"] as const,
  BENEFICIARIES_PROJECT_TRAINING: ["training"] as const
} as const;
