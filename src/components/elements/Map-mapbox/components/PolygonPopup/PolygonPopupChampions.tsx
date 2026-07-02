import { useT } from "@transifex/react";
import { useCallback, useMemo, useRef, useState } from "react";

import { useAuditStatuses } from "@/connections/AuditStatus";
import {
  closeMapPopupsFromMapPopup,
  isSitePolygonAdminReviewMode,
  openPolygonApproveConfirmationFromMapPopup,
  openPolygonRequestInformationConfirmationFromMapPopup,
  openPolygonSubmitConfirmationFromMapPopup,
  runPolygonValidationFromMapPopup
} from "@/context/mapArea.utils";
import { openPolygonEditDrawerForSitePolygon } from "@/context/polygonEditDrawer.utils";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
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
  normalizePolygonValidationStatus
} from "../../sitePolygonPopupUtils";
import PopupContentPolygon from "../PopupPolygon/PopupContentPolygon";
import PopupFooterPolygon from "../PopupPolygon/PopupFooterPolygon";
import PopupHeaderPolygon from "../PopupPolygon/PopupHeaderPolygon";

type PolygonPopupChampionsProps = {
  popup: PopupComponentProps["popup"];
  setShouldRefetchPolygonData?: PopupComponentProps["setShouldRefetchPolygonData"];
  sitePolygon?: SitePolygonLightDto;
  tooltipType?: TooltipType;
  siteReportPolygonPopup?: boolean;
};

export function PolygonPopupChampions({
  popup,
  sitePolygon,
  tooltipType,
  siteReportPolygonPopup = false
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
    enabled: hasValidSitePolygonUuid && !siteReportPolygonPopup
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
      polygonName: sitePolygon?.name ?? undefined,
      treesPlantedDisplay: formatTreesPlantedForPopup(sitePolygon?.numTrees),
      areaHectaresDisplay: formatAreaHectaresForPopup(sitePolygon?.calcArea),
      validationStatus,
      commentsDisplay: commentsCount.toString(),
      restorationPractice,
      targetLandUse
    };
  }, [commentsCount, sitePolygon]);

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
    if (sitePolygon?.uuid == null || sitePolygon.uuid === "") {
      return;
    }
    openPolygonApproveConfirmationFromMapPopup(sitePolygon.uuid);
    closeMapPopupsFromMapPopup();
  }, [sitePolygon?.uuid]);

  const handleRequestInformation = useCallback(() => {
    if (sitePolygon?.uuid == null || sitePolygon.uuid === "") {
      return;
    }
    openPolygonRequestInformationConfirmationFromMapPopup(sitePolygon.uuid);
    closeMapPopupsFromMapPopup();
  }, [sitePolygon?.uuid]);

  const handleEdit = useCallback(() => {
    openPolygonEditDrawerForSitePolygon(sitePolygon, metrics.polygonName);
    closeMapPopup();
  }, [closeMapPopup, metrics.polygonName, sitePolygon]);

  const geometryUuid = getSitePolygonGeometryUuid(sitePolygon);

  // Close the map popup immediately and hand off to the shared workspace flow, which opens the
  // results modal with its own loader — no intermediate button-state changes on this popup.
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
      showPolygonErrorToast(t("Failed to validate polygons"));
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
            siteReportPolygonPopup={siteReportPolygonPopup}
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
