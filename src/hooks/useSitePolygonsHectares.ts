import { useCallback, useEffect, useMemo, useState } from "react";

import { useSitePolygons } from "@/connections/SitePolygons";

export interface HectaresData {
  restoration_strategies_represented: Record<string, number>;
  target_land_use_types_represented: Record<string, number>;
}

export interface UseSitePolygonsHectaresResult {
  data: HectaresData | null;
  isLoading: boolean;
  error: string | null;
  allPolygonsCount: number;
}

export const useSitePolygonsHectares = (projectUuid: string | null): UseSitePolygonsHectaresResult => {
  console.log("projectUuid", projectUuid);
  const [allPolygonsData, setAllPolygonsData] = useState<any[]>([]);
  const [isLoadingBatch, setIsLoadingBatch] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = 100;

  const [isLoaded, { sitePolygons, total }] = useSitePolygons({
    entityName: "projects",
    entityUuid: projectUuid || "",
    pageSize: PAGE_SIZE,
    pageNumber: currentPage
  });

  const transformPolygonsToHectaresData = useCallback((polygons: any[]): HectaresData => {
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
                (restoration_strategies_represented[strategy] || 0) + numericValue;
            }
          });
        }

        if (indicator.indicatorSlug === "restorationByLandUse" && indicator.value) {
          Object.entries(indicator.value).forEach(([landUse, hectares]) => {
            const numericValue = Number(hectares);
            if (!isNaN(numericValue) && numericValue > 0) {
              target_land_use_types_represented[landUse] =
                (target_land_use_types_represented[landUse] || 0) + numericValue;
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

  useEffect(() => {
    if (!projectUuid) {
      setAllPolygonsData([]);
      setIsLoadingBatch(false);
      setError(null);
      setCurrentPage(1);
      return;
    }

    if (currentPage === 1) {
      setAllPolygonsData([]);
      setIsLoadingBatch(true);
      setError(null);
    }
  }, [projectUuid, currentPage]);

  useEffect(() => {
    if (!projectUuid) return;

    if (isLoaded && sitePolygons) {
      try {
        if (currentPage === 1) {
          setAllPolygonsData(sitePolygons);
        } else {
          setAllPolygonsData(prev => [...prev, ...sitePolygons]);
        }

        const totalLoaded = currentPage === 1 ? sitePolygons.length : allPolygonsData.length + sitePolygons.length;
        const hasMore = total ? totalLoaded < total : false;

        if (hasMore) {
          setCurrentPage(prev => prev + 1);
        } else {
          setIsLoadingBatch(false);
        }

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error processing polygons data");
        setIsLoadingBatch(false);
      }
    }

    if (isLoaded && !sitePolygons) {
      setIsLoadingBatch(false);
    }
  }, [isLoaded, sitePolygons, total, currentPage, projectUuid, allPolygonsData.length]);

  useEffect(() => {
    if (!projectUuid) return;

    setCurrentPage(1);
    setAllPolygonsData([]);
    setIsLoadingBatch(true);
    setError(null);
  }, [projectUuid]);

  const hectaresData = useMemo(() => {
    if (isLoadingBatch || !allPolygonsData.length) return null;

    try {
      return transformPolygonsToHectaresData(allPolygonsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error transforming data");
      return null;
    }
  }, [allPolygonsData, isLoadingBatch, transformPolygonsToHectaresData]);

  return {
    data: hectaresData,
    isLoading: isLoadingBatch || !isLoaded,
    error,
    allPolygonsCount: allPolygonsData.length
  };
};
