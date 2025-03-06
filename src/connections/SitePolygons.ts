import { createSelector } from "reselect";

import {
  sitePolygonsIndex,
  SitePolygonsIndexQueryParams
} from "@/generated/v3/researchService/researchServiceComponents";
import {
  sitePolygonsIndexFetchFailed,
  sitePolygonsIndexIsFetching
} from "@/generated/v3/researchService/researchServicePredicates";
import { SitePolygonDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { ApiDataStore } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook, connectionLoader } from "@/utils/connectionShortcuts";

export type SitePolygonConnectionParams = {
  entityName: string;
  entityUuid: string;
};

export type SitePolygonConnection = {
  sitePolygons?: SitePolygonDto[] | undefined;
  sitePolygonsHaveFailed: boolean;
  sitePolygonsAreLoading: boolean;
};

const sitePolygonQuery = (entityName: string, entityUuid: string) => {
  const queryParams = {
    "page[number]": 0, // update once pagination is implemented
    "page[size]": 10
  } as SitePolygonsIndexQueryParams;
  if (entityName === "projects") {
    queryParams["projectId[]"] = [entityUuid];
  } else if (entityName === "sites") {
    queryParams["siteId[]"] = [entityUuid];
  }
  return { queryParams };
};
const sitePolygonsSelector = (store: ApiDataStore) =>
  Object.values(store.sitePolygons || {}).map(resource => resource.attributes);

const sitePolygonsConnection = (params: SitePolygonConnectionParams): Connection<SitePolygonConnection> => ({
  load: ({ sitePolygons }) => {
    if (sitePolygons == null || sitePolygons.length === 0) {
      console.log("params.E", params.entityName);
      const queryParams = sitePolygonQuery(params.entityName, params.entityUuid);
      console.log("Query Params", queryParams);
      sitePolygonsIndex(queryParams);
    }
  },
  isLoaded: ({ sitePolygons, sitePolygonsHaveFailed }) => sitePolygons !== null || sitePolygonsHaveFailed,
  selector: createSelector(
    [
      sitePolygonsSelector,
      sitePolygonsIndexIsFetching(sitePolygonQuery(params.entityName, params.entityUuid)),
      sitePolygonsIndexFetchFailed(sitePolygonQuery(params.entityName, params.entityUuid))
    ],
    (sitePolygons, sitePolygonsAreLoading, sitePolygonsFailed) => ({
      sitePolygons,
      sitePolygonsAreLoading,
      sitePolygonsHaveFailed: sitePolygonsFailed !== null
    })
  )
});
export const useSitePolygons = (params: SitePolygonConnectionParams) =>
  connectionHook(sitePolygonsConnection(params))();

export const loadSitePolygons = (params: SitePolygonConnectionParams) =>
  connectionLoader(sitePolygonsConnection(params));
