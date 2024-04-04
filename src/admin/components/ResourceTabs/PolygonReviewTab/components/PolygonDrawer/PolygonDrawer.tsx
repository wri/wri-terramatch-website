import { Divider } from "@mui/material";
import { useState } from "react";
import { Else, If, Then } from "react-if";

import Accordion from "@/components/elements/Accordion/Accordion";
import Button from "@/components/elements/Button/Button";
import Comentary from "@/components/elements/Comentary/Comentary";
import ComentaryBox from "@/components/elements/ComentaryBox/ComentaryBox";
import StepProgressbar from "@/components/elements/ProgressBar/StepProgressbar/StepProgressbar";
import Text from "@/components/elements/Text/Text";

import AttributeInformation from "./components/AttributeInformation";
import PolygonValidation from "./components/PolygonValidation";
import VersionHistory from "./components/VersionHistory";

const polygonValidationItems = [
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

const polygonStatusLabels = [
  { id: "1", label: "Site Approved" },
  { id: "2", label: "Polygons Submitted" },
  { id: "3", label: "Polygons Approved" },
  { id: "4", label: "Monitoring Begins" }
];

const comentaryFiles = [
  { id: "1", file: "img-attachment.jpeg" },
  { id: "2", file: "img-attachment-with-large-name.jpeg" },
  { id: "3", file: "img-attachment.jpeg" },
  { id: "4", file: "img-attachment.jpeg" }
];

const comentariesItems = [
  {
    id: "1",
    name: "Ricardo",
    lastName: "Saavedra",
    date: "Oct 6, 2022 at 1:12 AM",
    comentary: `Don't see the outline. the source code also needs to be updated.re: aligned to one source. we need to make sure whether this is appropriate. consider that we have the organization in sign-up/profile, mask, and work request boards. On Thursday will provide the the source tables requested`,
    files: comentaryFiles
  },
  {
    id: "2",
    name: "Katie",
    lastName: "Evers",
    date: "Oct 5, 2022 at 11:51 PM",
    comentary: `The zoom to areas table sources the main mapview drop down list which only has for example, "Adams County" and not "Unincorporated Adams County". Do we want both options? @ricardosaavedra2    what is the source table of the mask layers? and also what is the source layer for work request drop down? Earlier this week when I was trying to add highlands ranch geom you said 'jurisdictions'. I added it but still don't see the outline. All this should be aligned to one source with data restructure I added it but still don't see the outline. All this should be aligned to one source with data restructure I added it but still don't see the outline. All this should be aligned to one source with data restructure`
  }
];

const PolygonDrawer = () => {
  const [buttonToogle, setButtonToogle] = useState(true);
  return (
    <div className="flex flex-1 flex-col gap-6 overflow-visible">
      <div>
        <Text variant={"text-12-light"}>Polygon ID: 1213023412</Text>
        <Text variant={"text-20-bold"} className="flex items-center gap-1">
          Malanga
          <div className="h-4 w-4 rounded-full bg-green" />
        </Text>
      </div>
      <div className="flex w-fit gap-1 rounded-lg bg-neutral-200 p-1">
        <Button
          variant={`${buttonToogle ? "white-toggle" : "transparent-toggle"}`}
          onClick={() => setButtonToogle(!buttonToogle)}
        >
          Attributes
        </Button>
        <Button
          variant={`${buttonToogle ? "transparent-toggle" : "white-toggle"}`}
          onClick={() => setButtonToogle(!buttonToogle)}
        >
          Polygon Status
        </Button>
      </div>
      <If condition={buttonToogle}>
        <Then>
          <div className="flex max-h-max flex-[1_1_0] flex-col gap-6 overflow-auto pr-3">
            <Accordion variant="drawer" title={"Validation"}>
              <PolygonValidation menu={polygonValidationItems} />
            </Accordion>
            <Divider />
            <Accordion variant="drawer" title={"Attribute Information"}>
              <AttributeInformation />
            </Accordion>
            <Divider />
            <Accordion variant="drawer" title={"Version History"}>
              <VersionHistory />
            </Accordion>
            <Divider />
          </div>
        </Then>
        <Else>
          <div className="flex max-h-max flex-[1_1_0] flex-col gap-6 overflow-auto pr-3">
            <StepProgressbar color="primary" value={80} labels={polygonStatusLabels} labelsPlaceTop />
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="semi-black" className="flex-1 whitespace-nowrap">
                Request change
              </Button>
              <Button className="flex-1">change status</Button>
            </div>
            <Text variant="text-16-bold">Send Comment</Text>
            <ComentaryBox name={"Ricardo"} lastName={"Saavedra"} />
            {comentariesItems.map(item => (
              <Comentary
                key={item.id}
                name={item.name}
                lastName={item.lastName}
                date={item.date}
                comentary={item.comentary}
                files={item.files}
              />
            ))}
          </div>
        </Else>
      </If>
    </div>
  );
};

export default PolygonDrawer;
