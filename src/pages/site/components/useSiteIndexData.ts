import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { loadFullProject, loadProjectIndex, loadSiteIndex } from "@/connections/Entity";
import { toFramework } from "@/context/framework.provider";
import type { ProjectFullDto, ProjectLightDto, SiteLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import ApiSlice from "@/store/apiSlice";
import Log from "@/utils/log";

import type { SiteIndexProject, SiteIndexSite } from "./siteIndex.types";
import {
  groupSitesByProject,
  mapSiteToIndexSite,
  toSiteIndexProject,
  toSiteIndexUpdateRequestStatus
} from "./siteIndex.utils";
import type { SiteIndexFilterStatus, SiteIndexFilterUpdate } from "./SiteIndexFilterDrawer";

type UseSiteIndexDataParams = {
  reloadNonce?: number;
  search?: string;
  statusFilters?: SiteIndexFilterStatus[];
  updateFilter?: SiteIndexFilterUpdate | null;
  projectUuid?: string;
};

type UseSiteIndexDataResult = {
  loading: boolean;
  filtering: boolean;
  projects: SiteIndexProject[];
  totalSiteCount: number;
  onProjectOpened: (projectId: string) => void;
};

const PAGE_SIZE = 100;
const SEARCH_DEBOUNCE_MS = 300;

type IndexPage<T> = {
  data?: T[] | null;
  indexTotal?: number | null;
};

type SiteIndexFilter = {
  projectUuid?: string;
  search?: string;
  status?: string;
  updateRequestStatus?: string;
};

const loadAllIndexPages = async <T>(loadPage: (pageNumber: number) => Promise<IndexPage<T>>): Promise<T[]> => {
  const firstPage = await loadPage(1);
  const items = [...(firstPage.data ?? [])];
  const total = firstPage.indexTotal ?? items.length;
  const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));

  for (let pageNumber = 2; pageNumber <= lastPage; pageNumber++) {
    const page = await loadPage(pageNumber);
    items.push(...(page.data ?? []));
  }

  return items;
};

const uniqueSites = (sites: SiteLightDto[]) => {
  const byId = new Map<string, SiteLightDto>();
  sites.forEach(site => {
    byId.set(site.uuid, site);
  });
  return Array.from(byId.values());
};

const buildSiteFilters = ({
  projectUuid,
  search,
  status,
  updateRequestStatus
}: SiteIndexFilter): SiteIndexFilter | undefined => {
  const filter: SiteIndexFilter = {};

  if (projectUuid != null && projectUuid !== "") {
    filter.projectUuid = projectUuid;
  }
  if (search != null && search !== "") {
    filter.search = search;
  }
  if (status != null && status !== "") {
    filter.status = status;
  }
  if (updateRequestStatus != null && updateRequestStatus !== "") {
    filter.updateRequestStatus = updateRequestStatus;
  }

  return Object.keys(filter).length > 0 ? filter : undefined;
};

export const useSiteIndexData = ({
  reloadNonce = 0,
  search = "",
  statusFilters = [],
  updateFilter = null,
  projectUuid
}: UseSiteIndexDataParams = {}): UseSiteIndexDataResult => {
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [projectIndex, setProjectIndex] = useState<ProjectLightDto[]>([]);
  const [sitesByProjectId, setSitesByProjectId] = useState<Map<string, SiteIndexSite[]>>(new Map());
  const [fullProjectsById, setFullProjectsById] = useState<Map<string, ProjectFullDto>>(new Map());
  const [loadedProjectIds, setLoadedProjectIds] = useState<Set<string>>(new Set());
  const [loadingProjectIds, setLoadingProjectIds] = useState<Set<string>>(new Set());
  const [filteredSites, setFilteredSites] = useState<SiteLightDto[] | null>(null);
  const [appliedFilterKey, setAppliedFilterKey] = useState("");
  const [totalSiteCount, setTotalSiteCount] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState(search.trim());

  const projectIndexRef = useRef(projectIndex);
  projectIndexRef.current = projectIndex;
  const loadedProjectIdsRef = useRef(loadedProjectIds);
  loadedProjectIdsRef.current = loadedProjectIds;
  const fullProjectsByIdRef = useRef(fullProjectsById);
  fullProjectsByIdRef.current = fullProjectsById;
  const inFlightRef = useRef(new Map<string, Promise<void>>());
  const loadGenerationRef = useRef(0);

  const normalisedSearch = search.trim();
  const hasActiveFilters = normalisedSearch.length > 0 || statusFilters.length > 0 || updateFilter != null;
  const filterQueryKey = [
    debouncedSearch,
    [...statusFilters].sort().join(","),
    updateFilter ?? "",
    projectUuid ?? ""
  ].join("|");

  useEffect(() => {
    const handle = window.setTimeout(() => setDebouncedSearch(normalisedSearch), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(handle);
  }, [normalisedSearch]);

  useEffect(() => {
    let cancelled = false;
    loadGenerationRef.current += 1;
    inFlightRef.current.clear();
    loadedProjectIdsRef.current = new Set();
    fullProjectsByIdRef.current = new Map();

    const loadIndex = async () => {
      setLoading(true);
      setFilteredSites(null);
      setAppliedFilterKey("");
      setSitesByProjectId(new Map());
      setFullProjectsById(new Map());
      setLoadedProjectIds(new Set());
      setLoadingProjectIds(new Set());

      if (reloadNonce > 0) {
        ApiSlice.pruneIndex("projects", "");
        ApiSlice.pruneIndex("sites", "");
      }

      try {
        const [loadedProjects, siteCountPage] = await Promise.all([
          loadAllIndexPages<ProjectLightDto>(pageNumber => loadProjectIndex({ pageNumber, pageSize: PAGE_SIZE })),
          loadSiteIndex({ pageNumber: 1, pageSize: 1 }).catch(error => {
            Log.error("Failed to load site index total", error);
            return { indexTotal: 0 };
          })
        ]);

        if (cancelled) {
          return;
        }

        setProjectIndex(loadedProjects);
        setTotalSiteCount(siteCountPage.indexTotal ?? 0);
        setLoading(false);
      } catch (error) {
        Log.error("Failed to load site index", error);
        if (!cancelled) {
          setProjectIndex([]);
          setTotalSiteCount(0);
          setLoading(false);
        }
      }
    };

    void loadIndex();

    return () => {
      cancelled = true;
    };
  }, [reloadNonce]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!hasActiveFilters) {
      setFilteredSites(null);
      setAppliedFilterKey("");
      setFiltering(false);
      return;
    }

    if (projectIndex.length === 0) {
      setFilteredSites([]);
      setAppliedFilterKey(filterQueryKey);
      setFiltering(false);
      return;
    }

    let cancelled = false;
    const generation = loadGenerationRef.current;

    const loadFilteredSites = async () => {
      setFiltering(true);

      try {
        const updateRequestStatus = toSiteIndexUpdateRequestStatus(updateFilter);
        const statuses = statusFilters.length > 0 ? statusFilters : [undefined];
        const pages = await Promise.all(
          statuses.map(status =>
            loadAllIndexPages<SiteLightDto>(pageNumber =>
              loadSiteIndex({
                pageNumber,
                pageSize: PAGE_SIZE,
                filter: buildSiteFilters({
                  projectUuid,
                  search: debouncedSearch,
                  status,
                  updateRequestStatus
                })
              })
            )
          )
        );

        if (cancelled || generation !== loadGenerationRef.current) {
          return;
        }

        setFilteredSites(uniqueSites(pages.flat()));
        setAppliedFilterKey(filterQueryKey);
      } catch (error) {
        Log.error("Failed to load filtered site index", error);
        if (!cancelled && generation === loadGenerationRef.current) {
          setFilteredSites([]);
          setAppliedFilterKey(filterQueryKey);
        }
      } finally {
        if (!cancelled && generation === loadGenerationRef.current) {
          setFiltering(false);
        }
      }
    };

    void loadFilteredSites();

    return () => {
      cancelled = true;
    };
  }, [
    debouncedSearch,
    filterQueryKey,
    hasActiveFilters,
    loading,
    projectIndex,
    projectUuid,
    statusFilters,
    updateFilter
  ]);

  const loadFullProjectIfNeeded = useCallback(async (projectId: string) => {
    if (fullProjectsByIdRef.current.has(projectId)) {
      return;
    }

    const generation = loadGenerationRef.current;

    try {
      const result = await loadFullProject({ id: projectId });
      const fullProject = result.data;
      if (generation !== loadGenerationRef.current || fullProject == null) {
        return;
      }

      setFullProjectsById(current => {
        if (current.has(projectId)) {
          return current;
        }
        const next = new Map(current);
        next.set(projectId, fullProject);
        return next;
      });
    } catch (error) {
      Log.error("Failed to load full project for site index metrics", error);
    }
  }, []);

  const loadSitesIfNeeded = useCallback(async (projectId: string) => {
    if (loadedProjectIdsRef.current.has(projectId) || inFlightRef.current.has(projectId)) {
      return;
    }

    const generation = loadGenerationRef.current;
    const request = (async () => {
      setLoadingProjectIds(current => new Set(current).add(projectId));

      try {
        const loadedSites = await loadAllIndexPages<SiteLightDto>(pageNumber =>
          loadSiteIndex({
            pageNumber,
            pageSize: PAGE_SIZE,
            filter: buildSiteFilters({ projectUuid: projectId })
          })
        );

        if (generation !== loadGenerationRef.current) {
          return;
        }

        const project = projectIndexRef.current.find(item => item.uuid === projectId);
        const frameworkKey = toFramework(project?.frameworkKey);
        const mappedSites = loadedSites.map(site => mapSiteToIndexSite(site, frameworkKey));

        loadedProjectIdsRef.current = new Set(loadedProjectIdsRef.current).add(projectId);
        setSitesByProjectId(current => new Map(current).set(projectId, mappedSites));
        setLoadedProjectIds(current => new Set(current).add(projectId));
      } catch (error) {
        Log.error("Failed to load sites for project", error);
      } finally {
        inFlightRef.current.delete(projectId);
        if (generation === loadGenerationRef.current) {
          setLoadingProjectIds(current => {
            const next = new Set(current);
            next.delete(projectId);
            return next;
          });
        }
      }
    })();

    inFlightRef.current.set(projectId, request);
    await request;
  }, []);

  const hasActiveFiltersRef = useRef(hasActiveFilters);
  hasActiveFiltersRef.current = hasActiveFilters;

  const onProjectOpened = useCallback(
    (projectId: string) => {
      void loadFullProjectIfNeeded(projectId);
      if (!hasActiveFiltersRef.current) {
        void loadSitesIfNeeded(projectId);
      }
    },
    [loadFullProjectIfNeeded, loadSitesIfNeeded]
  );

  const projects = useMemo(() => {
    const baseProjects = projectIndex
      .map(project =>
        toSiteIndexProject(project, {
          fullProject: fullProjectsById.get(project.uuid),
          sites: sitesByProjectId.get(project.uuid) ?? [],
          sitesLoaded: loadedProjectIds.has(project.uuid),
          sitesLoading: loadingProjectIds.has(project.uuid)
        })
      )
      .sort((left, right) => left.name.localeCompare(right.name));

    if (filteredSites == null || !hasActiveFilters) {
      return baseProjects;
    }

    const grouped = groupSitesByProject(projectIndex, filteredSites, fullProjectsById);
    const filteredSitesByProjectId = new Map(grouped.map(project => [project.id, project.sites]));

    return baseProjects.map(project => ({
      ...project,
      sites: filteredSitesByProjectId.get(project.id) ?? [],
      sitesLoaded: true,
      sitesLoading: false
    }));
  }, [
    filteredSites,
    fullProjectsById,
    hasActiveFilters,
    loadedProjectIds,
    loadingProjectIds,
    projectIndex,
    sitesByProjectId
  ]);

  const waitingForDebouncedSearch = hasActiveFilters && debouncedSearch !== normalisedSearch;
  const filterResultsStale = hasActiveFilters && appliedFilterKey !== filterQueryKey;

  return {
    loading,
    filtering:
      hasActiveFilters && (filtering || waitingForDebouncedSearch || filteredSites == null || filterResultsStale),
    projects,
    totalSiteCount,
    onProjectOpened
  };
};
