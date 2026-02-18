/**
 * Utils for ReportsCard transformation logic (TM-2947).
 * Extracted for testability and separation of concerns.
 */
import { ActionDto } from "@/generated/v3/userService/userServiceSchemas";
import { getEntityCombinedStatus } from "@/helpers/entity";

/** Statuses that qualify a report for display on the homepage (TM-2947) */
export const DISPLAYABLE_REPORT_STATUSES = [
  "due",
  "started",
  "needs-more-information",
  "requires-more-information"
] as const;

export type ReportActionTarget = {
  uuid?: string;
  dueAt?: string | null;
  updatedAt?: string;
  status?: string;
  update_request_status?: string;
  project?: { uuid?: string; name?: string };
  projectUuid?: string;
  site?: { name?: string; project?: { uuid?: string } };
  task?: { uuid?: string };
  taskUuid?: string;
  nursery?: { name?: string };
  projectName?: string;
};

export function isDisplayableStatus(status: string | null | undefined): boolean {
  if (!status) return false;
  return DISPLAYABLE_REPORT_STATUSES.some(s => status.includes(s));
}

export function getProjectUuid(target: ReportActionTarget): string | undefined {
  return target?.project?.uuid ?? target?.projectUuid ?? target?.site?.project?.uuid;
}

export function getTaskUuid(target: ReportActionTarget): string | undefined {
  return target?.task?.uuid ?? target?.taskUuid;
}

export function getProjectName(target: ReportActionTarget): string | undefined {
  return target?.project?.name ?? target?.projectName;
}

/** Filters actions to only those with displayable report status */
export function filterDisplayableReportActions(actions: ActionDto[]): ActionDto[] {
  return actions.filter((action: ActionDto) => {
    if (action.target == null) return false;
    const target = action.target as ReportActionTarget;
    const status = getEntityCombinedStatus(target);
    return isDisplayableStatus(status);
  });
}

/** Groups site and nursery report actions by task UUID. Keys are task UUIDs. */
export function groupSiteAndNurseryReportsByTask(actions: ActionDto[]) {
  const map = new Map<string, { siteReports: ActionDto[]; nurseryReports: ActionDto[] }>();

  actions
    .filter((a: ActionDto) => a.targetableType === "siteReports")
    .forEach((action: ActionDto) => {
      const target = action.target as ReportActionTarget;
      const taskUuid = getTaskUuid(target);
      if (!taskUuid) return;

      const existing = map.get(taskUuid) ?? { siteReports: [] as ActionDto[], nurseryReports: [] as ActionDto[] };
      existing.siteReports.push(action);
      map.set(taskUuid, existing);
    });

  actions
    .filter((a: ActionDto) => a.targetableType === "nurseryReports")
    .forEach((action: ActionDto) => {
      const target = action.target as ReportActionTarget;
      const taskUuid = getTaskUuid(target);
      if (!taskUuid) return;

      const existing = map.get(taskUuid) ?? { siteReports: [] as ActionDto[], nurseryReports: [] as ActionDto[] };
      existing.nurseryReports.push(action);
      map.set(taskUuid, existing);
    });

  return map;
}
