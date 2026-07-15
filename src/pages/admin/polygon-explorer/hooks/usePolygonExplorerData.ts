import { useEffect, useRef, useState } from "react";

import { sitePolygonsConnection } from "@/connections/SitePolygons";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { loadConnection } from "@/utils/loadConnection";

import { EXPLORER_PAGE_SIZE, FILTER_DEBOUNCE_MS, MAP_FLUSH_PAGE_INTERVAL, PARALLEL_PAGE_REQUESTS } from "../constants";
import type { ExplorerApiQuery } from "./usePolygonExplorerFilters";

export type ExplorerDataResult = {
  /** Polygons loaded so far; flushed to consumers every MAP_FLUSH_PAGE_INTERVAL pages. */
  polygons: SitePolygonLightDto[];
  /** Count of loaded records; updated every batch for the progress loader. */
  loadedCount: number;
  /** Total matching records (known after the first page). */
  total: number;
  isLoading: boolean;
  error: Error | null;
};

const loadPage = (query: ExplorerApiQuery, pageNumber: number) =>
  loadConnection(sitePolygonsConnection, {
    filter: query.filter,
    ...(query.projectUuid !== "" ? { entityName: "projects" as const, entityUuid: query.projectUuid } : {}),
    pageSize: EXPLORER_PAGE_SIZE,
    pageNumber
  });

/**
 * Progressively loads ALL site polygons matching the filter in the background.
 * Read-only: only the GET sitePolygons index endpoint is used. The load restarts
 * (and the in-flight one is abandoned) whenever the filter changes.
 */
export const usePolygonExplorerData = (apiQuery: ExplorerApiQuery): ExplorerDataResult => {
  const [polygons, setPolygons] = useState<SitePolygonLightDto[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const filterKey = JSON.stringify(apiQuery);
  const queryRef = useRef(apiQuery);
  queryRef.current = apiQuery;

  const [debouncedFilterKey, setDebouncedFilterKey] = useState(filterKey);
  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedFilterKey(filterKey), FILTER_DEBOUNCE_MS);
    return () => window.clearTimeout(timeout);
  }, [filterKey]);

  const generationRef = useRef(0);

  useEffect(() => {
    const generation = ++generationRef.current;
    let cancelled = false;
    const isStale = () => cancelled || generationRef.current !== generation;
    const query = queryRef.current;

    setIsLoading(true);
    setError(null);
    setPolygons([]);
    setLoadedCount(0);
    setTotal(0);

    const run = async () => {
      const firstPage = await loadPage(query, 1);
      if (isStale()) return;
      if (firstPage.loadFailure != null) throw firstPage.loadFailure;

      const totalCount = firstPage.indexTotal ?? 0;
      const accumulated: SitePolygonLightDto[] = [...(firstPage.data ?? [])];

      setTotal(totalCount);
      setLoadedCount(accumulated.length);
      setPolygons([...accumulated]);

      if (totalCount <= accumulated.length) {
        setIsLoading(false);
        return;
      }

      const totalPages = Math.ceil(totalCount / EXPLORER_PAGE_SIZE);
      let lastFlushedPage = 1;

      for (let batchStart = 2; batchStart <= totalPages; batchStart += PARALLEL_PAGE_REQUESTS) {
        const batchEnd = Math.min(batchStart + PARALLEL_PAGE_REQUESTS - 1, totalPages);
        const pageNumbers = [];
        for (let page = batchStart; page <= batchEnd; page++) pageNumbers.push(page);

        const responses = await Promise.all(pageNumbers.map(page => loadPage(query, page)));
        if (isStale()) return;

        for (const response of responses) {
          if (response.loadFailure != null) throw response.loadFailure;
          accumulated.push(...(response.data ?? []));
        }

        setLoadedCount(Math.min(accumulated.length, totalCount));
        if (batchEnd - lastFlushedPage >= MAP_FLUSH_PAGE_INTERVAL || batchEnd === totalPages) {
          lastFlushedPage = batchEnd;
          setPolygons([...accumulated]);
        }
      }

      setPolygons([...accumulated]);
      setIsLoading(false);
    };

    run().catch((e: Error) => {
      if (isStale()) return;
      setError(e);
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [debouncedFilterKey]);

  return { polygons, loadedCount, total, isLoading, error };
};
