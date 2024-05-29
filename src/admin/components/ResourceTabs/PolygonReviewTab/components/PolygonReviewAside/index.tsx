import { Stack } from "@mui/material";

import Polygons, { IpolygonFromMap, IPolygonItem } from "../Polygons";

interface SitePolygonReviewAsideProps {
  data: IPolygonItem[];
  polygonFromMap?: IpolygonFromMap;
  setPolygonFromMap?: any;
  mapFunctions: any;
}

const SitePolygonReviewAside = (props: SitePolygonReviewAsideProps) => {
  return (
    <Stack gap={8} className="h-full">
      <Polygons
        menu={props?.data}
        polygonFromMap={props?.polygonFromMap}
        setPolygonFromMap={props?.setPolygonFromMap}
        mapFunctions={props?.mapFunctions}
      />
    </Stack>
  );
};

export default SitePolygonReviewAside;
