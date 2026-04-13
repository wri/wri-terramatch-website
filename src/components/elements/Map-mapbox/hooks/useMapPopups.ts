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
  dashboardMode?: string;
  selectedCountry?: string | null;
  isMobile: boolean;
  dashboardCountries?: any[];
  setLoader?: (v: boolean) => void;
  setPolygonFromMap?: (v: any) => void;
  setEditPolygon: (v: { isOpen: boolean; uuid: string; primary_uuid?: string }) => void;
  editPolygon: { isOpen: boolean; uuid: string; primary_uuid?: string };
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
  dashboardMode,
  selectedCountry,
  isMobile,
  dashboardCountries,
  setLoader,
  setPolygonFromMap,
  setEditPolygon,
  editPolygon,
  setFilters,
  setMobilePopupData,
  dashboardContext
}: UseMapPopupsParams) {
  const callbacksRef = useRef({
    setPolygonFromMap,
    setEditPolygon,
    setFilters,
    setMobilePopupData
  });
  useEffect(() => {
    callbacksRef.current = { setPolygonFromMap, setEditPolygon, setFilters, setMobilePopupData };
  });

  const editPolygonRef = useRef(editPolygon);
  useEffect(() => {
    editPolygonRef.current = editPolygon;
  });

  useEffect(() => {
    if (!sourcesAdded || map.current == null || draw.current == null || !showPopups) return;

    addPopupsToMap(
      map.current,
      dashboardMode ? DashboardPopup : AdminPopup,
      callbacksRef.current.setPolygonFromMap,
      sitePolygonData,
      tooltipType ?? "goTo",
      editPolygonRef.current,
      callbacksRef.current.setEditPolygon,
      draw.current,
      dashboardMode,
      dashboardContext?.setFilters ?? callbacksRef.current.setFilters,
      dashboardContext?.dashboardCountries ?? dashboardCountries,
      setLoader,
      selectedCountry,
      isMobile || dashboardMode != null ? callbacksRef.current.setMobilePopupData : undefined
    );
  }, [
    sourcesAdded,
    sitePolygonData,
    dashboardMode,
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
