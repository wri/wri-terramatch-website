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
  entityName: string;
  entityUuid: string;
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

const sitePolygonsConnection: Connection<
  SitePolygonIndexConnection<SitePolygonDto>,
  SitePolygonIndexConnectionProps
> = {
  load: (connection, props) => {
    if (!indexIsLoaded(connection)) sitePolygonsIndex(sitePolygonQueryParams(props.entityName, props.entityUuid));
  },
  isLoaded: indexIsLoaded,
  selector: selectorCache(
    props => sitePolygonCacheKey(props.entityName, props.entityUuid),
    props =>
      createSelector(
        [
          indexMetaSelector("sitePolygons", sitePolygonQueryParams(props.entityName, props.entityUuid)),
          store => sitePolygonsSelector(store, props.entityName, props.entityUuid),
          sitePolygonsIndexFetchFailed(sitePolygonQueryParams(props.entityName, props.entityUuid))
        ],
        (indexMeta, sitePolygons, fetchFailure) => {
          const refetch = () => ApiSlice.pruneIndex("sitePolygons", "");
          if (indexMeta == null) return { refetch, fetchFailure };

          return { sitePolygons, refetch, fetchFailure };
        }
      )
  )
};

export const useSitePolygons = connectionHook(sitePolygonsConnection);

export const loadSitePolygons = connectionLoader(sitePolygonsConnection);
