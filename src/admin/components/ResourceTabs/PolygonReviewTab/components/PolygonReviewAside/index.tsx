import { Stack } from "@mui/material";

import Polygons, { IpolygonFromMap, IPolygonItem } from "../Polygons";

const SitePolygonReviewAside = (data: {
  data: IPolygonItem[];
  polygonFromMap?: IpolygonFromMap;
  setPolygonFromMap?: any;
}) => {
  return (
    <Stack gap={8} className="h-full">
      <Polygons menu={data?.data} polygonFromMap={data?.polygonFromMap} setPolygonFromMap={data?.setPolygonFromMap} />
    </Stack>
  );
};

export default SitePolygonReviewAside;
