import { Stack } from "@mui/material";

import Comentary from "@/components/elements/Comentary/Comentary";
import ComentaryBox from "@/components/elements/ComentaryBox/ComentaryBox";

import CriteriaCheckForSitePolygons from "../CriteriaCheckForSitePolygons";
import StatusLeyend from "../StatusLeyend";

const comentariesItems = [
  {
    id: "1",
    name: "Ricardo",
    lastName: "Saavedra",
    date: "Oct 6, 2022 at 1:12 AM",
    comentary: `Don't see the outline. the source code also needs to be updated.re: aligned to one source. we need to make sure whether this is appropriate. consider that we have the organization in sign-up/profile, mask, and work request boards. On Thursday will provide the the source tables requested`
  },
  {
    id: "2",
    name: "Katie",
    lastName: "Evers",
    date: "Oct 5, 2022 at 11:51 PM",
    comentary: `The zoom to areas table sources the main mapview drop down list which only has for example, "Adams County" and not "Unincorporated Adams County". Do we want both options? @ricardosaavedra2    what is the source table of the mask layers? and also what is the source layer for work request drop down? Earlier this week when I was trying to add highlands ranch geom you said 'jurisdictions'. I added it but still don't see the outline. All this should be aligned to one source with data restructure I added it but still don't see the outline. All this should be aligned to one source with data restructure`
  }
];
const criteriaMenuItems = [
  {
    id: "1",
    status: true,
    label: "Polygon 1213023412"
  },
  {
    id: "2",
    status: true,
    label: "Polygon 1234825234"
  },
  {
    id: "3",
    status: false,
    label: "Polygon 2321340880"
  },
  {
    id: "4",
    status: false,
    label: "Polygon 1234825235"
  },
  {
    id: "5",
    status: true,
    label: "Polygon 2321340881"
  },
  {
    id: "6",
    status: true,
    label: "Polygon 2321340882"
  },
  {
    id: "7",
    status: false,
    label: "Polygon 2321340883"
  },
  {
    id: "8",
    status: false,
    label: "Polygon 2321340884"
  }
];
const SitePolygonValidationAside = () => {
  return (
    <Stack gap={8} className="h-full">
      <CriteriaCheckForSitePolygons menu={criteriaMenuItems} />
      <StatusLeyend />
      <ComentaryBox name={"Ricardo"} lastName={"Saavedra"} />
      {comentariesItems.map(item => (
        <Comentary
          key={item.id}
          name={item.name}
          lastName={item.lastName}
          date={item.date}
          comentary={item.comentary}
        />
      ))}
    </Stack>
  );
};

export default SitePolygonValidationAside;
