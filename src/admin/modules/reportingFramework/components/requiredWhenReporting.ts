const REPORT_FORM_SOURCES = [
  "projectReportFormUuid",
  "siteReportFormUuid",
  "nurseryReportFormUuid",
  "financialReportFormUuid",
  "disturbanceReportFormUuid"
] as const;

const hasValue = (value: unknown) => value != null && value !== "";

/**
 * A reporting framework may have no report forms at all (no reports are generated). If any report
 * form is set, the inputs using this validator are required.
 */
export const requiredWhenReporting = (value: unknown, allValues: Record<string, unknown>) =>
  !hasValue(value) && REPORT_FORM_SOURCES.some(source => hasValue(allValues[source]))
    ? "Required when any reporting form is set"
    : undefined;

export const REQUIRED_WHEN_REPORTING_HELPER_TEXT =
  "Required if any reporting form is set. Leave all reporting forms blank for a framework without reporting.";
