import { useEffect, useMemo, useState } from "react";

import { PolygonEntityScopeProps, useSitePolygonSummary } from "@/connections/SitePolygons";
import { SitePolygonsSummaryQueryParams } from "@/generated/v3/researchService/researchServiceComponents";
import { useDebounce } from "@/hooks/useDebounce";

import { PolygonFilterState, toSitePolygonFilter } from "../components/polygonFilter.constants";

export type PolygonFilterFacet = NonNullable<SitePolygonsSummaryQueryParams["facet[]"]>[number];

export type PolygonFacetCounts = Partial<Record<PolygonFilterFacet, Record<string, number>>>;

const FACETS: PolygonFilterFacet[] = ["polygonStatus", "practice", "submissionCycle", "targetSys", "validationStatus"];

const COUNT_DEBOUNCE_MS = 300;

type UsePolygonFilterFacetCountsParams = {
  scope?: PolygonEntityScopeProps;
  filters: PolygonFilterState;
  search: string;
  enabled: boolean;
};

/**
 * Per-option polygon counts for the filter drawer, recomputed (debounced) as draft selections change. Each
 * facet is counted by the API with every other filter applied but not its own.
 */
export const usePolygonFilterFacetCounts = ({
  scope,
  filters,
  search,
  enabled
}: UsePolygonFilterFacetCountsParams): PolygonFacetCounts | undefined => {
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const debounceFilters = useDebounce(setDebouncedFilters, COUNT_DEBOUNCE_MS);

  useEffect(() => {
    debounceFilters(filters);
  }, [debounceFilters, filters]);

  const filter = useMemo(
    () => ({ ...toSitePolygonFilter(debouncedFilters, search), "facet[]": FACETS }),
    [debouncedFilters, search]
  );
  const siteUuids = useMemo(() => debouncedFilters.sites.map(({ value }) => value), [debouncedFilters.sites]);

  const [, { data }] = useSitePolygonSummary({
    ...scope,
    siteUuids,
    filter,
    enabled: enabled && scope?.entityUuid != null && !debouncedFilters.showDeleted
  });

  return data?.facetCounts;
};
