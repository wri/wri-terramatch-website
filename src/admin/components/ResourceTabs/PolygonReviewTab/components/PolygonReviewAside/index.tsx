import { Stack } from "@mui/material";

import Polygons, { IpolygonFromMap, IPolygonItem } from "../Polygons";

interface SitePolygonReviewAsideProps {
  data: IPolygonItem[];
  polygonFromMap?: IpolygonFromMap;
  setPolygonFromMap?: any;
  refresh?: () => void;
  mapFunctions: any;
  totalPolygons?: number;
  progress?: number;
  siteUuid?: string;
  isLoading?: boolean;
}

const SitePolygonReviewAside = (props: SitePolygonReviewAsideProps) => (
  <Stack gap={8} className="h-full">
    <Polygons
      menu={props?.data}
      polygonFromMap={props?.polygonFromMap}
      setPolygonFromMap={props?.setPolygonFromMap}
      refresh={props?.refresh}
      mapFunctions={props?.mapFunctions}
      totalPolygons={props?.totalPolygons}
      progress={props?.progress}
      siteUuid={props?.siteUuid}
      isLoading={props?.isLoading}
    />
  </Stack>
);
export default SitePolygonReviewAside;
