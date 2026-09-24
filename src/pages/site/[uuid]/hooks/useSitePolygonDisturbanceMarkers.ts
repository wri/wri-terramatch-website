import { useEffect, useMemo, useState } from "react";

import { OverlapPolygonPoint } from "@/components/elements/Map-mapbox/layers/overlapTypes";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

import { loadSitePolygonsByUuidBatch } from "./sitePolygonBatchLoad.utils";

const EMPTY_DISTURBANCE_POLYGONS: SitePolygonLightDto[] = [];
const EMPTY_DISTURBANCE_MARKER_POINTS: OverlapPolygonPoint[] = [];

type UseSitePolygonDisturbanceMarkersParams = {
  siteUuid: string;
  disturbancePolygonUuids: string[];
  excludePolygonUuid?: string | null;
  t: (key: string) => string;
};

export const useSitePolygonDisturbanceMarkers = ({
  siteUuid,
  disturbancePolygonUuids,
  excludePolygonUuid,
  t
}: UseSitePolygonDisturbanceMarkersParams) => {
  const disturbancePolygonUuidsKey = disturbancePolygonUuids.join(",");
  const [disturbancePolygonsLightData, setDisturbancePolygonsLightData] =
    useState<SitePolygonLightDto[]>(EMPTY_DISTURBANCE_POLYGONS);

  useEffect(() => {
    if (siteUuid == null || siteUuid === "" || disturbancePolygonUuids.length === 0) {
      setDisturbancePolygonsLightData(EMPTY_DISTURBANCE_POLYGONS);
      return;
    }

    let cancelled = false;

    void loadSitePolygonsByUuidBatch({
      siteUuid,
      polygonUuids: disturbancePolygonUuids,
      errorContext: "Failed to load disturbance marker polygon geometry"
    }).then(polygons => {
      if (!cancelled) {
        setDisturbancePolygonsLightData(polygons);
      }
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteUuid, disturbancePolygonUuidsKey]);

  const disturbanceMarkerPoints = useMemo<OverlapPolygonPoint[]>(() => {
    if (disturbancePolygonsLightData.length === 0) {
      return EMPTY_DISTURBANCE_MARKER_POINTS;
    }

    const tooltip = t("Disturbance reported");
    const points: OverlapPolygonPoint[] = [];

    for (const polygon of disturbancePolygonsLightData) {
      const uuid = polygon.polygonUuid ?? polygon.uuid;
      if (uuid == null || uuid === excludePolygonUuid) continue;
      if (polygon.lat == null || polygon.long == null) continue;

      points.push({ polygonUuid: uuid, lat: polygon.lat, lng: polygon.long, tooltip });
    }

    return points;
  }, [disturbancePolygonsLightData, excludePolygonUuid, t]);

  return { disturbanceMarkerPoints };
};
