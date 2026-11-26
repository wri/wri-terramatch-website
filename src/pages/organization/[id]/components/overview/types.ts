import { FinancialReportFullDto, ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

/**
 * Per-project totals aggregated into the organization's key indicators.
 *
 * Note for the connection work: most of these fields only exist on `ProjectFullDto` (the project index returns
 * `ProjectLightDto`), so this needs an organization-level totals endpoint or the fields added to the light DTO —
 * fetching every full project would be an N+1.
 */
export type OrganisationProjectTotals = Pick<
  ProjectFullDto,
  | "uuid"
  | "frameworkKey"
  | "treesPlantedCount"
  | "seedsPlantedCount"
  | "regeneratedTreesCount"
  | "treesGrownGoal"
  | "totalHectaresRestoredSum"
  | "totalHectaresRestoredGoal"
  | "totalJobsCreated"
  | "jobsCreatedGoal"
  | "combinedWorkdayCount"
>;

export type OrganisationLatestFinancialReport = Pick<
  FinancialReportFullDto,
  "uuid" | "currency" | "financialCollection" | "fundingTypes"
>;

export type OrganisationSetUpStep = {
  id: string;
  title: string;
  completed: boolean;
};
