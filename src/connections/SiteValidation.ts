import { isEmpty } from "lodash";
import { useCallback, useEffect, useState } from "react";

import { v3Resource } from "@/connections/util/apiConnectionFactory";
import {
  sitePolygonsIndex,
  SitePolygonsIndexQueryParams
} from "@/generated/v3/researchService/researchServiceComponents";
import { SitePolygonLightDto, ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { useStableProps } from "@/hooks/useStableProps";
import { PendingError } from "@/store/apiSlice";
import ApiSlice from "@/store/apiSlice";
import { ConnectionProps, Filter } from "@/types/connection";
import { loadConnection } from "@/utils/loadConnection";

export interface SiteValidationData {
  polygonUuid: string;
  validationStatus: string | null;
  validationData?: ValidationDto;
}

export const siteValidationConnection = v3Resource("sitePolygons", sitePolygonsIndex)
  .index<SitePolygonLightDto>(() => ({ queryParams: { lightResource: true } }))
  .pagination()
  .enabledProp()
  .filter<Omit<Filter<SitePolygonsIndexQueryParams>, "projectId[]" | "siteId[]">>()
  .addProps<{ entityName?: "projects" | "sites"; entityUuid?: string }>(({ entityName, entityUuid }) => {
    if (entityName === "projects" && entityUuid != null) return { queryParams: { "projectId[]": [entityUuid] } };
    if (entityName === "sites" && entityUuid != null) return { queryParams: { "siteId[]": [entityUuid] } };
    return {};
  })
  .buildConnection();

export const useSiteValidation = (
  props: Omit<ConnectionProps<typeof siteValidationConnection>, "pageNumber" | "pageSize"> & {
    sortField?: string;
    sortDirection?: "ASC" | "DESC";
  }
) => {
  const [validationData, setValidationData] = useState<SiteValidationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<PendingError | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const stableProps = useStableProps(props);

  const fetchValidationData = useCallback(
    async (clearCache: boolean = false) => {
      setIsLoading(true);
      setError(null);
      setValidationData([]);
      setProgress(0);
      setTotal(0);

      try {
        if (clearCache) {
          ApiSlice.pruneCache("sitePolygons");
          const currentState = ApiSlice.currentState;
          const sitePolygonsIndices = currentState.meta.indices.sitePolygons ?? {};
          Object.keys(sitePolygonsIndices).forEach(indexKey => {
            ApiSlice.pruneIndex("sitePolygons", indexKey);
          });
        }

        const response = await loadConnection(siteValidationConnection, {
          ...stableProps,
          pageSize: 100,
          pageNumber: 1,
          sortField: stableProps.sortField,
          sortDirection: stableProps.sortDirection ?? "ASC"
        });

        if (response.loadFailure) {
          throw response.loadFailure;
        }

        const polygons = response.data ?? [];
        const totalCount = response.indexTotal ?? 0;

        setTotal(totalCount);
        setProgress(polygons.length);

        // Transform polygon data to validation data format
        const transformedData: SiteValidationData[] = polygons.map(polygon => ({
          polygonUuid: polygon.uuid,
          validationStatus: polygon.validationStatus,
          validationData: undefined // Will be fetched individually if needed
        }));

        setValidationData(transformedData);
      } catch (e: any) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    },
    [stableProps]
  );

  const refetch = useCallback(() => {
    fetchValidationData(true);
  }, [fetchValidationData]);

  useEffect(() => {
    if (!stableProps.enabled || isEmpty(stableProps.entityUuid)) {
      setIsLoading(false);
      setValidationData([]);
      setProgress(0);
      setTotal(0);
      return;
    }

    fetchValidationData();
  }, [stableProps, fetchValidationData]);

  return {
    data: validationData,
    isLoading,
    error,
    progress,
    total,
    refetch
  };
};
