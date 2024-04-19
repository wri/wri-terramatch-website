import { Stack } from "@mui/material";

import Polygons, { IPolygonItem } from "../Polygons";

const criteriaMenuItems: IPolygonItem[] = [
  {
    id: "1",
    status: "Submitted",
    label: "Polygon 1213023412"
  },
  {
    id: "2",
    status: "Approved",
    label: "Polygon 1234825234"
  },
  {
    id: "3",
    status: "Submitted",
    label: "Polygon 2321340880"
  },
  {
    id: "4",
    status: "Approved",
    label: "Polygon 1234825235"
  },
  {
    id: "5",
    status: "Needs More Info",
    label: "Polygon 2321340881"
  },
  {
    id: "6",
    status: "Draft",
    label: "Polygon 2321340882"
  },
  {
    id: "7",
    status: "Draft",
    label: "Polygon 2321340883"
  },
  {
    id: "8",
    status: "Submitted",
    label: "Polygon 2321340884"
  }
];
const SitePolygonReviewAside = () => {
  return (
    <Stack gap={8} className="h-full">
      <Polygons menu={criteriaMenuItems} />
    </Stack>
  );
};

export default SitePolygonReviewAside;
