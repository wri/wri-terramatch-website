/**
 * Generated by @openapi-codegen
 *
 * @version 1.0
 */
export type ANRDto = {
  /**
   * Site name
   */
  name: string;
  treeCount: number;
};

export type ProjectApplicationDto = {
  uuid: string;
  fundingProgrammeName: string;
  projectPitchUuid: string;
};

export type MediaDto = {
  uuid: string;
  collectionName: string;
  url: string;
  thumbUrl: string;
  name: string;
  fileName: string;
  mimeType: string | null;
  size: number;
  lat: number | null;
  lng: number | null;
  isPublic: boolean;
  isCover: boolean;
  /**
   * @format date-time
   */
  createdAt: string;
  description: string | null;
  photographer: string | null;
};

export type EntitySideload = {
  /**
   * Entity type to sideload
   */
  entity: "projects" | "sites" | "nurseries" | "projectReports" | "nurseryReports" | "siteReports";
  /**
   * The page size to include.
   */
  pageSize: number;
};

export type ProjectLightDto = {
  /**
   * Indicates if this resource has the full resource definition.
   */
  lightResource: boolean;
  uuid: string;
  /**
   * Framework key for this project
   */
  frameworkKey: string | null;
  /**
   * The associated organisation name
   */
  organisationName: string | null;
  /**
   * Entity status for this project
   */
  status: "started" | "awaiting-approval" | "approved" | "needs-more-information" | null;
  /**
   * Update request status for this project
   */
  updateRequestStatus: "no-update" | "draft" | "awaiting-approval" | "approved" | "needs-more-information" | null;
  name: string | null;
  /**
   * @format date-time
   */
  plantingStartDate: string | null;
  country: string | null;
  totalHectaresRestoredSum: number;
  /**
   * @format date-time
   */
  createdAt: string;
  /**
   * @format date-time
   */
  updatedAt: string;
};

export type SiteLightDto = {
  /**
   * Indicates if this resource has the full resource definition.
   */
  lightResource: boolean;
  uuid: string;
  /**
   * Framework key for this project
   */
  frameworkKey: string | null;
  /**
   * Entity status for this site
   */
  status: "started" | "awaiting-approval" | "approved" | "needs-more-information" | "restoration-in-progress" | null;
  /**
   * Update request status for this site
   */
  updateRequestStatus: "no-update" | "draft" | "awaiting-approval" | "approved" | "needs-more-information" | null;
  name: string | null;
  /**
   * The associated project name
   */
  projectName: string | null;
  treesPlantedCount: number;
  /**
   * @format date-time
   */
  createdAt: string;
  /**
   * @format date-time
   */
  updatedAt: string;
};

export type NurseryLightDto = {
  /**
   * Indicates if this resource has the full resource definition.
   */
  lightResource: boolean;
  uuid: string;
  name: string | null;
  /**
   * Framework key for this nursery
   */
  frameworkKey: string | null;
  /**
   * Entity status for this nursery
   */
  status: "started" | "awaiting-approval" | "approved" | "needs-more-information" | null;
  /**
   * Update request status for this nursery
   */
  updateRequestStatus: "no-update" | "draft" | "awaiting-approval" | "approved" | "needs-more-information" | null;
  /**
   * The associated project name
   */
  projectName: string | null;
  /**
   * The associated project organisation name
   */
  organisationName: string | null;
  migrated: string | null;
  /**
   * @format date-time
   */
  startDate: string | null;
  /**
   * @format date-time
   */
  endDate: string | null;
  seedlingsGrownCount: number | null;
  /**
   * @format date-time
   */
  createdAt: string;
  /**
   * @format date-time
   */
  updatedAt: string;
};

export type ProjectReportLightDto = {
  /**
   * Indicates if this resource has the full resource definition.
   */
  lightResource: boolean;
  uuid: string;
  frameworkKey: string;
  /**
   * The associated organisation name
   */
  organisationName: string | null;
  /**
   * The associated organisation uuid
   */
  organisationUuid: string | null;
  projectName: string | null;
  projectUuid: string | null;
  status: string;
  /**
   * @format date-time
   */
  submittedAt: string | null;
  /**
   * The associated task uuid
   */
  taskUuid: string | null;
  title: string | null;
  updateRequestStatus: string;
  /**
   * @format date-time
   */
  dueAt: string;
  workdaysPaid: number;
  /**
   * @format date-time
   */
  createdAt: string;
  /**
   * @format date-time
   */
  updatedAt: string;
};

export type NurseryReportLightDto = {
  /**
   * Indicates if this resource has the full resource definition.
   */
  lightResource: boolean;
  uuid: string;
  /**
   * The associated nursery name
   */
  nurseryName: string | null;
  /**
   * The associated nursery uuid
   */
  nurseryUuid: string | null;
  frameworkKey: string;
  frameworkUuid: string;
  status: string;
  updateRequestStatus: string;
  /**
   * The associated project name
   */
  projectName: string | null;
  /**
   * The associated project uuid
   */
  projectUuid: string | null;
  /**
   * The associated organisation name
   */
  organisationName: string | null;
  /**
   * The associated organisation uuid
   */
  organisationUuid: string | null;
  /**
   * @format date-time
   */
  updatedAt: string;
  /**
   * @format date-time
   */
  submittedAt: string | null;
  taskUuid: string | null;
  /**
   * @format date-time
   */
  dueAt: string;
  title: string | null;
  reportTitle: string | null;
  /**
   * @format date-time
   */
  createdAt: string;
};

export type SiteReportLightDto = {
  /**
   * Indicates if this resource has the full resource definition.
   */
  lightResource: boolean;
  uuid: string;
  /**
   * The associated site name
   */
  siteName: string | null;
  /**
   * The associated site uuid
   */
  siteUuid: string | null;
  frameworkKey: string;
  frameworkUuid: string;
  status: string;
  updateRequestStatus: string;
  /**
   * The associated project name
   */
  projectName: string | null;
  /**
   * The associated project uuid
   */
  projectUuid: string | null;
  /**
   * The associated organisation name
   */
  organisationName: string | null;
  /**
   * The associated organisation uuid
   */
  organisationUuid: string | null;
  /**
   * @format date-time
   */
  updatedAt: string;
  /**
   * @format date-time
   */
  submittedAt: string | null;
  taskUuid: string | null;
  /**
   * @format date-time
   */
  dueAt: string;
  reportTitle: string | null;
  /**
   * @format date-time
   */
  createdAt: string;
};

export type ProjectFullDto = {
  /**
   * Indicates if this resource has the full resource definition.
   */
  lightResource: boolean;
  uuid: string;
  /**
   * Framework key for this project
   */
  frameworkKey: string | null;
  /**
   * The associated organisation name
   */
  organisationName: string | null;
  /**
   * Entity status for this project
   */
  status: "started" | "awaiting-approval" | "approved" | "needs-more-information" | null;
  /**
   * Update request status for this project
   */
  updateRequestStatus: "no-update" | "draft" | "awaiting-approval" | "approved" | "needs-more-information" | null;
  name: string | null;
  /**
   * @format date-time
   */
  plantingStartDate: string | null;
  country: string | null;
  totalHectaresRestoredSum: number;
  /**
   * @format date-time
   */
  createdAt: string;
  /**
   * @format date-time
   */
  updatedAt: string;
  /**
   * True for projects that are test data and do not represent actual planting on the ground.
   */
  isTest: boolean;
  feedback: string | null;
  feedbackFields: string[] | null;
  continent: string | null;
  states: string[] | null;
  projectCountyDistrict: string | null;
  /**
   * @format date-time
   */
  plantingEndDate: string | null;
  budget: number | null;
  history: string | null;
  objectives: string | null;
  environmentalGoals: string | null;
  socioeconomicGoals: string | null;
  sdgsImpacted: string | null;
  totalHectaresRestoredGoal: number | null;
  treesGrownGoal: number | null;
  survivalRate: number | null;
  landUseTypes: string[] | null;
  restorationStrategy: string[] | null;
  treesPlantedCount: number;
  seedsPlantedCount: number;
  regeneratedTreesCount: number;
  workdayCount: number;
  selfReportedWorkdayCount: number;
  combinedWorkdayCount: number;
  totalJobsCreated: number;
  totalSites: number;
  totalNurseries: number;
  totalProjectReports: number;
  totalOverdueReports: number;
  descriptionOfProjectTimeline: string | null;
  sitingStrategyDescription: string | null;
  sitingStrategy: string | null;
  landholderCommEngage: string | null;
  projPartnerInfo: string | null;
  seedlingsSource: string | null;
  landTenureProjectArea: string[] | null;
  projImpactBiodiv: string | null;
  projImpactFoodsec: string | null;
  proposedGovPartners: string | null;
  treesRestoredPpc: number;
  detailedInterventionTypes: string[] | null;
  /**
   * The list of tree counts regenerating naturally by site name
   */
  assistedNaturalRegenerationList: ANRDto[];
  goalTreesRestoredAnr: number | null;
  directSeedingSurvivalRate: number | null;
  application: ProjectApplicationDto;
  media: MediaDto[];
  socioeconomicBenefits: MediaDto[];
  file: MediaDto[];
  otherAdditionalDocuments: MediaDto[];
  photos: MediaDto[];
  documentFiles: MediaDto[];
  programmeSubmission: MediaDto[];
  detailedProjectBudget: MediaDto;
  proofOfLandTenureMou: MediaDto[];
};

export type SiteFullDto = {
  /**
   * Indicates that this resource has the full resource definition.
   *
   * @example false
   */
  lightResource: boolean;
  uuid: string;
  /**
   * Framework key for this project
   */
  frameworkKey: string | null;
  /**
   * Entity status for this site
   */
  status: "started" | "awaiting-approval" | "approved" | "needs-more-information" | "restoration-in-progress" | null;
  /**
   * Update request status for this site
   */
  updateRequestStatus: "no-update" | "draft" | "awaiting-approval" | "approved" | "needs-more-information" | null;
  name: string | null;
  /**
   * The associated project name
   */
  projectName: string | null;
  treesPlantedCount: number;
  /**
   * @format date-time
   */
  createdAt: string;
  /**
   * @format date-time
   */
  updatedAt: string;
  totalSiteReports: number;
  totalHectaresRestoredSum: number;
  seedsPlantedCount: number;
  overdueSiteReportsTotal: number;
  selfReportedWorkdayCount: number;
  regeneratedTreesCount: number;
  combinedWorkdayCount: number;
  workdayCount: number;
  ppcExternalId: number | null;
  sitingStrategy: string | null;
  descriptionSitingStrategy: string | null;
  hectaresToRestoreGoal: number | null;
  description: string | null;
  controlSite: boolean | null;
  history: string | null;
  /**
   * @format date-time
   */
  startDate: string | null;
  /**
   * @format date-time
   */
  endDate: string | null;
  landTenures: string[] | null;
  survivalRatePlanted: number | null;
  directSeedingSurvivalRate: number | null;
  aNatRegenerationTreesPerHectare: number | null;
  aNatRegeneration: number | null;
  landscapeCommunityContribution: string | null;
  technicalNarrative: string | null;
  plantingPattern: string | null;
  soilCondition: string | null;
  aimYearFiveCrownCover: number | null;
  aimNumberOfMatureTrees: number | null;
  landUseTypes: string[] | null;
  restorationStrategy: string[] | null;
  feedback: string | null;
  feedbackFields: string[] | null;
  detailedInterventionTypes: string[] | null;
  media: MediaDto[];
  socioeconomicBenefits: MediaDto[];
  file: MediaDto[];
  otherAdditionalDocuments: MediaDto[];
  photos: MediaDto[];
  treeSpecies: MediaDto[];
  documentFiles: MediaDto[];
  stratificationForHeterogeneity: MediaDto;
  /**
   * The associated project uuid
   */
  projectUuid: string | null;
  /**
   * The associated project country
   */
  projectCountry: string | null;
  /**
   * The associated project organisation name
   */
  organisationName: string | null;
};

export type NurseryFullDto = {
  /**
   * Indicates if this resource has the full resource definition.
   */
  lightResource: boolean;
  uuid: string;
  name: string | null;
  /**
   * Framework key for this nursery
   */
  frameworkKey: string | null;
  /**
   * Entity status for this nursery
   */
  status: "started" | "awaiting-approval" | "approved" | "needs-more-information" | null;
  /**
   * Update request status for this nursery
   */
  updateRequestStatus: "no-update" | "draft" | "awaiting-approval" | "approved" | "needs-more-information" | null;
  /**
   * The associated project name
   */
  projectName: string | null;
  /**
   * The associated project organisation name
   */
  organisationName: string | null;
  migrated: string | null;
  /**
   * @format date-time
   */
  startDate: string | null;
  /**
   * @format date-time
   */
  endDate: string | null;
  seedlingsGrownCount: number | null;
  /**
   * @format date-time
   */
  createdAt: string;
  /**
   * @format date-time
   */
  updatedAt: string;
  feedback: string | null;
  feedbackFields: string[] | null;
  type: string | null;
  seedlingGrown: number | null;
  plantingContribution: string | null;
  oldModel: string | null;
  nurseryReportsTotal: number | null;
  overdueNurseryReportsTotal: number | null;
  projectUuid: string | null;
  file: MediaDto[];
  otherAdditionalDocuments: MediaDto[];
  photos: MediaDto[];
};

export type ProjectReportFullDto = {
  /**
   * Indicates if this resource has the full resource definition.
   */
  lightResource: boolean;
  uuid: string;
  frameworkKey: string;
  /**
   * The associated organisation name
   */
  organisationName: string | null;
  /**
   * The associated organisation uuid
   */
  organisationUuid: string | null;
  projectName: string | null;
  projectUuid: string | null;
  status: string | null;
  /**
   * @format date-time
   */
  submittedAt: string | null;
  /**
   * The associated task uuid
   */
  taskUuid: string | null;
  title: string | null;
  updateRequestStatus: string;
  /**
   * @format date-time
   */
  dueAt: string;
  workdaysPaid: number;
  /**
   * @format date-time
   */
  createdAt: string;
  /**
   * @format date-time
   */
  updatedAt: string;
  feedback: string | null;
  feedbackFields: string[] | null;
  completion: number | null;
  localEngagementDescription: string | null;
  equitableOpportunities: string | null;
  resilienceProgress: string | null;
  localGovernance: string | null;
  adaptiveManagement: string | null;
  scalabilityReplicability: string | null;
  convergenceJobsDescription: string | null;
  convergenceSchemes: string | null;
  convergenceAmount: number | null;
  beneficiariesScstobc: number | null;
  beneficiariesScstobcFarmers: number | null;
  communityPartnersAssetsDescription: string | null;
  peopleKnowledgeSkillsIncreased: number | null;
  technicalNarrative: string | null;
  publicNarrative: string | null;
  totalUniqueRestorationPartners: number | null;
  businessMilestones: string | null;
  landscapeCommunityContribution: string | null;
  reportTitle: string | null;
  seedsPlantedCount: number | null;
  treesPlantedCount: number | null;
  regeneratedTreesCount: number;
  topThreeSuccesses: string | null;
  challengesFaced: string | null;
  lessonsLearned: string | null;
  maintenanceAndMonitoringActivities: string | null;
  significantChange: string | null;
  pctSurvivalToDate: number | null;
  survivalCalculation: string | null;
  survivalComparison: string | null;
  ftSmallholderFarmers: number | null;
  ptSmallholderFarmers: number | null;
  seasonalMen: number | null;
  seasonalWomen: number | null;
  seasonalYouth: number | null;
  seasonalSmallholderFarmers: number | null;
  seasonalTotal: number | null;
  volunteerSmallholderFarmers: number | null;
  plantedTrees: number | null;
  sharedDriveLink: string | null;
  beneficiariesDescription: string | null;
  beneficiariesIncomeIncrease: number | null;
  beneficiariesIncomeIncreaseDescription: string | null;
  beneficiariesSkillsKnowledgeIncreaseDescription: string | null;
  indirectBeneficiaries: number | null;
  indirectBeneficiariesDescription: string | null;
  newJobsDescription: string | null;
  volunteersWorkDescription: string | null;
  siteReportsCount: number | null;
  nurseryReportsCount: number | null;
  migrated: boolean;
  seedlingsGrown: number;
  communityProgress: string | null;
  localEngagement: string | null;
  siteAddition: boolean;
  paidOtherActivityDescription: string | null;
  nonTreeTotal: number | null;
  readableCompletionStatus: string;
  createdBy: number | null;
  createdByUser: Record<string, any> | null;
  media: MediaDto[];
  socioeconomicBenefits: MediaDto[];
  file: MediaDto[];
  otherAdditionalDocuments: MediaDto[];
  photos: MediaDto[];
};

export type NurseryReportFullDto = {
  /**
   * Indicates if this resource has the full resource definition.
   */
  lightResource: boolean;
  uuid: string;
  /**
   * The associated nursery name
   */
  nurseryName: string | null;
  /**
   * The associated nursery uuid
   */
  nurseryUuid: string | null;
  frameworkKey: string;
  frameworkUuid: string;
  status: string;
  updateRequestStatus: string;
  /**
   * The associated project name
   */
  projectName: string | null;
  /**
   * The associated project uuid
   */
  projectUuid: string | null;
  /**
   * The associated organisation name
   */
  organisationName: string | null;
  /**
   * The associated organisation uuid
   */
  organisationUuid: string | null;
  /**
   * @format date-time
   */
  updatedAt: string;
  /**
   * @format date-time
   */
  submittedAt: string | null;
  /**
   * The associated task uuid
   */
  taskUuid: string | null;
  /**
   * @format date-time
   */
  dueAt: string;
  title: string | null;
  reportTitle: string | null;
  /**
   * @format date-time
   */
  createdAt: string;
  projectReportTitle: string | null;
  feedback: string | null;
  feedbackFields: string[] | null;
  nothingToReport: boolean | null;
  completion: number | null;
  seedlingsYoungTrees: number | null;
  interestingFacts: string | null;
  sitePrep: string | null;
  sharedDriveLink: string | null;
  createdByFirstName: string | null;
  createdByLastName: string | null;
  approvedByFirstName: string | null;
  approvedByLastName: string | null;
  migrated: boolean;
  file: MediaDto[];
  otherAdditionalDocuments: MediaDto[];
  treeSeedlingContributions: MediaDto[];
  photos: MediaDto[];
};

export type SiteReportFullDto = {
  /**
   * Indicates if this resource has the full resource definition.
   */
  lightResource: boolean;
  uuid: string;
  /**
   * The associated site name
   */
  siteName: string | null;
  /**
   * The associated site uuid
   */
  siteUuid: string | null;
  frameworkKey: string;
  frameworkUuid: string;
  status: string;
  updateRequestStatus: string;
  /**
   * The associated project name
   */
  projectName: string | null;
  /**
   * The associated project uuid
   */
  projectUuid: string | null;
  /**
   * The associated organisation name
   */
  organisationName: string | null;
  /**
   * The associated organisation uuid
   */
  organisationUuid: string | null;
  /**
   * @format date-time
   */
  updatedAt: string;
  /**
   * @format date-time
   */
  submittedAt: string | null;
  /**
   * The associated task uuid
   */
  taskUuid: string | null;
  /**
   * @format date-time
   */
  dueAt: string;
  reportTitle: string | null;
  /**
   * @format date-time
   */
  createdAt: string;
  projectReportTitle: string | null;
  feedback: string | null;
  feedbackFields: string[] | null;
  nothingToReport: boolean | null;
  completion: number | null;
  title: string | null;
  sharedDriveLink: string | null;
  createdByFirstName: string | null;
  createdByLastName: string | null;
  approvedByFirstName: string | null;
  approvedByLastName: string | null;
  migrated: boolean;
  numTreesRegenerating: number | null;
  regenerationDescription: string | null;
  invasiveSpeciesRemoved: string | null;
  invasiveSpeciesManagement: string | null;
  siteCommunityPartnersDescription: string | null;
  siteCommunityPartnersIncomeIncreaseDescription: string | null;
  soilWaterRestorationDescription: string | null;
  waterStructures: string | null;
  disturbanceDetails: string | null;
  paidOtherActivityDescription: string | null;
  polygonStatus: string | null;
  totalNonTreeSpeciesPlantedCount: number;
  totalTreeReplantingCount: number;
  totalTreesPlantedCount: number;
  totalSeedsPlantedCount: number;
  survivalCalculation: string;
  survivalDescription: string;
  maintenanceActivities: string;
  technicalNarrative: string;
  publicNarrative: string;
  pctSurvivalToDate: number;
  projectReport: ProjectReportLightDto;
  socioeconomicBenefits: MediaDto[];
  media: MediaDto[];
  file: MediaDto[];
  otherAdditionalDocuments: MediaDto[];
  photos: MediaDto[];
  treeSpecies: MediaDto[];
  siteSubmission: MediaDto[];
  documentFiles: MediaDto[];
};

export type DemographicEntryDto = {
  type: string;
  subtype: string;
  name?: string;
  amount: number;
};

/**
 * CONSTANTS
 */
export type DemographicCollections = {
  /**
   * @example paid-project-management
   * @example volunteer-project-management
   * @example paid-nursery-operations
   * @example volunteer-nursery-operations
   * @example paid-other-activities
   * @example volunteer-other-activities
   * @example direct
   * @example convergence
   */
  WORKDAYS_PROJECT: string[];
  /**
   * @example paid-project-management
   * @example volunteer-project-management
   * @example paid-nursery-operations
   * @example volunteer-nursery-operations
   * @example paid-other-activities
   * @example volunteer-other-activities
   */
  WORKDAYS_PROJECT_PPC: string[];
  /**
   * @example paid-other-activities
   */
  WORKDAYS_PROJECT_OTHER: string;
  /**
   * @example paid-site-establishment
   * @example volunteer-site-establishment
   * @example paid-planting
   * @example volunteer-planting
   * @example paid-site-maintenance
   * @example volunteer-site-maintenance
   * @example paid-site-monitoring
   * @example volunteer-site-monitoring
   * @example paid-other-activities
   * @example volunteer-other-activities
   */
  WORKDAYS_SITE: string[];
  /**
   * @example paid-other-activities
   */
  WORKDAYS_SITE_OTHER: string;
  /**
   * @example direct-income
   * @example indirect-income
   * @example direct-benefits
   * @example indirect-benefits
   * @example direct-conservation-payments
   * @example indirect-conservation-payments
   * @example direct-market-access
   * @example indirect-market-access
   * @example direct-capacity
   * @example indirect-capacity
   * @example direct-training
   * @example indirect-training
   * @example direct-land-title
   * @example indirect-land-title
   * @example direct-livelihoods
   * @example indirect-livelihoods
   * @example direct-productivity
   * @example indirect-productivity
   * @example direct-other
   * @example indirect-other
   */
  RESTORATION_PARTNERS_PROJECT: string[];
  /**
   * @example direct-other
   */
  RESTORATION_PARTNERS_PROJECT_OTHER: string;
  /**
   * @example full-time
   * @example part-time
   */
  JOBS_PROJECT: string[];
  /**
   * @example volunteer
   */
  VOLUNTEERS_PROJECT: string[];
  /**
   * @example all
   */
  BENEFICIARIES_PROJECT_ALL: string[];
  /**
   * @example training
   */
  BENEFICIARIES_PROJECT_TRAINING: string[];
};

export type DemographicDto = {
  /**
   * The entity type this resource is associated with.
   */
  entityType: "projects" | "sites" | "nurseries" | "projectReports" | "siteReports" | "nurseryReports";
  /**
   * The entity UUID this resource is associated with.
   */
  entityUuid: string;
  uuid: string;
  type:
    | "workdays"
    | "restoration-partners"
    | "jobs"
    | "employees"
    | "volunteers"
    | "all-beneficiaries"
    | "training-beneficiaries"
    | "indirect-beneficiaries";
  collection: string;
  entries: DemographicEntryDto[];
};

export type SeedingDto = {
  /**
   * The entity type this resource is associated with.
   */
  entityType: "projects" | "sites" | "nurseries" | "projectReports" | "siteReports" | "nurseryReports";
  /**
   * The entity UUID this resource is associated with.
   */
  entityUuid: string;
  uuid: string;
  name?: string;
  amount?: number;
  taxonId?: string;
  weightOfSample?: number;
  seedsInSample?: number;
};

export type TreeSpeciesDto = {
  /**
   * The entity type this resource is associated with.
   */
  entityType: "projects" | "sites" | "nurseries" | "projectReports" | "siteReports" | "nurseryReports";
  /**
   * The entity UUID this resource is associated with.
   */
  entityUuid: string;
  uuid: string;
  name?: string;
  amount?: number;
  taxonId?: string;
  collection?: string;
};

export type PlantingCountDto = {
  /**
   * Taxonomic ID for this tree species row
   */
  taxonId: string | null;
  /**
   * Number of trees of this type that have been planted in all previous reports on this entity.
   */
  amount: number;
};

/**
 * CONSTANTS
 */
export type TreeEntityTypes = {
  /**
   * @example sites
   * @example nurseries
   * @example projectReports
   * @example siteReports
   * @example nurseryReports
   */
  ESTABLISHMENT_ENTITIES: string[];
  /**
   * @example projects
   * @example projectReports
   * @example sites
   * @example nurseries
   */
  REPORT_COUNT_ENTITIES: string[];
};

export type ScientificNameDto = {
  /**
   * The scientific name for this tree species
   *
   * @example Abelia uniflora
   */
  scientificName: string;
};

export type EstablishmentsTreesDto = {
  /**
   * The species that were specified at the establishment of the parent entity keyed by collection. Note that for site reports, the seeds on the site establishment are included under the collection name "seeds"
   *
   * @example {"tree-planted":["Aster Peraliens","Circium carniolicum"],"non-tree":["Coffee"]}
   */
  establishmentTrees: {
    [key: string]: string[];
  };
  /**
   * If the entity in this request is a report, the sum totals of previous planting by species by collection. Note that for site reports, the seeds planted under previous site reports are included under the collection name "seeds"
   *
   * @example {"tree-planted":{"Aster persaliens":{"amount":256},"Cirsium carniolicum":{"taxonId":"wfo-0000130112","amount":1024}},"non-tree":{"Coffee":{"amount":2048}}}
   */
  previousPlantingCounts: {
    [key: string]: {
      [key: string]: PlantingCountDto;
    };
  } | null;
};

export type TreeReportCountsDto = {
  /**
   * The species that were specified at the establishment of the parent entity grouped by collection. This will be null for projects because projects don't have a parent entity. Note that for site reports, the seeds on the site establishment are included under the collection name "seeds"
   *
   * @example {"tree-planted":["Aster Peraliens","Circium carniolicum"],"non-tree":["Coffee"]}
   */
  establishmentTrees: {
    [key: string]: string[];
  } | null;
  /**
   * Returns the planting counts of all species on reports associated with this entity, grouped by collection.If the entity is a project or site, it returns data for all site reports under that Project or Site. If the entity is a project report, it returns data for all site reports within the same reporting task. Note that seeding data is returned on this same endpoint under the collection name "seeds"
   *
   * @example {"tree-planted":{"Aster persaliens":{"amount":256},"Cirsium carniolicum":{"taxonId":"wfo-0000130112","amount":1024}},"non-tree":{"Coffee":{"amount":2048}}}
   */
  reportCounts: {
    [key: string]: {
      [key: string]: PlantingCountDto;
    };
  } | null;
};
