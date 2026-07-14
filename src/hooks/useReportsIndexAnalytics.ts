import { useCallback, useMemo } from "react";

import { ReportEntityType } from "@/utils/analytics/reportAnalytics";
import {
  IndexBulkActionType,
  IndexFilterField,
  IndexRowActionType,
  IndexSearchScope,
  IndexSortField,
  resolveIndexMixedEligibility,
  trackIndexBulkActionSubmitted,
  trackIndexFilterApplied,
  trackIndexRowActionClicked,
  trackIndexSearchUsed,
  trackIndexSelectionChanged,
  trackIndexSortApplied,
  trackReportsIndexAccordionExpanded,
  trackReportsIndexReportOpened
} from "@/utils/analytics/reportsIndexAnalytics";

export const useReportsIndexAnalytics = () => {
  const trackFilterApplied = useCallback(
    (params: { filterField: IndexFilterField; filterValue: string; isDefaultFilter: boolean }) => {
      trackIndexFilterApplied(params);
    },
    []
  );

  const trackSortApplied = useCallback((sortField: IndexSortField) => {
    trackIndexSortApplied({ sortField });
  }, []);

  const trackSearchUsed = useCallback((searchScope: IndexSearchScope) => {
    trackIndexSearchUsed({ searchScope });
  }, []);

  const trackRowActionClicked = useCallback(
    (params: { actionType: IndexRowActionType; entityType: ReportEntityType; status: string }) => {
      trackIndexRowActionClicked(params);
    },
    []
  );

  const trackSelectionChanged = useCallback(
    (params: { selectionCount: number; selectedStatuses: string[]; eligibleStatuses: readonly string[] }) => {
      trackIndexSelectionChanged({
        selectionCount: params.selectionCount,
        hasMixedEligibility: resolveIndexMixedEligibility(params.selectedStatuses, params.eligibleStatuses)
      });
    },
    []
  );

  const trackBulkActionSubmitted = useCallback(
    (params: { actionType: IndexBulkActionType; selectedCount: number; eligibleCount: number }) => {
      trackIndexBulkActionSubmitted(params);
    },
    []
  );

  const trackReportOpened = useCallback((params: { entityType: ReportEntityType; entityId: string }) => {
    trackReportsIndexReportOpened(params);
  }, []);

  const trackAccordionExpanded = useCallback((params: { entityType: ReportEntityType; entityId: string }) => {
    trackReportsIndexAccordionExpanded(params);
  }, []);

  return useMemo(
    () => ({
      trackFilterApplied,
      trackSortApplied,
      trackSearchUsed,
      trackRowActionClicked,
      trackSelectionChanged,
      trackBulkActionSubmitted,
      trackReportOpened,
      trackAccordionExpanded,
      resolveIndexMixedEligibility
    }),
    [
      trackAccordionExpanded,
      trackBulkActionSubmitted,
      trackFilterApplied,
      trackReportOpened,
      trackRowActionClicked,
      trackSearchUsed,
      trackSelectionChanged,
      trackSortApplied
    ]
  );
};

export default useReportsIndexAnalytics;
