import { useEffect, useMemo, useState } from "react";

import { projectReportsMetaIndexConnection, useReportCounts } from "@/connections/Entity";
import { ReportsFilterValues, useReportsContext } from "@/context/reports.provider";
import { ReportCountsGetQueryParams } from "@/generated/v3/entityService/entityServiceComponents";
import { useAllPages } from "@/hooks/useConnection";
import { useDebounce } from "@/hooks/useDebounce";

import { isProgressReportType } from "./components/reportFilter.constants";
import { REPORT_INDEX_TYPE_TO_ENTITY } from "./reportIndex.utils";
import { getDueDateQuery, getDueReportingPeriod } from "./reportPeriodFilter";

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
 * Loads the per-project report meta and the total report count for the "All Projects" view. The
 * reports themselves are only loaded (via useReportsIndexData) once a given project is opened.
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
  const [metasLoaded, metas, metaFailure] = useAllPages(projectReportsMetaIndexConnection, {
    filter: reportsQuery,
    enabled
  });
  const [, { data: reportCounts }] = useReportCounts(reportsQuery, enabled);
  const reportingPeriods = useMemo(
    () => (reportCounts?.reportingPeriods ?? []).map(getDueReportingPeriod),
    [reportCounts?.reportingPeriods]
  );

  return {
    loading: !metasLoaded,
    metas,
    error: metaFailure != null,
    reportCount: reportCounts?.totalReports ?? 0,
    reportingPeriods
  };
};
