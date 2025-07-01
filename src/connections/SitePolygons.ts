import { isEmpty } from "lodash";
import { useEffect, useState } from "react";

import { ApiConnectionFactory } from "@/connections/util/apiConnectionFactory";
import {
  sitePolygonsIndex,
  SitePolygonsIndexQueryParams,
  SitePolygonsIndexVariables
} from "@/generated/v3/researchService/researchServiceComponents";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import {
  sitePolygonsIndexFetchFailed,
  sitePolygonsIndexIndexMeta
} from "@/generated/v3/researchService/researchServiceSelectors";
import { useStableProps } from "@/hooks/useStableProps";
import { PendingErrorState } from "@/store/apiSlice";
import { ConnectionProps } from "@/types/connection";
import { loadConnection } from "@/utils/loadConnection";

export type Indicator = Required<SitePolygonsIndexQueryParams>["presentIndicator[]"] extends Array<infer T> ? T : never;
export type PolygonStatus = Required<SitePolygonsIndexQueryParams>["polygonStatus[]"] extends Array<infer T>
  ? T
  : never;

type SitePolygonFilter = Omit<
  SitePolygonsIndexQueryParams,
  "page[size]" | "page[after]" | "page[number]" | "projectId[]" | "siteId[]"
>;

export const sitePolygonsConnection = ApiConnectionFactory.index<SitePolygonLightDto, SitePolygonsIndexVariables>(
  "sitePolygons",
  sitePolygonsIndex,
  sitePolygonsIndexIndexMeta,
  () => ({ queryParams: { lightResource: true } })
)
  .loadFailure(sitePolygonsIndexFetchFailed)
  .pagination()
  .enabledProp()
  .filter<SitePolygonFilter>()
  .addProps<{ entityName?: "projects" | "sites"; entityUuid?: string }>(({ entityName, entityUuid }) => {
    if (entityName === "projects" && entityUuid != null) return { queryParams: { "projectId[]": [entityUuid] } };
    if (entityName === "sites" && entityUuid != null) return { queryParams: { "siteId[]": [entityUuid] } };
    return {};
  })
  .buildConnection();

const ALL_POLYGONS_PAGE_SIZE = 100;

export const useAllSitePolygons = (
  props: Omit<ConnectionProps<typeof sitePolygonsConnection>, "pageNumber" | "pageSize">
) => {
  const [allPolygons, setAllPolygons] = useState<SitePolygonLightDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<PendingErrorState | null>(null);

  const stableProps = useStableProps(props);

  useEffect(() => {
    if (!stableProps.enabled || isEmpty(stableProps.entityUuid)) {
      setIsLoading(false);
      setAllPolygons([]);
      return;
    }

    const fetchAllPages = async () => {
      setIsLoading(true);
      setError(null);
      setAllPolygons([]);

      try {
        const firstPageResponse = await loadConnection(sitePolygonsConnection, {
          ...stableProps,
          pageSize: ALL_POLYGONS_PAGE_SIZE,
          pageNumber: 1
        });

        if (firstPageResponse.loadFailure) {
          throw firstPageResponse.loadFailure;
        }

        const polygons = firstPageResponse.data ?? [];
        const total = firstPageResponse.indexTotal ?? 0;

        if (total === 0) {
          setAllPolygons([]);
          setIsLoading(false);
          return;
        }

        const totalPages = Math.ceil(total / ALL_POLYGONS_PAGE_SIZE);

        if (totalPages === 1) {
          setAllPolygons(polygons);
          setIsLoading(false);
          return;
        }

        const remainingPageNumbers = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
        const pagePromises = remainingPageNumbers.map(pageNumber =>
          loadConnection(sitePolygonsConnection, {
            ...stableProps,
            pageSize: ALL_POLYGONS_PAGE_SIZE,
            pageNumber: pageNumber
          })
        );

        const remainingPages = await Promise.all(pagePromises);

        let allFetchedPolygons = [...polygons];
        for (const page of remainingPages) {
          if (page.loadFailure) {
            throw page.loadFailure;
          }
          allFetchedPolygons.push(...(page.data ?? []));
        }

        setAllPolygons(allFetchedPolygons);
      } catch (e: any) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllPages();
  }, [stableProps]);

  return { data: allPolygons, isLoading, error };
};
