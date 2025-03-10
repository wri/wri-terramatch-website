import { useMemo } from "react";
import { createSelector } from "reselect";

import { sitePolygonsIndex } from "@/generated/v3/researchService/researchServiceComponents";
import { sitePolygonsIndexFetchFailed } from "@/generated/v3/researchService/researchServicePredicates";
import { SitePolygonDto } from "@/generated/v3/researchService/researchServiceSchemas";
import ApiSlice, { ApiDataStore, indexMetaSelector, PendingErrorState } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook, connectionLoader } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

export type SitePolygonIndexConnection<T extends SitePolygonDto> = {
  sitePolygons?: T[];
  indexTotal?: number;
  fetchFailure?: PendingErrorState | null;
  refetch: () => void;
};
export type SitePolygonConnectionParams = {
  entityName: string;
  entityUuid: string;
};
export type SitePolygonIndexConnectionProps = {
  pageSize?: number;
  pageNumber?: number;
};
export type SitePolygonConnection = {
  sitePolygons?: SitePolygonDto[];
};

const sitePolygonQueryParams = (entityName: string, entityUuid: string) => {
  const queryParams: Record<string, string> = {
    "page[number]": "0", // Update once pagination is implemented
    "page[size]": "10"
  };

  if (entityName === "projects") {
    queryParams["projectId[]"] = entityUuid;
  } else if (entityName === "sites") {
    queryParams["siteId[]"] = entityUuid;
  }

  return { queryParams };
};
const sitePolygonsSelector = (store: ApiDataStore, entityName: string, entityUuid: string) => {
  const key = entityName === "projects" ? "projectId" : "siteId";

  return Object.values(store.sitePolygons ?? {})
    .filter(resource => resource?.attributes?.[key] === entityUuid)
    .map(resource => resource.attributes);
};

const indexIsLoaded = ({ sitePolygons, fetchFailure }: SitePolygonIndexConnection<SitePolygonDto>) =>
  sitePolygons != null || fetchFailure !== null;

const sitePolygonCacheKey = (entityName: string, entityUuid: string) => {
  return `${entityName}:${entityUuid}`;
};

const sitePolygonsConnection = (
  entityName: string,
  entityUuid: string
): Connection<SitePolygonIndexConnection<SitePolygonDto>, SitePolygonIndexConnectionProps> => ({
  load: connection => {
    if (!indexIsLoaded(connection)) sitePolygonsIndex(sitePolygonQueryParams(entityName, entityUuid));
  },
  isLoaded: indexIsLoaded,
  selector: selectorCache(
    props => sitePolygonCacheKey(entityName, entityUuid),
    props =>
      createSelector(
        [
          indexMetaSelector("sitePolygons", sitePolygonQueryParams(entityName, entityUuid)),
          store => sitePolygonsSelector(store, entityName, entityUuid),
          sitePolygonsIndexFetchFailed(sitePolygonQueryParams(entityName, entityUuid))
        ],
        (indexMeta, sitePolygons, fetchFailure) => {
          const refetch = () => ApiSlice.pruneIndex("sitePolygons", "");
          if (indexMeta == null) return { refetch, fetchFailure };

          return { sitePolygons, refetch, fetchFailure };
        }
      )
  )
});

export const useSitePolygons = (params: SitePolygonConnectionParams) => {
  const { entityName, entityUuid } = params;

  const memoizedConnection = useMemo(() => sitePolygonsConnection(entityName, entityUuid), [entityName, entityUuid]);

  return connectionHook(memoizedConnection)();
};

export const loadSitePolygons = (params: SitePolygonConnectionParams) =>
  connectionLoader(sitePolygonsConnection(params.entityName, params.entityUuid));
