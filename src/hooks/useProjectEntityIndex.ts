import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { loadFullProject, loadNurseryIndex, loadProjectIndex, loadSiteIndex } from "@/connections/Entity";
import type { NurseryLightDto, ProjectLightDto, SiteLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { loadAllIndexPages } from "@/hooks/loadAllIndexPages";
import ApiSlice from "@/store/apiSlice";
import Log from "@/utils/log";

type ProjectEntityName = "sites" | "nurseries";

type ProjectEntityIndexParams = {
  reloadNonce?: number;
  search?: string;
  projectUuid?: string;
  enabled?: boolean;
  includeProject?: (project: ProjectLightDto) => boolean;
};

type ProjectEntityIndexData<T> = {
  projects: ProjectLightDto[];
  viewProjects: ProjectLightDto[];
  visibleProjects: ProjectLightDto[];
  childrenByProjectId: Map<string, T[]>;
  loadingProjectIds: Set<string>;
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  loadMore: () => void;
  onProjectOpened: (projectId: string) => Promise<void>;
  childTotal: number;
  error: boolean;
};

const PROJECT_PAGE_SIZE = 10;
const VIEW_PAGE_SIZE = 100;
const CHILD_PAGE_SIZE = 100;

const mergeProjects = (current: ProjectLightDto[], incoming: ProjectLightDto[]) => {
  const seen = new Set(current.map(project => project.uuid));
  const next = [...current];
  incoming.forEach(project => {
    if (seen.has(project.uuid)) return;
    seen.add(project.uuid);
    next.push(project);
  });
  return next;
};

const loadChildren = async (entity: ProjectEntityName, projectUuid: string) => {
  const loadPage = entity === "sites" ? loadSiteIndex : loadNurseryIndex;
  let total = 0;
  const rows = await loadAllIndexPages<SiteLightDto | NurseryLightDto>(async pageNumber => {
    const page = await loadPage({
      pageNumber,
      pageSize: CHILD_PAGE_SIZE,
      sortField: "name",
      sortDirection: "ASC",
      filter: { projectUuid }
    });
    if (pageNumber === 1) total = page.indexTotal ?? page.data?.length ?? 0;
    return page;
  }, CHILD_PAGE_SIZE);

  return { rows, total };
};

/**
 * Shared project index for sites and nurseries. Pages append in name order.
 * Child rows load for one project uuid when that project is opened.
 * `T` is bound once below, the same way `createEntityIndexConnection<SiteLightDto>("sites")` is.
 */
const useProjectEntityIndex = <T extends SiteLightDto | NurseryLightDto>(
  entity: ProjectEntityName,
  params: ProjectEntityIndexParams = {}
): ProjectEntityIndexData<T> => {
  const { reloadNonce = 0, search = "", projectUuid, enabled = true } = params;
  const trimmedSearch = search.trim();
  const includeProjectRef = useRef(params.includeProject);
  includeProjectRef.current = params.includeProject;
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [projects, setProjects] = useState<ProjectLightDto[]>([]);
  const [catalog, setCatalog] = useState<ProjectLightDto[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [childrenByProjectId, setChildrenByProjectId] = useState<Map<string, T[]>>(new Map());
  const [loadingProjectIds, setLoadingProjectIds] = useState<Set<string>>(new Set());
  const [childTotal, setChildTotal] = useState(0);
  const pageRef = useRef(1);
  const requestIdRef = useRef(0);
  const loadedProjectIdsRef = useRef(new Set<string>());
  const projectsRef = useRef(projects);
  projectsRef.current = projects;
  const projectUuidRef = useRef(projectUuid);
  projectUuidRef.current = projectUuid;

  const acceptProjects = useCallback((incoming: ProjectLightDto[]) => {
    const includeProject = includeProjectRef.current;
    if (includeProject == null) return incoming;
    return incoming.filter(includeProject);
  }, []);

  const loadProjectPage = useCallback(
    (pageNumber: number) =>
      loadProjectIndex({
        pageNumber,
        pageSize: PROJECT_PAGE_SIZE,
        sortField: "name",
        sortDirection: "ASC",
        ...(trimmedSearch === "" ? {} : { filter: { search: trimmedSearch } })
      }),
    [trimmedSearch]
  );

  useEffect(() => {
    if (!enabled) {
      setLoading(true);
      return;
    }

    let cancelled = false;
    const requestId = ++requestIdRef.current;
    pageRef.current = 1;
    loadedProjectIdsRef.current = new Set();

    if (projectUuid != null) {
      setHasMore(false);
      setLoadingMore(false);
      return () => {
        cancelled = true;
      };
    }

    const loadFirstPage = async () => {
      setLoading(true);
      setLoadingMore(false);
      setError(false);
      setHasMore(false);
      setProjects([]);
      setChildrenByProjectId(new Map());
      setLoadingProjectIds(new Set());

      if (reloadNonce > 0) {
        ApiSlice.pruneIndex("projects", "");
        ApiSlice.pruneIndex(entity, "");
      }

      try {
        const page = await loadProjectPage(1);
        if (cancelled || requestId !== requestIdRef.current) return;
        if (page.loadFailure != null) throw page.loadFailure;

        const loaded = acceptProjects(page.data ?? []);
        const selectedId = projectUuidRef.current;
        setProjects(current => {
          if (selectedId == null) return loaded;
          const selected = current.find(project => project.uuid === selectedId);
          if (selected == null || loaded.some(project => project.uuid === selectedId)) return loaded;
          return mergeProjects(loaded, [selected]);
        });
        const total = page.indexTotal ?? loaded.length;
        setHasMore(PROJECT_PAGE_SIZE < total);
        setLoading(false);
      } catch (loadError) {
        Log.error("Failed to load project index", loadError);
        if (!cancelled && requestId === requestIdRef.current) {
          setProjects([]);
          setHasMore(false);
          setError(true);
          setLoading(false);
        }
      }
    };

    void loadFirstPage();

    return () => {
      cancelled = true;
    };
  }, [acceptProjects, enabled, entity, loadProjectPage, projectUuid, reloadNonce]);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const loadCatalog = async () => {
      try {
        const rows = await loadAllIndexPages<ProjectLightDto>(
          pageNumber =>
            loadProjectIndex({
              pageNumber,
              pageSize: VIEW_PAGE_SIZE,
              sortField: "name",
              sortDirection: "ASC"
            }),
          VIEW_PAGE_SIZE
        );
        if (!cancelled) setCatalog(acceptProjects(rows));
      } catch (loadError) {
        Log.error("Failed to load the project view list", loadError);
      }
    };

    void loadCatalog();

    return () => {
      cancelled = true;
    };
  }, [acceptProjects, enabled, reloadNonce]);

  useEffect(() => {
    if (!enabled || projectUuid != null) return;

    let cancelled = false;
    const loadPage = entity === "sites" ? loadSiteIndex : loadNurseryIndex;

    const loadTotal = async () => {
      const page = await loadPage({
        pageNumber: 1,
        pageSize: 1,
        ...(projectUuid == null ? {} : { filter: { projectUuid } })
      });
      if (cancelled || page.loadFailure != null) return;
      setChildTotal(page.indexTotal ?? page.data?.length ?? 0);
    };

    void loadTotal();

    return () => {
      cancelled = true;
    };
  }, [enabled, entity, projectUuid, reloadNonce]);

  const loadMore = useCallback(async () => {
    if (!enabled || projectUuid != null || !hasMore || loadingMore) return;

    const requestId = requestIdRef.current;
    const nextPage = pageRef.current + 1;
    setLoadingMore(true);

    try {
      const page = await loadProjectPage(nextPage);
      if (requestId !== requestIdRef.current) return;
      if (page.loadFailure != null) throw page.loadFailure;

      setProjects(current => mergeProjects(current, acceptProjects(page.data ?? [])));
      pageRef.current = nextPage;
      const total = page.indexTotal ?? 0;
      setHasMore(nextPage * PROJECT_PAGE_SIZE < total);
    } catch (loadError) {
      Log.error("Failed to load the next project page", loadError);
      if (requestId === requestIdRef.current) setHasMore(false);
    } finally {
      if (requestId === requestIdRef.current) setLoadingMore(false);
    }
  }, [acceptProjects, enabled, hasMore, loadProjectPage, loadingMore, projectUuid]);

  const onProjectOpened = useCallback(
    async (projectId: string) => {
      if (projectId === "" || loadedProjectIdsRef.current.has(projectId)) return;
      loadedProjectIdsRef.current.add(projectId);
      setLoadingProjectIds(current => new Set(current).add(projectId));

      try {
        const { rows, total } = await loadChildren(entity, projectId);
        setChildrenByProjectId(current => new Map(current).set(projectId, rows as T[]));
        if (projectUuidRef.current === projectId) setChildTotal(total);
      } catch (loadError) {
        Log.error("Failed to load project children", loadError);
        loadedProjectIdsRef.current.delete(projectId);
      } finally {
        setLoadingProjectIds(current => {
          const next = new Set(current);
          next.delete(projectId);
          return next;
        });
      }
    },
    [entity]
  );

  useEffect(() => {
    if (!enabled || projectUuid == null) return;
    if (projectsRef.current.some(project => project.uuid === projectUuid)) {
      void onProjectOpened(projectUuid);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadSelectedProject = async () => {
      const result = await loadFullProject({ id: projectUuid });
      const selected = result.data;
      if (cancelled) return;
      if (selected == null) {
        setLoading(false);
        return;
      }
      // The index list is typed as the light DTO. A full project has those fields plus the rest.
      const listed = selected as ProjectLightDto;
      const includeProject = includeProjectRef.current;
      if (includeProject != null && !includeProject(listed)) {
        setLoading(false);
        return;
      }
      setProjects(current => mergeProjects(current, [listed]));
      void onProjectOpened(projectUuid);
      setLoading(false);
    };

    void loadSelectedProject();

    return () => {
      cancelled = true;
    };
  }, [enabled, onProjectOpened, projectUuid]);

  const visibleProjects = useMemo(() => {
    if (projectUuid == null) return projects;
    return projects.filter(project => project.uuid === projectUuid);
  }, [projectUuid, projects]);

  const viewProjects = useMemo(() => {
    const listed = catalog.length > 0 ? catalog : projects;
    if (projectUuid == null || listed.some(project => project.uuid === projectUuid)) return listed;
    const selected = projects.find(project => project.uuid === projectUuid);
    return selected == null ? listed : mergeProjects(listed, [selected]);
  }, [catalog, projectUuid, projects]);

  return {
    projects,
    viewProjects,
    visibleProjects,
    childrenByProjectId,
    loadingProjectIds,
    loading,
    loadingMore,
    hasMore: projectUuid == null && hasMore,
    loadMore,
    onProjectOpened,
    childTotal,
    error
  };
};

export const useSiteProjectIndex = (params: ProjectEntityIndexParams = {}) =>
  useProjectEntityIndex<SiteLightDto>("sites", params);

export const useNurseryProjectIndex = (params: ProjectEntityIndexParams = {}) =>
  useProjectEntityIndex<NurseryLightDto>("nurseries", params);
