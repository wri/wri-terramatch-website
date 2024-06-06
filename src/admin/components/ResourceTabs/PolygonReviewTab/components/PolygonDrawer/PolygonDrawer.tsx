import { Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { Else, If, Then, When } from "react-if";

import Accordion from "@/components/elements/Accordion/Accordion";
import Button from "@/components/elements/Button/Button";
import Status, { StatusEnum } from "@/components/elements/Status/Status";
import Text from "@/components/elements/Text/Text";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import {
  fetchGetV2TerrafundValidationPolygon,
  fetchPutV2SitePolygonUUID,
  GetV2AuditStatusResponse,
  useGetV2AuditStatus,
  useGetV2TerrafundValidationCriteriaData
} from "@/generated/apiComponents";
import { SitePolygon } from "@/generated/apiSchemas";

import ComentarySection from "../ComentarySection/ComentarySection";
import StatusDisplay from "../PolygonStatus/StatusDisplay ";
import AttributeInformation from "./components/AttributeInformation";
import PolygonValidation from "./components/PolygonValidation";
import VersionHistory from "./components/VersionHistory";

const statusColor: Record<string, string> = {
  draft: "bg-pinkCustom",
  submitted: "bg-blue",
  approved: "bg-green",
  "needs-more-information": "bg-tertiary-600"
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

const ESTIMATED_AREA_CRITERIA_ID = 12;

const PolygonDrawer = ({
  polygonSelected,
  isPolygonStatusOpen,
  refresh
}: {
  polygonSelected: string;
  isPolygonStatusOpen: any;
  refresh?: () => void;
}) => {
  const [buttonToogle, setButtonToogle] = useState(true);
  const [selectedPolygonData, setSelectedPolygonData] = useState<SitePolygon>();
  const [statusSelectedPolygon, setStatusSelectedPolygon] = useState<string>("");
  const [openAttributes, setOpenAttributes] = useState(true);
  const [checkPolygonValidation, setCheckPolygonValidation] = useState(false);
  const [validationStatus, setValidationStatus] = useState(false);
  const [polygonValidationData, setPolygonValidationData] = useState<ICriteriaCheckItem[]>();
  const [criteriaValidation, setCriteriaValidation] = useState<boolean>(false);

  const context = useSitePolygonData();
  const sitePolygonData = context?.sitePolygonData;
  const openEditNewPolygon = context?.isUserDrawingEnabled;
  const selectedPolygon = (sitePolygonData as any as Array<SitePolygon>)?.find(
    (item: SitePolygon) => item?.poly_id === polygonSelected
  );
  const mutateSitePolygons = fetchPutV2SitePolygonUUID;
  const { data: criteriaData, refetch: reloadCriteriaValidation } = useGetV2TerrafundValidationCriteriaData(
    {
      queryParams: {
        uuid: polygonSelected
      }
    },
    {
      enabled: !!polygonSelected,
      onError: () => {
        setCriteriaValidation(true);
      }
    }
  );

  const {
    data: auditLogData,
    refetch,
    isLoading
  } = useGetV2AuditStatus<{ data: GetV2AuditStatusResponse }>({
    queryParams: {
      entity: "SitePolygon",
      uuid: selectedPolygon?.uuid ?? ""
    }
  });

  const validatePolygon = () => {
    fetchGetV2TerrafundValidationPolygon({
      queryParams: {
        uuid: polygonSelected
      }
    }).then(() => {
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
    setButtonToogle(!isPolygonStatusOpen);
  }, [isPolygonStatusOpen]);

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
    if (sitePolygonData && Array.isArray(sitePolygonData)) {
      const PolygonData = sitePolygonData.find((data: SitePolygon) => data.poly_id === polygonSelected);
      setSelectedPolygonData(PolygonData || {});
      setStatusSelectedPolygon(PolygonData?.status || "");
    } else {
      setSelectedPolygonData({});
      setStatusSelectedPolygon("");
    }
    const criteriaDataLength = criteriaData?.criteria_list?.length || 0;
    setCriteriaValidation(criteriaDataLength > 0 ? isValidData(criteriaData?.criteria_list) : true);
  }, [polygonSelected, sitePolygonData]);
  useEffect(() => {
    console.log("openEditNewPolygon", openEditNewPolygon);
    if (openEditNewPolygon) {
      setButtonToogle(true);
      setOpenAttributes(true);
    }
  }, [openEditNewPolygon]);

  const isValidData = (criteriaData: any) => {
    for (const criteria of criteriaData.criteria_list || []) {
      if (criteria.criteria_id === ESTIMATED_AREA_CRITERIA_ID) {
        continue;
      }
      if (criteria.valid !== 1) {
        return true;
      }
    }
    return false;
  };

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
          Attributes
        </Button>
        <Button
          variant={`${buttonToogle ? "transparent-toggle" : "white-toggle"}`}
          onClick={() => setButtonToogle(!buttonToogle)}
        >
          Polygon Status
        </Button>
      </div>
      <If condition={!buttonToogle}>
        <Then>
          <div className="flex max-h-max flex-[1_1_0] flex-col gap-6 overflow-auto pr-3">
            <div className="flex items-center gap-2">
              <Text variant="text-14-semibold" className="w-[15%] break-words">
                Status:
              </Text>
              <When condition={selectedPolygon?.status}>
                <Status className="w-[35%]" status={selectedPolygon?.status as StatusEnum} />
              </When>
            </div>
            <StatusDisplay
              titleStatus="Polygon"
              name={selectedPolygon?.poly_name}
              refresh={refresh}
              record={selectedPolygon}
              mutate={mutateSitePolygons}
              tab="polygonReview"
              checkPolygonsSite={criteriaValidation}
            />
            <ComentarySection
              auditLogData={auditLogData?.data}
              refresh={refetch}
              record={selectedPolygon}
              entity={"SitePolygon"}
              loading={isLoading}
            ></ComentarySection>
          </div>
        </Then>
        <Else>
          <div className="flex max-h-max flex-[1_1_0] flex-col gap-6 overflow-auto pr-3">
            <Accordion variant="drawer" title={"Validation"} defaultOpen={true}>
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
            <Accordion variant="drawer" title={"Version History"} defaultOpen={true}>
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
