const SITE_POLYGON_REVIEW_PATH_PATTERN = /^\/site\/[^/]+\/polygon-review(?:[/?#]|$)/;

export const isSitePolygonReviewPath = (asPath: string): boolean => SITE_POLYGON_REVIEW_PATH_PATTERN.test(asPath);

export const getSitePolygonReviewPath = (siteUUID: string): string => `/site/${siteUUID}/polygon-review`;
