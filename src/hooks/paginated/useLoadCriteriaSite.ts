import { useEffect, useState } from "react";

import {
  fetchGetV2SitesUUIDPolygons,
  fetchGetV2SitesUUIDPolygonsCount,
  fetchGetV2TerrafundValidationCriteriaData
} from "@/generated/apiComponents";

interface LoadCriteriaSiteHook {
  data: any[];
  loading: boolean;
  total: number;
  progress: number;
  polygonCriteriaMap: Record<string, any>;
  refetch: () => void;
  fetchCriteriaData: (uuid: string) => void;
}

const useLoadCriteriaSite = (site_uuid: string): LoadCriteriaSiteHook => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [polygonCriteriaMap, setPolygonCriteriaMap] = useState<Record<string, any>>({});

  const loadInBatches = async () => {
    setLoading(true);
    const { count } = await fetchGetV2SitesUUIDPolygonsCount({
      pathParams: {
        uuid: site_uuid
      }
    });
    setTotal(count!);
    let result: any[] = [];
    const limit = 3;
    let offset = 0;
    while (offset < count!) {
      const queryParams: any = {
        limit: limit,
        offset: offset
      };
      const partialResponse = (await fetchGetV2SitesUUIDPolygons({
        pathParams: {
          uuid: site_uuid
        },
        queryParams
      })) as any;
      for (const polygon of partialResponse) {
        await fetchCriteriaData(polygon.poly_id);
      }
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

  const fetchCriteriaData = async (uuid: string) => {
    const criteriaData = await fetchGetV2TerrafundValidationCriteriaData({
      queryParams: {
        uuid: uuid
      }
    });
    setPolygonCriteriaMap(prev => {
      const newMap = { ...prev };
      newMap[uuid] = criteriaData;
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
    fetchCriteriaData
  };
};

export default useLoadCriteriaSite;
