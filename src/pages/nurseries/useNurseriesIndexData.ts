import { showToast } from "@worldresources/wri-design-systems";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { loadNurseryIndex, loadProjectIndex } from "@/connections/Entity";
import type { EntityIndexQueryParams } from "@/generated/v3/entityService/entityServiceComponents";
import type { NurseryLightDto, ProjectLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import ApiSlice from "@/store/apiSlice";
import type { Filter, PaginatedConnectionProps } from "@/types/connection";

import type { NurseryIndexData } from "./nurseryIndex.types";
import { buildNurseryProjectSections, createNurseryProjectSection } from "./nurseryIndex.utils";

export const DISCOVERY_PAGE_SIZE = 25;
export const PROJECT_INDEX_PAGE_SIZE = 100;
export const SECTION_NURSERIES_PAGE_SIZE = 100;

type IndexPage<T> = {
  data?: T[] | null;
  indexTotal?: number | null;
};

type NurseryIndexFilter = Filter<EntityIndexQueryParams>;

type NurseryIndexLoadProps = PaginatedConnectionProps & { filter?: NurseryIndexFilter };

export type NurseriesIndexQuery = {
  search?: string;
  projectUuid?: string;
  status?: string;
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

export const loadAllIndexPages = async <T>(
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

const toNurseryFilter = (query: NurseriesIndexQuery): NurseryIndexFilter | undefined => {
  const search = query.search?.trim() === "" ? undefined : query.search?.trim();
  const filter: NurseryIndexFilter = {};

  if (search != null) filter.search = search;
  if (query.projectUuid != null) filter.projectUuid = query.projectUuid;
  if (query.status != null) filter.status = query.status;

  return Object.keys(filter).length === 0 ? undefined : filter;
};

const loadNurseryPage = (pageNumber: number, pageSize: number, query: NurseriesIndexQuery) => {
  const props: NurseryIndexLoadProps = {
    pageNumber,
    pageSize,
    sortField: "projectName",
    sortDirection: "ASC",
    filter: toNurseryFilter(query)
  };

  return loadNurseryIndex(props);
};

export const useNurseriesIndexData = (reloadNonce = 0, query: NurseriesIndexQuery = {}): NurseryIndexData => {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [projects, setProjects] = useState<ProjectLightDto[]>([]);
  const [nurseries, setNurseries] = useState<NurseryLightDto[]>([]);
  const [nurseryTotal, setNurseryTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const pageRef = useRef(1);
  const hasMoreRef = useRef(false);
  const loadingMoreRef = useRef(false);
  const requestIdRef = useRef(0);
  const queryRef = useRef(query);
  queryRef.current = query;

  const loadMore = useCallback(async () => {
    if (loadingMoreRef.current || !hasMoreRef.current) return;

    loadingMoreRef.current = true;
    setLoadingMore(true);
    const requestId = requestIdRef.current;
    const nextPage = pageRef.current + 1;

    try {
      const page = await loadNurseryPage(nextPage, DISCOVERY_PAGE_SIZE, queryRef.current);
      if (requestId !== requestIdRef.current) return;

      const incoming = page.data ?? [];
      setNurseries(current => mergeByUuid(current, incoming));
      pageRef.current = nextPage;
      const total = page.indexTotal ?? 0;
      const nextHasMore = nextPage * DISCOVERY_PAGE_SIZE < total;
      hasMoreRef.current = nextHasMore;
      setHasMore(nextHasMore);
      setNurseryTotal(total);
    } catch {
      if (requestId !== requestIdRef.current) return;
      showToast({
        label: "Failed to load more nurseries",
        type: "error",
        placement: "bottom"
      });
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

    const loadIndex = async () => {
      setLoading(true);
      setLoadingMore(false);
      setError(false);
      setHasMore(false);

      if (reloadNonce > 0) {
        ApiSlice.pruneIndex("projects", "");
        ApiSlice.pruneIndex("nurseries", "");
      }

      try {
        const [loadedProjects, firstNurseries] = await Promise.all([
          loadAllIndexPages<ProjectLightDto>(
            pageNumber => loadProjectIndex({ pageNumber, pageSize: PROJECT_INDEX_PAGE_SIZE }),
            PROJECT_INDEX_PAGE_SIZE
          ),
          loadNurseryPage(1, DISCOVERY_PAGE_SIZE, queryRef.current)
        ]);

        if (cancelled || requestId !== requestIdRef.current) {
          return;
        }

        const nurseryPage = firstNurseries.data ?? [];
        const total = firstNurseries.indexTotal ?? nurseryPage.length;
        setProjects(loadedProjects);
        setNurseries(nurseryPage);
        setNurseryTotal(total);
        const nextHasMore = query.projectUuid == null && DISCOVERY_PAGE_SIZE < total;
        hasMoreRef.current = nextHasMore;
        setHasMore(nextHasMore);
        setLoading(false);
      } catch {
        showToast({
          label: "Failed to load nursery index",
          type: "error",
          placement: "bottom"
        });
        if (!cancelled && requestId === requestIdRef.current) {
          setProjects([]);
          setNurseries([]);
          setNurseryTotal(0);
          setHasMore(false);
          setError(true);
          setLoading(false);
        }
      }
    };

    void loadIndex();

    return () => {
      cancelled = true;
    };
  }, [query.projectUuid, query.search, query.status, reloadNonce]);

  const sections = useMemo(() => {
    if (query.projectUuid != null) {
      const project = projects.find(item => item.uuid === query.projectUuid);
      if (project == null) return [];
      if (nurseryTotal === 0 && nurseries.length === 0) return [];
      return [createNurseryProjectSection(project, nurseries)];
    }

    return buildNurseryProjectSections(nurseries, projects);
  }, [nurseries, nurseryTotal, projects, query.projectUuid]);

  return {
    projects,
    sections,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    nurseryTotal,
    error
  };
};
