import { Stack } from "@mui/material";

import Polygons, { IpolygonFromMap, IPolygonItem } from "../Polygons";

const SitePolygonReviewAside = (data: {
  data: IPolygonItem[];
  polygonFromMap?: IpolygonFromMap;
  setPolygonFromMap?: any;
  refresh?: () => void;
}) => {
  return (
    <Stack gap={8} className="h-full">
      <Polygons
        menu={data?.data}
        polygonFromMap={data?.polygonFromMap}
        setPolygonFromMap={data?.setPolygonFromMap}
        refresh={data.refresh}
      />
    </Stack>
  );
};

export default SitePolygonReviewAside;
