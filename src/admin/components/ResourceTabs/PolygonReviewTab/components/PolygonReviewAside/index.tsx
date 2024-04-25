import { Stack } from "@mui/material";

import Polygons, { IPolygonItem } from "../Polygons";

const SitePolygonReviewAside = (data: { data: IPolygonItem[] }) => {
  return (
    <Stack gap={8} className="h-full">
      <Polygons menu={data?.data} />
    </Stack>
  );
};

export default SitePolygonReviewAside;
