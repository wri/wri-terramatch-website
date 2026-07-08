import { type FC, memo, useCallback, useMemo, useRef } from "react";

import { getThemedColor } from "@/lib/theme";
import MapPopUp from "@/redesignComponents/geospatial/MapPopUp/MapPopUp";
import PointMarker from "@/redesignComponents/geospatial/PointMarker/PointMarker";

import PopupContentPlotANR from "./PopupPlotANR/PopupContentPlotANR";
import PopupFooterPlotANR from "./PopupPlotANR/PopupFooterPlotANR";
import PopupHeaderPlotANR from "./PopupPlotANR/PopupHeaderPlotANR";

const ANR_MARKER_COLOR = getThemedColor("primary", 700);

export type AnrPlotMapPopupProps = {
  plotId?: number;
  polygonName: string;
  onClose: () => void;
};

const AnrPlotMapPopupInner: FC<AnrPlotMapPopupProps> = ({ plotId, polygonName, onClose }) => {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleOpenChange = useCallback(
    (next: boolean): void => {
      if (!next) onClose();
    },
    [onClose]
  );

  const popupHeader = useMemo(() => <PopupHeaderPlotANR polygonName={polygonName} />, [polygonName]);
  const popupContent = useMemo(() => <PopupContentPlotANR plotId={plotId ?? 0} />, [plotId]);
  const popupFooter = useMemo(() => <PopupFooterPlotANR onClose={onClose} />, [onClose]);

  return (
    <>
      <PointMarker
        ariaLabel={polygonName}
        color={ANR_MARKER_COLOR}
        showFocusState
        size="sm"
        triggerRef={triggerRef}
        variant="simple-pin"
      />
      <MapPopUp
        anchorRef={triggerRef}
        open
        onOpenChange={handleOpenChange}
        placement="right"
        header={popupHeader}
        content={popupContent}
        footer={popupFooter}
      />
    </>
  );
};

export const AnrPlotMapPopup = memo(AnrPlotMapPopupInner);
