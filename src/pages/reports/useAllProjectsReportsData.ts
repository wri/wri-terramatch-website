import { useEffect, useMemo, useState } from "react";

import { projectReportsMetaIndexConnection, useReportCounts } from "@/connections/Entity";
import { ReportsFilterValues, useReportsContext } from "@/context/reports.provider";
import { ReportCountsGetQueryParams } from "@/generated/v3/entityService/entityServiceComponents";
import { useInfinitePages } from "@/hooks/useConnection";
import { useDebounce } from "@/hooks/useDebounce";

import { isProgressReportType } from "./components/reportFilter.constants";
import { REPORT_INDEX_TYPE_TO_ENTITY } from "./reportIndex.utils";
import { getDueDateQuery, getDueReportingPeriod } from "./reportPeriodFilter";

const PROJECTS_PAGE_SIZE = 20;

type ReportStatus = NonNullable<ReportCountsGetQueryParams["statuses"]>[number];
const REPORT_STATUSES: string[] = [
  "approved",
  "draft",
  "due",
  "information-required",
  "pending-approval"
] satisfies ReportStatus[];
const isReportStatus = (status: string): status is ReportStatus => REPORT_STATUSES.includes(status);

const toReportsQuery = ({
  reportTypes,
  statuses,
  dueDateFrom,
  dueDateTo,
  dueMonth,
  dueYear
}: ReportsFilterValues): ReportCountsGetQueryParams => ({
  reportTypes:
    reportTypes.length === 0
      ? undefined
      : reportTypes.filter(isProgressReportType).map(type => REPORT_INDEX_TYPE_TO_ENTITY[type]),
  statuses: statuses.length === 0 ? undefined : statuses.filter(isReportStatus),
  dueDateFrom: dueDateFrom === "" ? undefined : dueDateFrom,
  dueDateTo: dueDateTo === "" ? undefined : dueDateTo,
  ...getDueDateQuery(dueMonth, dueYear)
});

type AllProjectsReportsDataArgs = {
  query: string;
  enabled: boolean;
};

/**
 * Loads the per-project report meta (a page at a time, for infinite scroll) and the total report
 * count for the "All Projects" view. The reports themselves are only loaded (via
 * useReportsIndexData) once a given project is opened.
 */
export const useAllProjectsReportsData = ({ query, enabled }: AllProjectsReportsDataArgs) => {
  const { filters } = useReportsContext();
  const [search, setSearch] = useState("");
  const updateSearch = useDebounce(setSearch);
  useEffect(() => updateSearch(query.trim()), [query, updateSearch]);

  const reportsQuery = useMemo(
    () => ({ ...toReportsQuery(filters), search: search === "" ? undefined : search }),
    [filters, search]
  );
  const {
    loaded: metasLoaded,
    data: metas,
    loadFailure: metaFailure,
    hasMore,
    loadingMore,
    loadMore
  } = useInfinitePages(projectReportsMetaIndexConnection, { filter: reportsQuery, enabled }, PROJECTS_PAGE_SIZE);
  const [, { data: loadedReportCounts }] = useReportCounts(reportsQuery, enabled);
  // Keep showing the last counts while they're refetched (e.g. after a bulk action).
  const [lastReportCounts, setLastReportCounts] = useState(loadedReportCounts);
  useEffect(() => {
    if (loadedReportCounts != null) setLastReportCounts(loadedReportCounts);
  }, [loadedReportCounts]);
  const reportCounts = loadedReportCounts ?? lastReportCounts;
  const reportingPeriods = useMemo(
    () => (reportCounts?.reportingPeriods ?? []).map(getDueReportingPeriod),
    [reportCounts?.reportingPeriods]
  );

  return {
    loading: !metasLoaded,
    metas,
    error: metaFailure != null,
    hasMore,
    loadingMore,
    loadMore,
    reportCount: reportCounts?.totalReports ?? 0,
    reportingPeriods
  };
};
