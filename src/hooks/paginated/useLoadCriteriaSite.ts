import { useEffect, useState } from "react";

import {
  fetchGetV2EntityPolygons,
  fetchGetV2EntityPolygonsCount,
  fetchPostV2TerrafundValidationCriteriaData
} from "@/generated/apiComponents";

interface LoadCriteriaSiteHook {
  data: any[];
  loading: boolean;
  total: number;
  progress: number;
  polygonCriteriaMap: Record<string, any>;
  refetch: () => void;
  fetchCriteriaData: (uuids: string[]) => void;
  loadCriteriaInOrder: () => void;
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
  const loadCriteriaInOrder = async () => {
    setLoading(true);
    for (const polygon of data) {
      await fetchCriteriaData(polygon.poly_id);
    }
    setLoading(false);
  };
  const loadInBatches = async () => {
    setLoading(true);
    const { count } = await fetchGetV2EntityPolygonsCount({
      queryParams: {
        uuid: entity_uuid,
        type: entity_type,
        status: statuses ?? "",
        [`sort[${sortOrder}]`]: sortOrder === "created_at" ? "desc" : "asc"
      }
    });
    setTotal(count!);
    let result: any[] = [];
    const limit = 5;
    let offset = 0;
    while (offset < count!) {
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
      const polyUuids = partialResponse.map((polygon: any) => polygon.poly_id);
      await fetchCriteriaData(polyUuids);
      result = result.concat(partialResponse);
      setData(result as any);
      if (offset + limit > count!) {
        setProgress(count!);
      } else {
        setProgress(offset);
      }
      offset += limit;
    }
    setLoading(false);
  };

  const refetch = () => {
    setProgress(0);
    setTotal(0);
    setData([]);
    setPolygonCriteriaMap({});
    loadInBatches();
  };

  const fetchCriteriaData = async (polyUuids: string[]) => {
    const criteriaData = await fetchPostV2TerrafundValidationCriteriaData({
      body: {
        uuids: polyUuids
      }
    });
    setPolygonCriteriaMap(prev => {
      const newMap = { ...prev };
      polyUuids.forEach(uuid => {
        if (criteriaData[uuid]) {
          newMap[uuid] = criteriaData[uuid];
        }
      });
      return newMap;
    });
  };

  useEffect(() => {
    loadInBatches();
  }, []);

  return {
    data,
    loading,
    total,
    progress,
    polygonCriteriaMap,
    refetch,
    fetchCriteriaData,
    loadCriteriaInOrder
  };
};

export default useLoadCriteriaSite;
