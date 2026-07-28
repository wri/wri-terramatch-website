export const PROJECT_POLYGON_HANDOFF_AUDIT_TYPES = [
  "polygon-data-submission",
  "ready-for-baseline",
  "project-qa-status-1",
  "project-qa-status-2",
  "project-qa-status-3",
  "project-qa-status-4",
  "project-qa-status-5"
] as const;

export type ProjectPolygonHandoffAuditType = (typeof PROJECT_POLYGON_HANDOFF_AUDIT_TYPES)[number];

export const PROJECT_QA_STATUS_AUDIT_TYPES = [
  "project-qa-status-1",
  "project-qa-status-2",
  "project-qa-status-3",
  "project-qa-status-4",
  "project-qa-status-5"
] as const;

export type ProjectQaStatusAuditType = (typeof PROJECT_QA_STATUS_AUDIT_TYPES)[number];

export function isProjectQaStatusAuditType(value: string): value is ProjectQaStatusAuditType {
  return (PROJECT_QA_STATUS_AUDIT_TYPES as readonly string[]).includes(value);
}

export function getProjectQaStatusNumberFromAuditType(type: ProjectQaStatusAuditType): 1 | 2 | 3 | 4 | 5 {
  return Number(type.replace("project-qa-status-", "")) as 1 | 2 | 3 | 4 | 5;
}

export const POLYGON_DATA_SUBMISSION_OPTION_VALUES = [
  "no-polygons-submitted",
  "not-applicable",
  "polygons-partially-submitted",
  "all-polygons-received"
] as const;

export type PolygonDataSubmissionOption = (typeof POLYGON_DATA_SUBMISSION_OPTION_VALUES)[number];

export const POLYGON_SUBMISSION_STATUS_LABELS: Record<PolygonDataSubmissionOption, string> = {
  "no-polygons-submitted": "No polygons submitted",
  "not-applicable": "Not applicable",
  "polygons-partially-submitted": "Polygons partially submitted",
  "all-polygons-received": "All polygons submitted"
};

export function isPolygonDataSubmissionOption(value: string): value is PolygonDataSubmissionOption {
  return (POLYGON_DATA_SUBMISSION_OPTION_VALUES as readonly string[]).includes(value);
}

export const PROJECT_QA_STATUS_OPTION_VALUES = [
  "no-data-submitted",
  "no-data-expected",
  "qa-in-progress",
  "qa-completed"
] as const;

export type ProjectQaStatusOption = (typeof PROJECT_QA_STATUS_OPTION_VALUES)[number];

export const PROJECT_QA_STATUS_FIELDS = [
  "projectQaStatus1",
  "projectQaStatus2",
  "projectQaStatus3",
  "projectQaStatus4",
  "projectQaStatus5"
] as const;

export type ProjectQaStatusField = (typeof PROJECT_QA_STATUS_FIELDS)[number];

export const PROJECT_QA_STATUS_LABELS: Record<ProjectQaStatusOption, string> = {
  "no-data-submitted": "No data submitted",
  "no-data-expected": "No data expected",
  "qa-in-progress": "QA in progress",
  "qa-completed": "QA completed"
};

export function isProjectQaStatusOption(value: string): value is ProjectQaStatusOption {
  return (PROJECT_QA_STATUS_OPTION_VALUES as readonly string[]).includes(value);
}
