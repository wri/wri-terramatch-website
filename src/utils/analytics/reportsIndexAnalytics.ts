import {
  ACCORDION_CONTEXT_REPORT_DETAILS,
  ACCORDION_CONTEXT_REPORTING_PERIOD_GROUP,
  PAGE_CONTEXT_REPORT_OVERVIEW,
  PAGE_CONTEXT_REPORTS_INDEX,
  PageContext,
  REPORT_OPENED_ENTRY_POINT_INDEX_ROW_ACTION
} from "@/utils/analytics/pageContext";
import {
  getAnalyticsUserRole,
  ReportEntityType,
  ReportUserRole,
  trackReportAnalyticsEvent
} from "@/utils/analytics/reportAnalytics";
import { ReportsIndexEventName, trackReportsIndexEvent } from "@/utils/ga4";

export type IndexSortField = "due_date" | "status" | "report_type";
export type IndexSearchScope = "profile_name" | "project";
export type IndexRowActionType = "edit" | "download" | "submit_for_approval" | "mark_nothing_to_report";
export type IndexBulkActionType = "submit_for_approval" | "mark_nothing_to_report";

export {
  ACCORDION_CONTEXT_REPORT_DETAILS,
  ACCORDION_CONTEXT_REPORTING_PERIOD_GROUP,
  PAGE_CONTEXT_REPORT_OVERVIEW,
  PAGE_CONTEXT_REPORTS_INDEX,
  REPORT_OPENED_ENTRY_POINT_INDEX_ROW_ACTION
};

export type IndexFilterField = "report_type" | "status" | "due_date";

const trackReportsIndexAnalyticsEvent = (
  eventName: ReportsIndexEventName,
  params: Record<string, string | number | boolean | null | undefined>
): void => {
  trackReportsIndexEvent(eventName, {
    page_context: PAGE_CONTEXT_REPORTS_INDEX,
    ...params
  });
};

export const resolveIndexMixedEligibility = (
  selectedStatuses: string[],
  eligibleStatuses: readonly string[]
): boolean => {
  const eligibleSet = new Set(eligibleStatuses);
  let hasEligible = false;
  let hasIneligible = false;

  for (const status of selectedStatuses) {
    if (eligibleSet.has(status)) {
      hasEligible = true;
    } else {
      hasIneligible = true;
    }

    if (hasEligible && hasIneligible) {
      return true;
    }
  }

  return false;
};

export const trackIndexFilterApplied = ({
  filterField,
  filterValue,
  isDefaultFilter
}: {
  filterField: IndexFilterField;
  filterValue: string;
  isDefaultFilter: boolean;
}): void => {
  trackReportsIndexAnalyticsEvent("index_filter_applied", {
    filter_field: filterField,
    filter_value: filterValue,
    is_default_filter: isDefaultFilter
  });
};

export const trackIndexSortApplied = ({ sortField }: { sortField: IndexSortField }): void => {
  trackReportsIndexAnalyticsEvent("index_sort_applied", {
    sort_field: sortField
  });
};

export const trackIndexSearchUsed = ({ searchScope }: { searchScope: IndexSearchScope }): void => {
  trackReportsIndexAnalyticsEvent("index_search_used", {
    search_scope: searchScope
  });
};

export const trackIndexRowActionClicked = ({
  actionType,
  entityType,
  status
}: {
  actionType: IndexRowActionType;
  entityType: ReportEntityType;
  status: string;
}): void => {
  trackReportsIndexAnalyticsEvent("index_row_action_clicked", {
    action_type: actionType,
    entity_type: entityType,
    status
  });
};

export const trackIndexSelectionChanged = ({
  selectionCount,
  hasMixedEligibility
}: {
  selectionCount: number;
  hasMixedEligibility: boolean;
}): void => {
  trackReportsIndexAnalyticsEvent("index_selection_changed", {
    selection_count: selectionCount,
    has_mixed_eligibility: hasMixedEligibility
  });
};

export const trackIndexBulkActionSubmitted = ({
  actionType,
  selectedCount,
  eligibleCount
}: {
  actionType: IndexBulkActionType;
  selectedCount: number;
  eligibleCount: number;
}): void => {
  trackReportsIndexAnalyticsEvent("index_bulk_action_submitted", {
    action_type: actionType,
    selected_count: selectedCount,
    eligible_count: Math.min(eligibleCount, selectedCount)
  });
};

export const trackReportsIndexReportOpened = ({
  entityType,
  entityId,
  userRole = getAnalyticsUserRole()
}: {
  entityType: ReportEntityType;
  entityId: string;
  userRole?: ReportUserRole;
}): void => {
  trackReportAnalyticsEvent("report_opened", {
    entityType,
    entityId,
    userRole,
    page_context: PAGE_CONTEXT_REPORTS_INDEX,
    entry_point: REPORT_OPENED_ENTRY_POINT_INDEX_ROW_ACTION
  });
};

export const trackReportsIndexAccordionExpanded = ({
  entityType,
  entityId,
  accordionContext = ACCORDION_CONTEXT_REPORTING_PERIOD_GROUP
}: {
  entityType: ReportEntityType;
  entityId: string;
  accordionContext?: PageContext;
}): void => {
  trackReportAnalyticsEvent("accordion_expanded", {
    entityType,
    entityId,
    page_context: PAGE_CONTEXT_REPORTS_INDEX,
    accordion_context: accordionContext
  });
};

export const trackReportOverviewAccordionExpanded = ({
  entityType,
  entityId,
  accordionLabel,
  accordionContext = ACCORDION_CONTEXT_REPORT_DETAILS
}: {
  entityType: ReportEntityType;
  entityId: string;
  accordionLabel?: string;
  accordionContext?: PageContext;
}): void => {
  trackReportAnalyticsEvent("accordion_expanded", {
    entityType,
    entityId,
    page_context: PAGE_CONTEXT_REPORT_OVERVIEW,
    accordion_context: accordionContext,
    ...(accordionLabel != null && accordionLabel !== "" ? { accordion_label: accordionLabel } : {})
  });
};

export const trackReportOverviewReportOpened = ({
  entityType,
  entityId,
  userRole = getAnalyticsUserRole()
}: {
  entityType: ReportEntityType;
  entityId: string;
  userRole?: ReportUserRole;
}): void => {
  trackReportAnalyticsEvent("report_opened", {
    entityType,
    entityId,
    userRole,
    page_context: PAGE_CONTEXT_REPORT_OVERVIEW
  });
};
