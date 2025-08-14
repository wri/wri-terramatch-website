import { Divider } from "@mui/material";
import { useT } from "@transifex/react";
import { isEmpty } from "lodash";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Else, If, Then, When } from "react-if";

import Accordion from "@/components/elements/Accordion/Accordion";
import Button from "@/components/elements/Button/Button";
import { parseSitePolygonsDataResponseToFullDto } from "@/components/elements/Map-mapbox/utils";
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
  GetV2AuditStatusENTITYUUIDResponse,
  useGetV2AuditStatusENTITYUUID,
  useGetV2SitePolygonUuidVersions,
  useGetV2TerrafundValidationCriteriaData,
  usePostV2TerrafundClipPolygonsPolygonUuid,
  usePostV2TerrafundValidationPolygon
} from "@/generated/apiComponents";
import { ClippedPolygonResponse, SitePolygon, SitePolygonsDataResponse } from "@/generated/apiSchemas";
import { SitePolygonFullDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { parseValidationData } from "@/helpers/polygonValidation";
import { useValueChanged } from "@/hooks/useValueChanged";
import Log from "@/utils/log";

import AuditLogTable from "../../../AuditLogTab/components/AuditLogTable";
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
export const WITHIN_COUNTRY_CRITERIA_ID = 7;
export const PLANT_START_DATE_CRITERIA_ID = 15;

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
  const [selectedPolygonData, setSelectedPolygonData] = useState<SitePolygonFullDto>();
  const [openAttributes, setOpenAttributes] = useState(true);
  const [checkPolygonValidation, setCheckPolygonValidation] = useState(false);
  const [validationStatus, setValidationStatus] = useState(false);
  const [polygonValidationData, setPolygonValidationData] = useState<ICriteriaCheckItem[]>();
  const [criteriaValidation, setCriteriaValidation] = useState<boolean | any>();
  const [selectPolygonVersion, setSelectPolygonVersion] = useState<SitePolygonFullDto>();
  const [isLoadingDropdown, setIsLoadingDropdown] = useState(false);
  const t = useT();
  const context = useSitePolygonData();
  const contextMapArea = useMapAreaContext();
  const sitePolygonData = context?.sitePolygonData as undefined | Array<SitePolygonFullDto>;
  const sitePolygonRefresh = context?.reloadSiteData;
  const openEditNewPolygon = contextMapArea?.isUserDrawingEnabled;
  const selectedPolygon = sitePolygonData?.find((item: SitePolygonFullDto) => item?.polygonUuid === polygonSelected);
  const { statusSelectedPolygon, setStatusSelectedPolygon, setShouldRefetchValidation, setPolygonCriteriaMap } =
    contextMapArea;
  const { showLoader, hideLoader } = useLoading();
  const { openNotification } = useNotificationContext();
  const wrapperRef = useRef(null);

  const {
    data: validationCriteriaData,
    isLoading: isLoadingValidationCriteria,
    refetch: refetchValidationCriteria
  } = useGetV2TerrafundValidationCriteriaData(
    {
      queryParams: { uuid: polygonSelected }
    },
    {
      enabled: !!polygonSelected,
      onSuccess: data => {
        if (data?.polygon_id) {
          setPolygonCriteriaMap((oldPolygonMap: Record<string, unknown>) => ({
            ...oldPolygonMap,
            [data.polygon_id?.toString() ?? ""]: data
          }));
        }
      }
    }
  );

  const { mutate: getValidations } = usePostV2TerrafundValidationPolygon({
    onSuccess: async (data: any) => {
      setCheckPolygonValidation(false);
      setPolygonCriteriaMap((oldPolygonMap: any) => ({
        ...oldPolygonMap,
        [data.polygon_id]: data
      }));

      if (data.polygon_id) {
        context?.reloadSiteData?.();
      }

      refetchValidationCriteria();
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

  const { mutate: clipPolygons } = usePostV2TerrafundClipPolygonsPolygonUuid({
    onSuccess: async (data: ClippedPolygonResponse) => {
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
      if (!selectedPolygon?.primaryUuid) {
        return;
      }
      const response = (await fetchGetV2SitePolygonUuidVersions({
        pathParams: { uuid: selectedPolygon?.primaryUuid as string }
      })) as SitePolygonsDataResponse;
      const polygonActive = response?.find(item => item.is_active);
      sitePolygonRefresh?.();
      if (polygonActive) {
        const polygonActiveFullDto = parseSitePolygonsDataResponseToFullDto(polygonActive);
        setSelectedPolygonData(polygonActiveFullDto);
        setSelectedPolygonToDrawer?.({
          id: selectedPolygonIndex as string,
          status: polygonActiveFullDto.status as string,
          label: polygonActiveFullDto.name as string,
          uuid: polygonActiveFullDto.polygonUuid as string
        });
        setPolygonFromMap({ isOpen: true, uuid: polygonActiveFullDto.polygonUuid ?? "" });
        setStatusSelectedPolygon(polygonActiveFullDto.status ?? "");
      }
      setIsLoadingDropdown(false);
      hideLoader();
    },
    onError: error => {
      Log.error("Error clipping polygons:", error);
      openNotification("error", t("Error! Could not fix polygons"), t("Please try again later."));
    }
  });

  useEffect(() => {
    console.log("polygonSelected", polygonSelected);
    if (checkPolygonValidation) {
      showLoader();
      getValidations({ queryParams: { uuid: polygonSelected } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkPolygonValidation]);

  useValueChanged(isLoadingDropdown, () => {
    if (isLoadingDropdown) {
      showLoader();
    } else {
      hideLoader();
    }
  });
  useValueChanged(isPolygonStatusOpen, () => {
    setButtonToogle(!isPolygonStatusOpen);
  });
  useEffect(() => {
    if (validationCriteriaData?.criteria_list && validationCriteriaData?.criteria_list.length > 0) {
      setPolygonValidationData(parseValidationData(validationCriteriaData));
      setValidationStatus(true);
    } else {
      setValidationStatus(false);
    }
  }, [validationCriteriaData]);

  useEffect(() => {
    if (Array.isArray(sitePolygonData)) {
      const PolygonData = sitePolygonData.find((data: SitePolygonFullDto) => data.polygonUuid === polygonSelected);
      setSelectedPolygonData(PolygonData ?? undefined);
      setStatusSelectedPolygon(PolygonData?.status ?? "");
    } else {
      setSelectedPolygonData(undefined);
      setStatusSelectedPolygon("");
    }
  }, [polygonSelected, setStatusSelectedPolygon, sitePolygonData]);
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
        criteria.criteria_id !== WITHIN_COUNTRY_CRITERIA_ID &&
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
  }, [buttonToogle, polygonSelected, selectedPolygonData]);

  const {
    data: polygonVersions,
    refetch: refetchPolygonVersions,
    isLoading: isLoadingVersions
  } = useGetV2SitePolygonUuidVersions(
    {
      pathParams: { uuid: (selectPolygonVersion?.primaryUuid ?? selectedPolygonData?.primaryUuid) as string }
    },
    {
      enabled: !!selectPolygonVersion?.primaryUuid || !!selectedPolygonData?.primaryUuid || !!polygonFromMap?.uuid
    }
  );

  useEffect(() => {
    setIsLoadingDropdown(true);
    const onLoading = async () => {
      await refetchPolygonVersions();
      setIsLoadingDropdown(false);
    };
    onLoading();
  }, [isOpenPolygonDrawer, refetchPolygonVersions]);

  useEffect(() => {
    if (selectedPolygonData && isEmpty(selectedPolygonData as SitePolygon) && isEmpty(polygonSelected)) {
      setSelectedPolygonData(selectPolygonVersion);
    }
  }, [polygonSelected, selectPolygonVersion, selectedPolygonData]);

  const runFixPolygonOverlaps = () => {
    if (polygonSelected) {
      showLoader();
      clipPolygons({ pathParams: { uuid: polygonSelected } });
    } else {
      Log.error("Polygon UUID is missing");
      openNotification("error", t("Error"), t("Cannot fix polygons: Polygon UUID is missing."));
    }
  };

  const auditData = {
    entity: "site-polygon",
    entity_uuid: selectedPolygon?.polygonUuid as string
  };

  const { data: auditLogData, refetch } = useGetV2AuditStatusENTITYUUID<{ data: GetV2AuditStatusENTITYUUIDResponse }>({
    pathParams: {
      entity: "site-polygon",
      uuid: selectedPolygon?.uuid as string
    }
  });

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-visible">
      <div>
        <Text variant={"text-12-light"}>{`Polygon ID: ${selectedPolygonData?.polygonUuid}`}</Text>
        <div className="flex items-baseline gap-2">
          <Text variant={"text-20-bold"} className="flex items-center gap-1 break-all">
            {selectedPolygonData?.name ?? "Unnamed Polygon"}
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
              name={selectedPolygon?.name}
              refresh={refresh}
              record={selectedPolygon}
              mutate={mutateSitePolygons}
              showChangeRequest={false}
              checkPolygonsSite={isValidCriteriaData(criteriaValidation)}
            />
            <CommentarySection
              variantText="text-14-semibold"
              record={selectedPolygon}
              entity={"Polygon"}
              refresh={refetch}
            ></CommentarySection>
            {auditLogData && (
              <>
                <Text variant="text-14-semibold" className="">
                  Audit Log
                </Text>
                <AuditLogTable
                  fullColumns={false}
                  auditLogData={auditLogData}
                  auditData={auditData}
                  refresh={refetch}
                />
              </>
            )}
          </div>
        </Then>
        <Else>
          <div ref={wrapperRef} className="flex max-h-max flex-[1_1_0] flex-col gap-6 overflow-auto pr-3">
            <Accordion variant="drawer" title={"Validation"} defaultOpen={true}>
              {isLoadingValidationCriteria ? (
                <div className="flex justify-center py-4">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-blue"></div>
                </div>
              ) : (
                <PolygonValidation
                  menu={polygonValidationData ?? []}
                  clickedValidation={setCheckPolygonValidation}
                  clickedRunFixPolygonOverlaps={runFixPolygonOverlaps}
                  status={validationStatus}
                />
              )}
            </Accordion>
            <Divider />
            <Accordion variant="drawer" title={"Attribute Information"} defaultOpen={openAttributes}>
              {selectedPolygonData && (
                <AttributeInformation
                  selectedPolygon={selectPolygonVersion ?? selectedPolygonData}
                  sitePolygonRefresh={sitePolygonRefresh ?? (() => {})}
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
            <Accordion variant="drawer" title={"Version History"} defaultOpen={true} className="min-h-[168px]">
              {isLoadingVersions ? (
                <div className="flex justify-center py-4">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-blue"></div>
                </div>
              ) : (
                selectedPolygonData && (
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
                )
              )}
            </Accordion>
            <Divider />
            <div className="mt-[89px] lg:mt-[104px] wide:mt-[174px]" />
          </div>
        </Else>
      </If>
    </div>
  );
};

export default PolygonDrawer;
