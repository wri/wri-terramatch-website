import { Dictionary } from "lodash";
import { useEffect, useState } from "react";
import { createSelector } from "reselect";

import {
  sitePolygonsIndex,
  SitePolygonsIndexQueryParams
} from "@/generated/v3/researchService/researchServiceComponents";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import {
  sitePolygonsIndexFetchFailed,
  sitePolygonsIndexIndexMeta
} from "@/generated/v3/researchService/researchServiceSelectors";
import { ApiDataStore, PendingErrorState } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook, connectionLoader } from "@/utils/connectionShortcuts";
import { loadConnection } from "@/utils/loadConnection";
import { selectorCache } from "@/utils/selectorCache";

export type SitePolygonIndexConnectionProps = {
  entityName: string;
  entityUuid: string;
  search?: string;
  pageSize?: number;
  pageNumber?: number;
  presentIndicator?:
    | "treeCover"
    | "treeCoverLoss"
    | "treeCoverLossFires"
    | "restorationByEcoRegion"
    | "restorationByStrategy"
    | "restorationByLandUse"
    | "treeCount"
    | "earlyTreeVerification"
    | "fieldMonitoring"
    | "msuCarbon";
  polygonStatus?: ("draft" | "submitted" | "needs-more-information" | "approved")[];
  enabled?: boolean;
};

const ENTITY_QUERY_KEYS: Dictionary<keyof SitePolygonsIndexQueryParams> = {
  projects: "projectId[]",
  sites: "siteId[]"
};

type EntityQueryKey = SitePolygonsIndexQueryParams["projectId[]"] | SitePolygonsIndexQueryParams["siteId[]"];

export type SitePolygonIndexConnection<SitePolygonLightDto> = {
  sitePolygons?: SitePolygonLightDto[];
  total?: number;
  fetchFailure?: PendingErrorState | null;
};

const sitePolygonQueryParams = (props: SitePolygonIndexConnectionProps) => {
  const queryKey = ENTITY_QUERY_KEYS[props.entityName];
  const queryParams: SitePolygonsIndexQueryParams = {
    "page[number]": props.pageNumber ?? 1,
    "page[size]": props.pageSize ?? 10,
    search: props.search,
    lightResource: true
  };

  if (queryKey != null) {
    (queryParams[queryKey] as EntityQueryKey) = [props.entityUuid];
  }

  if (props.presentIndicator) {
    queryParams["presentIndicator[]"] = [props.presentIndicator];
  }

  if (props.polygonStatus) {
    queryParams["polygonStatus[]"] = props.polygonStatus;
  }

  return { queryParams };
};

const indexIsLoaded = (
  { sitePolygons, fetchFailure }: SitePolygonIndexConnection<SitePolygonLightDto>,
  { enabled }: SitePolygonIndexConnectionProps
) => enabled === false || sitePolygons != null || fetchFailure != null;

const sitePolygonCacheKey = (props: SitePolygonIndexConnectionProps) =>
  `${props.entityName}:${props.entityUuid}:${props.pageSize}:${props.pageNumber}:${props.presentIndicator}:${
    props.search
  }:${props.polygonStatus?.join(",")}`;

const sitePolygonsConnection: Connection<
  SitePolygonIndexConnection<SitePolygonLightDto>,
  SitePolygonIndexConnectionProps
> = {
  load: (connection, props) => {
    if (!indexIsLoaded(connection, props)) sitePolygonsIndex(sitePolygonQueryParams(props));
  },

  isLoaded: indexIsLoaded,

  selector: selectorCache(
    props => sitePolygonCacheKey(props),
    props =>
      createSelector(
        [
          sitePolygonsIndexIndexMeta("sitePolygons", sitePolygonQueryParams(props)),
          (store: ApiDataStore) => store.sitePolygons,
          sitePolygonsIndexFetchFailed(sitePolygonQueryParams(props))
        ],
        (indexMeta, sitePolygonsStore, fetchFailure) => {
          if (!indexMeta) return { fetchFailure };

          const sitePolygons: SitePolygonLightDto[] = indexMeta.ids
            .map(id => sitePolygonsStore[id]?.attributes)
            .filter(Boolean);

          return { sitePolygons, total: indexMeta?.total, fetchFailure };
        }
      )
  )
};
export const useAllSitePolygons = (props: Omit<SitePolygonIndexConnectionProps, "pageNumber" | "pageSize">) => {
  const { entityName, entityUuid, search, presentIndicator, polygonStatus, enabled = true } = props;

  const [allPolygons, setAllPolygons] = useState<SitePolygonLightDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<PendingErrorState | null>(null);

  const PAGE_SIZE = 100;

  useEffect(() => {
    if (enabled === false || entityUuid == null || entityUuid === "") {
      setIsLoading(false);
      setAllPolygons([]);
      return;
    }

    const fetchAllPages = async () => {
      setIsLoading(true);
      setError(null);
      setAllPolygons([]);

      try {
        const fetchProps = { entityName, entityUuid, search, presentIndicator, polygonStatus, enabled };

        const firstPageResponse = await loadConnection(sitePolygonsConnection, {
          ...fetchProps,
          pageSize: PAGE_SIZE,
          pageNumber: 1
        });

        if (firstPageResponse.fetchFailure) {
          throw firstPageResponse.fetchFailure;
        }

        const polygons = firstPageResponse.sitePolygons ?? [];
        const total = firstPageResponse.total ?? 0;

        if (total === 0) {
          setAllPolygons([]);
          setIsLoading(false);
          return;
        }

        const totalPages = Math.ceil(total / PAGE_SIZE);

        if (totalPages === 1) {
          setAllPolygons(polygons);
          setIsLoading(false);
          return;
        }

        const remainingPageNumbers = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
        const pagePromises = remainingPageNumbers.map(pageNumber =>
          loadConnection(sitePolygonsConnection, {
            ...fetchProps,
            pageSize: PAGE_SIZE,
            pageNumber: pageNumber
          })
        );

        const remainingPages = await Promise.all(pagePromises);

        let allFetchedPolygons = [...polygons];
        for (const page of remainingPages) {
          if (page.fetchFailure) {
            throw page.fetchFailure;
          }
          allFetchedPolygons.push(...(page.sitePolygons ?? []));
        }

        setAllPolygons(allFetchedPolygons);
      } catch (e: any) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllPages();
  }, [entityName, entityUuid, search, presentIndicator, polygonStatus, enabled]);

  return { data: allPolygons, isLoading, error };
};
export const useSitePolygons = connectionHook(sitePolygonsConnection);
export const loadSitePolygons = connectionLoader(sitePolygonsConnection);
