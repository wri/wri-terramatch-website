import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { Map as MapboxMap } from "mapbox-gl";
import { MutableRefObject, useEffect, useRef } from "react";

import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

import { AdminPopup } from "../components/AdminPopup";
import { DashboardPopup } from "../components/DashboardPopup";
import { addPopupsToMap } from "../interactions/popups";
import type {
  DashboardPopupContext,
  EditPolygonState,
  MobilePopupData,
  SetPolygonFromMap,
  TooltipType
} from "../Map.d";

type UseMapPopupsParams = {
  map: MutableRefObject<MapboxMap | null>;
  draw: MutableRefObject<MapboxDraw | null>;
  sourcesAdded: boolean;
  showPopups?: boolean;
  sitePolygonData?: SitePolygonLightDto[];
  tooltipType?: TooltipType;
  isMobile: boolean;
  setLoader?: (v: boolean) => void;
  setPolygonFromMap?: SetPolygonFromMap;
  setEditPolygon: (v: EditPolygonState) => void;
  editPolygon: EditPolygonState;
  setMobilePopupData: (v: MobilePopupData) => void;
  /** Full dashboard context; undefined in admin mode — drives popup component choice and filter callbacks. */
  dashboardContext?: DashboardPopupContext | null;
  newStyling: boolean;
};

export function useMapPopups({
  map,
  draw,
  sourcesAdded,
  showPopups,
  sitePolygonData,
  tooltipType,
  isMobile,
  setLoader,
  setPolygonFromMap,
  setEditPolygon,
  editPolygon,
  setMobilePopupData,
  dashboardContext,
  newStyling
}: UseMapPopupsParams) {
  const callbacksRef = useRef({ setPolygonFromMap, setEditPolygon, setMobilePopupData });
  useEffect(() => {
    callbacksRef.current = { setPolygonFromMap, setEditPolygon, setMobilePopupData };
  });

  const editPolygonRef = useRef(editPolygon);
  useEffect(() => {
    editPolygonRef.current = editPolygon;
  });

  useEffect(() => {
    if (!sourcesAdded || map.current == null || draw.current == null || !showPopups) return;

    const PopupComponent = dashboardContext?.dashboardMode != null ? DashboardPopup : AdminPopup;

    addPopupsToMap(map.current, PopupComponent, draw.current, {
      setPolygonFromMap: callbacksRef.current.setPolygonFromMap,
      sitePolygonData,
      type: tooltipType ?? "goTo",
      editPolygon: editPolygonRef.current,
      setEditPolygon: callbacksRef.current.setEditPolygon,
      dashboard: dashboardContext ?? undefined,
      setLoader,
      setMobilePopupData:
        isMobile || dashboardContext?.dashboardMode != null ? callbacksRef.current.setMobilePopupData : undefined,
      newStyling
    });
  }, [
    sourcesAdded,
    sitePolygonData,
    tooltipType,
    isMobile,
    showPopups,
    setLoader,
    dashboardContext,
    map,
    draw,
    newStyling
  ]);
}
