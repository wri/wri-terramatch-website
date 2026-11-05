import { omit } from "lodash";
import type { ParsedUrlQuery } from "querystring";

import { appendQueryParams } from "@/utils/appendQueryParams";

export const POLYGON_REVIEW_PATH = "/polygon-review";

export type PolygonReviewQuery = {
  siteUuid?: string;
};

const POLYGON_REVIEW_QUERY_KEYS: (keyof PolygonReviewQuery)[] = ["siteUuid"];

export const getPolygonReviewUrl = (query: PolygonReviewQuery = {}) => appendQueryParams(POLYGON_REVIEW_PATH, query);

export const parsePolygonReviewQuery = ({ siteUuid }: ParsedUrlQuery): PolygonReviewQuery => ({
  siteUuid: typeof siteUuid === "string" && siteUuid !== "" ? siteUuid : undefined
});

export const omitPolygonReviewQuery = (query: ParsedUrlQuery): ParsedUrlQuery => omit(query, POLYGON_REVIEW_QUERY_KEYS);
