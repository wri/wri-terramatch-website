import { useEffect, useMemo } from "react";

import { OverlapPolygonPoint } from "@/components/elements/Map-mapbox/layers/overlapTypes";
import { useAllSiteValidations } from "@/connections/Validation";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { OVERLAPPING_CRITERIA_ID } from "@/types/validation";

type UseSitePolygonOverlapParams = {
  siteUuid: string;
  polygonsData: SitePolygonLightDto[];
};

export const useSitePolygonOverlap = ({ siteUuid, polygonsData }: UseSitePolygonOverlapParams) => {
  const { allValidations: overlapValidations, fetchAllValidationPages: fetchOverlapValidations } =
    useAllSiteValidations(siteUuid, OVERLAPPING_CRITERIA_ID);

  const polygonIdsKey = useMemo(
    () =>
      polygonsData
        .map(polygon => polygon.uuid)
        .filter((uuid): uuid is string => uuid != null && uuid !== "")
        .sort()
        .join(","),
    [polygonsData]
  );

  useEffect(() => {
    if (siteUuid == null || siteUuid === "") {
      return;
    }
    void fetchOverlapValidations();
  }, [siteUuid, polygonIdsKey, fetchOverlapValidations]);

  return useMemo(() => {
    const currentPolygonUuids = new Set(
      polygonsData
        .map(polygon => polygon.polygonUuid ?? polygon.uuid)
        .filter((id): id is string => id != null && id !== "")
    );
    const overlapPolygonUuids = new Set(
      overlapValidations
        .map(validation => validation.polygonUuid)
        .filter((id): id is string => id != null && id !== "" && currentPolygonUuids.has(id))
    );
    if (overlapPolygonUuids.size === 0) {
      return { polygonsWithOverlapCount: 0, overlapPolygons: [] as OverlapPolygonPoint[] };
    }

    const overlapPolygons: OverlapPolygonPoint[] = [];
    for (const polygon of polygonsData) {
      const uuid = polygon.polygonUuid ?? polygon.uuid;
      if (uuid == null || !overlapPolygonUuids.has(uuid)) continue;
      if (polygon.lat == null || polygon.long == null) continue;
      overlapPolygons.push({ polygonUuid: uuid, lat: polygon.lat, lng: polygon.long });
    }

    return { polygonsWithOverlapCount: overlapPolygons.length, overlapPolygons };
  }, [overlapValidations, polygonsData]);
};
