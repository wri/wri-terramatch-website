import MapboxDraw from "@mapbox/mapbox-gl-draw";
import mapboxgl from "mapbox-gl";
import { MutableRefObject, useEffect, useRef } from "react";

import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

import { AdminPopup } from "../components/AdminPopup";
import { DashboardPopup } from "../components/DashboardPopup";
import { addPopupsToMap } from "../interactions/popups";
import type { TooltipType } from "../Map.d";

type UseMapPopupsParams = {
  map: MutableRefObject<mapboxgl.Map | null>;
  draw: MutableRefObject<MapboxDraw | null>;
  sourcesAdded: boolean;
  showPopups?: boolean;
  sitePolygonData?: SitePolygonLightDto[];
  tooltipType?: TooltipType;
  isDashboard?: string;
  selectedCountry?: string | null;
  isMobile: boolean;
  dashboardCountries?: any[];
  setLoader?: (v: boolean) => void;
  setPolygonFromMap?: (v: any) => void;
  setEditPolygon: (v: { isOpen: boolean; uuid: string; primary_uuid?: string }) => void;
  editPolygonSelected: { isOpen: boolean; uuid: string; primary_uuid?: string };
  setFilters?: any;
  setMobilePopupData: (v: any) => void;
  dashboardContext?: { setFilters?: any; dashboardCountries?: any[] } | null;
};

export function useMapPopups({
  map,
  draw,
  sourcesAdded,
  showPopups,
  sitePolygonData,
  tooltipType,
  isDashboard,
  selectedCountry,
  isMobile,
  dashboardCountries,
  setLoader,
  setPolygonFromMap,
  setEditPolygon,
  editPolygonSelected,
  setFilters,
  setMobilePopupData,
  dashboardContext
}: UseMapPopupsParams) {
  // Callbacks go into a ref so they never appear in the dependency array.
  // This prevents re-registering all click handlers on every parent render.
  const callbacksRef = useRef({
    setPolygonFromMap,
    setEditPolygon,
    setFilters,
    setMobilePopupData
  });
  useEffect(() => {
    callbacksRef.current = { setPolygonFromMap, setEditPolygon, setFilters, setMobilePopupData };
  });

  // editPolygonSelected is an object — stabilize via ref so popup closures always
  // read the latest value without triggering re-registration.
  const editPolygonRef = useRef(editPolygonSelected);
  useEffect(() => {
    editPolygonRef.current = editPolygonSelected;
  });

  useEffect(() => {
    if (!sourcesAdded || map.current == null || draw.current == null || !showPopups) return;

    addPopupsToMap(
      map.current,
      isDashboard ? DashboardPopup : AdminPopup,
      callbacksRef.current.setPolygonFromMap,
      sitePolygonData,
      tooltipType ?? "goTo",
      editPolygonRef.current,
      callbacksRef.current.setEditPolygon,
      draw.current,
      isDashboard,
      dashboardContext?.setFilters ?? callbacksRef.current.setFilters,
      dashboardContext?.dashboardCountries ?? dashboardCountries,
      setLoader,
      selectedCountry,
      isMobile || isDashboard != null ? callbacksRef.current.setMobilePopupData : undefined
    );
  }, [
    sourcesAdded,
    sitePolygonData,
    isDashboard,
    tooltipType,
    selectedCountry,
    isMobile,
    showPopups,
    dashboardCountries,
    setLoader,
    dashboardContext,
    map,
    draw
  ]);
}
