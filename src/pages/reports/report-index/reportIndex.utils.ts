export const REPORTS_INDEX_SOURCES = ["project", "site", "nursery"] as const;

export type ReportsIndexSource = (typeof REPORTS_INDEX_SOURCES)[number];

export const isReportsIndexSource = (value: string | undefined): value is ReportsIndexSource =>
  REPORTS_INDEX_SOURCES.some(source => source === value);

export const getReportsIndexUrl = (source: ReportsIndexSource, uuid: string) =>
  `/reports/report-index?source=${source}&uuid=${encodeURIComponent(uuid)}`;
