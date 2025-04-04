import { useRef, useState } from "react";

import {
  fetchGetV2EntityPolygons,
  fetchGetV2EntityPolygonsCount,
  fetchPostV2TerrafundValidationCriteriaData
} from "@/generated/apiComponents";
import { useOnMount } from "@/hooks/useOnMount";

interface LoadCriteriaSiteHook {
  data: any[];
  loading: boolean;
  total: number;
  progress: number;
  polygonCriteriaMap: Record<string, any>;
  refetch: () => void;
  fetchCriteriaData: (uuids: string[]) => void;
  loadCriteriaInOrder: () => void;
  updateSingleCriteriaData: (poly_id: string, updatedData: any) => void;
}

const useLoadCriteriaSite = (
  entity_uuid: string,
  entity_type: string,
  statuses: any = null,
  sortOrder: string = "created_at"
): LoadCriteriaSiteHook => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [polygonCriteriaMap, setPolygonCriteriaMap] = useState<Record<string, any>>({});
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadCriteriaInOrder = async () => {
    setLoading(true);
    for (const polygon of data) {
      await fetchCriteriaData(polygon.poly_id);
    }
    setLoading(false);
  };

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
          [`sort[${sortOrder}]`]: sortOrder === "created_at" ? "desc" : "asc"
        }
      });

      if (signal.aborted) return;

      setTotal(count!);
      let result: any[] = [];
      const limit = 5;
      let offset = 0;

      while (offset < count! && !signal.aborted) {
        const queryParams: any = {
          limit: limit,
          offset: offset,
          uuid: entity_uuid,
          type: entity_type,
          status: statuses ?? "",
          [`sort[${sortOrder}]`]: sortOrder === "created_at" ? "desc" : "asc"
        };

        const partialResponse = (await fetchGetV2EntityPolygons({
          queryParams
        })) as any;

        if (signal.aborted) return;

        const polyUuids = partialResponse.map((polygon: any) => polygon.poly_id);
        await fetchCriteriaData(polyUuids);

        if (signal.aborted) return;

        result = result.concat(partialResponse);
        setData(result as any);

        if (offset + limit > count!) {
          setProgress(count!);
        } else {
          setProgress(offset);
        }
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
    setPolygonCriteriaMap({});

    loadInBatches();
  };

  const fetchCriteriaData = async (polyUuids: string[]) => {
    const signal = abortControllerRef.current?.signal;

    try {
      if (signal && signal.aborted) return;

      const criteriaData = await fetchPostV2TerrafundValidationCriteriaData({
        body: {
          uuids: polyUuids
        }
      });

      if (signal && signal.aborted) return;

      setPolygonCriteriaMap(prev => {
        const newMap = { ...prev };
        polyUuids.forEach(uuid => {
          if (criteriaData[uuid]) {
            newMap[uuid] = criteriaData[uuid];
          }
        });
        return newMap;
      });
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error in fetchCriteriaData:", error);
      }
    }
  };

  const updateSingleCriteriaData = async (old_id: string, updatedData: any) => {
    setData((prevData: any) => prevData.map((item: any) => (item.uuid === old_id ? updatedData : item)));
    await fetchCriteriaData([updatedData.uuid]);
  };

  useOnMount(loadInBatches);

  return {
    data,
    loading,
    total,
    progress,
    polygonCriteriaMap,
    refetch,
    fetchCriteriaData,
    loadCriteriaInOrder,
    updateSingleCriteriaData
  };
};

export default useLoadCriteriaSite;
