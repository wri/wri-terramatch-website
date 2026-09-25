import { useT } from "@transifex/react";
import { useCallback, useMemo, useRef, useState } from "react";

import { useAuditStatuses } from "@/connections/AuditStatus";
import {
  closeMapPopupsFromMapPopup,
  isSitePolygonAdminReviewMode,
  openPolygonApproveConfirmationFromMapPopup,
  openPolygonEditDrawerByPolygonIdFromMapPopup,
  openPolygonRequestInformationConfirmationFromMapPopup,
  openPolygonSubmitConfirmationFromMapPopup,
  runPolygonValidationFromMapPopup
} from "@/context/mapArea.utils";
import type { SitePolygonMapEntryDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { isRestorationStrategy, isTargetLandUseType } from "@/pages/site/[uuid]/components/polygonTable.constants";
import { showPolygonErrorToast } from "@/pages/site/[uuid]/utils/polygonOperationToasts";
import MapPopUp from "@/redesignComponents/geospatial/MapPopUp/MapPopUp";
import PointMarker from "@/redesignComponents/geospatial/PointMarker/PointMarker";
import Log from "@/utils/log";
import { getSingleSitePolygonApproveTooltip, isSitePolygonApprovable } from "@/utils/sitePolygonReview";
import { getSingleSitePolygonSubmitTooltip, isSitePolygonSubmittable } from "@/utils/sitePolygonSubmit";

import type { PopupComponentProps, TooltipType } from "../../Map.d";
import {
  canNavigateToSitePolygonViewDetails,
  navigateToSitePolygonViewDetails,
  resolveViewDetailsSiteUuid
} from "../../sitePolygonNavigation";
import {
  formatAreaHectaresForPopup,
  formatTreesPlantedForPopup,
  getSitePolygonGeometryUuid,
  normalizePolygonValidationStatus,
  POPUP_METRIC_UNAVAILABLE
} from "../../sitePolygonPopupUtils";
import PopupContentPolygon from "../PopupPolygon/PopupContentPolygon";
import PopupFooterPolygon from "../PopupPolygon/PopupFooterPolygon";
import PopupHeaderPolygon from "../PopupPolygon/PopupHeaderPolygon";

type PolygonPopupChampionsProps = {
  popup: PopupComponentProps["popup"];
  setShouldRefetchPolygonData?: PopupComponentProps["setShouldRefetchPolygonData"];
  sitePolygon?: SitePolygonMapEntryDto;
  isLoading?: boolean;
  tooltipType?: TooltipType;
  overviewPolygonPopup?: boolean;
};

export function PolygonPopupChampions({
  popup,
  sitePolygon,
  isLoading = false,
  tooltipType,
  overviewPolygonPopup = false
}: PolygonPopupChampionsProps) {
  const t = useT();
  const isAdminReview = isSitePolygonAdminReviewMode();
  const siteUuid = useMemo(() => resolveViewDetailsSiteUuid(sitePolygon), [sitePolygon]);
  const [open, setOpen] = useState(true);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedSitePolygonUuid = sitePolygon?.uuid ?? "";
  const hasValidSitePolygonUuid = selectedSitePolygonUuid !== "";

  const [, { data: auditStatusesData }] = useAuditStatuses({
    entity: "sitePolygons",
    uuid: selectedSitePolygonUuid,
    types: ["comment"],
    enabled: hasValidSitePolygonUuid && !overviewPolygonPopup
  });

  const commentsCount = useMemo(() => {
    if (auditStatusesData == null) {
      return 0;
    }
    return auditStatusesData.filter(audit => audit.type === "comment").length;
  }, [auditStatusesData]);

  const metrics = useMemo(() => {
    const validationStatus = normalizePolygonValidationStatus(sitePolygon?.validationStatus);
    const restorationPractice = (sitePolygon?.practice ?? []).filter(isRestorationStrategy);
    const targetLandUse =
      sitePolygon?.targetSys != null && isTargetLandUseType(sitePolygon.targetSys) ? sitePolygon.targetSys : null;

    return {
      polygonName: isLoading ? t("Loading...") : sitePolygon?.name ?? undefined,
      treesPlantedDisplay: isLoading ? POPUP_METRIC_UNAVAILABLE : formatTreesPlantedForPopup(sitePolygon?.numTrees),
      areaHectaresDisplay: isLoading ? POPUP_METRIC_UNAVAILABLE : formatAreaHectaresForPopup(sitePolygon?.calcArea),
      validationStatus: isLoading ? ("not-started" as const) : validationStatus,
      commentsDisplay: isLoading ? POPUP_METRIC_UNAVAILABLE : commentsCount.toString(),
      restorationPractice: isLoading ? [] : restorationPractice,
      targetLandUse: isLoading ? null : targetLandUse
    };
  }, [commentsCount, isLoading, sitePolygon, t]);

  const submitDisabled = !isSitePolygonSubmittable(sitePolygon);
  const submitDisabledTooltip = getSingleSitePolygonSubmitTooltip(sitePolygon, t);

  const approveDisabled = !isSitePolygonApprovable(sitePolygon);
  const approveDisabledTooltip = getSingleSitePolygonApproveTooltip(sitePolygon, t);

  const closeMapPopup = useCallback(() => {
    setOpen(false);
    popup?.remove();
  }, [popup]);

  const handleRequestSubmit = useCallback(async () => {
    if (submitDisabled || sitePolygon?.uuid == null || sitePolygon.uuid === "") {
      return;
    }

    openPolygonSubmitConfirmationFromMapPopup(sitePolygon.uuid);
    closeMapPopupsFromMapPopup();
  }, [sitePolygon?.uuid, submitDisabled]);

  const handleApprove = useCallback(() => {
    if (approveDisabled || sitePolygon?.uuid == null || sitePolygon.uuid === "") {
      return;
    }
    openPolygonApproveConfirmationFromMapPopup(sitePolygon.uuid);
    closeMapPopupsFromMapPopup();
  }, [approveDisabled, sitePolygon?.uuid]);

  const handleRequestInformation = useCallback(() => {
    if (sitePolygon?.uuid == null || sitePolygon.uuid === "") {
      return;
    }
    openPolygonRequestInformationConfirmationFromMapPopup(sitePolygon.uuid);
    closeMapPopupsFromMapPopup();
  }, [sitePolygon?.uuid]);

  const handleEdit = useCallback(() => {
    const polygonId =
      getSitePolygonGeometryUuid(sitePolygon) ??
      (sitePolygon?.uuid != null && sitePolygon.uuid !== "" ? sitePolygon.uuid : null);
    if (polygonId == null) {
      return;
    }

    closeMapPopup();

    const openEdit = openPolygonEditDrawerByPolygonIdFromMapPopup(polygonId);
    if (openEdit == null) {
      Log.error("Polygon edit handler is not registered for map popup");
      showPolygonErrorToast(t("Failed to open polygon for editing"));
      return;
    }

    void openEdit
      .then(opened => {
        if (!opened) {
          showPolygonErrorToast(t("Failed to open polygon for editing"));
        }
      })
      .catch(error => {
        Log.error("Failed to open polygon for editing from map popup:", error);
        showPolygonErrorToast(t("Failed to open polygon for editing"));
      });
  }, [closeMapPopup, sitePolygon, t]);

  const geometryUuid = getSitePolygonGeometryUuid(sitePolygon);

  const handleRunValidation = useCallback(() => {
    if (geometryUuid == null || geometryUuid === "") {
      return;
    }

    const runValidation = runPolygonValidationFromMapPopup([geometryUuid]);
    if (runValidation == null) {
      return;
    }

    closeMapPopup();
    void runValidation.catch(error => {
      Log.error("Failed to validate polygon from map popup:", error);
      showPolygonErrorToast(t("Failed to Validate Polygons"));
    });
  }, [closeMapPopup, geometryUuid, t]);

  const handleViewDetails = useCallback(() => {
    if (geometryUuid == null) {
      return;
    }

    closeMapPopup();
    navigateToSitePolygonViewDetails(geometryUuid, siteUuid);
  }, [closeMapPopup, geometryUuid, siteUuid]);

  return (
    <>
      <PointMarker variant="simple-pin" onClick={() => setOpen(true)} triggerRef={triggerRef} showFocusState={open} />
      <MapPopUp
        anchorRef={triggerRef}
        content={
          <PopupContentPolygon
            treesPlantedDisplay={metrics.treesPlantedDisplay}
            areaHectaresDisplay={metrics.areaHectaresDisplay}
            commentsDisplay={metrics.commentsDisplay}
            validationStatus={metrics.validationStatus}
            overviewPolygonPopup={overviewPolygonPopup}
            restorationPractice={metrics.restorationPractice}
            targetLandUse={metrics.targetLandUse}
          />
        }
        footer={
          <PopupFooterPolygon
            polygonUuid={sitePolygon?.polygonUuid ?? undefined}
            polygonName={metrics.polygonName}
            submitDisabled={submitDisabled}
            submitDisabledTooltip={submitDisabledTooltip}
            onSubmit={handleRequestSubmit}
            onEdit={handleEdit}
            onClose={closeMapPopup}
            onViewDetails={handleViewDetails}
            viewDetailsDisabled={!canNavigateToSitePolygonViewDetails(geometryUuid, siteUuid)}
            tooltipType={tooltipType}
            isAdminReview={isAdminReview}
            onRunValidation={isAdminReview ? handleRunValidation : undefined}
            approveDisabled={approveDisabled}
            approveDisabledTooltip={approveDisabledTooltip}
            onApprove={handleApprove}
            onRequestInformation={handleRequestInformation}
          />
        }
        placement="right"
        open={open}
        onOpenChange={nextOpen => {
          if (!nextOpen) {
            setOpen(nextOpen);
            popup?.remove();
          } else {
            setOpen(nextOpen);
          }
        }}
        header={<PopupHeaderPolygon polygonName={metrics.polygonName} />}
      />
    </>
  );
}
