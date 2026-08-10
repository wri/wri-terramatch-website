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
  name: string;
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
