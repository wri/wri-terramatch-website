import { Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { Else, If, Then } from "react-if";

import Accordion from "@/components/elements/Accordion/Accordion";
import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import { SitePolygon } from "@/generated/apiSchemas";

import ComentarySection from "../ComentarySection/ComentarySection";
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
    label: "GeoJSON Format"
  },
  {
    id: "2",
    status: true,
    label: "WGS84 Projection"
  },
  {
    id: "3",
    status: false,
    label: "Earth Location"
  },
  {
    id: "4",
    status: false,
    label: "Country"
  },
  {
    id: "5",
    status: true,
    label: "Reasonable Size Self-Intersecting Topology"
  },
  {
    id: "6",
    status: false,
    label: "Overlapping Polygons"
  },
  {
    id: "7",
    status: true,
    label: "Spike"
  },
  {
    id: "8",
    status: true,
    label: "Polygon Integrity"
  },
  {
    id: "9",
    status: true,
    label: "Feature Type"
  }
];

const PolygonDrawer = ({ polygonSelected }: { polygonSelected: string }) => {
  const [buttonToogle, setButtonToogle] = useState(true);
  const [selectedPolygonData, setSelectedPolygonData] = useState<SitePolygon>();
  const [statusSelectedPolygon, setStatusSelectedPolygon] = useState<string>("");
  const [openAttributes, setOpenAttributes] = useState(false);

  const context = useSitePolygonData();
  const sitePolygonData = context?.sitePolygonData;
  const openEditNewPolygon = context?.isUserDrawingEnabled;

  useEffect(() => {
    console.log("polugon selected", polygonSelected);
    if (sitePolygonData && Array.isArray(sitePolygonData)) {
      const PolygonData = sitePolygonData.find((data: SitePolygon) => data.poly_id === polygonSelected);
      setSelectedPolygonData(PolygonData || {});
      setStatusSelectedPolygon(PolygonData?.status || "");
    } else {
      setSelectedPolygonData({});
      setStatusSelectedPolygon("");
    }
  }, [polygonSelected, sitePolygonData]);
  useEffect(() => {
    console.log("openEditNewPolygon", openEditNewPolygon);
    if (openEditNewPolygon) {
      setButtonToogle(false);
      setOpenAttributes(true);
    }
  }, [openEditNewPolygon]);
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
            <Accordion variant="drawer" title={"Attribute Information"} defaultOpen={openAttributes}>
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
