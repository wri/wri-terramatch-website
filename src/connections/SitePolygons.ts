import { isEmpty } from "lodash";
import { useCallback, useEffect, useState } from "react";

import { v3Resource } from "@/connections/util/apiConnectionFactory";
import {
  sitePolygonsIndex,
  SitePolygonsIndexQueryParams
} from "@/generated/v3/researchService/researchServiceComponents";
import { SitePolygonFullDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { useStableProps } from "@/hooks/useStableProps";
import { PendingError } from "@/store/apiSlice";
import ApiSlice from "@/store/apiSlice";
import { ConnectionProps, Filter } from "@/types/connection";
import { loadConnection } from "@/utils/loadConnection";

const ALL_POLYGONS_PAGE_SIZE = 100;

export type Indicator = Required<SitePolygonsIndexQueryParams>["presentIndicator[]"] extends Array<infer T> ? T : never;
export type PolygonStatus = Required<SitePolygonsIndexQueryParams>["polygonStatus[]"] extends Array<infer T>
  ? T
  : never;

export const sitePolygonsConnection = v3Resource("sitePolygons", sitePolygonsIndex)
  .index<SitePolygonFullDto>(() => ({ queryParams: { lightResource: false } }))
  .pagination()
  .enabledProp()
  .filter<Omit<Filter<SitePolygonsIndexQueryParams>, "projectId[]" | "siteId[]">>()
  .addProps<{ entityName?: "projects" | "sites"; entityUuid?: string }>(({ entityName, entityUuid }) => {
    if (entityName === "projects" && entityUuid != null) return { queryParams: { "projectId[]": [entityUuid] } };
    if (entityName === "sites" && entityUuid != null) return { queryParams: { "siteId[]": [entityUuid] } };
    return {};
  })
  .buildConnection();

export const useAllSitePolygons = (
  props: Omit<ConnectionProps<typeof sitePolygonsConnection>, "pageNumber" | "pageSize"> & {
    sortField?: string;
    sortDirection?: "ASC" | "DESC";
  }
) => {
  const [allPolygons, setAllPolygons] = useState<SitePolygonFullDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<PendingError | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const stableProps = useStableProps(props);

  const fetchAllPages = useCallback(
    async (clearCache: boolean = false) => {
      setIsLoading(true);
      setError(null);
      setAllPolygons([]);
      setProgress(0);
      setTotal(0);

      try {
        if (clearCache) {
          ApiSlice.pruneCache("sitePolygons");

          const currentState = ApiSlice.currentState;
          const sitePolygonsIndices = currentState.meta.indices.sitePolygons ?? {};
          Object.keys(sitePolygonsIndices).forEach(indexKey => {
            ApiSlice.pruneIndex("sitePolygons", indexKey);
          });
        }

        const firstPageResponse = await loadConnection(sitePolygonsConnection, {
          ...stableProps,
          pageSize: ALL_POLYGONS_PAGE_SIZE,
          pageNumber: 1,
          sortField: stableProps.sortField,
          sortDirection: stableProps.sortDirection ?? "ASC"
        });

        if (firstPageResponse.loadFailure) {
          throw firstPageResponse.loadFailure;
        }

        const polygons = firstPageResponse.data ?? [];
        const totalCount = firstPageResponse.indexTotal ?? 0;

        setTotal(totalCount);
        setProgress(Math.min(ALL_POLYGONS_PAGE_SIZE, totalCount));

        if (totalCount === 0) {
          setAllPolygons([]);
          setIsLoading(false);
          return;
        }

        if (totalCount <= ALL_POLYGONS_PAGE_SIZE) {
          setAllPolygons(polygons);
          setIsLoading(false);
          return;
        }

        const totalPages = Math.ceil(totalCount / ALL_POLYGONS_PAGE_SIZE);
        let allFetchedPolygons = [...polygons];

        for (let pageNumber = 2; pageNumber <= totalPages; pageNumber++) {
          const pageResponse = await loadConnection(sitePolygonsConnection, {
            ...stableProps,
            pageSize: ALL_POLYGONS_PAGE_SIZE,
            pageNumber: pageNumber,
            sortField: stableProps.sortField,
            sortDirection: stableProps.sortDirection ?? "ASC"
          });

          if (pageResponse.loadFailure) {
            throw pageResponse.loadFailure;
          }

          allFetchedPolygons.push(...(pageResponse.data ?? []));
          setProgress(Math.min(allFetchedPolygons.length, totalCount));
        }

        setAllPolygons(allFetchedPolygons);
      } catch (e: any) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    },
    [stableProps]
  );

  const refetch = useCallback(() => {
    fetchAllPages(true);
  }, [fetchAllPages]);

  useEffect(() => {
    if (!stableProps.enabled || isEmpty(stableProps.entityUuid)) {
      setIsLoading(false);
      setAllPolygons([]);
      setProgress(0);
      setTotal(0);
      return;
    }

    fetchAllPages();
  }, [stableProps, fetchAllPages]);

  return {
    data: allPolygons,
    isLoading,
    error,
    progress,
    total,
    refetch
  };
};
