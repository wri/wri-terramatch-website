import { useMemo } from "react";

import { ReportsFilterValues, useReportsContext } from "@/context/reports.provider";

import {
  AdditionalReport,
  AdditionalReportsEntitySection,
  ReportsIndexPeriod,
  ReportsIndexReport
} from "./reportIndex.types";

type ReportFilterCriteria = {
  query: string;
  reportTypes: string[];
  statuses: string[];
  dueDate: string;
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

const matchesDueDate = (dueAt: string | null | undefined, dueDate: string) => {
  if (dueDate === "") return true;
  return (dueAt?.slice(0, 10) ?? "") === dueDate;
};

const toFilterCriteria = (query: string, filters: ReportsFilterValues): ReportFilterCriteria => ({
  query: query.trim().toLocaleLowerCase(),
  reportTypes: filters.reportTypes,
  statuses: filters.statuses,
  dueDate: filters.dueDate
});

const matchesProgressReport = (report: ReportsIndexReport, criteria: ReportFilterCriteria) => {
  if (!matchesSearchQuery([report.name, report.type, report.sourceName, report.projectName], criteria.query)) {
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
  return matchesDueDate(reportDate, criteria.dueDate);
};

export const filterProgressPeriods = (periods: ReportsIndexPeriod[], criteria: ReportFilterCriteria) =>
  periods
    .map(period => ({
      ...period,
      reports: period.reports.filter(report => matchesProgressReport(report, criteria))
    }))
    .filter(period => {
      if (period.reports.length === 0) return false;
      return matchesDueDate(period.task.dueAt, criteria.dueDate);
    });

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
  periods: ReportsIndexPeriod[];
  additionalSections: AdditionalReportsEntitySection[];
  query: string;
};

export const useReportsIndexFilters = ({ periods, additionalSections, query }: UseReportsIndexFiltersArgs) => {
  const { filters } = useReportsContext();
  const criteria = useMemo(() => toFilterCriteria(query, filters), [query, filters]);

  const filteredPeriods = useMemo(() => filterProgressPeriods(periods, criteria), [periods, criteria]);

  const filteredAdditionalSections = useMemo(
    () => filterAdditionalSections(additionalSections, criteria),
    [additionalSections, criteria]
  );

  const progressReportCount = useMemo(
    () => filteredPeriods.reduce((total, period) => total + period.reports.length, 0),
    [filteredPeriods]
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
    filteredPeriods,
    filteredAdditionalSections,
    progressReportCount,
    additionalReportCount
  };
};
