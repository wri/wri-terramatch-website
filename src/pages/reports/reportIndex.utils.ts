import type { ParsedUrlQuery } from "querystring";

import type { ReportsFilterValues } from "@/context/reports.provider";
import type { FeedbackTagProps } from "@/redesignComponents/actions/Tags/FeedbackTag/FeedbackTag";
import type { TagSubmissionState } from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import { appendQueryParams } from "@/utils/appendQueryParams";
import { mapStatusToTagStateEntity } from "@/utils/mapStatusToTagStateEntity";

import type {
  AdditionalReport,
  AdditionalReportsEntitySection,
  ReportIndexItem,
  ReportsIndexProjectSection
} from "./reportIndex.types";

export const REPORTS_INDEX_SOURCES = ["project", "site", "nursery"] as const;

export type ReportsIndexSource = (typeof REPORTS_INDEX_SOURCES)[number];

export const REPORTS_INDEX_TABS = ["progress-reports", "additional-reports"] as const;

export type ReportsIndexTab = (typeof REPORTS_INDEX_TABS)[number];

export const ALL_PROJECTS_VIEW_VALUE = "all";

export const REPORTS_INDEX_PATH = "/reports";

// Mirrors the `i18n.locales` list in next.config.js, so a locale-prefixed href still resolves.
const LOCALE_PREFIX_PATTERN = /^\/(?:en|en-US|es|es-MX|fr-FR|pt-BR)(?=\/)/;

export const REPORT_INDEX_TYPE_TO_ENTITY = {
  "project-report": "projectReports",
  "site-report": "siteReports",
  "nursery-report": "nurseryReports",
  "financial-report": "financialReports",
  "disturbance-report": "disturbanceReports",
  "srp-report": "srpReports"
} as const;

export type ReportsIndexEntity = (typeof REPORT_INDEX_TYPE_TO_ENTITY)[ReportIndexItem["type"]];

const SUBMITTABLE_STATUSES: ReadonlySet<TagSubmissionState> = new Set(["draft", "information-required"]);
const SUBMITTED_UPDATE_REQUEST_STATUSES: ReadonlySet<string> = new Set(["pending-approval", "information-required"]);

const NOTHING_TO_REPORT_TYPES: ReadonlySet<ReportIndexItem["type"]> = new Set([
  "site-report",
  "nursery-report",
  "srp-report",
  "disturbance-report",
  "financial-report"
]);

const NOTHING_TO_REPORT_STATUSES: ReadonlySet<TagSubmissionState> = new Set(["draft", "due"]);

export const getReportsAccordionResetKey = (
  query: string,
  { dueDateFrom, dueDateTo, dueMonth, dueYear, reportTypes, statuses }: ReportsFilterValues
) => [query.trim(), dueDateFrom, dueDateTo, dueMonth, dueYear, reportTypes.join(","), statuses.join(",")].join(":");

export const isReportsIndexSource = (value: string | undefined): value is ReportsIndexSource =>
  REPORTS_INDEX_SOURCES.some(source => source === value);

export const isReportsIndexTab = (value: string | undefined): value is ReportsIndexTab =>
  REPORTS_INDEX_TABS.some(tab => tab === value);

export const isReportsIndexPath = (href: string | undefined): href is string => {
  if (href == null || href === "") return false;
  const path = href.split("?")[0].replace(LOCALE_PREFIX_PATTERN, "");
  return path === REPORTS_INDEX_PATH;
};

export type ReportsIndexUrlOptions = {
  tab?: ReportsIndexTab;
  view?: string;
  reportType?: string;
};

export const getReportsIndexUrl = (source: ReportsIndexSource, uuid: string, options?: ReportsIndexUrlOptions) => {
  const params = new URLSearchParams({ source, uuid });
  if (options?.tab != null && options.tab !== "progress-reports") {
    params.set("tab", options.tab);
  }
  if (options?.view != null && options.view !== "") {
    params.set("view", options.view);
  }
  if (options?.reportType != null && options.reportType !== "") {
    params.set("reportType", options.reportType);
  }
  return `${REPORTS_INDEX_PATH}?${params.toString()}`;
};

type ReportEntityForIndex = {
  projectUuid?: string | null;
  siteUuid?: string | null;
  nurseryUuid?: string | null;
};

export const getReportsIndexUrlForEntity = (
  tab: ReportsIndexTab,
  entity: ReportEntityForIndex,
  source?: ReportsIndexSource
) => {
  if (source === "site" && entity.siteUuid != null) {
    return getReportsIndexUrl("site", entity.siteUuid, { tab });
  }
  if (source === "nursery" && entity.nurseryUuid != null) {
    return getReportsIndexUrl("nursery", entity.nurseryUuid, { tab });
  }
  if (entity.projectUuid != null) {
    return getReportsIndexUrl("project", entity.projectUuid, { tab });
  }
  return undefined;
};

export const getReportsIndexHrefFromQuery = (from: ParsedUrlQuery["from"], fallback?: string) => {
  const value = typeof from === "string" ? from : undefined;
  return isReportsIndexPath(value) ? value : fallback;
};

export const withReportsIndexReturn = (href: string, indexHref?: string) =>
  appendQueryParams(href, { from: indexHref });

export type ReportProfileOrigin = {
  source: ReportsIndexSource;
  uuid: string;
};

const REPORT_ORIGIN_QUERY_KEYS = ["from", "profile", "profileUuid", "origin"] as const;

export const getReportProfileOriginFromQuery = (
  profile: ParsedUrlQuery["profile"],
  profileUuid: ParsedUrlQuery["profileUuid"]
): ReportProfileOrigin | undefined => {
  if (typeof profile !== "string" || !isReportsIndexSource(profile)) return undefined;
  if (typeof profileUuid !== "string" || profileUuid === "") return undefined;
  return { source: profile, uuid: profileUuid };
};

export const getReportViewHref = (
  report: Pick<ReportIndexItem, "type" | "id">,
  indexHref?: string,
  profileOrigin?: ReportProfileOrigin & { contextOrigin?: string; projectName?: string | null }
) => {
  const href = `/reports/${report.type}/${report.id}`;
  if (profileOrigin == null) {
    const params: Record<string, string | undefined> = { origin: "reports" };
    if (indexHref) params.from = indexHref;
    return appendQueryParams(href, params);
  }
  const params: Record<string, string | undefined> = {
    profile: profileOrigin.source,
    profileUuid: profileOrigin.uuid
  };
  if (profileOrigin.contextOrigin) {
    params.origin = profileOrigin.contextOrigin;
  }
  if (profileOrigin.projectName) {
    params.projectName = profileOrigin.projectName;
  }
  return appendQueryParams(href, params);
};

/** Carries the origin params (`from`, `profile`, `profileUuid`) of the current report page over to `href`. */
export const withReportOrigin = (href: string, query: ParsedUrlQuery) => {
  const params: Record<string, string | undefined> = {};
  for (const key of REPORT_ORIGIN_QUERY_KEYS) {
    const value = query[key];
    params[key] = typeof value === "string" ? value : undefined;
  }
  return appendQueryParams(href, params);
};

type ReportWithStatus = {
  status: string | null;
  updateRequestStatus?: string | null;
};

export const resolveReportsIndexStatus = (report: ReportWithStatus): TagSubmissionState => {
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

const REPORTS_INDEX_COMPLETE_STATUSES: ReadonlySet<TagSubmissionState> = new Set(["approved"]);

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

// Pending approval only needs action from an admin, so it only counts as overdue for admins.
const REPORTS_INDEX_ADMIN_ATTENTION_STATUSES: ReadonlySet<TagSubmissionState> = new Set([
  ...REPORTS_INDEX_ATTENTION_STATUSES,
  "pending-approval"
]);

/**
 * Sub-level reporting period date tag:
 * - future/today due date → info-white
 * - past due date, reports pending the user's attention → error (overdue)
 * - past due date, nothing pending the user's attention → info-grey
 */
export const getReportingPeriodDueDateType = (
  dueAt: string | null | undefined,
  reports: Array<{ status: TagSubmissionState }>,
  isAdmin: boolean
): ReportingPeriodDueDateType | undefined => {
  if (dueAt == null) return undefined;
  if (!isReportingPeriodDueDatePast(dueAt)) return "info-white";
  const attentionStatuses = isAdmin ? REPORTS_INDEX_ADMIN_ATTENTION_STATUSES : REPORTS_INDEX_ATTENTION_STATUSES;
  return reports.some(report => attentionStatuses.has(report.status)) ? "error" : "info-grey";
};

export type ReportingPeriodAnalyticsStatus = "open" | "overdue";

export const getReportingPeriodAnalyticsStatus = (
  dueAt: string | null | undefined,
  reports: Array<{ status: TagSubmissionState }>,
  isAdmin: boolean
): ReportingPeriodAnalyticsStatus =>
  getReportingPeriodDueDateType(dueAt, reports, isAdmin) === "error" ? "overdue" : "open";

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

export const isReportEditable = (report: ReportIndexItem) => report.status !== "pending-approval";

export const getEditDisabledTooltip = (reports: ReportIndexItem[], t: Translate): string | undefined => {
  if (reports.length !== 1 || isReportEditable(reports[0])) return undefined;

  return reports[0].nothingToReport
    ? t('This report has been marked as "Nothing to Report" and can’t be edited')
    : t("This report has already been submitted for review and can’t be edited");
};

export const isReportCompleteEnoughToSubmit = (report: ReportIndexItem) => {
  if (report.nothingToReport && NOTHING_TO_REPORT_TYPES.has(report.type)) return true;
  if (report.completion == null) return report.status !== "due";
  return report.completion === 100;
};

export const isReportSubmittable = (report: ReportIndexItem) => {
  if (hasOpenChangeRequestDraft(report)) return false;
  const markedNothingToReportDue =
    report.status === "due" && report.nothingToReport && NOTHING_TO_REPORT_TYPES.has(report.type);
  if (!SUBMITTABLE_STATUSES.has(report.status) && !markedNothingToReportDue) return false;
  return isReportCompleteEnoughToSubmit(report);
};

export type ReportSubmitBlockingReason = "approved" | "pending-approval" | "incomplete" | "ineligible";

export const getReportSubmitBlockingReason = (report: ReportIndexItem): ReportSubmitBlockingReason | null => {
  if (isReportSubmittable(report)) return null;
  if (report.status === "approved") return "approved";
  if (report.status === "pending-approval") return "pending-approval";
  if (SUBMITTABLE_STATUSES.has(report.status) && !isReportCompleteEnoughToSubmit(report)) {
    return "incomplete";
  }
  return "ineligible";
};

type Translate = (message: string) => string;

export const getSubmitDisabledTooltip = (reports: ReportIndexItem[], t: Translate): string | undefined => {
  if (reports.length === 0 || reports.every(isReportSubmittable)) return undefined;

  if (reports.length === 1) {
    switch (getReportSubmitBlockingReason(reports[0])) {
      case "approved":
        return t("This report has already been approved");
      case "pending-approval":
        return reports[0].nothingToReport
          ? t('This report has been marked as "Nothing to Report" and has already been submitted for review')
          : t("This report has already been submitted for review");
      case "incomplete":
        return t("One or more selected reports are incomplete. Please complete the required fields before submitting");
      default:
        return t(
          "One or more selected reports can't be submitted because they are already approved, pending approval, or incomplete"
        );
    }
  }

  return t(
    "One or more selected reports can't be submitted because they are already approved, pending approval, or incomplete"
  );
};

export const isReportNothingToReportEligible = (report: ReportIndexItem) => {
  if (report.nothingToReport) return false;
  if (!NOTHING_TO_REPORT_TYPES.has(report.type)) return false;
  return NOTHING_TO_REPORT_STATUSES.has(report.status);
};

export type ReportNothingToReportBlockingReason =
  | "already-nothing-to-report"
  | "approved"
  | "pending-approval"
  | "ineligible";

export const getReportNothingToReportBlockingReason = (
  report: ReportIndexItem
): ReportNothingToReportBlockingReason | null => {
  if (isReportNothingToReportEligible(report)) return null;
  if (report.nothingToReport) return "already-nothing-to-report";
  if (report.status === "approved") return "approved";
  if (report.status === "pending-approval") return "pending-approval";
  return "ineligible";
};

export const getNothingToReportDisabledTooltip = (reports: ReportIndexItem[], t: Translate): string | undefined => {
  if (reports.length === 0 || reports.every(isReportNothingToReportEligible)) return undefined;

  if (reports.length === 1) {
    switch (getReportNothingToReportBlockingReason(reports[0])) {
      case "already-nothing-to-report":
        return t('This report has already been marked as "Nothing to Report"');
      case "pending-approval":
        return t('This report has already been submitted for review and can\'t be marked as "Nothing to Report"');
      case "approved":
        return t('This report has already been approved and can\'t be marked as "Nothing to Report"');
      default:
        return t(
          "One or more selected reports have already been submitted or approved. Deselect those reports to continue"
        );
    }
  }

  return t("One or more selected reports have already been submitted or approved. Deselect those reports to continue");
};

export const groupReportUuidsByEntity = (reports: ReportIndexItem[]): Partial<Record<ReportsIndexEntity, string[]>> =>
  reports.reduce<Partial<Record<ReportsIndexEntity, string[]>>>((grouped, report) => {
    const entity = REPORT_INDEX_TYPE_TO_ENTITY[report.type];
    grouped[entity] = [...(grouped[entity] ?? []), report.id];
    return grouped;
  }, {});

const REPORT_STATUS_SORT_ORDER: Record<string, number> = {
  due: 0,
  draft: 1,
  "pending-approval": 2,
  "pending-approval-neutral": 2,
  "information-required": 3,
  "nothing-reported": 4,
  approved: 5
};

const REPORT_TYPE_SORT_ORDER: Record<string, number> = {
  "project-report": 0,
  "site-report": 1,
  "nursery-report": 2
};

export const getReportStatusSortValue = (status: string) => REPORT_STATUS_SORT_ORDER[status] ?? Number.MAX_SAFE_INTEGER;

export const getReportTypeSortValue = (type: string) => REPORT_TYPE_SORT_ORDER[type] ?? Number.MAX_SAFE_INTEGER;

const REPORTS_INDEX_RESTORE_KEY = "terramatch.reportsIndex.restore";

export type ReportsIndexRestoreState = {
  indexHref: string;
  reportId: string;
  // Allows the "All Projects" view to open the report's project before its reports are loaded.
  projectUuid?: string;
};

export type ProgressReportRestoreLocation = {
  sectionId: string;
  periodId: string;
};

export type AdditionalReportRestoreLocation = {
  sectionId: string;
  groupId: string;
};

const isRestoreState = (value: unknown): value is ReportsIndexRestoreState => {
  if (value == null || typeof value !== "object") return false;
  const candidate = value as ReportsIndexRestoreState;
  return typeof candidate.indexHref === "string" && typeof candidate.reportId === "string";
};

export const rememberReportsIndexPosition = (indexHref: string | undefined, reportId: string, projectUuid?: string) => {
  if (typeof window === "undefined" || indexHref == null || indexHref === "") return;
  const state: ReportsIndexRestoreState = { indexHref, reportId, projectUuid };
  sessionStorage.setItem(REPORTS_INDEX_RESTORE_KEY, JSON.stringify(state));
};

export const readReportsIndexRestore = (indexHref: string): ReportsIndexRestoreState | null => {
  if (typeof window === "undefined" || indexHref === "") return null;
  const raw = sessionStorage.getItem(REPORTS_INDEX_RESTORE_KEY);
  if (raw == null) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRestoreState(parsed) || parsed.indexHref !== indexHref) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const clearReportsIndexRestore = () => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(REPORTS_INDEX_RESTORE_KEY);
};

export const findProgressReportLocation = (
  sections: ReportsIndexProjectSection[],
  reportId: string
): ProgressReportRestoreLocation | null => {
  for (const section of sections) {
    for (const period of section.periods) {
      if (period.reports.some(report => report.id === reportId)) {
        return { sectionId: section.id, periodId: period.id };
      }
    }
  }
  return null;
};

export const collectAdditionalReports = (section: AdditionalReportsEntitySection): AdditionalReport[] => [
  ...section.groups.flatMap(group => group.reports),
  ...(section.children ?? []).flatMap(collectAdditionalReports)
];

export const findAdditionalReportLocation = (
  sections: AdditionalReportsEntitySection[],
  reportId: string
): AdditionalReportRestoreLocation | null => {
  for (const section of sections) {
    for (const group of section.groups) {
      if (group.reports.some(report => report.id === reportId)) {
        return { sectionId: section.id, groupId: group.id };
      }
    }
    const nested = findAdditionalReportLocation(section.children ?? [], reportId);
    if (nested != null) return nested;
  }
  return null;
};
