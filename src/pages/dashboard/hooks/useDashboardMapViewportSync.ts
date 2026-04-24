import { Map as MapboxMap } from "mapbox-gl";
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
    const currentMap = dashboardMapFunctions.map.current as MapboxMap | null;
    if (!currentMap || !dashboardMapLoaded) return;

    const syncViewport = () => {
      const center = currentMap.getCenter();
      const zoom = currentMap.getZoom();
      const [clampedLng, clampedLat] = clampLongitudeLatitude(center.lng, center.lat);
      setCurrentCenter([clampedLng, clampedLat]);
      setCurrentZoom(zoom);
    };

    // Read style once on initial attach so the parent React state is seeded, but defer
    // with rAF so that useGoogleSatellite has already applied the Google raster layer
    // before we call getCurrentMapStyle. Without the deferral, getCurrentMapStyle sees
    // the bare Street style (before the raster overlay is added) and pushes MapStyle.Street
    // into React state, overwriting the intended GoogleSatellite — which then cascades
    // through useMapStyle.setMapStyle and removes the raster.
    const syncStyleDeferred = () => {
      requestAnimationFrame(() => {
        const style = getCurrentMapStyle(currentMap);
        if (style != null) setCurrentMapStyle(style);
      });
    };

    syncViewport();
    syncStyleDeferred();

    currentMap.on("moveend", syncViewport);
    currentMap.on("zoomend", syncViewport);
    // style.load viewport sync only covers center/zoom — style must NOT be read here
    // because at style.load time the Google raster layer is not yet applied (it's applied
    // by the React useGoogleSatellite effect on the next render). Reading style here
    // would always return MapStyle.Street for the Google satellite basemap.
    const onStyleLoad = () => syncViewport();
    currentMap.on("style.load", onStyleLoad);

    return () => {
      currentMap.off("moveend", syncViewport);
      currentMap.off("zoomend", syncViewport);
      currentMap.off("style.load", onStyleLoad);
    };
  }, [dashboardMapFunctions, dashboardMapLoaded, setCurrentCenter, setCurrentZoom, setCurrentMapStyle]);

  useEffect(() => {
    const currentMap = modalMapFunctions.map.current as MapboxMap | null;
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

    const currentMap = modalMapFunctions.map.current as MapboxMap | null;
    if (!currentMap) return;

    const center = currentMap.getCenter();
    const zoom = currentMap.getZoom();
    const [clampedLng, clampedLat] = clampLongitudeLatitude(center.lng, center.lat);
    setCurrentCenter([clampedLng, clampedLat]);
    setCurrentZoom(zoom);
  }, [modalMapFunctions, setCurrentCenter, setCurrentZoom, setCurrentMapStyle]);

  return { handleCloseExpandedMapModal };
}
