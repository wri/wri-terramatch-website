import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { GeoJSONFeature, Map as MapboxMap } from "mapbox-gl";
import { MutableRefObject, useEffect, useRef } from "react";

import { BBox } from "@/components/elements/Map-mapbox/GeoJSON";
import { loadBoundingBox, normalizeBoundingBoxDto } from "@/connections/BoundingBox";
import { LAYERS_NAMES } from "@/constants/layers";
import { registerOpenPolygonPopupHandler, unregisterOpenPolygonPopupHandler } from "@/context/mapArea.utils";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import Log from "@/utils/log";

import { useChampionsMap } from "../championsMap.context";
import { DashboardPopup } from "../components/DashboardPopup";
import { PolygonPopup } from "../components/PolygonPopup/PolygonPopup";
import { useMapEditFocus } from "../hooks/useMapEditFocus";
import {
  closeAllPopups,
  disableBackgroundClickClose,
  enableBackgroundClickClose
} from "../interactions/popupCoordinator";
import {
  addPopupsToMap,
  openPolygonPopup,
  PopupHandlerOptions,
  removePopups,
  teardownPopupsFromMap
} from "../interactions/popups";
import type {
  DashboardPopupContext,
  EditPolygonState,
  MobilePopupData,
  PolygonFromMapState,
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
  siteReportPolygonPopup?: boolean;
  polygonFromMap?: Pick<PolygonFromMapState, "isOpen"> | null;
};

const buildPopupFeature = (polygonUuid: string): GeoJSONFeature =>
  ({
    type: "Feature",
    properties: { uuid: polygonUuid },
    geometry: {
      type: "Point",
      coordinates: [0, 0]
    }
  } as unknown as GeoJSONFeature);

const getBboxCenter = (bbox: BBox) => ({
  lng: (bbox[0] + bbox[2]) / 2,
  lat: (bbox[1] + bbox[3]) / 2
});

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
  dashboardContext,
  siteReportPolygonPopup,
  polygonFromMap
}: UseMapPopupsParams) {
  const championsMap = useChampionsMap();
  const { isEditFocusActive } = useMapEditFocus({ polygonFromMap, editPolygon });
  const effectiveShowPopups = showPopups === true && !isEditFocusActive;
  const callbacksRef = useRef({ setPolygonFromMap, setEditPolygon, setMobilePopupData });
  useEffect(() => {
    callbacksRef.current = { setPolygonFromMap, setEditPolygon, setMobilePopupData };
  });

  const editPolygonRef = useRef(editPolygon);
  useEffect(() => {
    editPolygonRef.current = editPolygon;
  });

  const popupOptionsRef = useRef<PopupHandlerOptions | null>(null);

  useEffect(() => {
    if (!isEditFocusActive || map.current == null) return;
    closeAllPopups(map.current);
    removePopups(map.current, "POLYGON");
  }, [isEditFocusActive, map]);

  useEffect(() => {
    if (!sourcesAdded || map.current == null || draw.current == null || !effectiveShowPopups) return;

    const PopupComponent = dashboardContext?.dashboardMode != null ? DashboardPopup : PolygonPopup;
    const mapInstance = map.current;

    const popupOptions: PopupHandlerOptions = {
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
      championsMap,
      siteReportPolygonPopup
    };
    popupOptionsRef.current = popupOptions;

    addPopupsToMap(mapInstance, PopupComponent, draw.current, popupOptions);

    const openPopupForUuid = async (polygonUuid: string) => {
      const activeMap = map.current;
      const activeOptions = popupOptionsRef.current;
      if (activeMap == null || activeOptions == null || polygonUuid === "") {
        return;
      }

      try {
        const result = await loadBoundingBox({ filter: { polygonUuid }, enabled: true });
        const bbox = normalizeBoundingBoxDto(result?.data?.bbox);
        if (bbox == null || map.current == null) {
          return;
        }

        openPolygonPopup(
          map.current,
          PopupComponent,
          {
            feature: buildPopupFeature(polygonUuid),
            lngLat: getBboxCenter(bbox),
            layerName: LAYERS_NAMES.CENTROIDS
          },
          {
            ...activeOptions,
            editPolygon: editPolygonRef.current,
            setPolygonFromMap: callbacksRef.current.setPolygonFromMap,
            setEditPolygon: callbacksRef.current.setEditPolygon,
            sitePolygonData
          }
        );
      } catch (error) {
        Log.warn("useMapPopups: failed to open polygon popup programmatically", { polygonUuid, error });
      }
    };

    registerOpenPolygonPopupHandler(openPopupForUuid);
    enableBackgroundClickClose(mapInstance);

    return () => {
      teardownPopupsFromMap(mapInstance);
      unregisterOpenPolygonPopupHandler();
      disableBackgroundClickClose(mapInstance);
    };
  }, [
    sourcesAdded,
    sitePolygonData,
    tooltipType,
    isMobile,
    effectiveShowPopups,
    setLoader,
    setShouldRefetchPolygonData,
    dashboardContext,
    map,
    draw,
    championsMap,
    siteReportPolygonPopup
  ]);
}
