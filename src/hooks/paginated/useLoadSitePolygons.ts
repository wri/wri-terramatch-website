import { useEffect, useState } from "react";

import {
  fetchGetV2AdminSitesUUIDPolygons,
  fetchGetV2AdminSitesUUIDPolygonsCount,
  fetchGetV2TerrafundValidationCriteriaData
} from "@/generated/apiComponents";

interface LoadSitePolygonsHook {
  data: any[];
  loading: boolean;
  total: number;
  progress: number;
  polygonListOrder: Record<string, any>;
  polygonMap: Record<string, any>;
  refetch: () => void;
  fetchCriteriaData: (uuid: string) => void;
}

const useLoadSitePolygons = (site_uuid: string): LoadSitePolygonsHook => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [polygonListOrder, setPolygonListOrder] = useState<Record<string, any>>({});
  const [polygonMap, setPolygonMap] = useState<Record<string, any>>({});

  const loadInBatches = async () => {
    setLoading(true);
    const { count } = await fetchGetV2AdminSitesUUIDPolygonsCount({
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
      const partialResponse = (await fetchGetV2AdminSitesUUIDPolygons({
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
    const keys = result.map((polygon: any) => polygon.poly_id);
    setPolygonListOrder(keys);
    setLoading(false);
  };

  const refetch = () => {
    setProgress(0);
    setTotal(0);
    setData([]);
    setPolygonListOrder({});
    setPolygonMap({});
    loadInBatches();
  };

  const fetchCriteriaData = async (uuid: string) => {
    const criteriaData = await fetchGetV2TerrafundValidationCriteriaData({
      queryParams: {
        uuid: uuid
      }
    });
    setPolygonMap(prev => {
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
    polygonListOrder,
    polygonMap,
    refetch,
    fetchCriteriaData
  };
};

export default useLoadSitePolygons;
