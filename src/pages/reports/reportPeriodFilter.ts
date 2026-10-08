import { ReportingPeriodDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { isNotNull } from "@/utils/array";

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

/** The reporting period a report is for ends the month before the report is due. */
export const getDueReportingPeriod = ({ dueYear, dueMonth }: ReportingPeriodDto): ReportPeriod =>
  dueMonth === 1 ? { month: "12", year: String(dueYear - 1) } : { month: String(dueMonth - 1), year: String(dueYear) };

export const getReportingPeriod = (dueAt: string | null | undefined): ReportPeriod | undefined => {
  const year = getIsoYear(dueAt);
  const month = getIsoMonth(dueAt);
  if (year == null || month == null) return undefined;

  return getDueReportingPeriod({ dueYear: Number(year), dueMonth: Number(month) });
};

export const getSectionReportingPeriods = (sections: ReportsIndexProjectSection[]): ReportPeriod[] =>
  sections.flatMap(({ periods }) => periods.map(({ dueAt }) => getReportingPeriod(dueAt))).filter(isNotNull);

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
  progressPeriods: ReportPeriod[],
  additionalSections: AdditionalReportsEntitySection[]
): ReportPeriodOptions => {
  const currentYear = String(new Date().getFullYear());
  const progressMonths = new Set<string>();
  const progressYears = new Set<string>([currentYear]);
  const additionalYears = new Set<string>([currentYear]);

  progressPeriods.forEach(({ month, year }) => {
    progressMonths.add(month);
    progressYears.add(year);
  });

  const collectAdditionalYears = (section: AdditionalReportsEntitySection) => {
    section.groups.forEach(group =>
      group.reports.forEach(report => {
        const year = getAdditionalReportYear(report);
        if (year != null) additionalYears.add(year);
      })
    );
    section.children?.forEach(collectAdditionalYears);
  };
  additionalSections.forEach(collectAdditionalYears);

  return {
    progressMonths: Array.from(progressMonths).sort(byMonthAscending),
    progressYears: Array.from(progressYears).sort(byYearDescending),
    additionalYears: Array.from(additionalYears).sort(byYearDescending)
  };
};

/**
 * The inverse of getReportingPeriod: converts a reporting period month / year refinement into the
 * due date query params the BE filters on. A reporting period's reports are due the month after it.
 */
export const getDueDateQuery = (month: string, year: string) => {
  if (month === "") {
    return year === "" ? {} : { dueDateFrom: `${year}-02-01`, dueDateTo: `${Number(year) + 1}-01-31` };
  }

  const dueMonth = (Number(month) % 12) + 1;
  if (year === "") return { dueMonth };
  return { dueMonth, dueYear: dueMonth === 1 ? Number(year) + 1 : Number(year) };
};
