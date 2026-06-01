export const PROJECT_POLYGON_HANDOFF_AUDIT_TYPES = ["polygon-data-submission", "ready-for-baseline"];

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

export function getPolygonSubmissionStatusLabel(
  value: PolygonDataSubmissionOption | string | null | undefined
): string {
  if (value != null && isPolygonDataSubmissionOption(value)) {
    return POLYGON_SUBMISSION_STATUS_LABELS[value];
  }

  return "-";
}
