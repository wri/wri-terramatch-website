import { Divider } from "@mui/material";
import { useT } from "@transifex/react";
import { useEffect, useState } from "react";
import { Else, If, Then, When } from "react-if";

import Accordion from "@/components/elements/Accordion/Accordion";
import Button from "@/components/elements/Button/Button";
import { validationLabels } from "@/components/elements/MapPolygonPanel/ChecklistInformation";
import useAlertHook from "@/components/elements/MapPolygonPanel/hooks/useAlertHook";
import { StatusEnum } from "@/components/elements/Status/constants/statusMap";
import Status from "@/components/elements/Status/Status";
import Text from "@/components/elements/Text/Text";
import { useLoading } from "@/context/loaderAdmin.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import {
  fetchPostV2TerrafundValidationPolygon,
  fetchPutV2ENTITYUUIDStatus,
  useGetV2SitePolygonUuidVersions,
  useGetV2TerrafundValidationCriteriaData,
  usePostV2TerrafundValidationPolygon
} from "@/generated/apiComponents";
import { SitePolygon } from "@/generated/apiSchemas";

import CommentarySection from "../CommentarySection/CommentarySection";
import StatusDisplay from "../PolygonStatus/StatusDisplay";
import AttributeInformation from "./components/AttributeInformation";
import PolygonValidation from "./components/PolygonValidation";
import VersionHistory from "./components/VersionHistory";

const statusColor: Record<string, string> = {
  draft: "bg-pinkCustom",
  submitted: "bg-blue",
  approved: "bg-green",
  "needs-more-information": "bg-tertiary-600"
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
  refresh,
  isOpenPolygonDrawer
}: {
  polygonSelected: string;
  isPolygonStatusOpen: any;
  refresh?: () => void;
  isOpenPolygonDrawer: boolean;
}) => {
  const [buttonToogle, setButtonToogle] = useState(true);
  const [selectedPolygonData, setSelectedPolygonData] = useState<SitePolygon>();
  const [statusSelectedPolygon, setStatusSelectedPolygon] = useState<string>("");
  const [openAttributes, setOpenAttributes] = useState(true);
  const [checkPolygonValidation, setCheckPolygonValidation] = useState(false);
  const [validationStatus, setValidationStatus] = useState(false);
  const [polygonValidationData, setPolygonValidationData] = useState<ICriteriaCheckItem[]>();
  const [criteriaValidation, setCriteriaValidation] = useState<boolean | any>();
  const [selectPolygonVersion, setSelectPolygonVersion] = useState<SitePolygon>();
  const [isLoadingDropdown, setIsLoadingDropdown] = useState(false);
  const t = useT();
  const context = useSitePolygonData();
  const contextMapArea = useMapAreaContext();
  const { displayNotification } = useAlertHook();
  const sitePolygonData = context?.sitePolygonData as undefined | Array<SitePolygon>;
  const sitePolygonRefresh = context?.reloadSiteData;
  const openEditNewPolygon = contextMapArea?.isUserDrawingEnabled;
  const selectedPolygon = sitePolygonData?.find((item: SitePolygon) => item?.poly_id === polygonSelected);
  const { showLoader, hideLoader } = useLoading();

  const { mutate: getValidations } = usePostV2TerrafundValidationPolygon({
    onSuccess: () => {
      reloadCriteriaValidation();
      setCheckPolygonValidation(false);
      displayNotification(
        t("Please update and re-run if validations fail."),
        "success",
        t("Success! TerraMatch reviewed the polygon")
      );
      hideLoader();
    },
    onError: () => {
      setCheckPolygonValidation(false);
      hideLoader();
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
      showLoader();
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
    setSelectPolygonVersion(selectedPolygonData);
  }, [buttonToogle, selectedPolygonData]);

  const {
    data: polygonVersions,
    refetch: refetchPolygonVersions,
    isLoading: isLoadingVersions
  } = useGetV2SitePolygonUuidVersions(
    {
      pathParams: { uuid: (selectPolygonVersion?.primary_uuid ?? selectedPolygon?.primary_uuid) as string }
    },
    {
      enabled: !!selectPolygonVersion?.primary_uuid || !!selectedPolygon?.primary_uuid
    }
  );

  useEffect(() => {
    setIsLoadingDropdown(true);
    const onLoading = async () => {
      await refetchPolygonVersions();
      setIsLoadingDropdown(false);
    };
    onLoading();
  }, [isOpenPolygonDrawer]);

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
              showChangeRequest={false}
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
              {selectedPolygonData && (
                <AttributeInformation selectedPolygon={selectPolygonVersion ?? selectedPolygonData} />
              )}
            </Accordion>
            <Accordion variant="drawer" title={"Version History"} defaultOpen={true}>
              {selectedPolygonData && (
                <VersionHistory
                  selectedPolygon={selectedPolygonData}
                  setSelectPolygonVersion={setSelectPolygonVersion}
                  selectPolygonVersion={selectPolygonVersion}
                  refreshPolygonList={refresh}
                  refreshSiteData={sitePolygonRefresh}
                  setSelectedPolygonData={setSelectedPolygonData}
                  setStatusSelectedPolygon={setStatusSelectedPolygon}
                  data={polygonVersions ?? []}
                  isLoadingVersions={isLoadingVersions}
                  refetch={refetchPolygonVersions}
                  isLoadingDropdown={isLoadingDropdown}
                  setIsLoadingDropdown={setIsLoadingDropdown}
                />
              )}
            </Accordion>
            <Divider />
          </div>
        </Else>
      </If>
    </div>
  );
};

export default PolygonDrawer;
