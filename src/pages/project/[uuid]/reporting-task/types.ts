import {
  NurseryReportLightDto,
  ProjectReportLightDto,
  SiteReportLightDto,
  SrpReportLightDto
} from "@/generated/v3/entityService/entityServiceSchemas";

export type TaskReportDto = ProjectReportLightDto | SiteReportLightDto | NurseryReportLightDto | SrpReportLightDto;

export const NOTHING_TO_REPORT_MODELS = ["siteReports", "nurseryReports", "srpReports"] as const;
export type NothingToReportEntity = (typeof NOTHING_TO_REPORT_MODELS)[number];
