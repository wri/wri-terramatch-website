import { Divider } from "@mui/material";
import { useT } from "@transifex/react";
import { useEffect, useState } from "react";
import { Else, If, Then, When } from "react-if";

import Accordion from "@/components/elements/Accordion/Accordion";
import Button from "@/components/elements/Button/Button";
import useAlertHook from "@/components/elements/MapPolygonPanel/hooks/useAlertHook";
import { StatusEnum } from "@/components/elements/Status/constants/statusMap";
import Status from "@/components/elements/Status/Status";
import Text from "@/components/elements/Text/Text";
import Loader from "@/components/generic/Loading/Loader";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import {
  fetchPostV2TerrafundValidationPolygon,
  fetchPutV2ENTITYUUIDStatus,
  useGetV2TerrafundValidationCriteriaData,
  usePostV2TerrafundValidationPolygon
} from "@/generated/apiComponents";
import { SitePolygon } from "@/generated/apiSchemas";

import CommentarySection from "../CommentarySection/CommentarySection";
import StatusDisplay from "../PolygonStatus/StatusDisplay";
import AttributeInformation from "./components/AttributeInformation";
import PolygonValidation from "./components/PolygonValidation";

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

export const ESTIMATED_AREA_CRITERIA_ID = 12;
export const COMPLETED_DATA_CRITERIA_ID = 14;

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
  const [criteriaValidation, setCriteriaValidation] = useState<boolean | any>();
  const t = useT();
  const context = useSitePolygonData();
  const contextMapArea = useMapAreaContext();
  const { displayNotification } = useAlertHook();
  const sitePolygonData = context?.sitePolygonData as undefined | Array<SitePolygon>;
  const openEditNewPolygon = contextMapArea?.isUserDrawingEnabled;
  const selectedPolygon = sitePolygonData?.find((item: SitePolygon) => item?.poly_id === polygonSelected);
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: getValidations } = usePostV2TerrafundValidationPolygon({
    onSuccess: () => {
      reloadCriteriaValidation();
      setCheckPolygonValidation(false);
      displayNotification(
        t("Please update and re-run if validations fail."),
        "success",
        t("Success! TerraMatch reviewed the polygon")
      );
      setIsLoading(false);
    },
    onError: () => {
      setCheckPolygonValidation(false);
      setIsLoading(false);
      displayNotification(t("Please try again later."), "error", t("Error! TerraMatch could not review polygons"));
    }
  });
  const mutateSitePolygons = fetchPutV2ENTITYUUIDStatus;
  const { data: criteriaData, refetch: reloadCriteriaValidation } = useGetV2TerrafundValidationCriteriaData(
    {
      queryParams: {
        uuid: polygonSelected
      }
    },
    {
      enabled: !!polygonSelected
    }
  );

  useEffect(() => {
    if (checkPolygonValidation) {
      setIsLoading(true);
      getValidations({ queryParams: { uuid: polygonSelected } });
      reloadCriteriaValidation();
    }
  }, [checkPolygonValidation]);

  useEffect(() => {
    setButtonToogle(!isPolygonStatusOpen);
  }, [isPolygonStatusOpen]);

  useEffect(() => {
    if (criteriaData?.criteria_list && criteriaData?.criteria_list.length > 0) {
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
    if (Array.isArray(sitePolygonData)) {
      const PolygonData = sitePolygonData.find((data: SitePolygon) => data.poly_id === polygonSelected);
      setSelectedPolygonData(PolygonData ?? {});
      setStatusSelectedPolygon(PolygonData?.status ?? "");
    } else {
      setSelectedPolygonData({});
      setStatusSelectedPolygon("");
    }
  }, [polygonSelected, sitePolygonData]);
  useEffect(() => {
    if (openEditNewPolygon) {
      setButtonToogle(true);
      setOpenAttributes(true);
    }
  }, [openEditNewPolygon]);

  const isValidCriteriaData = (criteriaData: any) => {
    if (!criteriaData?.criteria_list?.length) {
      return true;
    }
    return criteriaData.criteria_list.some(
      (criteria: any) =>
        criteria.criteria_id !== ESTIMATED_AREA_CRITERIA_ID &&
        criteria.criteria_id !== COMPLETED_DATA_CRITERIA_ID &&
        criteria.valid !== 1
    );
  };

  useEffect(() => {
    const fetchCriteriaValidation = async () => {
      if (!buttonToogle) {
        const criteriaData = await fetchPostV2TerrafundValidationPolygon({
          queryParams: {
            uuid: polygonSelected
          }
        });
        setCriteriaValidation(criteriaData);
      }
    };

    fetchCriteriaValidation();
  }, [buttonToogle, selectedPolygonData]);

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-visible">
      <When condition={isLoading}>
        <div className="max-h-[60vh] min-h-[10vh] grid-cols-[14%_20%_18%_15%_33%]">
          <Loader />
        </div>
      </When>
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
              showChangeRequest={true}
              checkPolygonsSite={isValidCriteriaData(criteriaValidation)}
            />
            <CommentarySection record={selectedPolygon} entity={"Polygon"}></CommentarySection>
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
          </div>
        </Else>
      </If>
    </div>
  );
};

export default PolygonDrawer;
