import { useEffect, useMemo } from "react";

import { OverlapPolygonPoint } from "@/components/elements/Map-mapbox/layers/overlapTypes";
import { useAllSiteValidations } from "@/connections/Validation";
import { SitePolygonLightDto, ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { OVERLAPPING_CRITERIA_ID } from "@/types/validation";

import { mergeValidationsByPolygonUuid } from "../components/Modals/validationCriteria";
import { getCrossSiteOverlapPartnersForValidation } from "./crossSiteOverlap.utils";
import { buildOverlapFailureValidationsMap } from "./overlapFix.utils";

type UseSitePolygonOverlapParams = {
  siteUuid: string;
  polygonsData: SitePolygonLightDto[];
  preferredValidationsByPolygonUuid?: Map<string, ValidationDto>;
  t: (key: string) => string;
};

export const useSitePolygonOverlap = ({
  siteUuid,
  polygonsData,
  preferredValidationsByPolygonUuid,
  t
}: UseSitePolygonOverlapParams) => {
  const { allValidations: indexedOverlapValidations, fetchAllValidationPages: fetchOverlapValidations } =
    useAllSiteValidations(siteUuid, OVERLAPPING_CRITERIA_ID);

  useEffect(() => {
    if (siteUuid == null || siteUuid === "") {
      return;
    }
    void fetchOverlapValidations();
  }, [siteUuid, fetchOverlapValidations]);

  const overlapValidationsByPolygonUuid = useMemo(() => {
    if (preferredValidationsByPolygonUuid == null || preferredValidationsByPolygonUuid.size === 0) {
      return mergeValidationsByPolygonUuid(indexedOverlapValidations);
    }

    return mergeValidationsByPolygonUuid(indexedOverlapValidations, preferredValidationsByPolygonUuid);
  }, [indexedOverlapValidations, preferredValidationsByPolygonUuid]);

  const overlapValidations = useMemo(
    () => Array.from(overlapValidationsByPolygonUuid.values()),
    [overlapValidationsByPolygonUuid]
  );

  return useMemo(() => {
    const currentPolygonUuids = new Set(
      polygonsData
        .map(polygon => polygon.polygonUuid ?? polygon.uuid)
        .filter((id): id is string => id != null && id !== "")
    );
    const overlapValidationByPolygonUuid = buildOverlapFailureValidationsMap(
      overlapValidationsByPolygonUuid.values(),
      currentPolygonUuids
    );

    if (overlapValidationByPolygonUuid.size === 0) {
      return {
        polygonsWithOverlapCount: 0,
        overlapPolygons: [] as OverlapPolygonPoint[],
        overlapValidations,
        overlapValidationsByPolygonUuid,
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
      overlapValidationsByPolygonUuid,
      fetchOverlapValidations
    };
  }, [overlapValidations, overlapValidationsByPolygonUuid, polygonsData, fetchOverlapValidations, t]);
};
