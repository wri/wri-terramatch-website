import mapboxgl from "mapbox-gl";
import { Dispatch, SetStateAction, useCallback, useEffect } from "react";

import { MapFunctions } from "@/components/elements/Map-mapbox/Map.d";
import { MapStyle } from "@/components/elements/Map-mapbox/MapControls/types";
import { getCurrentMapStyle } from "@/components/elements/Map-mapbox/utils";
import { clampLongitudeLatitude } from "@/pages/dashboard/utils/mapViewport";

type UseDashboardMapViewportSyncParams = {
  dashboardMapFunctions: MapFunctions;
  dashboardMapLoaded: boolean;
  modalMapFunctions: MapFunctions;
  modalMapLoaded: boolean;
  setCurrentCenter: Dispatch<SetStateAction<[number, number] | undefined>>;
  setCurrentZoom: Dispatch<SetStateAction<number | undefined>>;
  setCurrentMapStyle: Dispatch<SetStateAction<MapStyle | undefined>>;
};

/**
 * Subscribes to dashboard and modal Mapbox instances so shared viewport state stays aligned
 * when the user pans or zooms, and when the basemap style reloads (dashboard map only).
 */
export function useDashboardMapViewportSync({
  dashboardMapFunctions,
  dashboardMapLoaded,
  modalMapFunctions,
  modalMapLoaded,
  setCurrentCenter,
  setCurrentZoom,
  setCurrentMapStyle
}: UseDashboardMapViewportSyncParams): { handleCloseExpandedMapModal: () => void } {
  useEffect(() => {
    const currentMap = dashboardMapFunctions.map.current as mapboxgl.Map | null;
    if (!currentMap || !dashboardMapLoaded) return;

    const syncMapState = () => {
      const center = currentMap.getCenter();
      const zoom = currentMap.getZoom();
      const style = getCurrentMapStyle(currentMap);
      const [clampedLng, clampedLat] = clampLongitudeLatitude(center.lng, center.lat);
      setCurrentCenter([clampedLng, clampedLat]);
      setCurrentZoom(zoom);
      if (style) {
        setCurrentMapStyle(style);
      }
    };

    syncMapState();

    currentMap.on("moveend", syncMapState);
    currentMap.on("zoomend", syncMapState);
    currentMap.on("style.load", syncMapState);

    return () => {
      currentMap.off("moveend", syncMapState);
      currentMap.off("zoomend", syncMapState);
      currentMap.off("style.load", syncMapState);
    };
  }, [dashboardMapFunctions, dashboardMapLoaded, setCurrentCenter, setCurrentZoom, setCurrentMapStyle]);

  useEffect(() => {
    const currentMap = modalMapFunctions.map.current as mapboxgl.Map | null;
    if (!currentMap || !modalMapLoaded) return;

    const handleMoveEnd = () => {
      const center = currentMap.getCenter();
      const zoom = currentMap.getZoom();
      const [clampedLng, clampedLat] = clampLongitudeLatitude(center.lng, center.lat);
      setCurrentCenter([clampedLng, clampedLat]);
      setCurrentZoom(zoom);
    };

    currentMap.on("moveend", handleMoveEnd);
    currentMap.on("zoomend", handleMoveEnd);

    return () => {
      currentMap.off("moveend", handleMoveEnd);
      currentMap.off("zoomend", handleMoveEnd);
    };
  }, [modalMapFunctions, modalMapLoaded, setCurrentCenter, setCurrentZoom]);

  const handleCloseExpandedMapModal = useCallback(() => {
    const modalMap = modalMapFunctions.map.current;
    if (modalMap != null) {
      const modalStyle = getCurrentMapStyle(modalMap);
      if (modalStyle) {
        setCurrentMapStyle(modalStyle);
      }
    }

    const currentMap = modalMapFunctions.map.current as mapboxgl.Map | null;
    if (!currentMap) return;

    const center = currentMap.getCenter();
    const zoom = currentMap.getZoom();
    const [clampedLng, clampedLat] = clampLongitudeLatitude(center.lng, center.lat);
    setCurrentCenter([clampedLng, clampedLat]);
    setCurrentZoom(zoom);
  }, [modalMapFunctions, setCurrentCenter, setCurrentZoom, setCurrentMapStyle]);

  return { handleCloseExpandedMapModal };
}
