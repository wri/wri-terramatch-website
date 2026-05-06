/** Comma-separated value for GET auditStatuses ?types= (TM-3300). */
export const PROJECT_POLYGON_HANDOFF_AUDIT_TYPES = "polygon-data-submission,ready-for-baseline" as const;

export const POLYGON_DATA_SUBMISSION_OPTION_VALUES = [
  "no-polygons-submitted",
  "not-applicable",
  "polygons-partially-submitted",
  "all-polygons-received"
] as const;

export type PolygonDataSubmissionOption = (typeof POLYGON_DATA_SUBMISSION_OPTION_VALUES)[number];
