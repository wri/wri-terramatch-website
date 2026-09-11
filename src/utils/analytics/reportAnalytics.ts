import { FormModelType } from "@/connections/Form";
import { FormFieldsProvider } from "@/context/wizardForm.provider";
import { EntityName } from "@/types/common";
import { ReportEventName, trackReportEvent } from "@/utils/ga4";

import { PageContext } from "./pageContext";

export type ReportEntityType = "project-report" | "site-report" | "nursery-report" | "financial-report";
export type ReportUserRole = "admin" | "project-developer";

export type { PageContext };
export {
  ACCORDION_CONTEXT_REPORT_DETAILS,
  ACCORDION_CONTEXT_REPORTING_PERIOD_GROUP,
  PAGE_CONTEXT_REPORT_OVERVIEW,
  PAGE_CONTEXT_REPORTS_INDEX,
  REPORT_OPENED_ENTRY_POINT_INDEX_ROW_ACTION
} from "./pageContext";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const REPORT_MODEL_TYPES: Partial<Record<FormModelType, ReportEntityType>> = {
  projectReports: "project-report",
  siteReports: "site-report",
  nurseryReports: "nursery-report",
  financialReports: "financial-report"
};

const REPORT_ENTITY_NAMES: Partial<Record<EntityName, ReportEntityType>> = {
  "project-reports": "project-report",
  "site-reports": "site-report",
  "nursery-reports": "nursery-report",
  "financial-reports": "financial-report"
};

const ADMIN_REPORT_RESOURCES: Record<string, ReportEntityType> = {
  projectReport: "project-report",
  siteReport: "site-report",
  nurseryReport: "nursery-report",
  financialReport: "financial-report"
};

export const resolveReportEntityTypeFromAdminResource = (resource?: string | null): ReportEntityType | null => {
  if (resource == null) return null;
  return ADMIN_REPORT_RESOURCES[resource] ?? null;
};

export const resolveReportEntityType = (model?: FormModelType | null): ReportEntityType | null => {
  if (model == null) return null;
  return REPORT_MODEL_TYPES[model] ?? null;
};

export const resolveReportEntityTypeFromEntityName = (entityName?: EntityName | null): ReportEntityType | null => {
  if (entityName == null) return null;
  return REPORT_ENTITY_NAMES[entityName] ?? null;
};

export const getAnalyticsUserRole = (): ReportUserRole => {
  if (typeof window === "undefined") return "project-developer";

  const href = window.location.href;
  return href.includes("/admin/") || href.includes("/admin#") ? "admin" : "project-developer";
};

export const isReportReopenedStatus = (status?: string | null): boolean =>
  status === "draft" || status === "information-required";

const isUuid = (value: string): boolean => UUID_PATTERN.test(value);

export const resolveReportSectionName = (fieldsProvider: FormFieldsProvider, stepId: string): string => {
  const title = fieldsProvider.step(stepId)?.title?.trim();
  if (title == null || title === "" || isUuid(title)) return "";
  return title;
};

type ReportAnalyticsContext = {
  entityType: ReportEntityType;
  entityId: string;
  userRole?: ReportUserRole;
};

const getReportAnalyticsContext = ({ entityType, entityId, userRole }: ReportAnalyticsContext) => ({
  entity_type: entityType,
  entity_id: entityId,
  ...(userRole != null ? { user_role: userRole } : {})
});

export const trackReportAnalyticsEvent = (
  eventName: ReportEventName,
  params: ReportAnalyticsContext & Record<string, string | number | boolean | null | undefined>
): void => {
  const { entityType, entityId, userRole, ...rest } = params;
  if (entityId == null || entityId === "") return;

  const optionalParams = Object.fromEntries(
    Object.entries(rest).filter(([, value]) => value != null && value !== "")
  ) as Record<string, string | number | boolean>;

  trackReportEvent(eventName, {
    ...getReportAnalyticsContext({ entityType, entityId, userRole }),
    ...optionalParams
  });
};
