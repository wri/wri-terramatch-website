import router from "next/router";

import { setPendingPolygonFocusUuid } from "@/context/polygonTableInteraction.store";
import type { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { SITE_POLYGON_TAB_HEADER_ID } from "@/pages/site/[uuid]/constants/sitePolygonMapSizing";

const SITE_DETAIL_PATH = "/site/[uuid]";

export { SITE_DETAIL_PATH };

let viewDetailsSiteUuid: string | null = null;

export const setViewDetailsSiteUuid = (siteUuid?: string | null): void => {
  viewDetailsSiteUuid = siteUuid != null && siteUuid !== "" ? siteUuid : null;
};

export const resolveViewDetailsSiteUuid = (sitePolygon?: SitePolygonLightDto): string | null => {
  const siteId = sitePolygon?.siteId;
  if (siteId != null && siteId !== "") {
    return siteId;
  }

  return viewDetailsSiteUuid;
};

export const canNavigateToSitePolygonViewDetails = (
  geometryUuid: string | null,
  siteUuid: string | null,
  pathname: string = router.pathname
): boolean => {
  if (geometryUuid == null || geometryUuid === "") {
    return false;
  }

  return pathname === SITE_DETAIL_PATH || (siteUuid != null && siteUuid !== "");
};

export const scrollToSitePolygonTabHeader = (): void => {
  document.getElementById(SITE_POLYGON_TAB_HEADER_ID)?.scrollIntoView({ block: "start" });
};

export const navigateToSitePolygonViewDetails = (geometryUuid: string, siteUuid: string | null | undefined): void => {
  if (geometryUuid === "") {
    return;
  }

  setPendingPolygonFocusUuid(geometryUuid);

  if (router.pathname === SITE_DETAIL_PATH) {
    void router.push({ pathname: router.pathname, query: { ...router.query, tab: "polygons" } }, undefined, {
      shallow: true
    });
    requestAnimationFrame(() => {
      scrollToSitePolygonTabHeader();
    });
    return;
  }

  if (siteUuid != null && siteUuid !== "") {
    void router.push(`/site/${siteUuid}?tab=polygons`, undefined, { scroll: false });
  }
};
