import { useCallback, useMemo, useRef, useState } from "react";

import { useAuditStatuses } from "@/connections/AuditStatus";
import { POLYGON_APPROVED, POLYGON_PENDING_APPROVAL } from "@/constants/polygonStatuses";
import { closeMapPopupsFromMapPopup, openPolygonSubmitConfirmationFromMapPopup } from "@/context/mapArea.utils";
import { openPolygonEditDrawerForSitePolygon } from "@/context/polygonEditDrawer.utils";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import MapPopUp from "@/redesignComponents/geospatial/MapPopUp/MapPopUp";
import PointMarker from "@/redesignComponents/geospatial/PointMarker/PointMarker";

import type { PopupComponentProps, TooltipType } from "../../Map.d";
import {
  formatAreaHectaresForPopup,
  formatTreesPlantedForPopup,
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
};

export function PolygonPopupChampions({ popup, sitePolygon, tooltipType }: PolygonPopupChampionsProps) {
  const [open, setOpen] = useState(true);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedSitePolygonUuid = sitePolygon?.uuid ?? "";
  const hasValidSitePolygonUuid = selectedSitePolygonUuid !== "";

  const [, { data: auditStatusesData }] = useAuditStatuses({
    entity: "sitePolygons",
    uuid: selectedSitePolygonUuid,
    enabled: hasValidSitePolygonUuid
  });

  const commentsCount = useMemo(() => {
    if (auditStatusesData == null) {
      return 0;
    }
    return auditStatusesData.filter(audit => audit.type === "comment").length;
  }, [auditStatusesData]);

  const metrics = useMemo(() => {
    const validationStatus = normalizePolygonValidationStatus(sitePolygon?.validationStatus);
    return {
      polygonName: sitePolygon?.name ?? undefined,
      treesPlantedDisplay: formatTreesPlantedForPopup(sitePolygon?.numTrees),
      areaHectaresDisplay: formatAreaHectaresForPopup(sitePolygon?.calcArea),
      validationStatus,
      commentsDisplay: commentsCount.toString()
    };
  }, [commentsCount, sitePolygon]);

  const sitePolygonStatus = sitePolygon?.status;
  const submitDisabled = sitePolygonStatus === POLYGON_PENDING_APPROVAL || sitePolygonStatus === POLYGON_APPROVED;

  const closeMapPopup = useCallback(() => {
    setOpen(false);
    popup?.remove();
  }, [popup]);

  const handleRequestSubmit = useCallback(async () => {
    if (submitDisabled || sitePolygon?.uuid == null || sitePolygon.uuid === "") {
      return;
    }

    openPolygonSubmitConfirmationFromMapPopup({
      sitePolygonUuid: sitePolygon.uuid,
      eligibleCount: 1,
      totalCount: 1
    });
    closeMapPopupsFromMapPopup();
  }, [sitePolygon?.uuid, submitDisabled]);

  const handleEdit = useCallback(() => {
    openPolygonEditDrawerForSitePolygon(sitePolygon, metrics.polygonName);
    closeMapPopup();
  }, [closeMapPopup, metrics.polygonName, sitePolygon]);

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
          />
        }
        footer={
          <PopupFooterPolygon
            polygonUuid={sitePolygon?.polygonUuid ?? undefined}
            polygonName={metrics.polygonName}
            submitDisabled={submitDisabled}
            onSubmit={handleRequestSubmit}
            onEdit={handleEdit}
            tooltipType={tooltipType}
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
