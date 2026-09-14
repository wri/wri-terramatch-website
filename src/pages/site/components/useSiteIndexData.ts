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
  loadingMore: boolean;
  hasMore: boolean;
  loadMore: () => void;
  viewProjects: SiteIndexProject[];
  projects: SiteIndexProject[];
  totalSiteCount: number;
  onProjectOpened: (projectId: string) => void;
};

export const DISCOVERY_PAGE_SIZE = 25;
export const PROJECT_INDEX_PAGE_SIZE = 100;
export const SECTION_SITES_PAGE_SIZE = 100;
export const SEARCH_DEBOUNCE_MS = 300;

type IndexPage<T> = {
  data?: T[] | null;
  indexTotal?: number | null;
  loadFailure?: unknown;
};

type SiteIndexFilter = {
  projectUuid?: string;
  search?: string;
  status?: string;
  updateRequestStatus?: string;
};

const mergeByUuid = <T extends { uuid: string }>(current: T[], incoming: T[]) => {
  const seen = new Set(current.map(item => item.uuid));
  const next = [...current];

  incoming.forEach(item => {
    if (seen.has(item.uuid)) return;
    seen.add(item.uuid);
    next.push(item);
  });

  return next;
};

const loadAllIndexPages = async <T>(
  loadPage: (pageNumber: number) => Promise<IndexPage<T>>,
  pageSize: number
): Promise<T[]> => {
  const firstPage = await loadPage(1);
  const items = [...(firstPage.data ?? [])];
  const total = firstPage.indexTotal ?? items.length;
  const lastPage = Math.max(1, Math.ceil(total / pageSize));

  for (let pageNumber = 2; pageNumber <= lastPage; pageNumber++) {
    const page = await loadPage(pageNumber);
    items.push(...(page.data ?? []));
  }

  return items;
};

const asFullProject = (project: ProjectLightDto | ProjectFullDto | undefined): ProjectFullDto | undefined =>
  project != null && project.lightResource === false ? (project as ProjectFullDto) : undefined;

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

const loadSiteDiscoveryPage = async (
  pageNumber: number,
  query: {
    search?: string;
    projectUuid?: string;
    statusFilters: SiteIndexFilterStatus[];
    updateRequestStatus?: string;
  }
) => {
  const statuses = query.statusFilters.length > 0 ? query.statusFilters : [undefined];
  const pages = await Promise.all(
    statuses.map(status =>
      loadSiteIndex({
        pageNumber,
        pageSize: DISCOVERY_PAGE_SIZE,
        filter: buildSiteFilters({
          projectUuid: query.projectUuid,
          search: query.search,
          status,
          updateRequestStatus: query.updateRequestStatus
        })
      })
    )
  );

  const failedPage = pages.find(page => page.loadFailure != null);
  if (failedPage?.loadFailure != null) {
    throw failedPage.loadFailure;
  }

  const data = uniqueSites(pages.flatMap(page => page.data ?? []));
  const indexTotal = pages.reduce((total, page) => total + (page.indexTotal ?? 0), 0);
  const maxTotal = Math.max(0, ...pages.map(page => page.indexTotal ?? 0));

  return {
    data,
    indexTotal,
    hasMore: pageNumber * DISCOVERY_PAGE_SIZE < maxTotal
  };
};

export const useSiteIndexData = ({
  reloadNonce = 0,
  search = "",
  statusFilters = [],
  updateFilter = null,
  projectUuid
}: UseSiteIndexDataParams = {}): UseSiteIndexDataResult => {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [projectIndex, setProjectIndex] = useState<ProjectLightDto[]>([]);
  const [discoveredSites, setDiscoveredSites] = useState<SiteLightDto[]>([]);
  const [sitesByProjectId, setSitesByProjectId] = useState<Map<string, SiteIndexSite[]>>(new Map());
  const [fullProjectsById, setFullProjectsById] = useState<Map<string, ProjectFullDto>>(new Map());
  const [loadedProjectIds, setLoadedProjectIds] = useState<Set<string>>(new Set());
  const [loadingProjectIds, setLoadingProjectIds] = useState<Set<string>>(new Set());
  const [totalSiteCount, setTotalSiteCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const projectIndexRef = useRef(projectIndex);
  projectIndexRef.current = projectIndex;
  const loadedProjectIdsRef = useRef(loadedProjectIds);
  loadedProjectIdsRef.current = loadedProjectIds;
  const fullProjectsByIdRef = useRef(fullProjectsById);
  fullProjectsByIdRef.current = fullProjectsById;
  const inFlightRef = useRef(new Map<string, Promise<void>>());
  const pageRef = useRef(1);
  const hasMoreRef = useRef(false);
  const loadingMoreRef = useRef(false);
  const requestIdRef = useRef(0);

  const normalisedSearch = search.trim();
  const updateRequestStatus = toSiteIndexUpdateRequestStatus(updateFilter);

  const queryRef = useRef({
    search: normalisedSearch,
    projectUuid,
    statusFilters,
    updateRequestStatus
  });
  queryRef.current = {
    search: normalisedSearch,
    projectUuid,
    statusFilters,
    updateRequestStatus
  };

  const loadMore = useCallback(async () => {
    if (loadingMoreRef.current || !hasMoreRef.current) return;

    loadingMoreRef.current = true;
    setLoadingMore(true);
    const requestId = requestIdRef.current;
    const nextPage = pageRef.current + 1;

    try {
      const page = await loadSiteDiscoveryPage(nextPage, queryRef.current);
      if (requestId !== requestIdRef.current) return;

      setDiscoveredSites(current => mergeByUuid(current, page.data));
      pageRef.current = nextPage;
      hasMoreRef.current = page.hasMore;
      setHasMore(page.hasMore);
      setTotalSiteCount(page.indexTotal);
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      Log.error("Failed to load more sites", error);
    } finally {
      if (requestId === requestIdRef.current) {
        loadingMoreRef.current = false;
        setLoadingMore(false);
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const requestId = ++requestIdRef.current;
    pageRef.current = 1;
    hasMoreRef.current = false;
    loadingMoreRef.current = false;
    inFlightRef.current.clear();
    loadedProjectIdsRef.current = new Set();

    const loadIndex = async () => {
      setLoading(true);
      setLoadingMore(false);
      setHasMore(false);
      setDiscoveredSites([]);
      setSitesByProjectId(new Map());
      setLoadedProjectIds(new Set());
      setLoadingProjectIds(new Set());

      if (reloadNonce > 0) {
        ApiSlice.pruneIndex("projects", "");
        ApiSlice.pruneIndex("sites", "");
      }

      try {
        const [loadedProjects, firstSites] = await Promise.all([
          loadAllIndexPages<ProjectLightDto>(
            pageNumber => loadProjectIndex({ pageNumber, pageSize: PROJECT_INDEX_PAGE_SIZE }),
            PROJECT_INDEX_PAGE_SIZE
          ),
          loadSiteDiscoveryPage(1, queryRef.current)
        ]);

        if (cancelled || requestId !== requestIdRef.current) {
          return;
        }

        const cachedFullProjects = new Map<string, ProjectFullDto>();
        loadedProjects.forEach(project => {
          const fullProject = asFullProject(project);
          if (fullProject != null) {
            cachedFullProjects.set(project.uuid, fullProject);
          }
        });

        setFullProjectsById(cachedFullProjects);
        setProjectIndex(loadedProjects);
        setDiscoveredSites(firstSites.data);
        setTotalSiteCount(firstSites.indexTotal);
        hasMoreRef.current = firstSites.hasMore;
        setHasMore(firstSites.hasMore);
        setLoading(false);
      } catch (error) {
        Log.error("Failed to load site index", error);
        if (!cancelled && requestId === requestIdRef.current) {
          setProjectIndex([]);
          setDiscoveredSites([]);
          setTotalSiteCount(0);
          setHasMore(false);
          setLoading(false);
        }
      }
    };

    void loadIndex();

    return () => {
      cancelled = true;
    };
  }, [normalisedSearch, projectUuid, reloadNonce, statusFilters, updateRequestStatus]);

  const loadSitesIfNeeded = useCallback(async (projectId: string) => {
    const isKnownProject = projectIndexRef.current.some(project => project.uuid === projectId);
    if (!isKnownProject || loadedProjectIdsRef.current.has(projectId) || inFlightRef.current.has(projectId)) {
      return;
    }

    const requestId = requestIdRef.current;
    const request = (async () => {
      setLoadingProjectIds(current => new Set(current).add(projectId));

      try {
        const cachedFullProject = fullProjectsByIdRef.current.get(projectId);
        const [loadedSites, fullProject] = await Promise.all([
          loadAllIndexPages<SiteLightDto>(
            pageNumber =>
              loadSiteIndex({
                pageNumber,
                pageSize: SECTION_SITES_PAGE_SIZE,
                sortField: "name",
                sortDirection: "ASC",
                filter: buildSiteFilters({ projectUuid: projectId })
              }),
            SECTION_SITES_PAGE_SIZE
          ),
          cachedFullProject != null
            ? Promise.resolve(cachedFullProject)
            : loadFullProject({ id: projectId })
                .then(result => result.data ?? null)
                .catch(error => {
                  Log.error("Failed to load full project for site index metrics", error);
                  return null;
                })
        ]);

        if (requestId !== requestIdRef.current) {
          return;
        }

        const project = projectIndexRef.current.find(item => item.uuid === projectId);
        const frameworkKey = toFramework(project?.frameworkKey);
        const mappedSites = loadedSites.map(site => mapSiteToIndexSite(site, frameworkKey));

        if (fullProject != null) {
          setFullProjectsById(current => {
            if (current.has(projectId)) {
              return current;
            }
            const next = new Map(current);
            next.set(projectId, fullProject);
            return next;
          });
        }

        loadedProjectIdsRef.current = new Set(loadedProjectIdsRef.current).add(projectId);
        setSitesByProjectId(current => new Map(current).set(projectId, mappedSites));
        setLoadedProjectIds(current => new Set(current).add(projectId));
      } catch (error) {
        Log.error("Failed to load sites for project", error);
      } finally {
        inFlightRef.current.delete(projectId);
        if (requestId === requestIdRef.current) {
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

  const onProjectOpened = useCallback(
    (projectId: string) => {
      void loadSitesIfNeeded(projectId);
    },
    [loadSitesIfNeeded]
  );

  const viewProjects = useMemo(
    () =>
      projectIndex
        .map(project =>
          toSiteIndexProject(project, {
            fullProject: fullProjectsById.get(project.uuid) ?? asFullProject(project)
          })
        )
        .sort((left, right) => left.name.localeCompare(right.name)),
    [fullProjectsById, projectIndex]
  );

  const projects = useMemo(() => {
    return groupSitesByProject(projectIndex, discoveredSites, fullProjectsById)
      .filter(section => section.sites.length > 0)
      .map(section => {
        const lightProject = projectIndex.find(item => item.uuid === section.id);
        const sites = sitesByProjectId.get(section.id) ?? section.sites;
        const sitesLoaded = loadedProjectIds.has(section.id);
        const sitesLoading = loadingProjectIds.has(section.id);

        if (lightProject == null) {
          return { ...section, sites, sitesLoaded, sitesLoading };
        }

        return toSiteIndexProject(lightProject, {
          fullProject: fullProjectsById.get(section.id) ?? asFullProject(lightProject),
          sites,
          sitesLoaded,
          sitesLoading
        });
      });
  }, [discoveredSites, fullProjectsById, loadedProjectIds, loadingProjectIds, projectIndex, sitesByProjectId]);

  return {
    loading,
    loadingMore,
    hasMore,
    loadMore,
    viewProjects,
    projects,
    totalSiteCount,
    onProjectOpened
  };
};
