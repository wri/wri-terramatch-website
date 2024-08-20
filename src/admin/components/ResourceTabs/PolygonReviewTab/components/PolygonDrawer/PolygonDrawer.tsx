import { Divider } from "@mui/material";
import { useT } from "@transifex/react";
import { isEmpty } from "lodash";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Else, If, Then, When } from "react-if";

import Accordion from "@/components/elements/Accordion/Accordion";
import Button from "@/components/elements/Button/Button";
import { StatusEnum } from "@/components/elements/Status/constants/statusMap";
import Status from "@/components/elements/Status/Status";
import Text from "@/components/elements/Text/Text";
import { useLoading } from "@/context/loaderAdmin.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import {
  fetchGetV2SitePolygonUuidVersions,
  fetchPostV2TerrafundValidationPolygon,
  fetchPutV2ENTITYUUIDStatus,
  useGetV2SitePolygonUuidVersions,
  useGetV2TerrafundValidationCriteriaData,
  usePostV2TerrafundClipPolygonsPolygonUuid,
  usePostV2TerrafundValidationPolygon
} from "@/generated/apiComponents";
import { ClippedPolygonsResponse, SitePolygon, SitePolygonsDataResponse } from "@/generated/apiSchemas";
import { parseValidationData } from "@/helpers/polygonValidation";

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
  extra_info?: string;
}

export const ESTIMATED_AREA_CRITERIA_ID = 12;
export const COMPLETED_DATA_CRITERIA_ID = 14;
export const OVERLAPPING_CRITERIA_ID = 3;

const PolygonDrawer = ({
  polygonSelected,
  isPolygonStatusOpen,
  refresh,
  isOpenPolygonDrawer,
  setSelectedPolygonToDrawer,
  selectedPolygonIndex,
  setPolygonFromMap,
  polygonFromMap,
  setIsOpenPolygonDrawer
}: {
  polygonSelected: string;
  isPolygonStatusOpen: any;
  refresh?: () => void;
  isOpenPolygonDrawer: boolean;
  setPolygonFromMap: Dispatch<SetStateAction<{ isOpen: boolean; uuid: string }>>;
  setSelectedPolygonToDrawer?: Dispatch<SetStateAction<{ id: string; status: string; label: string; uuid: string }>>;
  selectedPolygonIndex?: string;
  setIsOpenPolygonDrawer: Dispatch<SetStateAction<boolean>>;
  polygonFromMap?: { isOpen: boolean; uuid: string };
}) => {
  const [buttonToogle, setButtonToogle] = useState(true);
  const [selectedPolygonData, setSelectedPolygonData] = useState<SitePolygon>();
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
  const sitePolygonData = context?.sitePolygonData as undefined | Array<SitePolygon>;
  const sitePolygonRefresh = context?.reloadSiteData;
  const openEditNewPolygon = contextMapArea?.isUserDrawingEnabled;
  const selectedPolygon = sitePolygonData?.find((item: SitePolygon) => item?.poly_id === polygonSelected);
  const { statusSelectedPolygon, setStatusSelectedPolygon, setShouldRefetchValidation } = contextMapArea;
  const { showLoader, hideLoader } = useLoading();
  const { openNotification } = useNotificationContext();
  const wrapperRef = useRef(null);

  const { mutate: getValidations } = usePostV2TerrafundValidationPolygon({
    onSuccess: () => {
      reloadCriteriaValidation();
      setCheckPolygonValidation(false);
      openNotification(
        "success",
        t("Success! TerraMatch reviewed the polygon"),
        t("Please update and re-run if validations fail.")
      );
      hideLoader();
    },
    onError: () => {
      setCheckPolygonValidation(false);
      hideLoader();
      openNotification("error", t("Error! TerraMatch could not review polygons"), t("Please try again later."));
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

  const { mutate: clipPolygons } = usePostV2TerrafundClipPolygonsPolygonUuid({
    onSuccess: async (data: ClippedPolygonsResponse) => {
      if (!data.updated_polygons?.length) {
        openNotification("warning", t("No polygon have been fixed"), t("Please run 'Check Polygons' again."));
        hideLoader();
        return;
      }
      const updatedPolygonNames = data.updated_polygons
        ?.map(p => p.poly_name)
        .filter(Boolean)
        .join(", ");
      openNotification("success", t("Success! The following polygons have been fixed:"), updatedPolygonNames);
      setShouldRefetchValidation(true);
      await refetchPolygonVersions();
      await sitePolygonRefresh?.();
      await refresh?.();
      const response = (await fetchGetV2SitePolygonUuidVersions({
        pathParams: { uuid: selectedPolygon?.primary_uuid as string }
      })) as SitePolygonsDataResponse;
      const polygonActive = response?.find(item => item.is_active);
      setSelectedPolygonData(polygonActive);
      setSelectedPolygonToDrawer?.({
        id: selectedPolygonIndex as string,
        status: polygonActive?.status as string,
        label: polygonActive?.poly_name as string,
        uuid: polygonActive?.poly_id as string
      });
      setPolygonFromMap({ isOpen: true, uuid: polygonActive?.poly_id ?? "" });
      setStatusSelectedPolygon(polygonActive?.status ?? "");
      setIsLoadingDropdown(false);
      hideLoader();
    },
    onError: error => {
      console.error("Error clipping polygons:", error);
      openNotification("error", t("Error! Could not fix polygons"), t("Please try again later."));
    }
  });

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
      setPolygonValidationData(parseValidationData(criteriaData));
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
      pathParams: { uuid: (selectPolygonVersion?.primary_uuid ?? selectedPolygonData?.primary_uuid) as string }
    },
    {
      enabled: !!selectPolygonVersion?.primary_uuid || !!selectedPolygonData?.primary_uuid || !!polygonFromMap?.uuid
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

  useEffect(() => {
    if (selectedPolygonData && isEmpty(selectedPolygonData as SitePolygon) && isEmpty(polygonSelected)) {
      setSelectedPolygonData(selectPolygonVersion);
    }
  }, [selectPolygonVersion]);

  const runFixPolygonOverlaps = () => {
    if (polygonSelected) {
      showLoader();
      clipPolygons({ pathParams: { uuid: polygonSelected } });
    } else {
      console.error("Polygon UUID is missing");
      openNotification("error", t("Error"), t("Cannot fix polygons: Polygon UUID is missing."));
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-visible">
      <div>
        <Text variant={"text-12-light"}>{`Polygon ID: ${selectedPolygonData?.id}`}</Text>
        <div className="flex items-baseline gap-2">
          <Text variant={"text-20-bold"} className="flex items-center gap-1 break-all">
            {selectedPolygonData?.poly_name ?? "Unnamed Polygon"}
          </Text>
          <div className={`h-4 w-4 min-w-[16px] rounded-full ${statusColor[statusSelectedPolygon]}`} />
        </div>
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
          <div ref={wrapperRef} className="flex max-h-max flex-[1_1_0] flex-col gap-6 overflow-auto pr-3">
            <Accordion variant="drawer" title={"Validation"} defaultOpen={true}>
              <PolygonValidation
                menu={polygonValidationData ?? []}
                clickedValidation={setCheckPolygonValidation}
                clickedRunFixPolygonOverlaps={runFixPolygonOverlaps}
                status={validationStatus}
              />
            </Accordion>
            <Divider />
            <Accordion variant="drawer" title={"Attribute Information"} defaultOpen={openAttributes}>
              {selectedPolygonData && (
                <AttributeInformation
                  selectedPolygon={selectPolygonVersion ?? selectedPolygonData}
                  sitePolygonRefresh={sitePolygonRefresh}
                  isLoadingVersions={isLoadingVersions}
                  setSelectedPolygonData={setSelectPolygonVersion}
                  setStatusSelectedPolygon={setStatusSelectedPolygon}
                  refetchPolygonVersions={refetchPolygonVersions}
                  setSelectedPolygonToDrawer={setSelectedPolygonToDrawer}
                  selectedPolygonIndex={selectedPolygonIndex}
                  setPolygonFromMap={setPolygonFromMap}
                  setIsOpenPolygonDrawer={setIsOpenPolygonDrawer}
                  setIsLoadingDropdownVersions={setIsLoadingDropdown}
                />
              )}
            </Accordion>
            <Accordion variant="drawer" title={"Version History"} defaultOpen={true}>
              {selectedPolygonData && (
                <VersionHistory
                  wrapperRef={wrapperRef}
                  setPolygonFromMap={setPolygonFromMap}
                  polygonFromMap={polygonFromMap}
                  selectedPolygon={selectedPolygonData ?? selectPolygonVersion}
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
                  setSelectedPolygonToDrawer={setSelectedPolygonToDrawer}
                  selectedPolygonIndex={selectedPolygonIndex}
                />
              )}
            </Accordion>
            <Divider />
            <div className="mt-[79px] lg:mt-[95px] wide:mt-[164px]" />
          </div>
        </Else>
      </If>
    </div>
  );
};

export default PolygonDrawer;
