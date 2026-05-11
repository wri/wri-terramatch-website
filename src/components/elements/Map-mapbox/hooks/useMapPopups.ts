import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { Map as MapboxMap } from "mapbox-gl";
import { MutableRefObject, useEffect, useRef } from "react";

import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

import { useChampionsMap } from "../championsMap.context";
import { DashboardPopup } from "../components/DashboardPopup";
import { PolygonPopup } from "../components/PolygonPopup/PolygonPopup";
import { disableBackgroundClickClose, enableBackgroundClickClose } from "../interactions/popupCoordinator";
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
  setShouldRefetchPolygonData?: (v: boolean) => void;
  setEditPolygon: (v: EditPolygonState) => void;
  editPolygon: EditPolygonState;
  setMobilePopupData: (v: MobilePopupData) => void;
  dashboardContext?: DashboardPopupContext | null;
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
  setShouldRefetchPolygonData,
  setEditPolygon,
  editPolygon,
  setMobilePopupData,
  dashboardContext
}: UseMapPopupsParams) {
  const championsMap = useChampionsMap();
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

    const PopupComponent = dashboardContext?.dashboardMode != null ? DashboardPopup : PolygonPopup;
    const mapInstance = map.current;

    addPopupsToMap(mapInstance, PopupComponent, draw.current, {
      setPolygonFromMap: callbacksRef.current.setPolygonFromMap,
      setShouldRefetchPolygonData,
      sitePolygonData,
      type: tooltipType ?? "goTo",
      editPolygon: editPolygonRef.current,
      setEditPolygon: callbacksRef.current.setEditPolygon,
      dashboard: dashboardContext ?? undefined,
      setLoader,
      setMobilePopupData:
        isMobile || dashboardContext?.dashboardMode != null ? callbacksRef.current.setMobilePopupData : undefined,
      championsMap
    });

    enableBackgroundClickClose(mapInstance);
    return () => {
      disableBackgroundClickClose(mapInstance);
    };
  }, [
    sourcesAdded,
    sitePolygonData,
    tooltipType,
    isMobile,
    showPopups,
    setLoader,
    setShouldRefetchPolygonData,
    dashboardContext,
    map,
    draw,
    championsMap
  ]);
}
