import { useEffect, useMemo } from "react";

import { OverlapPolygonPoint } from "@/components/elements/Map-mapbox/layers/overlapTypes";
import { useAllSiteValidations } from "@/connections/Validation";
import { SitePolygonLightDto, ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { OVERLAPPING_CRITERIA_ID } from "@/types/validation";

import { mergeValidationsByPolygonUuid } from "../components/Modals/validationCriteria";
import { getCrossSiteOverlapPartnersForValidation } from "./crossSiteOverlap.utils";
import { buildOverlapFailureValidationsMap } from "./overlapFix.utils";

type OverlapValidationsSource = {
  allValidations: ValidationDto[];
  fetchAllValidationPages: (clearCache?: boolean) => Promise<ValidationDto[] | undefined>;
};

type UseSitePolygonOverlapParams = {
  // Site scope: pass the site uuid and the hook fetches the OVERLAPPING criteria for that site.
  siteUuid?: string;
  // Project scope: pass a validations source (e.g. `useAllProjectValidations(projectUuid, OVERLAPPING_CRITERIA_ID)`)
  // so overlaps are computed across every site in the project. When provided it takes precedence over siteUuid.
  overlapValidationsSource?: OverlapValidationsSource;
  polygonsData: SitePolygonLightDto[];
  preferredValidationsByPolygonUuid?: Map<string, ValidationDto>;
  t: (key: string) => string;
  // Optional override for the cross-site partner tooltip (project scope may reword it).
  crossSiteTooltip?: string;
};

export const useSitePolygonOverlap = ({
  siteUuid,
  overlapValidationsSource,
  polygonsData,
  preferredValidationsByPolygonUuid,
  t,
  crossSiteTooltip
}: UseSitePolygonOverlapParams) => {
  // The internal site hook is only used when no project-scope source is supplied. Passing an empty
  // uuid keeps the hook call unconditional (rules of hooks) without triggering a site fetch.
  const siteOverlapValidations = useAllSiteValidations(siteUuid ?? "", OVERLAPPING_CRITERIA_ID);
  const indexedOverlapValidations = overlapValidationsSource?.allValidations ?? siteOverlapValidations.allValidations;
  const fetchOverlapValidations =
    overlapValidationsSource?.fetchAllValidationPages ?? siteOverlapValidations.fetchAllValidationPages;

  // Trigger the initial/refresh fetch. Depend on a STABLE boolean (whether a project source exists),
  // NOT the source object itself: the source object is re-created every time its validations array
  // changes, so depending on it here would re-fire the fetch after every fetch — an infinite loop.
  // `fetchOverlapValidations` resolves to a stable useCallback in both scopes.
  const hasOverlapSource = overlapValidationsSource != null;
  useEffect(() => {
    if (!hasOverlapSource && (siteUuid == null || siteUuid === "")) {
      return;
    }
    void fetchOverlapValidations();
  }, [hasOverlapSource, siteUuid, fetchOverlapValidations]);

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

    const crossSiteOverlapTooltip =
      crossSiteTooltip ?? t("This polygon overlaps with a polygon on another site in this project.");

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
  }, [overlapValidations, overlapValidationsByPolygonUuid, polygonsData, fetchOverlapValidations, t, crossSiteTooltip]);
};
