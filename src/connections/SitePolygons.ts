import { useMemo } from "react";
import { createSelector } from "reselect";

import {
  sitePolygonsIndex,
  SitePolygonsIndexQueryParams
} from "@/generated/v3/researchService/researchServiceComponents";
import { SitePolygonDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { ApiDataStore } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook, connectionLoader } from "@/utils/connectionShortcuts";

export type SitePolygonConnectionParams = {
  entityName: string;
  entityUuid: string;
};

export type SitePolygonConnection = {
  sitePolygons?: SitePolygonDto[];
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
  Object.values(store.sitePolygons ?? {}).map(resource => resource.attributes);

const sitePolygonsConnection = (params: SitePolygonConnectionParams): Connection<SitePolygonConnection> => ({
  load: ({ sitePolygons }) => {
    if (sitePolygons == null || sitePolygons.length === 0) {
      const queryParams = sitePolygonQuery(params.entityName, params.entityUuid);
      sitePolygonsIndex(queryParams);
    }
  },
  isLoaded: ({ sitePolygons }) => sitePolygons !== null,
  selector: createSelector([sitePolygonsSelector], sitePolygons => ({
    sitePolygons
  }))
});
export const useSitePolygons = (params: SitePolygonConnectionParams) => {
  const { entityName, entityUuid } = params;

  const memoizedConnection = useMemo(
    () => sitePolygonsConnection({ entityName, entityUuid }),
    [entityName, entityUuid]
  );

  return connectionHook(memoizedConnection)();
};

export const loadSitePolygons = (params: SitePolygonConnectionParams) =>
  connectionLoader(sitePolygonsConnection(params));
