import { Stack } from "@mui/material";

import Polygons, { IpolygonFromMap, IPolygonItem } from "../Polygons";

const SitePolygonReviewAside = (data: { data: IPolygonItem[]; polygonFromMap?: IpolygonFromMap }) => {
  return (
    <Stack gap={8} className="h-full">
      <Polygons menu={data?.data} polygonFromMap={data?.polygonFromMap} />
    </Stack>
  );
};

export default SitePolygonReviewAside;
