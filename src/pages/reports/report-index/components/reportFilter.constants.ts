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
  dueDate: string;
};

export const EMPTY_REPORT_FILTERS: ReportFilterState = {
  reportTypes: [],
  statuses: [],
  dueDate: ""
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

export const PROGRESS_REPORT_TYPE_OPTIONS: { value: ReportTypeOption; label: string }[] = [
  { value: "project-report", label: "Project Reports" },
  { value: "site-report", label: "Site Reports" },
  { value: "nursery-report", label: "Nursery Reports" }
];

export const ADDITIONAL_REPORT_TYPE_OPTIONS: { value: ReportTypeOption; label: string }[] = [
  { value: "srp-report", label: "Annual Reports" },
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
