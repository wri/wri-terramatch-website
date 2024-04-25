import { Stack } from "@mui/material";

import Polygons from "../Polygons";

const SitePolygonReviewAside = (data: any) => {
  return (
    <Stack gap={8} className="h-full">
      <Polygons menu={data?.data} />
    </Stack>
  );
};

export default SitePolygonReviewAside;
