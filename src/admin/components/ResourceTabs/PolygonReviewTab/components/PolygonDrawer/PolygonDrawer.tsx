import { Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { Else, If, Then } from "react-if";

import Accordion from "@/components/elements/Accordion/Accordion";
import Button from "@/components/elements/Button/Button";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import Text from "@/components/elements/Text/Text";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import { SitePolygon } from "@/generated/apiSchemas";
import { toArray } from "@/utils/array";

import ComentarySection from "../ComentarySection/ComentarySection";
import { dropdownPolygonOptions } from "../mockedData";
import StatusDisplay from "../PolygonStatus/StatusDisplay ";
import AttributeInformation from "./components/AttributeInformation";
import PolygonValidation from "./components/PolygonValidation";
import VersionHistory from "./components/VersionHistory";

const statusColor: Record<string, string> = {
  Draft: "bg-pinkCustom",
  Submitted: "bg-blue",
  Approved: "bg-green",
  "Needs More Info": "bg-tertiary-600"
};

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

const PolygonDrawer = ({ polygonSelected }: { polygonSelected: string }) => {
  const [buttonToogle, setButtonToogle] = useState(true);
  const [selectedPolygonData, setSelectedPolygonData] = useState<SitePolygon>();
  const [statusSelectedPolygon, setStatusSelectedPolygon] = useState<string>("");

  const context = useSitePolygonData();
  const sitePolygonData = context?.sitePolygonData;

  useEffect(() => {
    if (sitePolygonData && Array.isArray(sitePolygonData)) {
      const PolygonData = sitePolygonData.find((data: SitePolygon) => data.poly_id === polygonSelected);
      setSelectedPolygonData(PolygonData || {});
      setStatusSelectedPolygon(PolygonData?.status || "");
    } else {
      // Handle the case when sitePolygonData is not an array
      setSelectedPolygonData({});
      setStatusSelectedPolygon("");
    }
  }, [polygonSelected]);
  return (
    <div className="flex flex-1 flex-col gap-6 overflow-visible">
      <div>
        <Text variant={"text-12-light"}>{`Polygon ID: ${selectedPolygonData?.id}`}</Text>
        <Text variant={"text-20-bold"} className="flex items-center gap-1">
          {selectedPolygonData?.poly_name ? selectedPolygonData?.poly_name : "Unnamed Polygon"}
          <div className={`h-4 w-4 rounded-full ${statusColor[statusSelectedPolygon]}`} />
        </Text>
      </div>
      <div className="flex w-fit gap-1 rounded-lg bg-neutral-200 p-1">
        <Button
          variant={`${buttonToogle ? "white-toggle" : "transparent-toggle"}`}
          onClick={() => setButtonToogle(!buttonToogle)}
        >
          Polygon Status
        </Button>
        <Button
          variant={`${buttonToogle ? "transparent-toggle" : "white-toggle"}`}
          onClick={() => setButtonToogle(!buttonToogle)}
        >
          Attributes
        </Button>
      </div>
      <If condition={buttonToogle}>
        <Then>
          <div className="flex max-h-max flex-[1_1_0] flex-col gap-6 overflow-auto pr-3">
            <Dropdown
              label="Select Polygon"
              labelVariant="text-16-bold"
              labelClassName="capitalize"
              optionsClassName="max-w-full"
              defaultValue={toArray(dropdownPolygonOptions[0].value)}
              placeholder="Select Polygon"
              options={dropdownPolygonOptions}
              onChange={() => {}}
            />
            <StatusDisplay status={"Approved"} />
            <ComentarySection></ComentarySection>
          </div>
        </Then>
        <Else>
          <div className="flex max-h-max flex-[1_1_0] flex-col gap-6 overflow-auto pr-3">
            <Accordion variant="drawer" title={"Validation"}>
              <PolygonValidation menu={polygonValidationItems} />
            </Accordion>
            <Divider />
            <Accordion variant="drawer" title={"Attribute Information"}>
              {selectedPolygonData && <AttributeInformation selectedPolygon={selectedPolygonData} />}
            </Accordion>
            <Divider />
            <Accordion variant="drawer" title={"Version History"}>
              <VersionHistory />
            </Accordion>
            <Divider />
          </div>
        </Else>
      </If>
    </div>
  );
};

export default PolygonDrawer;
