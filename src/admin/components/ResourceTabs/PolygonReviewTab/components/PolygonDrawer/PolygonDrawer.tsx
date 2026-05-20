import { Divider } from "@mui/material";
import { useT } from "@transifex/react";
import { isEmpty } from "lodash";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";

import Accordion from "@/components/elements/Accordion/Accordion";
import Button from "@/components/elements/Button/Button";
import { StatusEnum } from "@/components/elements/Status/constants/statusMap";
import Status from "@/components/elements/Status/Status";
import Text from "@/components/elements/Text/Text";
import { useAuditStatuses } from "@/connections/AuditStatus";
import { clipSinglePolygon } from "@/connections/PolygonClipping";
import { bulkUpdateSitePolygonStatus, PolygonStatus } from "@/connections/SitePolygons";
import { createPolygonValidation } from "@/connections/Validation";
import { POLYGON_INFORMATION_REQUIRED, POLYGON_PENDING_APPROVAL } from "@/constants/polygonStatuses";
import { useAnrMapOverlayOptional } from "@/context/anrMapOverlay.provider";
import { useLoading } from "@/context/loaderAdmin.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { useOnUnmount } from "@/hooks/useOnMount";
import { usePolygonClippingCompletion } from "@/hooks/usePolygonClippingCompletion";
import { useValueChanged } from "@/hooks/useValueChanged";
import ApiSlice from "@/store/apiSlice";
import Log from "@/utils/log";
import { isSitePolygonEligibleForAnrMonitoringPlots } from "@/utils/sitePolygonAnrEligibility";

import AuditLogTable from "../../../AuditLogTab/components/AuditLogTable";
import CommentarySection from "../CommentarySection/CommentarySection";
import StatusDisplay from "../PolygonStatus/StatusDisplay";
import AnrMonitoringPlots from "./components/AnrMonitoringPlots";
import AttributeInformation from "./components/AttributeInformation";
import SinglePolygonValidation from "./components/SinglePolygonValidation";
import VersionHistory from "./components/VersionHistory";

const statusColor: Record<string, string> = {
  draft: "bg-pinkCustom",
  [POLYGON_PENDING_APPROVAL]: "bg-blue",
  approved: "bg-green",
  [POLYGON_INFORMATION_REQUIRED]: "bg-tertiary-600"
};

export type PolygonDrawerTopTab = "attributes" | "polygonStatus" | "anrMonitoringPlots";

const PolygonDrawer = ({
  polygonSelected,
  refresh,
  isOpenPolygonDrawer,
  setSelectedPolygonToDrawer,
  selectedPolygonIndex,
  setPolygonFromMap,
  polygonFromMap,
  setIsOpenPolygonDrawer,
  initialTopTab = "attributes"
}: {
  polygonSelected: string;
  refresh?: () => void;
  isOpenPolygonDrawer: boolean;
  setPolygonFromMap: Dispatch<SetStateAction<{ isOpen: boolean; uuid: string; source?: string }>>;
  setSelectedPolygonToDrawer?: Dispatch<SetStateAction<{ id: string; status: string; label: string; uuid: string }>>;
  selectedPolygonIndex?: string;
  setIsOpenPolygonDrawer: Dispatch<SetStateAction<boolean>>;
  polygonFromMap?: { isOpen: boolean; uuid: string };
  initialTopTab?: PolygonDrawerTopTab;
}) => {
  const [activeTab, setActiveTab] = useState<PolygonDrawerTopTab>(initialTopTab);
  const [selectedPolygonData, setSelectedPolygonData] = useState<SitePolygonLightDto>();
  const [openAttributes, setOpenAttributes] = useState(true);
  const [checkPolygonValidation, setCheckPolygonValidation] = useState(false);
  const [pendingClipping, setPendingClipping] = useState(false);
  const [selectPolygonVersion, setSelectPolygonVersion] = useState<SitePolygonLightDto>();
  const [isLoadingDropdown, setIsLoadingDropdown] = useState(false);
  const t = useT();
  const context = useSitePolygonData();
  const contextMapArea = useMapAreaContext();
  const sitePolygonData = context?.sitePolygonData as undefined | Array<SitePolygonLightDto>;
  const sitePolygonRefresh = context?.reloadSiteData;
  const isDrawingEnabled = contextMapArea?.isUserDrawingEnabled;
  const selectedPolygon = sitePolygonData?.find((item: SitePolygonLightDto) => item?.polygonUuid === polygonSelected);
  const anrPlotsEligible = useMemo(
    () => isSitePolygonEligibleForAnrMonitoringPlots(selectedPolygon),
    [selectedPolygon]
  );
  const anrMapOverlay = useAnrMapOverlayOptional();
  const { statusSelectedPolygon, setStatusSelectedPolygon, setShouldRefetchValidation } = contextMapArea;
  const { showLoader, hideLoader } = useLoading();
  const { openNotification } = useNotificationContext();
  const wrapperRef = useRef(null);
  const prevActiveTabForAnrRef = useRef<PolygonDrawerTopTab | null>(null);
  const anrMapOverlayRef = useRef(anrMapOverlay);
  anrMapOverlayRef.current = anrMapOverlay;

  const runPolygonValidation = async () => {
    try {
      showLoader();
      await createPolygonValidation({
        polygonUuids: [polygonSelected]
      });

      setCheckPolygonValidation(false);
      setShouldRefetchValidation(true);
      context?.reloadSiteData?.();
      ApiSlice.pruneCache("validations", [polygonSelected]);

      openNotification(
        "success",
        t("Success! TerraMatch reviewed the polygon"),
        t("Please update and re-run if validations fail.")
      );
      hideLoader();
    } catch (error) {
      setCheckPolygonValidation(false);
      hideLoader();
      openNotification("error", t("Error! TerraMatch could not review polygons"), t("Please try again later."));
    }
  };
  const handlePolygonStatusChange = useCallback(
    async (status: string, comment: string) => {
      if (selectedPolygon?.uuid == null) {
        Log.error("Cannot update polygon status: site polygon UUID is missing");
        return;
      }
      await bulkUpdateSitePolygonStatus([selectedPolygon.uuid], status as PolygonStatus, comment);
      ApiSlice.pruneCache("auditStatuses");
    },
    [selectedPolygon?.uuid]
  );

  useEffect(() => {
    if (checkPolygonValidation) {
      runPolygonValidation();
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

  useEffect(() => {
    const eligible = isSitePolygonEligibleForAnrMonitoringPlots(selectedPolygon);
    const safeTab = initialTopTab === "anrMonitoringPlots" && !eligible ? "attributes" : initialTopTab;
    setActiveTab(safeTab);
  }, [polygonSelected, initialTopTab, selectedPolygon]);

  useEffect(() => {
    if (!isSitePolygonEligibleForAnrMonitoringPlots(selectedPolygon) && activeTab === "anrMonitoringPlots") {
      setActiveTab("attributes");
    }
  }, [selectedPolygon, activeTab]);

  useEffect(() => {
    if (anrMapOverlay == null) {
      return;
    }
    if (!isOpenPolygonDrawer) {
      anrMapOverlay.resetAnrMapOverlay();
      prevActiveTabForAnrRef.current = null;
      return;
    }
    anrMapOverlay.setDrawerOpen(true);
    const onAnrTab = activeTab === "anrMonitoringPlots" && anrPlotsEligible;
    anrMapOverlay.setAnrTabActive(onAnrTab);

    if (selectedPolygon?.uuid != null && selectedPolygon.uuid !== "") {
      anrMapOverlay.syncDrawerSelection({
        sitePolygonUuid: selectedPolygon.uuid,
        geometryPolygonUuid: polygonSelected
      });
    }

    if (onAnrTab && prevActiveTabForAnrRef.current !== "anrMonitoringPlots") {
      anrMapOverlay.setShowPlotsOnMap(true);
    }
    prevActiveTabForAnrRef.current = activeTab;
  }, [anrMapOverlay, activeTab, anrPlotsEligible, isOpenPolygonDrawer, polygonSelected, selectedPolygon?.uuid]);

  useOnUnmount(() => {
    anrMapOverlayRef.current?.resetAnrMapOverlay();
  });

  useEffect(() => {
    if (Array.isArray(sitePolygonData)) {
      const PolygonData = sitePolygonData.find((data: SitePolygonLightDto) => data.polygonUuid === polygonSelected);
      setSelectedPolygonData(PolygonData ?? undefined);
      setStatusSelectedPolygon(PolygonData?.status ?? "");
    } else {
      setSelectedPolygonData(undefined);
      setStatusSelectedPolygon("");
    }
  }, [polygonSelected, setStatusSelectedPolygon, sitePolygonData]);
  useEffect(() => {
    if (isDrawingEnabled) {
      setOpenAttributes(true);
      setActiveTab(prev => (initialTopTab === "attributes" ? "attributes" : prev));
    }
  }, [initialTopTab, isDrawingEnabled]);

  useEffect(() => {
    setSelectPolygonVersion(selectedPolygonData);
  }, [selectedPolygonData]);

  useEffect(() => {
    if (selectedPolygonData && isEmpty(selectedPolygonData) && isEmpty(polygonSelected)) {
      setSelectedPolygonData(selectPolygonVersion);
    }
  }, [polygonSelected, selectPolygonVersion, selectedPolygonData]);

  const runFixPolygonOverlaps = () => {
    if (polygonSelected) {
      showLoader();
      clipSinglePolygon(polygonSelected);
      setPendingClipping(true);
    } else {
      Log.error("Polygon UUID is missing");
      openNotification("error", t("Error"), t("Cannot fix polygons: Polygon UUID is missing."));
    }
  };

  usePolygonClippingCompletion({
    pendingClipping,
    setPendingClipping,
    onSuccess: () => {
      hideLoader();
    },
    onFailure: () => {
      openNotification("error", t("Error! Could not fix polygons"), t("Please try again later."));
      hideLoader();
    }
  });

  const auditData = {
    entity: "site-polygon",
    entityUuid: selectedPolygon?.polygonUuid as string
  };

  const polygonUuid = selectedPolygon?.uuid;
  const hasValidUuid = polygonUuid != null && polygonUuid !== "";

  const [, { data: auditStatusesData, refetch: refetchAuditLog }] = useAuditStatuses({
    entity: "sitePolygons",
    uuid: polygonUuid ?? "",
    enabled: hasValidUuid
  });

  const auditLogData = auditStatusesData != null ? { data: auditStatusesData } : undefined;

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
          variant={`${activeTab === "attributes" ? "white-toggle" : "transparent-toggle"}`}
          onClick={() => setActiveTab("attributes")}
          className="px-3 py-1 lg:px-2.5 lg:py-1"
        >
          <span className="text-12">{t("Attributes")}</span>
        </Button>
        <Button
          variant={`${activeTab === "polygonStatus" ? "white-toggle" : "transparent-toggle"}`}
          onClick={() => setActiveTab("polygonStatus")}
          className="px-3 py-1 lg:px-2.5 lg:py-1"
        >
          <span className="text-12">{t("Polygon Status")}</span>
        </Button>
        {anrPlotsEligible ? (
          <Button
            variant={`${activeTab === "anrMonitoringPlots" ? "white-toggle" : "transparent-toggle"}`}
            onClick={() => setActiveTab("anrMonitoringPlots")}
            className="px-3 py-1 lg:px-2.5 lg:py-1"
          >
            <span className="text-12">{t("ANR Monitoring Plots")}</span>
          </Button>
        ) : null}
      </div>
      {activeTab === "polygonStatus" ? (
        <div className="flex max-h-max flex-[1_1_0] flex-col gap-6 overflow-auto pr-2.5">
          <div className="flex items-center gap-2">
            <Text variant="text-14-semibold" className="w-[15%] break-words">
              Status:
            </Text>
            {selectedPolygon?.status && <Status className="w-[35%]" status={selectedPolygon?.status as StatusEnum} />}
          </div>
          <StatusDisplay
            titleStatus="sitePolygons"
            name={selectedPolygon?.name}
            refresh={refresh}
            record={selectedPolygon}
            onStatusChange={handlePolygonStatusChange}
            showChangeRequest={false}
            checkPolygonsSite={true}
          />
          <CommentarySection
            variantText="text-14-semibold"
            record={selectedPolygon}
            entity="sitePolygons"
            refresh={refetchAuditLog}
          ></CommentarySection>
          {auditLogData != null && (
            <>
              <Text variant="text-14-semibold" className="">
                Audit Log
              </Text>
              <AuditLogTable
                fullColumns={false}
                auditLogData={auditLogData}
                auditData={auditData}
                refresh={refetchAuditLog}
              />
            </>
          )}
        </div>
      ) : activeTab === "anrMonitoringPlots" && anrPlotsEligible ? (
        <div className="flex max-h-max flex-[1_1_0] flex-col gap-6 overflow-auto pr-2.5">
          <AnrMonitoringPlots sitePolygonUuid={selectedPolygon?.uuid ?? ""} />
        </div>
      ) : (
        <div ref={wrapperRef} className="flex max-h-max flex-[1_1_0] flex-col gap-6 overflow-auto pr-2.5">
          <Accordion variant="drawer" title={"Validation"} defaultOpen={true}>
            <SinglePolygonValidation
              polygonUuid={polygonSelected}
              clickedValidation={setCheckPolygonValidation}
              clickedRunFixPolygonOverlaps={runFixPolygonOverlaps}
            />
          </Accordion>
          <Divider />
          <Accordion variant="drawer" title={"Attribute Information"} defaultOpen={openAttributes}>
            {selectedPolygonData != null && (
              <AttributeInformation
                selectedPolygon={selectPolygonVersion ?? selectedPolygonData}
                sitePolygonRefresh={sitePolygonRefresh ?? (() => {})}
                setSelectedPolygonData={setSelectPolygonVersion}
                setStatusSelectedPolygon={setStatusSelectedPolygon}
                setSelectedPolygonToDrawer={setSelectedPolygonToDrawer}
                selectedPolygonIndex={selectedPolygonIndex}
                setPolygonFromMap={setPolygonFromMap}
                setIsOpenPolygonDrawer={setIsOpenPolygonDrawer}
                setIsLoadingDropdownVersions={setIsLoadingDropdown}
              />
            )}
          </Accordion>
          <Accordion variant="drawer" title={"Version History"} defaultOpen={true} className="min-h-[168px]">
            {selectedPolygonData != null && (
              <VersionHistory
                wrapperRef={wrapperRef}
                setPolygonFromMap={setPolygonFromMap}
                polygonFromMap={polygonFromMap}
                selectedPolygon={selectedPolygonData}
                setSelectPolygonVersion={setSelectPolygonVersion}
                selectPolygonVersion={selectPolygonVersion}
                refreshPolygonList={refresh}
                refreshSiteData={sitePolygonRefresh}
                setSelectedPolygonData={setSelectedPolygonData}
                setStatusSelectedPolygon={setStatusSelectedPolygon}
                isLoadingDropdown={isLoadingDropdown}
                setIsLoadingDropdown={setIsLoadingDropdown}
                setSelectedPolygonToDrawer={setSelectedPolygonToDrawer}
                selectedPolygonIndex={selectedPolygonIndex}
              />
            )}
          </Accordion>
          <Divider />
          <div className="mt-[89px] lg:mt-[104px] wide:mt-[174px]" />
        </div>
      )}
    </div>
  );
};

export default PolygonDrawer;
