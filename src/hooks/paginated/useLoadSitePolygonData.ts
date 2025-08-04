import { useMemo, useState } from "react";

import { useAllSitePolygons } from "@/connections/SitePolygons";
import { SitePolygonFullDto } from "@/generated/v3/researchService/researchServiceSchemas";
import Log from "@/utils/log";

const VALID_ENTITY_TYPES = ["sites", "projects"] as const;
const VALID_FILTER_ALL = "all" as const;

interface LoadSitePolygonsDataHook {
  data: SitePolygonFullDto[];
  loading: boolean;
  total: number;
  refetch: () => void;
  updateSingleSitePolygonData: (poly_id: string, updatedData: SitePolygonFullDto) => void;
  polygonCriteriaMap: Record<string, unknown>;
  setPolygonCriteriaMap: (polygonCriteriaMap: Record<string, unknown>) => void;
}

const useLoadSitePolygonsData = (
  entityUuid: string,
  entityType: string,
  statuses: string | null = null,
  sortOrder: string = "created_at",
  validFilter: string = ""
): LoadSitePolygonsDataHook => {
  // Validate entity type
  const entityName = useMemo(() => {
    if (!entityType || !VALID_ENTITY_TYPES.includes(entityType as any)) {
      throw new Error(`Invalid entityType: ${entityType}. Must be one of: ${VALID_ENTITY_TYPES.join(", ")}`);
    }
    return entityType as "sites" | "projects";
  }, [entityType]);

  // Build filter object for the new API
  const filter = useMemo(() => {
    const filterObj: Record<string, unknown> = {};

    if (statuses) {
      const statusArray = statuses.split(",").filter(Boolean);
      if (statusArray.length > 0) {
        filterObj.polygonStatus = statusArray;
      }
    }

    if (validFilter && validFilter !== VALID_FILTER_ALL) {
      filterObj.validationStatus = [validFilter];
    }

    return filterObj;
  }, [statuses, validFilter]);

  const {
    data: sitePolygonsData,
    isLoading,
    total,
    refetch,
    updateSinglePolygon
  } = useAllSitePolygons({
    entityName,
    entityUuid,
    enabled: entityUuid != null,
    filter
  });

  const [polygonCriteriaMap, setPolygonCriteriaMap] = useState<Record<string, unknown>>({});

  const updateSingleSitePolygonData = (old_id: string, updatedData: SitePolygonFullDto) => {
    try {
      updateSinglePolygon(old_id, updatedData);
    } catch (error) {
      Log.error("Failed to update single site polygon data", { old_id, error });
      refetch();
    }
  };

  return {
    data: sitePolygonsData,
    loading: isLoading,
    total,
    refetch,
    polygonCriteriaMap,
    setPolygonCriteriaMap,
    updateSingleSitePolygonData
  };
};

export default useLoadSitePolygonsData;
