import { Stack } from "@mui/material";

import Polygons, { IpolygonFromMap, IPolygonItem } from "../Polygons";

interface SitePolygonReviewAsideProps {
  data: IPolygonItem[];
  polygonFromMap?: IpolygonFromMap;
  setPolygonFromMap?: any;
  refresh?: () => void;
  mapFunctions: any;
}

const SitePolygonReviewAside = (props: SitePolygonReviewAsideProps) => (
  <Stack gap={8} className="h-full">
    <Polygons
      menu={props?.data}
      polygonFromMap={props?.polygonFromMap}
      setPolygonFromMap={props?.setPolygonFromMap}
      refresh={props?.refresh}
      mapFunctions={props?.mapFunctions}
    />
  </Stack>
);

export default SitePolygonReviewAside;
