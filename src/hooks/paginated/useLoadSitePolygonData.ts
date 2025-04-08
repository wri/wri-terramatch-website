import { useRef, useState } from "react";

import { fetchGetV2EntityPolygons, fetchGetV2EntityPolygonsCount } from "@/generated/apiComponents";
import { useOnMount } from "@/hooks/useOnMount";

interface LoadSitePolygonsDataHook {
  data: any[];
  loading: boolean;
  total: number;
  progress: number;
  refetch: () => void;
  updateSingleSitePolygonData: (poly_id: string, updatedData: any) => void;
  polygonCriteriaMap: any;
  setPolygonCriteriaMap: (polygonCriteriaMap: any) => void;
}

const useLoadSitePolygonsData = (
  entity_uuid: string,
  entity_type: string,
  statuses: any = null,
  sortOrder: string = "created_at",
  validFilter: string = ""
): LoadSitePolygonsDataHook => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [polygonCriteriaMap, setPolygonCriteriaMap] = useState<any>({});
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadInBatches = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setLoading(true);

      if (signal.aborted) return;

      const { count } = await fetchGetV2EntityPolygonsCount({
        queryParams: {
          uuid: entity_uuid,
          type: entity_type,
          status: statuses ?? "",
          [`sort[${sortOrder}]`]: sortOrder === "created_at" ? "desc" : "asc",
          ...(validFilter !== "all" && { valid: validFilter })
        }
      });
      if (signal.aborted) return;

      setTotal(count!);
      let result: any[] = [];
      const limit = 10;
      let offset = 0;

      while (offset < count! && !signal.aborted) {
        const queryParams: any = {
          limit: limit,
          offset: offset,
          uuid: entity_uuid,
          type: entity_type,
          status: statuses ?? "",
          [`sort[${sortOrder}]`]: sortOrder === "created_at" ? "desc" : "asc",
          ...(validFilter !== "all" && { valid: validFilter })
        };

        const partialResponse = (await fetchGetV2EntityPolygons({
          queryParams
        })) as any;

        if (signal.aborted) return;

        result = result.concat(partialResponse);
        setData(result as any);

        setProgress(Math.min(offset + limit, count!));
        offset += limit;
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error in loadInBatches:", error);
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  };

  const refetch = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setProgress(0);
    setTotal(0);
    setData([]);
    loadInBatches();
  };

  const updateSingleSitePolygonData = async (old_id: string, updatedData: any) => {
    setData((prevData: any) => prevData.map((item: any) => (item.uuid === old_id ? updatedData : item)));
  };

  useOnMount(loadInBatches);

  return {
    data,
    loading,
    total,
    progress,
    refetch,
    polygonCriteriaMap,

    setPolygonCriteriaMap,
    updateSingleSitePolygonData
  };
};

export default useLoadSitePolygonsData;
