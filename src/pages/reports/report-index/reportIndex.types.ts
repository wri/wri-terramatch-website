import {
  NurseryFullDto,
  ProjectFullDto,
  SiteFullDto,
  TaskLightDto
} from "@/generated/v3/entityService/entityServiceSchemas";
import type { TagSubmissionState } from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";

export type ReportsIndexReportType = "project-report" | "site-report" | "nursery-report";

export type ReportsIndexStatus = TagSubmissionState;

export type ReportsIndexSourceEntity = ProjectFullDto | SiteFullDto | NurseryFullDto;

export type ReportsIndexReport = {
  id: string;
  name: string | null;
  sourceName: string;
  projectName: string;
  type: ReportsIndexReportType;
  status: ReportsIndexStatus;
  updatedAt: string;
};

export type ReportsIndexPeriod = {
  id: string;
  task: TaskLightDto;
  reports: ReportsIndexReport[];
};

export type AdditionalReportType = "financial-report" | "srp-report" | "disturbance-report";

type AdditionalReportBase = {
  id: string;
  name: string;
  type: AdditionalReportType;
  status: ReportsIndexStatus;
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
