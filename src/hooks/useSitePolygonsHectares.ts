import { useCallback, useMemo, useState } from "react";

import { PolygonStatus, useAllSitePolygons } from "@/connections/SitePolygons";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

export interface HectaresData {
  restoration_strategies_represented: Record<string, number>;
  target_land_use_types_represented: Record<string, number>;
}

export interface UseSitePolygonsHectaresResult {
  data: HectaresData | null;
  isLoading: boolean;
  error: string | null;
  allPolygonsData: SitePolygonLightDto[];
}

const APPROVED_STATUS: PolygonStatus[] = ["approved"];

export const useSitePolygonsHectares = (projectUuid: string | null): UseSitePolygonsHectaresResult => {
  const [error, setError] = useState<string | null>(null);
  const {
    data: allPolygonsData,
    isLoading,
    error: fetchError
  } = useAllSitePolygons({
    entityName: "projects",
    entityUuid: projectUuid ?? undefined,
    enabled: projectUuid != null,
    filter: { "polygonStatus[]": APPROVED_STATUS }
  });

  const transformPolygonsToHectaresData = useCallback((polygons: SitePolygonLightDto[]): HectaresData => {
    const restoration_strategies_represented: Record<string, number> = {};
    const target_land_use_types_represented: Record<string, number> = {};

    polygons.forEach(polygon => {
      if (!polygon?.indicators || !Array.isArray(polygon.indicators)) return;

      polygon.indicators.forEach((indicator: any) => {
        if (indicator.indicatorSlug === "restorationByStrategy" && indicator.value) {
          Object.entries(indicator.value).forEach(([strategy, hectares]) => {
            const numericValue = Number(hectares);
            if (!isNaN(numericValue) && numericValue > 0) {
              restoration_strategies_represented[strategy] =
                (restoration_strategies_represented[strategy] ?? 0) + numericValue;
            }
          });
        }

        if (indicator.indicatorSlug === "restorationByLandUse" && indicator.value) {
          Object.entries(indicator.value).forEach(([landUse, hectares]) => {
            const numericValue = Number(hectares);
            if (!isNaN(numericValue) && numericValue > 0) {
              target_land_use_types_represented[landUse] =
                (target_land_use_types_represented[landUse] ?? 0) + numericValue;
            }
          });
        }
      });
    });

    return {
      restoration_strategies_represented,
      target_land_use_types_represented
    };
  }, []);

  const hectaresData = useMemo(() => {
    if (isLoading || !allPolygonsData.length) return null;

    try {
      return transformPolygonsToHectaresData(allPolygonsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error transforming data");
      return null;
    }
  }, [allPolygonsData, isLoading, transformPolygonsToHectaresData]);

  const combinedError = useMemo(() => {
    if (error) return error;
    if (fetchError) return fetchError.message || "An error occurred while fetching polygons.";
    return null;
  }, [error, fetchError]);

  return {
    data: hectaresData,
    isLoading: isLoading,
    error: combinedError,
    allPolygonsData: allPolygonsData
  };
};
