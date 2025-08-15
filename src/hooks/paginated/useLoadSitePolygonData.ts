import { useMemo, useState } from "react";

import { useAllSitePolygons } from "@/connections/SitePolygons";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

const VALID_ENTITY_TYPES = ["sites", "projects"] as const;
const VALID_FILTER_ALL = "all" as const;

interface LoadSitePolygonsDataHook {
  data: SitePolygonLightDto[];
  loading: boolean;
  total: number;
  progress: number;
  refetch: () => void;
  polygonCriteriaMap: Record<string, unknown>;
  setPolygonCriteriaMap: (polygonCriteriaMap: Record<string, unknown>) => void;
}

const useLoadSitePolygonsData = (
  entityUuid: string,
  entityType: string,
  statuses: string | null = null,
  sortField: string = "createdAt",
  sortDirection: "ASC" | "DESC" = "ASC",
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
    progress,
    refetch
  } = useAllSitePolygons({
    entityName,
    entityUuid,
    enabled: entityUuid != null,
    filter,
    sortField,
    sortDirection
  });

  const [polygonCriteriaMap, setPolygonCriteriaMap] = useState<Record<string, unknown>>({});

  return {
    data: sitePolygonsData,
    loading: isLoading,
    total,
    progress,
    refetch,
    polygonCriteriaMap,
    setPolygonCriteriaMap
  };
};

export default useLoadSitePolygonsData;
