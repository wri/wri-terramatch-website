import type { FeedbackTagProps } from "@/redesignComponents/actions/Tags/FeedbackTag/FeedbackTag";
import type { TagSubmissionState } from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import { mapStatusToTagStateEntity } from "@/utils/mapStatusToTagStateEntity";

import type { ReportIndexItem } from "./reportIndex.types";

export const REPORTS_INDEX_SOURCES = ["project", "site", "nursery"] as const;

export type ReportsIndexSource = (typeof REPORTS_INDEX_SOURCES)[number];

export const ALL_PROJECTS_VIEW_VALUE = "all";

export const REPORT_INDEX_TYPE_TO_ENTITY = {
  "project-report": "projectReports",
  "site-report": "siteReports",
  "nursery-report": "nurseryReports",
  "financial-report": "financialReports",
  "disturbance-report": "disturbanceReports",
  "srp-report": "srpReports"
} as const;

export type ReportsIndexEntity = (typeof REPORT_INDEX_TYPE_TO_ENTITY)[ReportIndexItem["type"]];

const SUBMITTABLE_STATUSES: ReadonlySet<TagSubmissionState> = new Set(["draft", "due"]);
const SUBMITTED_UPDATE_REQUEST_STATUSES: ReadonlySet<string> = new Set(["pending-approval", "information-required"]);

const NOTHING_TO_REPORT_TYPES: ReadonlySet<ReportIndexItem["type"]> = new Set([
  "site-report",
  "nursery-report",
  "srp-report",
  "disturbance-report",
  "financial-report"
]);

const NOTHING_TO_REPORT_STATUSES: ReadonlySet<TagSubmissionState> = new Set(["draft", "due"]);

export const isReportsIndexSource = (value: string | undefined): value is ReportsIndexSource =>
  REPORTS_INDEX_SOURCES.some(source => source === value);

export const getReportsIndexUrl = (source: ReportsIndexSource, uuid: string) =>
  `/reports/report-index?source=${source}&uuid=${encodeURIComponent(uuid)}`;

export const getReportIndexItemPath = (report: ReportIndexItem) => {
  if (["approved", "pending-approval"].includes(report.status)) {
    return `/reports/${report.type}/${report.id}`;
  }

  return `/entity/${report.type}s/edit/${report.id}`;
};

type ReportWithStatus = {
  status: string | null;
  updateRequestStatus?: string | null;
  nothingToReport?: boolean | null;
};

export const resolveReportsIndexStatus = (report: ReportWithStatus): TagSubmissionState => {
  if (report.nothingToReport === true) return "nothing-reported";

  const updateRequestStatus = report.updateRequestStatus;
  const hasSubmittedUpdateRequest =
    updateRequestStatus != null && SUBMITTED_UPDATE_REQUEST_STATUSES.has(updateRequestStatus);
  const status = hasSubmittedUpdateRequest ? updateRequestStatus : report.status;

  return mapStatusToTagStateEntity(status)?.type ?? "draft";
};

export const REPORTS_INDEX_ATTENTION_STATUSES: ReadonlySet<TagSubmissionState> = new Set([
  "due",
  "information-required",
  "draft"
]);

const REPORTS_INDEX_COMPLETE_STATUSES: ReadonlySet<TagSubmissionState> = new Set(["approved", "nothing-reported"]);

export const getReportsRequiringAttention = (reports: Array<{ status: TagSubmissionState }>) =>
  reports.filter(report => REPORTS_INDEX_ATTENTION_STATUSES.has(report.status)).length;

export const areAllReportsComplete = (reports: Array<{ status: TagSubmissionState }>) =>
  reports.length > 0 && reports.every(report => REPORTS_INDEX_COMPLETE_STATUSES.has(report.status));

export type ReportingPeriodDueDateType = Extract<FeedbackTagProps["type"], "info-white" | "info-grey" | "error">;

export const isReportingPeriodDueDatePast = (dueAt: string) => {
  const due = new Date(dueAt);
  const now = new Date();
  const dueDay = Date.UTC(due.getUTCFullYear(), due.getUTCMonth(), due.getUTCDate());
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return dueDay < today;
};

/**
 * Sub-level reporting period date tag:
 * - future/today due date → info-white
 * - past due date, all reports complete → info-grey
 * - past due date, incomplete items remain → error
 */
export const getReportingPeriodDueDateType = (
  dueAt: string | null | undefined,
  reports: Array<{ status: TagSubmissionState }>
): ReportingPeriodDueDateType | undefined => {
  if (dueAt == null) return undefined;
  if (!isReportingPeriodDueDatePast(dueAt)) return "info-white";
  return areAllReportsComplete(reports) ? "info-grey" : "error";
};

export const getReportStatusCounts = (reports: Array<{ status: TagSubmissionState }>) =>
  reports.reduce(
    (result, report) => {
      if (report.status === "due") result.due += 1;
      if (report.status === "draft") result.draft += 1;
      if (report.status === "information-required") result.informationRequired += 1;
      return result;
    },
    { due: 0, draft: 0, informationRequired: 0 }
  );

const hasOpenChangeRequestDraft = (report: ReportIndexItem) => report.updateRequestStatus === "draft";

const isReportCompleteEnoughToSubmit = (report: ReportIndexItem) => {
  if (report.completion == null) return report.status !== "due";
  return report.completion === 100;
};

export const isReportSubmittable = (report: ReportIndexItem) => {
  if (hasOpenChangeRequestDraft(report)) return false;
  if (!SUBMITTABLE_STATUSES.has(report.status)) return false;
  return isReportCompleteEnoughToSubmit(report);
};

export const isReportNothingToReportEligible = (report: ReportIndexItem) => {
  if (!NOTHING_TO_REPORT_TYPES.has(report.type)) return false;
  if (!NOTHING_TO_REPORT_STATUSES.has(report.status)) return false;
  if (hasOpenChangeRequestDraft(report)) return false;
  if (report.status === "nothing-reported") return false;
  return report.completion != 100;
};

export const groupReportUuidsByEntity = (reports: ReportIndexItem[]): Partial<Record<ReportsIndexEntity, string[]>> =>
  reports.reduce<Partial<Record<ReportsIndexEntity, string[]>>>((grouped, report) => {
    const entity = REPORT_INDEX_TYPE_TO_ENTITY[report.type];
    grouped[entity] = [...(grouped[entity] ?? []), report.id];
    return grouped;
  }, {});
