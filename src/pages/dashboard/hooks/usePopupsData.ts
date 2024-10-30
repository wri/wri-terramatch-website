import { useEffect } from "react";

import { useGetV2DashboardPolygonDataUuid, useGetV2DashboardProjectDataUuid } from "@/generated/apiComponents";

const usePolygonData = (uuid: string, typeTooltip: string) => {
  const getDataHook = typeTooltip === "point" ? useGetV2DashboardProjectDataUuid : useGetV2DashboardPolygonDataUuid;

  const { data: tooltipData, refetch } = getDataHook({
    pathParams: { uuid }
  });

  useEffect(() => {
    refetch();
  }, [uuid, refetch, typeTooltip]);

  return { tooltipData };
};

export default usePolygonData;
