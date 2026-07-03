import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

import { openPolygonEditDrawer } from "./polygonEditDrawer.provider";
import type { PolygonEditDrawerPolygon, PolygonEditDrawerTab } from "./polygonEditDrawer.types";

export const buildPolygonEditDrawerParams = (
  sitePolygon?: SitePolygonLightDto,
  polygonName?: string,
  defaultTab?: PolygonEditDrawerTab
): PolygonEditDrawerPolygon => ({
  polygonUuid: sitePolygon?.polygonUuid ?? undefined,
  polygonName: polygonName ?? sitePolygon?.name ?? undefined,
  sitePolygon,
  defaultTab
});

export const openPolygonEditDrawerForSitePolygon = (
  sitePolygon?: SitePolygonLightDto,
  polygonName?: string,
  defaultTab?: PolygonEditDrawerTab
): void => {
  openPolygonEditDrawer(buildPolygonEditDrawerParams(sitePolygon, polygonName, defaultTab));
};
