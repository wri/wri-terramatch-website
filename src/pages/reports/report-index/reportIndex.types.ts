import { NurseryFullDto, ProjectFullDto, SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import type { TagSubmissionState } from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";

export type ReportsIndexReportType = "project-report" | "site-report" | "nursery-report";

export type ReportsIndexStatus = TagSubmissionState;

export type ReportsIndexSourceEntity = ProjectFullDto | SiteFullDto | NurseryFullDto;

export type ReportsIndexReport = {
  id: string;
  name: string | null;
  projectName: string;
  type: ReportsIndexReportType;
  status: ReportsIndexStatus;
  updateRequestStatus: string | null;
  completion: number | null;
  updatedAt: string;
};

/**
 * A reporting period is the set of reports a project has to deliver for a given due date, which is
 * what a reporting task represents on the backend. The reports carry their own due date and
 * framework, so the period is derived from them without having to walk the tasks. Metric values are
 * loaded lazily from the linked project report when the period accordion opens.
 */
export type ReportsIndexPeriod = {
  id: string;
  dueAt: string | null;
  frameworkKey: string | null;
  projectReportUuid: string | null;
  reports: ReportsIndexReport[];
};

export type ReportsIndexProjectSection = {
  id: string;
  name: string | null;
  organisationName: string | null;
  periods: ReportsIndexPeriod[];
};

export type AdditionalReportType = "financial-report" | "srp-report" | "disturbance-report";

type AdditionalReportBase = {
  id: string;
  name: string;
  type: AdditionalReportType;
  status: ReportsIndexStatus;
  updateRequestStatus: string | null;
  completion: number | null;
  updatedAt: string;
  organisationName: string | null;
  projectName: string | null;
  year: string | null;
};

export type AdditionalFinancialReport = AdditionalReportBase & {
  type: "financial-report";
  dueAt: string | null;
  currency: string | null;
  financialYearStart: number | null;
  organisationName: string | null;
};

export type AdditionalSrpReport = AdditionalReportBase & {
  type: "srp-report";
  dueAt: string | null;
  organisationName: string | null;
};

export type AdditionalDisturbanceReport = AdditionalReportBase & {
  type: "disturbance-report";
  dueAt: string | null;
  sitesAffected: number;
  intensity: string | null;
  dateOfDisturbance: string | null;
  organisationName: string | null;
};

export type AdditionalReport = AdditionalFinancialReport | AdditionalSrpReport | AdditionalDisturbanceReport;

export type ReportIndexItem = ReportsIndexReport | AdditionalReport;

export type AdditionalReportGroup = {
  id: string;
  type: AdditionalReportType;
  reports: AdditionalReport[];
};

export type AdditionalReportsEntitySection = {
  id: string;
  type: "organisation" | "project";
  name: string | null;
  caption: string;
  groups: AdditionalReportGroup[];
};
