export type ReportTypeOption = "project-reports" | "site-reports" | "nursery-reports" | "disturbance-reports";

export type ReportFilterState = {
  reportTypes: ReportTypeOption[];
  statuses: string[];
  dueDateFrom: string;
  dueDateTo: string;
};

export const EMPTY_REPORT_FILTERS: ReportFilterState = {
  reportTypes: [],
  statuses: [],
  dueDateFrom: "",
  dueDateTo: ""
};

export const PROGRESS_REPORT_TYPE_OPTIONS: { value: ReportTypeOption; label: string }[] = [
  { value: "project-reports", label: "Project Reports" },
  { value: "site-reports", label: "Site Reports" },
  { value: "nursery-reports", label: "Nursery Reports" }
];

export const ADDITIONAL_REPORT_TYPE_OPTIONS: { value: ReportTypeOption; label: string }[] = [
  { value: "disturbance-reports", label: "Disturbance Reports" }
];

export const REPORT_TYPE_LABELS: Record<ReportTypeOption, string> = {
  "project-reports": "Project Reports",
  "site-reports": "Site Reports",
  "nursery-reports": "Nursery Reports",
  "disturbance-reports": "Disturbance Reports"
};
