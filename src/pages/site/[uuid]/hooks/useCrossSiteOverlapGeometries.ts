import { useEffect, useMemo, useState } from "react";

import type { CrossSiteOverlapPolygon } from "@/components/elements/Map-mapbox/layers/overlapTypes";
import { fetchPolygonGeometry } from "@/components/elements/Map-mapbox/utils";
import type { ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";
import Log from "@/utils/log";
import type { OverlapExtraInfo } from "@/utils/polygonFixValidation";

import { getCrossSiteOverlapPartnersForValidation } from "./crossSiteOverlap.utils";

export type { CrossSiteOverlapPolygon };

type UseCrossSiteOverlapGeometriesParams = {
  polygonUuid: string | null | undefined;
  validation: ValidationDto | undefined;
  currentSiteGeometryUuids: string[];
  enabled: boolean;
};

type LoadedCrossSiteOverlapPolygon = {
  partner: OverlapExtraInfo;
  geometry: GeoJSON.Geometry;
};

const EMPTY_CROSS_SITE_OVERLAP_POLYGONS: CrossSiteOverlapPolygon[] = [];

export const useCrossSiteOverlapGeometries = ({
  polygonUuid,
  validation,
  currentSiteGeometryUuids,
  enabled
}: UseCrossSiteOverlapGeometriesParams) => {
  const [crossSiteOverlapPolygons, setCrossSiteOverlapPolygons] = useState<CrossSiteOverlapPolygon[]>(
    EMPTY_CROSS_SITE_OVERLAP_POLYGONS
  );
  const [isLoadingCrossSiteOverlapPolygons, setIsLoadingCrossSiteOverlapPolygons] = useState(false);

  const currentSiteGeometryUuidsKey = useMemo(
    () => [...currentSiteGeometryUuids].sort().join(","),
    [currentSiteGeometryUuids]
  );

  const partners = useMemo((): OverlapExtraInfo[] => {
    if (!enabled || polygonUuid == null || polygonUuid === "") {
      return [];
    }
    return getCrossSiteOverlapPartnersForValidation(validation, currentSiteGeometryUuids);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, polygonUuid, validation, currentSiteGeometryUuidsKey]);

  const partnersKey = useMemo(
    () =>
      partners
        .map(partner => partner.polyUuid)
        .sort()
        .join(","),
    [partners]
  );

  useEffect(() => {
    if (partners.length === 0) {
      setCrossSiteOverlapPolygons(EMPTY_CROSS_SITE_OVERLAP_POLYGONS);
      setIsLoadingCrossSiteOverlapPolygons(false);
      return;
    }

    let cancelled = false;
    setIsLoadingCrossSiteOverlapPolygons(true);

    const loadCrossSiteOverlapGeometries = async () => {
      const results = await Promise.all(
        partners.map(async (partner): Promise<LoadedCrossSiteOverlapPolygon | null> => {
          try {
            const geometry = await fetchPolygonGeometry(partner.polyUuid, true);
            return geometry == null ? null : { partner, geometry };
          } catch (error) {
            Log.error("Failed to load cross-site overlap polygon geometry:", error);
            return null;
          }
        })
      );

      if (cancelled) return;

      const loadedPolygons: CrossSiteOverlapPolygon[] = results
        .filter((result): result is LoadedCrossSiteOverlapPolygon => result != null)
        .map(({ partner, geometry }) => ({
          polygonUuid: partner.polyUuid,
          polyName: partner.polyName,
          siteName: partner.siteName,
          geometry
        }));

      setCrossSiteOverlapPolygons(loadedPolygons);
      setIsLoadingCrossSiteOverlapPolygons(false);
    };

    void loadCrossSiteOverlapGeometries();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partnersKey]);

  return { crossSiteOverlapPolygons, isLoadingCrossSiteOverlapPolygons };
};
