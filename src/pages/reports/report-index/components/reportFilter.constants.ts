export type ReportTypeOption =
  | "project-report"
  | "site-report"
  | "nursery-report"
  | "disturbance-report"
  | "srp-report"
  | "financial-report";

export type ReportFilterState = {
  reportTypes: ReportTypeOption[];
  statuses: string[];
  dueDateFrom: string;
  dueDateTo: string;
  dueMonth: string;
  dueYear: string;
};

export const EMPTY_REPORT_FILTERS: ReportFilterState = {
  reportTypes: [],
  statuses: [],
  dueDateFrom: "",
  dueDateTo: "",
  dueMonth: "",
  dueYear: ""
};

export const getDefaultProgressFiltersForSource = (source: "project" | "site" | "nursery"): ReportFilterState => {
  if (source === "site") {
    return { ...EMPTY_REPORT_FILTERS, reportTypes: ["site-report"] };
  }
  if (source === "nursery") {
    return { ...EMPTY_REPORT_FILTERS, reportTypes: ["nursery-report"] };
  }
  return EMPTY_REPORT_FILTERS;
};

export const isProgressReportType = (value: string | undefined): value is ReportTypeOption =>
  value === "project-report" || value === "site-report" || value === "nursery-report";

export const getInitialProgressFilters = (
  source: "project" | "site" | "nursery",
  reportType?: string
): ReportFilterState => {
  if (isProgressReportType(reportType)) {
    return { ...EMPTY_REPORT_FILTERS, reportTypes: [reportType] };
  }
  return getDefaultProgressFiltersForSource(source);
};

export const formatDueDateRangeLabel = (from: string, to: string) => {
  if (from !== "" && to !== "") return `${from} — ${to}`;
  return from !== "" ? from : to;
};

/**
 * Which time period control the filters offer. Progress reports are filed on a fixed set of
 * reporting months, so they refine by month and/or year. Annual SRP and financial reports only report
 * on a year. Disturbances happen on an arbitrary date, so they keep the range picker.
 */
export type ReportPeriodControl = "month-year" | "year" | "date-range";

export const getReportPeriodControl = (activeTab: string, reportTypes: ReportTypeOption[]): ReportPeriodControl => {
  if (reportTypes.includes("disturbance-report")) return "date-range";
  return activeTab === "additional-reports" ? "year" : "month-year";
};

export const clearReportPeriodFilters = (filters: ReportFilterState): ReportFilterState => ({
  ...filters,
  dueDateFrom: "",
  dueDateTo: "",
  dueMonth: "",
  dueYear: ""
});

type DateFormatter = (date?: string | number | Date | null, pattern?: string) => string;

export const formatMonthLabel = (month: string, format: DateFormatter) =>
  format(new Date(2000, Number(month) - 1, 1), "LLLL");

export const formatReportPeriodLabel = (filters: ReportFilterState, format: DateFormatter): string | undefined => {
  if (filters.dueMonth !== "" && filters.dueYear !== "") {
    return `${formatMonthLabel(filters.dueMonth, format)} ${filters.dueYear}`;
  }
  if (filters.dueMonth !== "") return formatMonthLabel(filters.dueMonth, format);
  if (filters.dueYear !== "") return filters.dueYear;
  if (filters.dueDateFrom !== "" || filters.dueDateTo !== "") {
    return formatDueDateRangeLabel(filters.dueDateFrom, filters.dueDateTo);
  }
  return undefined;
};

export const PROGRESS_REPORT_TYPE_OPTIONS: { value: ReportTypeOption; label: string }[] = [
  { value: "project-report", label: "Project Reports" },
  { value: "site-report", label: "Site Reports" },
  { value: "nursery-report", label: "Nursery Reports" }
];

export const ADDITIONAL_REPORT_TYPE_OPTIONS: { value: ReportTypeOption; label: string }[] = [
  { value: "srp-report", label: "Annual SRP" },
  { value: "disturbance-report", label: "Disturbance Reports" },
  { value: "financial-report", label: "Financial Reports" }
];

export const REPORT_TYPE_LABELS: Record<ReportTypeOption, string> = {
  "project-report": "Project Reports",
  "site-report": "Site Reports",
  "nursery-report": "Nursery Reports",
  "disturbance-report": "Disturbance Reports",
  "srp-report": "Annual Reports",
  "financial-report": "Financial Reports"
};
