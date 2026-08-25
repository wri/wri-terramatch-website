export const getDisturbanceReportHref = (uuid: string, isAdmin: boolean): string =>
  isAdmin ? `/admin#/disturbanceReport/${uuid}/show` : `/reports/disturbance-report/${uuid}`;

export const getSitePolygonReviewHref = (siteUuid: string, isAdmin: boolean): string =>
  isAdmin ? `/site/${siteUuid}/polygon-review` : `/site/${siteUuid}?tab=polygons`;
