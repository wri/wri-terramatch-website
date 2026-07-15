import { useCallback, useEffect, useMemo, useState } from "react";

import { restorationStrategyType, targetLandUseType } from "@/constants/polygons";
import {
  type PolygonStatus,
  POLYGON_APPROVED,
  POLYGON_INFORMATION_REQUIRED,
  POLYGON_PENDING_APPROVAL
} from "@/constants/polygonStatuses";
import { SitePolygonsIndexQueryParams } from "@/generated/v3/researchService/researchServiceComponents";
import { type PolygonValidationStatus } from "@/pages/site/[uuid]/components/polygonFilter.constants";
import { LandscapeCode } from "@/utils/landscapeUtils";

export type ExplorerFilterState = {
  /** Mutually exclusive with landscape / projectCohort (research API rule). */
  projectUuid: string;
  projectLabel: string;
  landscape: LandscapeCode | "";
  projectCohort: string[];
  polygonStatus: PolygonStatus[];
  validationStatus: PolygonValidationStatus[];
  practice: restorationStrategyType[];
  targetSys: targetLandUseType[];
  hasOverlap: boolean;
  includeTestProjects: boolean;
};

/** Defaults requested for the exploration view (exclude Draft / failed / not checked). */
export const DEFAULT_EXPLORER_FILTERS: ExplorerFilterState = {
  projectUuid: "",
  projectLabel: "",
  landscape: "",
  projectCohort: [],
  polygonStatus: [POLYGON_PENDING_APPROVAL, POLYGON_INFORMATION_REQUIRED, POLYGON_APPROVED],
  validationStatus: ["passed"],
  practice: [],
  targetSys: [],
  hasOverlap: false,
  includeTestProjects: false
};

export type ExplorerApiQuery = {
  filter: Partial<SitePolygonsIndexQueryParams>;
  /** Passed via sitePolygonsConnection entity props → projectId[]. */
  projectUuid: string;
};

const SEARCH_DEBOUNCE_MS = 300;

export const usePolygonExplorerFilters = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<ExplorerFilterState>(DEFAULT_EXPLORER_FILTERS);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(search.trim()), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timeout);
  }, [search]);

  const setProject = useCallback((uuid: string, label: string) => {
    setFilters(current => ({
      ...current,
      projectUuid: uuid,
      projectLabel: label,
      // Research API: projectId cannot combine with landscape / projectCohort.
      landscape: uuid !== "" ? "" : current.landscape,
      projectCohort: uuid !== "" ? [] : current.projectCohort
    }));
  }, []);

  const setLandscape = useCallback((landscape: LandscapeCode | "") => {
    setFilters(current => ({
      ...current,
      landscape,
      projectUuid: landscape !== "" ? "" : current.projectUuid,
      projectLabel: landscape !== "" ? "" : current.projectLabel
    }));
  }, []);

  const toggleProjectCohort = useCallback((cohort: string) => {
    setFilters(current => {
      const next = current.projectCohort.includes(cohort)
        ? current.projectCohort.filter(item => item !== cohort)
        : [...current.projectCohort, cohort];
      return {
        ...current,
        projectCohort: next,
        projectUuid: next.length > 0 ? "" : current.projectUuid,
        projectLabel: next.length > 0 ? "" : current.projectLabel
      };
    });
  }, []);

  // Same non-bracketed key convention as useSitePolygonFilters; the query serializer
  // turns arrays into indexed params that the API parses back into arrays.
  const apiQuery = useMemo((): ExplorerApiQuery => {
    const filter: Record<string, unknown> = {};
    const projectUuid = filters.projectUuid;

    // Scope mutual exclusivity: project wins over landscape / cohort at the query level.
    if (projectUuid === "") {
      if (filters.landscape !== "") filter.landscape = filters.landscape;
      if (filters.projectCohort.length > 0) filter.projectCohort = filters.projectCohort;
    }

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

    return {
      filter: filter as Partial<SitePolygonsIndexQueryParams>,
      projectUuid
    };
  }, [debouncedSearch, filters]);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_EXPLORER_FILTERS);
    setSearch("");
    setDebouncedSearch("");
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.projectUuid !== "") count++;
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

  return {
    search,
    setSearch,
    filters,
    setFilters,
    setProject,
    setLandscape,
    toggleProjectCohort,
    apiQuery,
    clearFilters,
    activeFilterCount
  };
};
