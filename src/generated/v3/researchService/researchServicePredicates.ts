import { isFetching, fetchFailed } from "../utils";
import { ApiDataStore } from "@/store/apiSlice";
import { SitePolygonsIndexQueryParams, SitePolygonsIndexVariables } from "./researchServiceComponents";

export const sitePolygonsIndexIsFetching =
  (variables: Omit<SitePolygonsIndexVariables, "body">) => (store: ApiDataStore) =>
    isFetching<SitePolygonsIndexQueryParams, {}>({
      store,
      url: "/research/v3/sitePolygons",
      method: "get",
      ...variables
    });

export const sitePolygonsIndexFetchFailed =
  (variables: Omit<SitePolygonsIndexVariables, "body">) => (store: ApiDataStore) =>
    fetchFailed<SitePolygonsIndexQueryParams, {}>({
      store,
      url: "/research/v3/sitePolygons",
      method: "get",
      ...variables
    });

export const bulkUpdateSitePolygonsIsFetching = (store: ApiDataStore) =>
  isFetching<{}, {}>({ store, url: "/research/v3/sitePolygons", method: "patch" });

export const bulkUpdateSitePolygonsFetchFailed = (store: ApiDataStore) =>
  fetchFailed<{}, {}>({ store, url: "/research/v3/sitePolygons", method: "patch" });
