import { useCallback, useEffect, useMemo, useState } from "react";

import { restorationStrategyType, targetLandUseType } from "@/constants/polygons";
import { type PolygonStatus } from "@/constants/polygonStatuses";
import { SitePolygonsIndexQueryParams } from "@/generated/v3/researchService/researchServiceComponents";
import { type PolygonValidationStatus } from "@/pages/site/[uuid]/components/polygonFilter.constants";
import { LandscapeCode } from "@/utils/landscapeUtils";

export type ExplorerFilterState = {
  landscape: LandscapeCode | "";
  projectCohort: string[];
  polygonStatus: PolygonStatus[];
  validationStatus: PolygonValidationStatus[];
  practice: restorationStrategyType[];
  targetSys: targetLandUseType[];
  hasOverlap: boolean;
  includeTestProjects: boolean;
};

export const EMPTY_EXPLORER_FILTERS: ExplorerFilterState = {
  landscape: "",
  projectCohort: [],
  polygonStatus: [],
  validationStatus: [],
  practice: [],
  targetSys: [],
  hasOverlap: false,
  includeTestProjects: false
};

const SEARCH_DEBOUNCE_MS = 300;

export const usePolygonExplorerFilters = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<ExplorerFilterState>(EMPTY_EXPLORER_FILTERS);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(search.trim()), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timeout);
  }, [search]);

  // Same non-bracketed key convention as useSitePolygonFilters; the query serializer
  // turns arrays into indexed params that the API parses back into arrays.
  const apiFilter = useMemo(() => {
    const filter: Record<string, unknown> = {};
    if (filters.landscape !== "") filter.landscape = filters.landscape;
    if (filters.projectCohort.length > 0) filter.projectCohort = filters.projectCohort;
    if (filters.polygonStatus.length > 0) filter.polygonStatus = filters.polygonStatus;
    if (filters.validationStatus.length > 0) filter.validationStatus = filters.validationStatus;
    if (filters.practice.length > 0) filter.practice = filters.practice;
    if (filters.targetSys.length > 0) filter.targetSys = filters.targetSys;
    if (filters.hasOverlap) filter.hasOverlap = true;
    if (filters.includeTestProjects) filter.includeTestProjects = true;
    if (debouncedSearch !== "") {
      filter.search = debouncedSearch;
      filter.searchFields = ["siteName", "polyName", "polygonUuid"];
    }
    return filter as Partial<SitePolygonsIndexQueryParams>;
  }, [debouncedSearch, filters]);

  const clearFilters = useCallback(() => {
    setFilters(EMPTY_EXPLORER_FILTERS);
    setSearch("");
    setDebouncedSearch("");
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.landscape !== "") count++;
    if (filters.projectCohort.length > 0) count++;
    if (filters.polygonStatus.length > 0) count++;
    if (filters.validationStatus.length > 0) count++;
    if (filters.practice.length > 0) count++;
    if (filters.targetSys.length > 0) count++;
    if (filters.hasOverlap) count++;
    if (filters.includeTestProjects) count++;
    if (debouncedSearch !== "") count++;
    return count;
  }, [debouncedSearch, filters]);

  return { search, setSearch, filters, setFilters, apiFilter, clearFilters, activeFilterCount };
};
