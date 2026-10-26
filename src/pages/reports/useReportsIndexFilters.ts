import { useMemo } from "react";

import { ReportsFilterValues, useReportsContext } from "@/context/reports.provider";

import {
  AdditionalReport,
  AdditionalReportsEntitySection,
  ReportsIndexPeriod,
  ReportsIndexProjectSection,
  ReportsIndexReport
} from "./reportIndex.types";
import {
  getAdditionalReportDate,
  getAdditionalReportYear,
  getIsoMonth,
  getReportingPeriod,
  ReportPeriod
} from "./reportPeriodFilter";

type ReportFilterCriteria = {
  query: string;
  reportTypes: string[];
  reportTypesSpanSections: boolean;
  statuses: string[];
  updateStatuses: string[];
  dueDateFrom: string;
  dueDateTo: string;
  dueMonth: string;
  dueYear: string;
};

const ADDITIONAL_REPORT_TYPES: string[] = ["financial-report", "srp-report", "disturbance-report"];

const matchesSearchQuery = (values: Array<string | null | undefined>, query: string) => {
  if (query === "") return true;
  return values.some(value => value?.toLocaleLowerCase().includes(query));
};

const matchesStatuses = (
  report: { status: string; updateRequestStatus: string | null },
  { statuses, updateStatuses }: Pick<ReportFilterCriteria, "statuses" | "updateStatuses">
) => {
  if (statuses.length > 0 && !statuses.includes(report.status)) return false;
  if (
    updateStatuses.length > 0 &&
    (report.updateRequestStatus == null || !updateStatuses.includes(report.updateRequestStatus))
  ) {
    return false;
  }
  return true;
};

const matchesTypeAndStatus = (
  report: { type: string; status: string; updateRequestStatus: string | null },
  criteria: Pick<ReportFilterCriteria, "reportTypes" | "statuses" | "updateStatuses">
) => {
  if (criteria.reportTypes.length > 0 && !criteria.reportTypes.includes(report.type)) return false;
  return matchesStatuses(report, criteria);
};

const matchesDueDateRange = (dueAt: string | null | undefined, dueDateFrom: string, dueDateTo: string) => {
  if (dueDateFrom === "" && dueDateTo === "") return true;

  const date = dueAt?.slice(0, 10) ?? "";
  if (date === "") return false;
  if (dueDateFrom !== "" && date < dueDateFrom) return false;
  if (dueDateTo !== "" && date > dueDateTo) return false;
  return true;
};

const matchesReportPeriod = (
  date: string | null | undefined,
  period: Partial<ReportPeriod>,
  criteria: ReportFilterCriteria
) => {
  if (!matchesDueDateRange(date, criteria.dueDateFrom, criteria.dueDateTo)) return false;
  if (criteria.dueMonth !== "" && period.month !== criteria.dueMonth) return false;
  if (criteria.dueYear !== "" && period.year !== criteria.dueYear) return false;
  return true;
};

const toFilterCriteria = (
  query: string,
  filters: ReportsFilterValues,
  reportTypesSpanSections: boolean
): ReportFilterCriteria => ({
  query: query.trim().toLocaleLowerCase(),
  reportTypes: filters.reportTypes,
  reportTypesSpanSections,
  statuses: filters.statuses,
  updateStatuses: filters.updateStatuses,
  dueDateFrom: filters.dueDateFrom,
  dueDateTo: filters.dueDateTo,
  dueMonth: filters.dueMonth,
  dueYear: filters.dueYear
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
  if (!matchesStatuses(report, criteria)) return false;

  if (criteria.reportTypes.length > 0 && !criteria.reportTypes.includes(report.type)) {
    const hasAdditionalType = criteria.reportTypes.some(type => ADDITIONAL_REPORT_TYPES.includes(type));
    if (criteria.reportTypesSpanSections || hasAdditionalType) return false;
  }

  const hasPeriodFilter =
    criteria.dueDateFrom !== "" || criteria.dueDateTo !== "" || criteria.dueMonth !== "" || criteria.dueYear !== "";
  if (hasPeriodFilter) {
    const date = getAdditionalReportDate(report);
    return matchesReportPeriod(date, { month: getIsoMonth(date), year: getAdditionalReportYear(report) }, criteria);
  }

  return true;
};

export const filterProgressPeriods = (periods: ReportsIndexPeriod[], criteria: ReportFilterCriteria) =>
  periods
    .map(period => ({
      ...period,
      reports: period.reports.filter(report => matchesProgressReport(report, criteria))
    }))
    .filter(period => {
      if (period.reports.length === 0) return false;
      return matchesReportPeriod(period.dueAt, getReportingPeriod(period.dueAt) ?? {}, criteria);
    });

export const filterProgressSections = (sections: ReportsIndexProjectSection[], criteria: ReportFilterCriteria) =>
  sections
    .map(section => ({ ...section, periods: filterProgressPeriods(section.periods, criteria) }))
    .filter(section => section.periods.length > 0);

export const filterAdditionalSections = (
  sections: AdditionalReportsEntitySection[],
  criteria: ReportFilterCriteria
): AdditionalReportsEntitySection[] =>
  sections
    .map(section => {
      const children = filterAdditionalSections(section.children ?? [], criteria);
      const groups = section.groups
        .map(group => ({
          ...group,
          reports: group.reports.filter(report => matchesAdditionalReport(report, criteria))
        }))
        .filter(group => group.reports.length > 0);

      return { ...section, groups, children: children.length > 0 ? children : undefined };
    })
    .filter(section => section.groups.length > 0 || (section.children?.length ?? 0) > 0);

type UseReportsIndexFiltersArgs = {
  progressSections: ReportsIndexProjectSection[];
  additionalSections: AdditionalReportsEntitySection[];
  query: string;
  reportTypesSpanSections?: boolean;
};

export const useReportsIndexFilters = ({
  progressSections,
  additionalSections,
  query,
  reportTypesSpanSections = false
}: UseReportsIndexFiltersArgs) => {
  const { filters } = useReportsContext();
  const criteria = useMemo(
    () => toFilterCriteria(query, filters, reportTypesSpanSections),
    [query, filters, reportTypesSpanSections]
  );

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

  const additionalReportCount = useMemo(() => {
    const countSection = (section: AdditionalReportsEntitySection): number =>
      section.groups.reduce((groupTotal, group) => groupTotal + group.reports.length, 0) +
      (section.children ?? []).reduce((childTotal, child) => childTotal + countSection(child), 0);

    return filteredAdditionalSections.reduce((sectionTotal, section) => sectionTotal + countSection(section), 0);
  }, [filteredAdditionalSections]);

  return {
    filteredProgressSections,
    filteredAdditionalSections,
    progressReportCount,
    additionalReportCount
  };
};
