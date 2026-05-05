import type { FC } from "react";
import { useCallback, useRef, useState } from "react";

import MapPopUp from "@/redesignComponents/geospatial/MapPopUp/MapPopUp";
import PointMarker from "@/redesignComponents/geospatial/PointMarker/PointMarker";

import TooltipMap from "../../TooltipMap/TooltipMap";
import type { PopupComponentProps } from "../Map.d";
import PopupContentPolygon from "./PopupPolygon/PopupContentPolygon";
import PopupFooterPolygon from "./PopupPolygon/PopupFooterPolygon";
import PopupHeaderPolygon from "./PopupPolygon/PopupHeaderPolygon";

export const AdminPopup: FC<PopupComponentProps> = event => {
  const { feature, popup, setPolygonFromMap, type, setEditPolygon, championsMap } = event;
  const uuidPolygon = (feature.properties?.uuid ?? "") as string;
  const [open, setOpen] = useState(true);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleTooltipClose = useCallback(() => {
    if (popup != null) {
      popup.remove();
      setPolygonFromMap?.({ isOpen: false, uuid: "" });
      setEditPolygon?.({ isOpen: false, uuid: "" });
    }
  }, [popup, setPolygonFromMap, setEditPolygon]);

  const handleSetEditPolygon = useCallback(
    (primaryUuid?: string) => {
      setPolygonFromMap?.({ isOpen: true, uuid: uuidPolygon });
      setEditPolygon?.({
        isOpen: true,
        uuid: uuidPolygon,
        primaryUuid
      });
      if (popup != null) {
        popup.remove();
      }
    },
    [popup, setPolygonFromMap, setEditPolygon, uuidPolygon]
  );

  const handleMarkerClick = useCallback(() => {
    setOpen(true);
  }, []);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);
      if (!nextOpen) {
        popup?.remove();
      }
    },
    [popup]
  );

  return championsMap == null || championsMap === false ? (
    <TooltipMap
      polygon={uuidPolygon}
      type={type}
      setTooltipOpen={handleTooltipClose}
      setEditPolygon={handleSetEditPolygon}
    />
  ) : (
    <>
      <PointMarker
        ariaLabel="This is a custom icon marker"
        variant="simple-pin"
        onClick={handleMarkerClick}
        triggerRef={triggerRef}
        showFocusState={open}
      />
      <MapPopUp
        anchorRef={triggerRef}
        content={<PopupContentPolygon />}
        footer={<PopupFooterPolygon />}
        placement="right"
        open={open}
        onOpenChange={handleOpenChange}
        header={<PopupHeaderPolygon />}
      />
    </>
  );
};
