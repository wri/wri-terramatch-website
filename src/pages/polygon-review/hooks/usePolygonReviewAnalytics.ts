import { useCallback, useEffect, useRef } from "react";

import type { SortColumn } from "@/redesignComponents/dataDisplay/Table/tableUtils";
import {
  trackPolygonsIndexFiltersChanged,
  trackPolygonsIndexSearchUsed,
  trackPolygonsIndexSelectionChanged,
  trackPolygonsIndexSortApplied
} from "@/utils/analytics/polygonsIndexAnalytics";
import { isSitePolygonApprovable, toReviewAvailabilityPolygon } from "@/utils/sitePolygonReview";

import type { PolygonFilterState } from "../../site/[uuid]/components/polygonFilter.constants";
import type { PolygonTableRow } from "../../site/[uuid]/components/PolygonTableRow";

/**
 * - `user`: a drawer Apply or a filter chip removal; reported field by field.
 * - `cleared_all`: the user cleared every filter at once.
 * - `silent`: the page reset or pre-applied the filters itself, which is not user filter usage.
 */
export type PolygonFilterChangeSource = "user" | "cleared_all" | "silent";

type UsePolygonReviewAnalyticsParams = {
  polygonFilters: PolygonFilterState;
  search: string | undefined;
  isResultsLoaded: boolean;
  resultCount: number;
  selectedRows: PolygonTableRow[];
};

export const usePolygonReviewAnalytics = ({
  polygonFilters,
  search,
  isResultsLoaded,
  resultCount,
  selectedRows
}: UsePolygonReviewAnalyticsParams) => {
  const previousFiltersRef = useRef(polygonFilters);
  const nextFilterChangeSourceRef = useRef<PolygonFilterChangeSource>("user");

  // Call right before a state change the user did not make with the filter UI. Callers must only
  // mark a change that will actually update the filters, otherwise the mark leaks onto the next one.
  const markNextFilterChange = useCallback((source: PolygonFilterChangeSource) => {
    nextFilterChangeSourceRef.current = source;
  }, []);

  useEffect(() => {
    const previous = previousFiltersRef.current;
    previousFiltersRef.current = polygonFilters;
    const source = nextFilterChangeSourceRef.current;
    nextFilterChangeSourceRef.current = "user";

    if (previous === polygonFilters || source === "silent") return;

    trackPolygonsIndexFiltersChanged({ previous, next: polygonFilters, clearedAll: source === "cleared_all" });
  }, [polygonFilters]);

  const lastTrackedSearchRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (search == null) {
      lastTrackedSearchRef.current = undefined;
      return;
    }
    if (!isResultsLoaded || lastTrackedSearchRef.current === search) return;

    lastTrackedSearchRef.current = search;
    trackPolygonsIndexSearchUsed({ resultCount });
  }, [isResultsLoaded, resultCount, search]);

  const isUserSelectionPendingRef = useRef(false);
  const markUserSelection = useCallback(() => {
    isUserSelectionPendingRef.current = true;
  }, []);

  const previousSelectedCountRef = useRef(0);
  useEffect(() => {
    const selectedCount = selectedRows.length;
    const hasCountChanged = previousSelectedCountRef.current !== selectedCount;
    previousSelectedCountRef.current = selectedCount;
    if (!hasCountChanged || !isUserSelectionPendingRef.current) return;

    isUserSelectionPendingRef.current = false;
    const eligibleCount = selectedRows.filter(row => isSitePolygonApprovable(toReviewAvailabilityPolygon(row))).length;
    trackPolygonsIndexSelectionChanged({
      selectionCount: selectedCount,
      hasMixedEligibility: eligibleCount > 0 && eligibleCount < selectedCount
    });
  }, [selectedRows]);

  const trackSortChange = useCallback((sortColumn: SortColumn) => {
    if (sortColumn.order === "") return;

    trackPolygonsIndexSortApplied({
      columnKey: sortColumn.key,
      direction: sortColumn.order === "desc" ? "desc" : "asc"
    });
  }, []);

  return { markNextFilterChange, markUserSelection, trackSortChange };
};
