import { isFetchingSelector, fetchFailedSelector, indexMetaSelector } from "../utils";
import { ResourceType } from "@/store/apiSlice";
import {
  SitePolygonsIndexQueryParams,
  SitePolygonsIndexVariables,
  BoundingBoxGetQueryParams,
  BoundingBoxGetVariables
} from "./researchServiceComponents";

export const SITE_POLYGONS_INDEX_URL = "/research/v3/sitePolygons";

export const sitePolygonsIndexIsFetching = (variables: Omit<SitePolygonsIndexVariables, "body">) =>
  isFetchingSelector<SitePolygonsIndexQueryParams, {}>({ url: SITE_POLYGONS_INDEX_URL, method: "get", ...variables });

export const sitePolygonsIndexFetchFailed = (variables: Omit<SitePolygonsIndexVariables, "body">) =>
  fetchFailedSelector<SitePolygonsIndexQueryParams, {}>({ url: SITE_POLYGONS_INDEX_URL, method: "get", ...variables });

export const sitePolygonsIndexIndexMeta = (
  resource: ResourceType,
  variables: Omit<SitePolygonsIndexVariables, "body">
) => indexMetaSelector<SitePolygonsIndexQueryParams, {}>({ url: SITE_POLYGONS_INDEX_URL, resource, ...variables });

export const BULK_UPDATE_SITE_POLYGONS_URL = "/research/v3/sitePolygons";

export const bulkUpdateSitePolygonsIsFetching = (_?: Omit<void, "body">) =>
  isFetchingSelector<{}, {}>({ url: BULK_UPDATE_SITE_POLYGONS_URL, method: "patch" });

export const bulkUpdateSitePolygonsFetchFailed = (_?: Omit<void, "body">) =>
  fetchFailedSelector<{}, {}>({ url: BULK_UPDATE_SITE_POLYGONS_URL, method: "patch" });

export const BOUNDING_BOX_GET_URL = "/boundingBoxes/v3/get";

export const boundingBoxGetIsFetching = (variables: Omit<BoundingBoxGetVariables, "body">) =>
  isFetchingSelector<BoundingBoxGetQueryParams, {}>({ url: BOUNDING_BOX_GET_URL, method: "get", ...variables });

export const boundingBoxGetFetchFailed = (variables: Omit<BoundingBoxGetVariables, "body">) =>
  fetchFailedSelector<BoundingBoxGetQueryParams, {}>({ url: BOUNDING_BOX_GET_URL, method: "get", ...variables });
