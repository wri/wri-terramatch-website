import { isFetchingSelector, fetchFailedSelector, indexMetaSelector } from "../utils";
import { ResourceType } from "@/store/apiSlice";
import { SitePolygonsIndexQueryParams, SitePolygonsIndexVariables } from "./researchServiceComponents";

export const sitePolygonsIndexIsFetching = (variables: Omit<SitePolygonsIndexVariables, "body">) =>
  isFetchingSelector<SitePolygonsIndexQueryParams, {}>({
    url: "/research/v3/sitePolygons",
    method: "get",
    ...variables
  });

export const sitePolygonsIndexFetchFailed = (variables: Omit<SitePolygonsIndexVariables, "body">) =>
  fetchFailedSelector<SitePolygonsIndexQueryParams, {}>({
    url: "/research/v3/sitePolygons",
    method: "get",
    ...variables
  });

export const sitePolygonsIndexIndexMeta = (
  resource: ResourceType,
  variables: Omit<SitePolygonsIndexVariables, "body">
) => indexMetaSelector<SitePolygonsIndexQueryParams, {}>({ url: "/research/v3/sitePolygons", resource, ...variables });

export const bulkUpdateSitePolygonsIsFetching = () =>
  isFetchingSelector<{}, {}>({ url: "/research/v3/sitePolygons", method: "patch" });

export const bulkUpdateSitePolygonsFetchFailed = () =>
  fetchFailedSelector<{}, {}>({ url: "/research/v3/sitePolygons", method: "patch" });
