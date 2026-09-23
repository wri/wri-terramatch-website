import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { loadFullProject, loadProjectIndex, loadSiteIndex } from "@/connections/Entity";
import { toFramework } from "@/context/framework.provider";
import type { ProjectFullDto, ProjectLightDto, SiteLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import ApiSlice, { type ApiFilteredIndexCache } from "@/store/apiSlice";
import Log from "@/utils/log";

import type { SiteIndexProject } from "./siteIndex.types";
import { mapSiteToIndexSite, toSiteIndexProject, toSiteIndexUpdateRequestStatus } from "./siteIndex.utils";
import type { SiteIndexFilterStatus, SiteIndexFilterUpdate } from "./SiteIndexFilterDrawer";

type UseSiteIndexDataParams = {
  reloadNonce?: number;
  search?: string;
  statusFilters?: SiteIndexFilterStatus[];
  updateFilter?: SiteIndexFilterUpdate | null;
  projectUuid?: string;
  enabled?: boolean;
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

export const PROJECT_PAGE_SIZE = 10;
const VIEW_CATALOG_PAGE_SIZE = 100;

const PROJECT_SITE_SIDELOADS = [{ entity: "sites" as const, pageSize: 100 }];
const SEARCH_SITES_PAGE_SIZE = 100;
const SEARCH_SITES_MAX_PAGES = 3;
const CLOSED_PROJECT_ROW_PX = 80;
const PAGE_CHROME_PX = 280;
export const SECTION_SITES_PAGE_SIZE = 100;
export const SEARCH_DEBOUNCE_MS = 300;

const getViewportProjectCount = () => {
  if (typeof window === "undefined") return PROJECT_PAGE_SIZE;
  const availableHeight = window.innerHeight - PAGE_CHROME_PX;
  return Math.max(1, Math.min(20, Math.ceil(availableHeight / CLOSED_PROJECT_ROW_PX)));
};

type IndexPage<T> = {
  data?: T[] | null;
  indexTotal?: number | null;
  loadFailure?: unknown;
};

const loadLimitedIndexPages = async <T>(
  loadPage: (pageNumber: number) => Promise<IndexPage<T>>,
  pageSize: number,
  maxPages: number
): Promise<T[]> => {
  const firstPage = await loadPage(1);
  if (firstPage.loadFailure != null) throw firstPage.loadFailure;

  const items = [...(firstPage.data ?? [])];
  const total = firstPage.indexTotal ?? items.length;
  const lastPage = Math.min(maxPages, Math.max(1, Math.ceil(total / pageSize)));

  for (let pageNumber = 2; pageNumber <= lastPage; pageNumber++) {
    const page = await loadPage(pageNumber);
    if (page.loadFailure != null) throw page.loadFailure;
    items.push(...(page.data ?? []));
  }

  return items;
};

const getSiteProjectId = (site: SiteLightDto) => {
  const typed = site as SiteLightDto & { projectUuid?: string | null };
  if (typed.projectUuid != null && typed.projectUuid !== "") return typed.projectUuid;

  const related =
    ApiSlice.currentState.sites[site.uuid]?.relationships?.project ??
    ApiSlice.currentState.sites[site.uuid]?.relationships?.projects ??
    [];
  const relatedId = related[0]?.id;
  return relatedId != null && relatedId !== "" ? relatedId : null;
};

const loadFilteredSites = async ({
  search = "",
  status,
  updateRequestStatus,
  projectUuid
}: {
  search?: string;
  status?: string;
  updateRequestStatus?: string;
  projectUuid?: string;
}) => {
  try {
    return await loadLimitedIndexPages<SiteLightDto>(
      pageNumber =>
        loadSiteIndex({
          pageNumber,
          pageSize: SEARCH_SITES_PAGE_SIZE,
          sortField: "name",
          sortDirection: "ASC",
          filter: {
            ...(search === "" ? {} : { search }),
            ...(status == null || status === "" ? {} : { status }),
            ...(updateRequestStatus == null || updateRequestStatus === "" ? {} : { updateRequestStatus }),
            ...(requireProjectUuid(projectUuid) ? { projectUuid } : {})
          }
        }),
      SEARCH_SITES_PAGE_SIZE,
      SEARCH_SITES_MAX_PAGES
    );
  } catch (error) {
    Log.error("Failed to filter sites", error);
    return [] as SiteLightDto[];
  }
};

const loadSitesForFilters = async ({
  search = "",
  statusFilters = [],
  updateFilter = null,
  projectUuid
}: {
  search?: string;
  statusFilters?: SiteIndexFilterStatus[];
  updateFilter?: SiteIndexFilterUpdate | null;
  projectUuid?: string;
}) => {
  const updateRequestStatus = toSiteIndexUpdateRequestStatus(updateFilter);
  const statuses = statusFilters.length > 0 ? statusFilters : [undefined];
  const pages = await Promise.all(
    statuses.map(status =>
      loadFilteredSites({
        search,
        status,
        updateRequestStatus,
        projectUuid
      })
    )
  );

  const sitesById = new Map<string, SiteLightDto>();
  pages.flat().forEach(site => sitesById.set(site.uuid, site));
  return [...sitesById.values()];
};

const loadAllIndexPages = async <T>(
  loadPage: (pageNumber: number) => Promise<IndexPage<T>>,
  pageSize: number
): Promise<T[]> => {
  const firstPage = await loadPage(1);
  if (firstPage.loadFailure != null) throw firstPage.loadFailure;

  const items = [...(firstPage.data ?? [])];
  const total = firstPage.indexTotal ?? items.length;
  const lastPage = Math.max(1, Math.ceil(total / pageSize));

  for (let pageNumber = 2; pageNumber <= lastPage; pageNumber++) {
    const page = await loadPage(pageNumber);
    if (page.loadFailure != null) throw page.loadFailure;
    items.push(...(page.data ?? []));
  }

  return items;
};

const asFullProject = (project: ProjectLightDto | ProjectFullDto | undefined): ProjectFullDto | undefined =>
  project != null && project.lightResource === false ? (project as ProjectFullDto) : undefined;

const requireProjectUuid = (projectUuid?: string): projectUuid is string => projectUuid != null && projectUuid !== "";

const projectMatchesSearch = (project: ProjectLightDto, search: string) => {
  if (search === "") return true;
  const query = search.toLocaleLowerCase();
  return [project.name, project.organisationName, project.shortName].some(value =>
    (value ?? "").toLocaleLowerCase().includes(query)
  );
};

const getSideloadedSitesPage = (projectUuid: string) => {
  if (!requireProjectUuid(projectUuid)) return null;

  const sitePages = ApiSlice.currentState.meta.indices.sites;
  if (sitePages == null) return null;

  const marker = `projectUuid=${projectUuid}`;

  for (const [requestPath, pages] of Object.entries(sitePages) as [string, Record<number, ApiFilteredIndexCache>][]) {
    const path = decodeURIComponent(requestPath);
    if (!requestPath.includes(marker) && !path.includes(marker)) continue;
    return pages[1] ?? Object.values(pages)[0] ?? null;
  }

  return null;
};

const getSideloadedSiteCount = (projectUuid: string) => {
  const page = getSideloadedSitesPage(projectUuid);
  if (page == null) return 0;
  return page.total ?? page.ids.length;
};

const getSideloadedSites = (projectUuid: string) => {
  const page = getSideloadedSitesPage(projectUuid);
  if (page == null) return [] as SiteLightDto[];

  return page.ids
    .map(id => ApiSlice.currentState.sites[id]?.attributes as SiteLightDto | undefined)
    .filter((site): site is SiteLightDto => site != null);
};

const loadProjectSites = async (projectUuid: string) => {
  if (!requireProjectUuid(projectUuid)) {
    Log.error("Skipped sites request without projectUuid");
    return [] as SiteLightDto[];
  }

  const sideloaded = getSideloadedSites(projectUuid);
  const total = getSideloadedSiteCount(projectUuid);
  if (sideloaded.length >= total) return sideloaded;

  return loadAllIndexPages<SiteLightDto>(
    pageNumber =>
      loadSiteIndex({
        pageNumber,
        pageSize: SECTION_SITES_PAGE_SIZE,
        sortField: "name",
        sortDirection: "ASC",
        filter: { projectUuid }
      }),
    SECTION_SITES_PAGE_SIZE
  );
};

export const useSiteIndexData = ({
  reloadNonce = 0,
  search = "",
  statusFilters = [],
  updateFilter = null,
  projectUuid,
  enabled = true
}: UseSiteIndexDataParams = {}): UseSiteIndexDataResult => {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [projectIndex, setProjectIndex] = useState<ProjectLightDto[]>([]);
  const [viewProjectIndex, setViewProjectIndex] = useState<ProjectLightDto[]>([]);
  const [siteCountByProjectId, setSiteCountByProjectId] = useState<Map<string, number>>(new Map());
  const [sitesByProjectId, setSitesByProjectId] = useState<Map<string, SiteIndexProject["sites"]>>(new Map());
  const [fullProjectsById, setFullProjectsById] = useState<Map<string, ProjectFullDto>>(new Map());
  const [loadedProjectIds, setLoadedProjectIds] = useState<Set<string>>(new Set());
  const [loadingProjectIds, setLoadingProjectIds] = useState<Set<string>>(new Set());
  const [hasMorePages, setHasMorePages] = useState(false);

  const projectIndexRef = useRef(projectIndex);
  const loadedProjectIdsRef = useRef(loadedProjectIds);
  loadedProjectIdsRef.current = loadedProjectIds;
  const fullProjectsByIdRef = useRef(fullProjectsById);
  fullProjectsByIdRef.current = fullProjectsById;
  const siteCountByProjectIdRef = useRef(siteCountByProjectId);
  siteCountByProjectIdRef.current = siteCountByProjectId;
  const matchingProjectsRef = useRef<ProjectLightDto[]>([]);
  const nextPageNumberRef = useRef(1);
  const projectTotalRef = useRef<number | null>(null);
  const probingRef = useRef(false);
  const inFlightRef = useRef(new Set<string>());
  const requestIdRef = useRef(0);
  const viewCatalogRequestIdRef = useRef(0);
  const projectUuidRef = useRef(projectUuid);
  projectUuidRef.current = projectUuid;

  const normalisedSearch = search.trim();

  const loadSitesIfNeeded = useCallback(async (projectId: string) => {
    if (!requireProjectUuid(projectId)) return;
    if (
      !projectIndexRef.current.some(project => project.uuid === projectId) ||
      loadedProjectIdsRef.current.has(projectId) ||
      inFlightRef.current.has(projectId)
    ) {
      return;
    }

    inFlightRef.current.add(projectId);
    setLoadingProjectIds(current => new Set(current).add(projectId));

    try {
      const loadedSites = await loadProjectSites(projectId);
      if (
        !projectIndexRef.current.some(project => project.uuid === projectId) ||
        loadedProjectIdsRef.current.has(projectId)
      ) {
        return;
      }

      const project = projectIndexRef.current.find(item => item.uuid === projectId);
      const mappedSites = loadedSites.map(site => mapSiteToIndexSite(site, toFramework(project?.frameworkKey)));

      loadedProjectIdsRef.current = new Set(loadedProjectIdsRef.current).add(projectId);
      setSitesByProjectId(current => new Map(current).set(projectId, mappedSites));
      setLoadedProjectIds(current => new Set(current).add(projectId));
      setSiteCountByProjectId(current => {
        const next = new Map(current);
        next.set(projectId, mappedSites.length);
        siteCountByProjectIdRef.current = next;
        return next;
      });

      if (fullProjectsByIdRef.current.has(projectId)) return;

      const result = await loadFullProject({ id: projectId });
      if (result.data == null || !projectIndexRef.current.some(project => project.uuid === projectId)) return;

      setFullProjectsById(current => {
        if (current.has(projectId)) return current;
        const next = new Map(current);
        next.set(projectId, result.data!);
        return next;
      });
    } catch {
      if (!projectIndexRef.current.some(project => project.uuid === projectId)) return;
      loadedProjectIdsRef.current = new Set(loadedProjectIdsRef.current).add(projectId);
      setLoadedProjectIds(current => new Set(current).add(projectId));
    } finally {
      inFlightRef.current.delete(projectId);
      setLoadingProjectIds(current => {
        const next = new Set(current);
        next.delete(projectId);
        return next;
      });
    }
  }, []);

  const matchingProjects = useMemo(() => {
    const source = projectUuid != null ? projectIndex.filter(project => project.uuid === projectUuid) : projectIndex;

    if (normalisedSearch === "") return source;

    const query = normalisedSearch.toLocaleLowerCase();
    return source.filter(project => {
      if (projectMatchesSearch(project, normalisedSearch)) return true;
      return (sitesByProjectId.get(project.uuid) ?? []).some(site => site.name.toLocaleLowerCase().includes(query));
    });
  }, [normalisedSearch, projectIndex, projectUuid, sitesByProjectId]);
  matchingProjectsRef.current = matchingProjects;

  const countLoadedProjects = () => matchingProjectsRef.current.length;

  const hasMoreProjectPages = () => {
    if (projectTotalRef.current == null) return true;
    return (nextPageNumberRef.current - 1) * PROJECT_PAGE_SIZE < projectTotalRef.current;
  };

  const loadNextProjectPage = useCallback(
    async (requestId: number) => {
      if (!hasMoreProjectPages() || requestId !== requestIdRef.current) return [] as ProjectLightDto[];

      const search = normalisedSearch;
      const page = await loadProjectIndex({
        pageNumber: nextPageNumberRef.current,
        pageSize: PROJECT_PAGE_SIZE,
        sortField: "name",
        sortDirection: "ASC",
        sideloads: PROJECT_SITE_SIDELOADS,
        ...(search === "" ? {} : { filter: { search } })
      });

      if (page.loadFailure != null && (page.data == null || page.data.length === 0)) {
        throw page.loadFailure;
      }
      if (requestId !== requestIdRef.current) return [] as ProjectLightDto[];

      const loadedProjects = page.data ?? [];
      nextPageNumberRef.current += 1;

      if (page.indexTotal != null) {
        projectTotalRef.current = page.indexTotal;
      } else if (loadedProjects.length < PROJECT_PAGE_SIZE) {
        projectTotalRef.current = projectIndexRef.current.length + loadedProjects.length;
      }

      if (loadedProjects.length === 0) {
        setHasMorePages(false);
        return [] as ProjectLightDto[];
      }

      const existingIds = new Set(projectIndexRef.current.map(project => project.uuid));
      const newProjects = loadedProjects.filter(project => !existingIds.has(project.uuid));
      const nextProjects = [...projectIndexRef.current, ...newProjects];
      projectIndexRef.current = nextProjects;
      matchingProjectsRef.current = nextProjects.filter(project => projectMatchesSearch(project, search));
      setProjectIndex(nextProjects);
      setHasMorePages(hasMoreProjectPages());

      const cachedFullProjects = new Map(fullProjectsByIdRef.current);
      newProjects.forEach(project => {
        const fullProject = asFullProject(project);
        if (fullProject != null) cachedFullProjects.set(project.uuid, fullProject);
      });
      if (cachedFullProjects.size !== fullProjectsByIdRef.current.size) {
        fullProjectsByIdRef.current = cachedFullProjects;
        setFullProjectsById(cachedFullProjects);
      }

      return newProjects;
    },
    [normalisedSearch]
  );

  const applySideloadedSiteCounts = (projects: ProjectLightDto[]) => {
    if (projects.length === 0) return;

    const nextCounts = new Map(siteCountByProjectIdRef.current);
    projects.forEach(project => {
      nextCounts.set(project.uuid, getSideloadedSiteCount(project.uuid));
    });
    siteCountByProjectIdRef.current = nextCounts;
    setSiteCountByProjectId(nextCounts);
  };

  const appendProject = (project: ProjectLightDto | ProjectFullDto) => {
    if (projectIndexRef.current.some(item => item.uuid === project.uuid)) return;

    const nextProjects = [...projectIndexRef.current, project as ProjectLightDto];
    projectIndexRef.current = nextProjects;
    matchingProjectsRef.current = nextProjects;
    setProjectIndex(nextProjects);

    const fullProject = asFullProject(project);
    if (fullProject != null && !fullProjectsByIdRef.current.has(project.uuid)) {
      const nextFull = new Map(fullProjectsByIdRef.current);
      nextFull.set(project.uuid, fullProject);
      fullProjectsByIdRef.current = nextFull;
      setFullProjectsById(nextFull);
    }
  };

  const mergeSearchSites = useCallback(async (sites: SiteLightDto[], requestId: number) => {
    if (sites.length === 0 || requestId !== requestIdRef.current) return;

    const sitesByProject = new Map<string, SiteLightDto[]>();
    const unmatched: SiteLightDto[] = [];

    sites.forEach(site => {
      const projectId = getSiteProjectId(site);
      if (projectId == null) {
        unmatched.push(site);
        return;
      }
      const current = sitesByProject.get(projectId) ?? [];
      current.push(site);
      sitesByProject.set(projectId, current);
    });

    const matchByName = (site: SiteLightDto) => {
      const projectName = (site.projectName ?? "").trim().toLocaleLowerCase();
      if (projectName === "") return;
      const project = projectIndexRef.current.find(
        item =>
          (item.name ?? "").trim().toLocaleLowerCase() === projectName ||
          (item.shortName ?? "").trim().toLocaleLowerCase() === projectName
      );
      if (project == null) return;
      const current = sitesByProject.get(project.uuid) ?? [];
      current.push(site);
      sitesByProject.set(project.uuid, current);
    };

    unmatched.forEach(matchByName);

    const remaining = unmatched.filter(site => {
      const projectName = (site.projectName ?? "").trim().toLocaleLowerCase();
      return (
        projectName !== "" &&
        !projectIndexRef.current.some(
          item =>
            (item.name ?? "").trim().toLocaleLowerCase() === projectName ||
            (item.shortName ?? "").trim().toLocaleLowerCase() === projectName
        )
      );
    });

    const missingNames = [...new Set(remaining.map(site => site.projectName?.trim() ?? "").filter(Boolean))];
    await Promise.all(
      missingNames.map(async name => {
        try {
          const page = await loadProjectIndex({
            pageNumber: 1,
            pageSize: PROJECT_PAGE_SIZE,
            sortField: "name",
            sortDirection: "ASC",
            sideloads: PROJECT_SITE_SIDELOADS,
            filter: { search: name }
          });
          if (requestId !== requestIdRef.current) return;
          (page.data ?? []).forEach(appendProject);
          applySideloadedSiteCounts(page.data ?? []);
        } catch (error) {
          Log.error("Failed to load project for site name search", error);
        }
      })
    );

    if (requestId !== requestIdRef.current) return;
    remaining.forEach(matchByName);

    const missingIds = [...sitesByProject.keys()].filter(
      id => !projectIndexRef.current.some(project => project.uuid === id)
    );
    await Promise.all(
      missingIds.map(async id => {
        const result = await loadFullProject({ id });
        if (requestId !== requestIdRef.current || result.data == null) return;
        appendProject(result.data);
      })
    );

    if (requestId !== requestIdRef.current) return;

    setSitesByProjectId(current => {
      const next = new Map(current);
      sitesByProject.forEach((projectSites, projectId) => {
        const project = projectIndexRef.current.find(item => item.uuid === projectId);
        next.set(
          projectId,
          projectSites.map(site => mapSiteToIndexSite(site, toFramework(project?.frameworkKey ?? site.frameworkKey)))
        );
      });
      return next;
    });

    loadedProjectIdsRef.current = new Set([...loadedProjectIdsRef.current, ...sitesByProject.keys()]);
    setLoadedProjectIds(current => new Set([...current, ...sitesByProject.keys()]));

    const nextCounts = new Map(siteCountByProjectIdRef.current);
    sitesByProject.forEach((projectSites, projectId) => {
      nextCounts.set(
        projectId,
        Math.max(nextCounts.get(projectId) ?? 0, projectSites.length, getSideloadedSiteCount(projectId))
      );
    });
    siteCountByProjectIdRef.current = nextCounts;
    setSiteCountByProjectId(nextCounts);
  }, []);

  const loadNextProjectBatch = useCallback(
    async (requestId: number) => {
      if (requestId !== requestIdRef.current) return false;
      probingRef.current = true;

      try {
        const newProjects = await loadNextProjectPage(requestId);
        if (requestId !== requestIdRef.current) return false;
        applySideloadedSiteCounts(newProjects);
        return newProjects.length > 0;
      } catch (error) {
        Log.error("Failed to load next project page for site index", error);
        return false;
      } finally {
        if (requestId === requestIdRef.current) probingRef.current = false;
      }
    },
    [loadNextProjectPage]
  );

  useEffect(() => {
    if (!enabled) {
      setLoading(true);
      return;
    }

    let cancelled = false;
    const requestId = ++requestIdRef.current;
    inFlightRef.current.clear();
    loadedProjectIdsRef.current = new Set();
    probingRef.current = false;
    nextPageNumberRef.current = 1;
    projectTotalRef.current = null;
    projectIndexRef.current = [];
    matchingProjectsRef.current = [];

    const loadIndex = async () => {
      setLoading(true);
      setLoadingMore(false);
      setHasMorePages(false);
      setProjectIndex([]);
      setViewProjectIndex([]);
      setSiteCountByProjectId(new Map());
      siteCountByProjectIdRef.current = new Map();
      setSitesByProjectId(new Map());
      setLoadedProjectIds(new Set());
      setLoadingProjectIds(new Set());
      setFullProjectsById(new Map());
      fullProjectsByIdRef.current = new Map();

      if (reloadNonce > 0) {
        ApiSlice.pruneIndex("projects", "");
        ApiSlice.pruneIndex("sites", "");
      }

      const visibleTarget = getViewportProjectCount();
      const hasStatusOrUpdateFilter = statusFilters.length > 0 || updateFilter != null;
      const isScopedToProject = requireProjectUuid(projectUuid);

      const loadViewCatalog = async () => {
        const viewRequestId = ++viewCatalogRequestIdRef.current;
        const allProjects: ProjectLightDto[] = [];
        let pageNumber = 1;
        let total: number | null = null;

        while (!cancelled) {
          const page = await loadProjectIndex({
            pageNumber,
            pageSize: VIEW_CATALOG_PAGE_SIZE,
            sortField: "name",
            sortDirection: "ASC"
          });
          if (cancelled || viewRequestId !== viewCatalogRequestIdRef.current) return;

          const batch = page.data ?? [];
          allProjects.push(...batch);
          if (page.indexTotal != null) total = page.indexTotal;
          if (
            batch.length === 0 ||
            batch.length < VIEW_CATALOG_PAGE_SIZE ||
            (total != null && allProjects.length >= total)
          ) {
            break;
          }
          pageNumber += 1;
        }

        if (cancelled || viewRequestId !== viewCatalogRequestIdRef.current) return;
        setViewProjectIndex(allProjects);
      };

      try {
        if (normalisedSearch !== "" || hasStatusOrUpdateFilter) {
          const matchingSites = await loadSitesForFilters({
            search: normalisedSearch,
            statusFilters,
            updateFilter,
            projectUuid
          });
          if (cancelled || requestId !== requestIdRef.current) return;
          await mergeSearchSites(matchingSites, requestId);
          void loadViewCatalog();
        } else if (isScopedToProject) {
          const result = await loadFullProject({ id: projectUuid });
          if (cancelled || requestId !== requestIdRef.current || result.data == null) return;

          appendProject(result.data);
          setViewProjectIndex([result.data as ProjectLightDto]);
          void loadViewCatalog();

          const sitesPage = await loadSiteIndex({
            pageNumber: 1,
            pageSize: 1,
            sortField: "name",
            sortDirection: "ASC",
            filter: { projectUuid }
          });
          if (cancelled || requestId !== requestIdRef.current) return;

          const siteCount = sitesPage.indexTotal ?? sitesPage.data?.length ?? 0;
          const nextCounts = new Map(siteCountByProjectIdRef.current);
          nextCounts.set(projectUuid, siteCount);
          siteCountByProjectIdRef.current = nextCounts;
          setSiteCountByProjectId(nextCounts);
          setHasMorePages(false);
        } else {
          void loadViewCatalog();
          do {
            const loadedBatch = await loadNextProjectBatch(requestId);
            if (!loadedBatch) break;
          } while (
            !cancelled &&
            requestId === requestIdRef.current &&
            hasMoreProjectPages() &&
            countLoadedProjects() < visibleTarget
          );
        }

        if (!cancelled && requestId === requestIdRef.current) {
          setHasMorePages(!isScopedToProject && !hasStatusOrUpdateFilter && hasMoreProjectPages());
          setLoading(false);
        }
      } catch (error) {
        Log.error("Failed to load site index", error);
        if (!cancelled && requestId === requestIdRef.current) {
          setHasMorePages(!isScopedToProject && !hasStatusOrUpdateFilter && hasMoreProjectPages());
          setLoading(false);
        }
      }
    };

    void loadIndex();

    return () => {
      cancelled = true;
    };
  }, [
    enabled,
    loadNextProjectBatch,
    normalisedSearch,
    projectUuid,
    reloadNonce,
    statusFilters,
    updateFilter,
    mergeSearchSites
  ]);

  const loadMore = useCallback(async () => {
    if (
      projectUuidRef.current != null ||
      statusFilters.length > 0 ||
      updateFilter != null ||
      !hasMorePages ||
      probingRef.current
    ) {
      return;
    }

    const requestId = requestIdRef.current;
    setLoadingMore(true);
    try {
      await loadNextProjectBatch(requestId);
    } finally {
      if (requestId === requestIdRef.current) {
        setHasMorePages(hasMoreProjectPages());
        setLoadingMore(false);
      }
    }
  }, [hasMorePages, loadNextProjectBatch, statusFilters.length, updateFilter]);

  const viewProjects = useMemo(() => {
    const byId = new Map<string, ProjectLightDto>();
    viewProjectIndex.forEach(project => byId.set(project.uuid, project));
    projectIndex.forEach(project => {
      if (!byId.has(project.uuid)) byId.set(project.uuid, project);
    });

    return [...byId.values()]
      .sort((left, right) => (left.name ?? "").localeCompare(right.name ?? ""))
      .map(project =>
        toSiteIndexProject(project, {
          fullProject: fullProjectsById.get(project.uuid) ?? asFullProject(project)
        })
      );
  }, [fullProjectsById, projectIndex, viewProjectIndex]);

  const projects = useMemo(
    () =>
      matchingProjects.map(project =>
        toSiteIndexProject(project, {
          fullProject: fullProjectsById.get(project.uuid) ?? asFullProject(project),
          sites: sitesByProjectId.get(project.uuid) ?? [],
          sitesLoaded: loadedProjectIds.has(project.uuid),
          sitesLoading: loadingProjectIds.has(project.uuid)
        })
      ),
    [fullProjectsById, loadedProjectIds, loadingProjectIds, matchingProjects, sitesByProjectId]
  );

  const totalSiteCount = useMemo(
    () => matchingProjects.reduce((total, project) => total + (siteCountByProjectId.get(project.uuid) ?? 0), 0),
    [matchingProjects, siteCountByProjectId]
  );

  return {
    loading,
    loadingMore,
    hasMore: projectUuid == null && hasMorePages && statusFilters.length === 0 && updateFilter == null,
    loadMore,
    viewProjects,
    projects,
    totalSiteCount,
    onProjectOpened: loadSitesIfNeeded
  };
};
