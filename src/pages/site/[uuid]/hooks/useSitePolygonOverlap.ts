import { useEffect, useMemo } from "react";

import { OverlapPolygonPoint } from "@/components/elements/Map-mapbox/layers/overlapTypes";
import { useAllSiteValidations } from "@/connections/Validation";
import { SitePolygonLightDto, ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { OVERLAPPING_CRITERIA_ID } from "@/types/validation";

import { getCrossSiteOverlapPartnersForValidation } from "./crossSiteOverlap.utils";
import { hasOverlapValidationFailure } from "./overlapFix.utils";

type UseSitePolygonOverlapParams = {
  siteUuid: string;
  polygonsData: SitePolygonLightDto[];
  t: (key: string) => string;
};

export const useSitePolygonOverlap = ({ siteUuid, polygonsData, t }: UseSitePolygonOverlapParams) => {
  const { allValidations: overlapValidations, fetchAllValidationPages: fetchOverlapValidations } =
    useAllSiteValidations(siteUuid, OVERLAPPING_CRITERIA_ID);

  useEffect(() => {
    if (siteUuid == null || siteUuid === "") {
      return;
    }
    void fetchOverlapValidations();
  }, [siteUuid, fetchOverlapValidations]);

  return useMemo(() => {
    const currentPolygonUuids = new Set(
      polygonsData
        .map(polygon => polygon.polygonUuid ?? polygon.uuid)
        .filter((id): id is string => id != null && id !== "")
    );
    const overlapValidationByPolygonUuid = new Map<string, ValidationDto>(
      overlapValidations
        .filter(hasOverlapValidationFailure)
        .filter(
          (validation): validation is ValidationDto & { polygonUuid: string } =>
            validation.polygonUuid != null &&
            validation.polygonUuid !== "" &&
            currentPolygonUuids.has(validation.polygonUuid)
        )
        .map(validation => [validation.polygonUuid, validation])
    );
    if (overlapValidationByPolygonUuid.size === 0) {
      return {
        polygonsWithOverlapCount: 0,
        overlapPolygons: [] as OverlapPolygonPoint[],
        overlapValidations,
        fetchOverlapValidations
      };
    }

    const crossSiteOverlapTooltip = t("This polygon overlaps with a polygon on another site in this project.");

    const overlapPolygons: OverlapPolygonPoint[] = [];
    for (const polygon of polygonsData) {
      const uuid = polygon.polygonUuid ?? polygon.uuid;
      const validation = uuid == null ? undefined : overlapValidationByPolygonUuid.get(uuid);
      if (uuid == null || validation == null) continue;
      if (polygon.lat == null || polygon.long == null) continue;

      const hasCrossSitePartner = getCrossSiteOverlapPartnersForValidation(validation, currentPolygonUuids).length > 0;

      overlapPolygons.push({
        polygonUuid: uuid,
        lat: polygon.lat,
        lng: polygon.long,
        tooltip: hasCrossSitePartner ? crossSiteOverlapTooltip : undefined
      });
    }

    return {
      polygonsWithOverlapCount: overlapPolygons.length,
      overlapPolygons,
      overlapValidations,
      fetchOverlapValidations
    };
  }, [overlapValidations, polygonsData, fetchOverlapValidations, t]);
};
