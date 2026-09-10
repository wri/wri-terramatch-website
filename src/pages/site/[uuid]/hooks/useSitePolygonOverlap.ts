import { useEffect, useMemo } from "react";

import { OverlapPolygonPoint } from "@/components/elements/Map-mapbox/layers/overlapTypes";
import { useAllSiteValidations } from "@/connections/Validation";
import { ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { OVERLAPPING_CRITERIA_ID } from "@/types/validation";

import { mergeValidationsByPolygonUuid } from "../components/Modals/validationCriteria";
import { getCrossSiteOverlapPartnersForValidation } from "./crossSiteOverlap.utils";
import { buildOverlapFailureValidationsMap } from "./overlapFix.utils";

export type SitePolygonOverlapIdentity = {
  uuid?: string | null;
  polygonUuid?: string | null;
  lat?: number | null;
  long?: number | null;
};

type UseSitePolygonOverlapParams = {
  siteUuid: string;
  polygonIdentities: SitePolygonOverlapIdentity[];
  preferredValidationsByPolygonUuid?: Map<string, ValidationDto>;
  t: (key: string) => string;
};

const getPolygonIdentityUuid = (polygon: SitePolygonOverlapIdentity): string | undefined => {
  const uuid = polygon.polygonUuid ?? polygon.uuid;
  return uuid != null && uuid !== "" ? uuid : undefined;
};

export const useSitePolygonOverlap = ({
  siteUuid,
  polygonIdentities,
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
      polygonIdentities.map(getPolygonIdentityUuid).filter((id): id is string => id != null)
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
    for (const polygon of polygonIdentities) {
      const uuid = getPolygonIdentityUuid(polygon);
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
      polygonsWithOverlapCount: overlapValidationByPolygonUuid.size,
      overlapPolygons,
      overlapValidations,
      overlapValidationsByPolygonUuid,
      fetchOverlapValidations
    };
  }, [overlapValidations, overlapValidationsByPolygonUuid, polygonIdentities, fetchOverlapValidations, t]);
};
