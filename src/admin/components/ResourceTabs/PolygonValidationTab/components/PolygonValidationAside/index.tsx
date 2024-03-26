import { Stack } from "@mui/material";

import Button from "@/components/elements/Button/Button";
import Comentary from "@/components/elements/Comentary/Comentary";
import ComentaryBox from "@/components/elements/ComentaryBox/ComentaryBox";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
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

const SitePolygonValidationAside = () => {
  return (
    <Stack gap={2} className="h-full">
      <Text variant="text-16-bold" className="flex items-center gap-1 text-grey-300">
        Status
        <Button variant="link">
          <Icon name={IconNames.LINK_PA} className="h-3 w-3" />
        </Button>
      </Text>
      <Button variant="white-pa" className="w-full text-neutral-950">
        Approved
      </Button>
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
