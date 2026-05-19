import { useMemo, useRef, useState } from "react";

import { useAuditStatuses } from "@/connections/AuditStatus";
import { bulkUpdateSitePolygonStatus } from "@/connections/SitePolygons";
import { POLYGON_APPROVED, POLYGON_PENDING_APPROVAL } from "@/constants/polygonStatuses";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { openPolygonEditDrawer } from "@/pages/site/[uuid]/context/polygonEditDrawer.provider";
import MapPopUp from "@/redesignComponents/geospatial/MapPopUp/MapPopUp";
import PointMarker from "@/redesignComponents/geospatial/PointMarker/PointMarker";

import type { PopupComponentProps } from "../../Map.d";
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
};

export function PolygonPopupChampions({ popup, setShouldRefetchPolygonData, sitePolygon }: PolygonPopupChampionsProps) {
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

  const handleSubmit = async () => {
    if (submitDisabled || sitePolygon?.uuid == null || sitePolygon.uuid === "") {
      return;
    }
    setOpen(false);
    popup?.remove();
    await bulkUpdateSitePolygonStatus([sitePolygon.uuid], POLYGON_PENDING_APPROVAL, "");
    setShouldRefetchPolygonData?.(true);
  };

  const handleEdit = () => {
    openPolygonEditDrawer({
      polygonUuid: sitePolygon?.polygonUuid ?? undefined,
      polygonName: metrics.polygonName
    });
    setOpen(false);
    popup?.remove();
  };

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
            onSubmit={handleSubmit}
            onEdit={handleEdit}
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
