import { Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { Else, If, Then } from "react-if";

import Accordion from "@/components/elements/Accordion/Accordion";
import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import {
  fetchGetV2TerrafundValidationPolygon,
  useGetV2TerrafundValidationCriteriaData
} from "@/generated/apiComponents";
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

const validationLabels: any = {
  3: "No Overlapping Polygon",
  4: "No Self-Intersection",
  6: "Inside Size Limit",
  7: "Within Country",
  8: "No Spike",
  10: "Polygon Type",
  12: "Within Total Area Expected",
  14: "Data Completed"
};

export interface ICriteriaCheckItem {
  id: string;
  status: boolean;
  label: string;
  date?: string;
}

const PolygonDrawer = ({ polygonSelected }: { polygonSelected: string }) => {
  const [buttonToogle, setButtonToogle] = useState(true);
  const [selectedPolygonData, setSelectedPolygonData] = useState<SitePolygon>();
  const [statusSelectedPolygon, setStatusSelectedPolygon] = useState<string>("");
  const [openAttributes, setOpenAttributes] = useState(false);
  const [checkPolygonValidation, setCheckPolygonValidation] = useState(false);
  const [validationStatus, setValidationStatus] = useState(false);
  const [polygonValidationData, setPolygonValidationData] = useState<ICriteriaCheckItem[]>();

  const context = useSitePolygonData();
  const sitePolygonData = context?.sitePolygonData;
  const openEditNewPolygon = context?.isUserDrawingEnabled;

  const { data: criteriaData, refetch: reloadCriteriaValidation } = useGetV2TerrafundValidationCriteriaData({
    queryParams: {
      uuid: polygonSelected
    }
  });

  const validatePolygon = () => {
    fetchGetV2TerrafundValidationPolygon({
      queryParams: {
        uuid: polygonSelected
      }
    }).then(() => {
      setValidationStatus(true);
      reloadCriteriaValidation();
      setCheckPolygonValidation(false);
    });
  };

  useEffect(() => {
    if (checkPolygonValidation) {
      validatePolygon();
      reloadCriteriaValidation();
    }
  }, [checkPolygonValidation]);

  useEffect(() => {
    if (criteriaData && criteriaData.criteria_list) {
      const transformedData: ICriteriaCheckItem[] = criteriaData.criteria_list.map((criteria: any) => ({
        id: criteria.criteria_id,
        date: criteria.latest_created_at,
        status: criteria.valid === 1,
        label: validationLabels[criteria.criteria_id]
      }));
      setPolygonValidationData(transformedData);
      setValidationStatus(true);
    } else {
      setValidationStatus(false);
    }
  }, [criteriaData]);

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
              <PolygonValidation
                menu={polygonValidationData ?? []}
                clickedValidation={setCheckPolygonValidation}
                status={validationStatus}
              />
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
