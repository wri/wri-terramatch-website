import { loadSitePolygonByUuid } from "@/connections/SitePolygons";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import Log from "@/utils/log";

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

export const openPolygonEditDrawerForPolygonId = async ({
  polygonId,
  siteUuid,
  findCachedSitePolygon
}: {
  polygonId: string;
  siteUuid: string;
  findCachedSitePolygon?: (polygonId: string) => SitePolygonLightDto | undefined;
}): Promise<boolean> => {
  if (polygonId === "" || siteUuid === "") {
    return false;
  }

  const cachedPolygon = findCachedSitePolygon?.(polygonId);
  if (cachedPolygon != null) {
    openPolygonEditDrawerForSitePolygon(cachedPolygon, cachedPolygon.name ?? undefined);
    return true;
  }

  try {
    const loadedPolygon = await loadSitePolygonByUuid({ entityUuid: siteUuid, polygonId });
    if (loadedPolygon == null) {
      return false;
    }

    openPolygonEditDrawerForSitePolygon(loadedPolygon, loadedPolygon.name ?? undefined);
    return true;
  } catch (error) {
    Log.error("Failed to load polygon for edit drawer:", error);
    throw error;
  }
};
