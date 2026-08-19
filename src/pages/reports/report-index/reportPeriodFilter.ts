import { AdditionalReport, AdditionalReportsEntitySection, ReportsIndexProjectSection } from "./reportIndex.types";

const ISO_YEAR = /^\d{4}$/;

/** Due dates are read as plain ISO text so a timezone shift can never move a report a month over. */
export const getIsoYear = (value: string | null | undefined): string | undefined => {
  const year = value?.slice(0, 4);
  return year != null && ISO_YEAR.test(year) ? year : undefined;
};

export const getIsoMonth = (value: string | null | undefined): string | undefined => {
  if (getIsoYear(value) == null) return undefined;
  const month = Number(value?.slice(5, 7));
  return month >= 1 && month <= 12 ? String(month) : undefined;
};

export type ReportPeriod = { month: string; year: string };

export const getReportingPeriod = (dueAt: string | null | undefined): ReportPeriod | undefined => {
  const year = getIsoYear(dueAt);
  const month = getIsoMonth(dueAt);
  if (year == null || month == null) return undefined;

  const monthNumber = Number(month);
  return monthNumber === 1 ? { month: "12", year: String(Number(year) - 1) } : { month: String(monthNumber - 1), year };
};

/** Disturbance reports are dated by when the disturbance started, the rest by their due date. */
export const getAdditionalReportDate = (report: AdditionalReport) =>
  report.type === "disturbance-report" ? report.dateOfDisturbance : report.dueAt;

/** SRP and financial reports carry the year they report on, which is the year the filter refines. */
export const getAdditionalReportYear = (report: AdditionalReport) =>
  report.year ?? getIsoYear(getAdditionalReportDate(report));

export type ReportPeriodOptions = {
  progressMonths: string[];
  progressYears: string[];
  additionalYears: string[];
};

export const EMPTY_REPORT_PERIOD_OPTIONS: ReportPeriodOptions = {
  progressMonths: [],
  progressYears: [],
  additionalYears: []
};

const byMonthAscending = (a: string, b: string) => Number(a) - Number(b);
const byYearDescending = (a: string, b: string) => Number(b) - Number(a);

/**
 * The months and years the loaded reports can be refined by. Progress months and years come from
 * the reporting periods a project actually reports on (two a year on most frameworks) so they line
 * up with the labels on the rows; months are in calendar order and years newest first, with the
 * current year always present so it heads the list even before anything has been reported yet.
 */
export const getReportPeriodOptions = (
  progressSections: ReportsIndexProjectSection[],
  additionalSections: AdditionalReportsEntitySection[]
): ReportPeriodOptions => {
  const currentYear = String(new Date().getFullYear());
  const progressMonths = new Set<string>();
  const progressYears = new Set<string>([currentYear]);
  const additionalYears = new Set<string>([currentYear]);

  progressSections.forEach(section =>
    section.periods.forEach(period => {
      const reportingPeriod = getReportingPeriod(period.dueAt);
      if (reportingPeriod == null) return;
      progressMonths.add(reportingPeriod.month);
      progressYears.add(reportingPeriod.year);
    })
  );

  additionalSections.forEach(section =>
    section.groups.forEach(group =>
      group.reports.forEach(report => {
        const year = getAdditionalReportYear(report);
        if (year != null) additionalYears.add(year);
      })
    )
  );

  return {
    progressMonths: Array.from(progressMonths).sort(byMonthAscending),
    progressYears: Array.from(progressYears).sort(byYearDescending),
    additionalYears: Array.from(additionalYears).sort(byYearDescending)
  };
};
