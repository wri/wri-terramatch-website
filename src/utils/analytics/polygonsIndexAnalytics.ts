import type { PolygonFilterState } from "@/pages/site/[uuid]/components/polygonFilter.constants";
import { PAGE_CONTEXT_POLYGONS_INDEX } from "@/utils/analytics/pageContext";
import { trackReportsIndexEvent } from "@/utils/ga4";

const MAX_FILTER_VALUE_LENGTH = 100;

export type PolygonsIndexFilterField =
  | "site"
  | "restoration_practice"
  | "target_land_use"
  | "submission_cycle"
  | "plant_start_date"
  | "submission_status"
  | "system_validation"
  | "show_overlaps"
  | "show_disturbances"
  | "show_deleted";

export type PolygonsIndexFilterAction = "applied" | "removed" | "cleared_all";
export type PolygonsIndexRowActionType = "open_polygon" | "open_site" | "open_project";

type FilterDescriptor = {
  field: PolygonsIndexFilterField;
  /** Identifies the filter's current value. An empty string means the filter is inactive. */
  signature: (filters: PolygonFilterState) => string;
  /** Only enumerated fields report their value; free-form and toggle fields do not. */
  enumeratedValues?: (filters: PolygonFilterState) => readonly string[];
  dateDimension?: "plant_start_date";
};

const joinSorted = (values: readonly string[]): string => [...values].sort().join(",");

const toggleSignature = (isOn: boolean): string => (isOn ? "on" : "");

const FILTER_REGISTRY: FilterDescriptor[] = [
  { field: "site", signature: ({ sites }) => joinSorted(sites.map(({ value }) => value)) },
  {
    field: "submission_status",
    signature: ({ polygonStatus }) => joinSorted(polygonStatus),
    enumeratedValues: ({ polygonStatus }) => polygonStatus
  },
  {
    field: "system_validation",
    signature: ({ validationStatus }) => joinSorted(validationStatus),
    enumeratedValues: ({ validationStatus }) => validationStatus
  },
  {
    field: "plant_start_date",
    signature: ({ plantStartFrom, plantStartTo }) =>
      plantStartFrom === "" && plantStartTo === "" ? "" : `${plantStartFrom}|${plantStartTo}`,
    dateDimension: "plant_start_date"
  },
  {
    field: "restoration_practice",
    signature: ({ practice }) => joinSorted(practice),
    enumeratedValues: ({ practice }) => practice
  },
  {
    field: "target_land_use",
    signature: ({ targetSys }) => joinSorted(targetSys),
    enumeratedValues: ({ targetSys }) => targetSys
  },
  {
    field: "submission_cycle",
    signature: ({ submissionCycle }) => joinSorted(submissionCycle),
    enumeratedValues: ({ submissionCycle }) => submissionCycle
  },
  { field: "show_overlaps", signature: ({ hasOverlap }) => toggleSignature(hasOverlap) },
  { field: "show_disturbances", signature: ({ hasDisturbance }) => toggleSignature(hasDisturbance) },
  { field: "show_deleted", signature: ({ showDeleted }) => toggleSignature(showDeleted) }
];

const POLYGONS_INDEX_SORT_FIELD_BY_COLUMN: Record<string, string> = {
  polygonName: "polygon_name",
  submission: "submission_status",
  validation: "validation_status",
  siteName: "site_name",
  restorationPracticeSort: "restoration_practice",
  targetLandUseSort: "target_land_use",
  treeDistributionSort: "tree_distribution",
  plantingDate: "plant_start_date",
  treesPlanted: "trees_planted",
  area: "area_ha",
  submissionCycleSort: "submission_cycle",
  source: "source",
  disturbance: "disturbance"
};

type PolygonsIndexEventParams = Record<string, string | number | boolean | undefined>;

const trackPolygonsIndexEvent = (
  eventName: Parameters<typeof trackReportsIndexEvent>[0],
  params: PolygonsIndexEventParams
): void => {
  // The shared GA4 helper turns undefined into "unknown"; the spec wants empty parameters omitted.
  const definedParams = Object.fromEntries(Object.entries(params).filter(([, value]) => value != null));
  trackReportsIndexEvent(eventName, { page_context: PAGE_CONTEXT_POLYGONS_INDEX, ...definedParams });
};

const countActiveFilters = (filters: PolygonFilterState): number =>
  FILTER_REGISTRY.filter(({ signature }) => signature(filters) !== "").length;

/**
 * Emits one `index_filter_applied` per filter field that changed between the two states, or a single
 * `cleared_all` event when the user cleared everything at once.
 */
export const trackPolygonsIndexFiltersChanged = ({
  previous,
  next,
  clearedAll
}: {
  previous: PolygonFilterState;
  next: PolygonFilterState;
  clearedAll: boolean;
}): void => {
  const activeFilterCount = countActiveFilters(next);

  if (clearedAll) {
    if (countActiveFilters(previous) === 0) return;

    trackPolygonsIndexEvent("index_filter_applied", {
      filter_field: "all",
      filter_action: "cleared_all" satisfies PolygonsIndexFilterAction,
      is_default_filter: false,
      active_filter_count: activeFilterCount
    });
    return;
  }

  for (const { field, signature, enumeratedValues, dateDimension } of FILTER_REGISTRY) {
    const nextSignature = signature(next);
    if (signature(previous) === nextSignature) continue;

    const isActive = nextSignature !== "";
    const filterValue =
      isActive && enumeratedValues != null
        ? joinSorted(enumeratedValues(next)).slice(0, MAX_FILTER_VALUE_LENGTH)
        : undefined;

    trackPolygonsIndexEvent("index_filter_applied", {
      filter_field: field,
      filter_value: filterValue,
      is_default_filter: false,
      date_dimension: isActive ? dateDimension : undefined,
      filter_action: (isActive ? "applied" : "removed") satisfies PolygonsIndexFilterAction,
      active_filter_count: activeFilterCount
    });
  }
};

export const trackPolygonsIndexSearchUsed = ({ resultCount }: { resultCount: number }): void => {
  trackPolygonsIndexEvent("index_search_used", { search_scope: "polygons", result_count: resultCount });
};

export const trackPolygonsIndexSortApplied = ({
  columnKey,
  direction
}: {
  columnKey: string;
  direction: "asc" | "desc";
}): void => {
  const sortField = POLYGONS_INDEX_SORT_FIELD_BY_COLUMN[columnKey];
  if (sortField == null) return;

  trackPolygonsIndexEvent("index_sort_applied", { sort_field: sortField, sort_direction: direction });
};

export const trackPolygonsIndexSelectionChanged = ({
  selectionCount,
  hasMixedEligibility
}: {
  selectionCount: number;
  hasMixedEligibility: boolean;
}): void => {
  trackPolygonsIndexEvent("index_selection_changed", {
    selection_count: selectionCount,
    has_mixed_eligibility: hasMixedEligibility
  });
};

export const trackPolygonsIndexBulkActionSubmitted = ({
  actionType,
  selectedCount,
  eligibleCount
}: {
  actionType: string;
  selectedCount: number;
  eligibleCount: number;
}): void => {
  trackPolygonsIndexEvent("index_bulk_action_submitted", {
    action_type: actionType,
    selected_count: selectedCount,
    eligible_count: Math.min(eligibleCount, selectedCount)
  });
};

export const trackPolygonsIndexRowActionClicked = ({
  actionType,
  status
}: {
  actionType: PolygonsIndexRowActionType;
  status: string;
}): void => {
  trackPolygonsIndexEvent("index_row_action_clicked", {
    action_type: actionType,
    entity_type: "polygon",
    status
  });
};
