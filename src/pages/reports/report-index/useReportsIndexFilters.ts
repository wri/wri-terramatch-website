import { useMemo } from "react";

import { ReportsFilterValues, useReportsContext } from "@/context/reports.provider";

import {
  AdditionalReport,
  AdditionalReportsEntitySection,
  ReportsIndexPeriod,
  ReportsIndexProjectSection,
  ReportsIndexReport
} from "./reportIndex.types";

type ReportFilterCriteria = {
  query: string;
  reportTypes: string[];
  statuses: string[];
  dueDateFrom: string;
  dueDateTo: string;
};

const matchesSearchQuery = (values: Array<string | null | undefined>, query: string) => {
  if (query === "") return true;
  return values.some(value => value?.toLocaleLowerCase().includes(query));
};

const matchesTypeAndStatus = (
  report: { type: string; status: string },
  { reportTypes, statuses }: Pick<ReportFilterCriteria, "reportTypes" | "statuses">
) => {
  if (reportTypes.length > 0 && !reportTypes.includes(report.type)) return false;
  if (statuses.length > 0 && !statuses.includes(report.status)) return false;
  return true;
};

const matchesDueDateRange = (dueAt: string | null | undefined, dueDateFrom: string, dueDateTo: string) => {
  if (dueDateFrom === "" && dueDateTo === "") return true;

  const date = dueAt?.slice(0, 10) ?? "";
  if (date === "") return false;
  if (dueDateFrom !== "" && date < dueDateFrom) return false;
  if (dueDateTo !== "" && date > dueDateTo) return false;
  return true;
};

const toFilterCriteria = (query: string, filters: ReportsFilterValues): ReportFilterCriteria => ({
  query: query.trim().toLocaleLowerCase(),
  reportTypes: filters.reportTypes,
  statuses: filters.statuses,
  dueDateFrom: filters.dueDateFrom,
  dueDateTo: filters.dueDateTo
});

const matchesProgressReport = (report: ReportsIndexReport, criteria: ReportFilterCriteria) => {
  if (!matchesSearchQuery([report.name, report.type, report.projectName], criteria.query)) {
    return false;
  }
  return matchesTypeAndStatus(report, criteria);
};

const matchesAdditionalReport = (report: AdditionalReport, criteria: ReportFilterCriteria) => {
  if (
    !matchesSearchQuery(
      [report.name, report.type, report.status, report.organisationName, report.projectName, report.year],
      criteria.query
    )
  ) {
    return false;
  }
  if (!matchesTypeAndStatus(report, criteria)) return false;

  const reportDate = report.type === "disturbance-report" ? report.dateOfDisturbance : report.dueAt;
  return matchesDueDateRange(reportDate, criteria.dueDateFrom, criteria.dueDateTo);
};

export const filterProgressPeriods = (periods: ReportsIndexPeriod[], criteria: ReportFilterCriteria) =>
  periods
    .map(period => ({
      ...period,
      reports: period.reports.filter(report => matchesProgressReport(report, criteria))
    }))
    .filter(period => {
      if (period.reports.length === 0) return false;
      return matchesDueDateRange(period.dueAt, criteria.dueDateFrom, criteria.dueDateTo);
    });

export const filterProgressSections = (sections: ReportsIndexProjectSection[], criteria: ReportFilterCriteria) =>
  sections
    .map(section => ({ ...section, periods: filterProgressPeriods(section.periods, criteria) }))
    .filter(section => section.periods.length > 0);

export const filterAdditionalSections = (sections: AdditionalReportsEntitySection[], criteria: ReportFilterCriteria) =>
  sections
    .map(section => ({
      ...section,
      groups: section.groups
        .map(group => ({
          ...group,
          reports: group.reports.filter(report => matchesAdditionalReport(report, criteria))
        }))
        .filter(group => group.reports.length > 0)
    }))
    .filter(section => section.groups.length > 0);

type UseReportsIndexFiltersArgs = {
  progressSections: ReportsIndexProjectSection[];
  additionalSections: AdditionalReportsEntitySection[];
  query: string;
};

export const useReportsIndexFilters = ({ progressSections, additionalSections, query }: UseReportsIndexFiltersArgs) => {
  const { filters } = useReportsContext();
  const criteria = useMemo(() => toFilterCriteria(query, filters), [query, filters]);

  const filteredProgressSections = useMemo(
    () => filterProgressSections(progressSections, criteria),
    [progressSections, criteria]
  );

  const filteredAdditionalSections = useMemo(
    () => filterAdditionalSections(additionalSections, criteria),
    [additionalSections, criteria]
  );

  const progressReportCount = useMemo(
    () =>
      filteredProgressSections.reduce(
        (sectionTotal, section) =>
          sectionTotal + section.periods.reduce((periodTotal, period) => periodTotal + period.reports.length, 0),
        0
      ),
    [filteredProgressSections]
  );

  const additionalReportCount = useMemo(
    () =>
      filteredAdditionalSections.reduce(
        (sectionTotal, section) =>
          sectionTotal + section.groups.reduce((groupTotal, group) => groupTotal + group.reports.length, 0),
        0
      ),
    [filteredAdditionalSections]
  );

  return {
    filteredProgressSections,
    filteredAdditionalSections,
    progressReportCount,
    additionalReportCount
  };
};
