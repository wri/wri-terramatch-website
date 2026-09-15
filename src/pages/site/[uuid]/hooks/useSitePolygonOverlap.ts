import { useEffect, useMemo, useState } from "react";

import { OverlapPolygonPoint } from "@/components/elements/Map-mapbox/layers/overlapTypes";
import { loadSitePolygons } from "@/connections/SitePolygons";
import { useAllSiteValidations } from "@/connections/Validation";
import { SitePolygonLightDto, ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { OVERLAPPING_CRITERIA_ID } from "@/types/validation";
import Log from "@/utils/log";

import {
  mergeValidationsByPolygonUuid,
  withResolvedValidationStatusFromCriteria
} from "../components/Modals/validationCriteria";
import { getCrossSiteOverlapPartnersForValidation } from "./crossSiteOverlap.utils";
import { buildOverlapFailureValidationsMap } from "./overlapFix.utils";

const EMPTY_OVERLAP_POLYGONS: SitePolygonLightDto[] = [];
const OVERLAP_POLYGONS_BATCH_SIZE = 100;

type UseSitePolygonOverlapParams = {
  siteUuid: string;
  scopedPolygonUuids: string[];
  preferredValidationsByPolygonUuid?: Map<string, ValidationDto>;
  t: (key: string) => string;
};

export const useSitePolygonOverlap = ({
  siteUuid,
  scopedPolygonUuids,
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

  const currentPolygonUuids = useMemo(() => new Set(scopedPolygonUuids), [scopedPolygonUuids]);

  const overlapValidationByPolygonUuid = useMemo(
    () => buildOverlapFailureValidationsMap(overlapValidationsByPolygonUuid.values(), currentPolygonUuids),
    [overlapValidationsByPolygonUuid, currentPolygonUuids]
  );

  const overlapPolygonUuids = useMemo(
    () => Array.from(overlapValidationByPolygonUuid.keys()).sort(),
    [overlapValidationByPolygonUuid]
  );
  const overlapPolygonUuidsKey = overlapPolygonUuids.join(",");

  const [overlapPolygonsLightData, setOverlapPolygonsLightData] =
    useState<SitePolygonLightDto[]>(EMPTY_OVERLAP_POLYGONS);

  useEffect(() => {
    if (siteUuid == null || siteUuid === "" || overlapPolygonUuids.length === 0) {
      setOverlapPolygonsLightData(EMPTY_OVERLAP_POLYGONS);
      return;
    }

    let cancelled = false;

    const loadOverlapPolygons = async () => {
      const polygons: SitePolygonLightDto[] = [];

      for (let offset = 0; offset < overlapPolygonUuids.length; offset += OVERLAP_POLYGONS_BATCH_SIZE) {
        const uuidBatch = overlapPolygonUuids.slice(offset, offset + OVERLAP_POLYGONS_BATCH_SIZE);
        const response = await loadSitePolygons({
          entityName: "sites",
          entityUuid: siteUuid,
          enabled: true,
          filter: { "polygonUuid[]": uuidBatch },
          pageNumber: 1,
          pageSize: uuidBatch.length
        });

        if (response.loadFailure != null) {
          Log.error("Failed to load overlap polygon geometry", { siteUuid, loadFailure: response.loadFailure });
          continue;
        }

        polygons.push(...(response.data ?? []));
      }

      if (!cancelled) {
        setOverlapPolygonsLightData(polygons);
      }
    };

    void loadOverlapPolygons();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteUuid, overlapPolygonUuidsKey]);

  const overlapPolygonsData = useMemo(
    () => withResolvedValidationStatusFromCriteria(overlapPolygonsLightData, overlapValidationsByPolygonUuid),
    [overlapPolygonsLightData, overlapValidationsByPolygonUuid]
  );

  return useMemo(() => {
    if (overlapValidationByPolygonUuid.size === 0) {
      return {
        polygonsWithOverlapCount: 0,
        overlapPolygons: [] as OverlapPolygonPoint[],
        overlapPolygonUuids: [] as string[],
        overlapPolygonsData: EMPTY_OVERLAP_POLYGONS,
        overlapValidations,
        overlapValidationsByPolygonUuid,
        fetchOverlapValidations
      };
    }

    const crossSiteOverlapTooltip = t("This polygon overlaps with a polygon on another site in this project.");

    const overlapPolygons: OverlapPolygonPoint[] = [];
    for (const polygon of overlapPolygonsData) {
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
      polygonsWithOverlapCount: overlapValidationByPolygonUuid.size,
      overlapPolygons,
      overlapPolygonUuids,
      overlapPolygonsData,
      overlapValidations,
      overlapValidationsByPolygonUuid,
      fetchOverlapValidations
    };
  }, [
    overlapValidationByPolygonUuid,
    overlapPolygonUuids,
    overlapPolygonsData,
    overlapValidations,
    overlapValidationsByPolygonUuid,
    currentPolygonUuids,
    fetchOverlapValidations,
    t
  ]);
};
