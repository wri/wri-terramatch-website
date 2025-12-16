import MapboxDraw from "@mapbox/mapbox-gl-draw";
import mapboxgl from "mapbox-gl";
import { useCallback, useRef, useState } from "react";
import { useShowContext } from "react-admin";

import { mapboxToken } from "@/constants/environment";
import { useMapAreaContext } from "@/context/mapArea.provider";

import { FeatureCollection } from "../GeoJSON";
import type { ControlType } from "../Map.d";
import { BASEMAP_CONFIGS, MapStyle } from "../MapControls/types";
import { addFilterOfPolygonsData, convertToGeoJSON } from "../utils";

const INITIAL_ZOOM = 2.4;

export const useMap = (onSave?: (geojson: any, record: any) => void) => {
  const { record } = useShowContext();
  const { setIsUserDrawingEnabled } = useMapAreaContext();

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const draw = useRef<MapboxDraw | null>(null);
  const styleLoadListenerRef = useRef<(() => void) | null>(null);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [styleLoaded, setStyleLoaded] = useState(false);
  const [changeStyle, setChangeStyle] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const onCancel = (parsedPolygonData: any) => {
    if (map?.current && draw?.current) {
      const currentMap = map.current as mapboxgl.Map;
      const currentDraw = draw.current as MapboxDraw;
      currentDraw.deleteAll();
      addFilterOfPolygonsData(currentMap, parsedPolygonData);
    }
  };

  const handleCreateDraw = (featureCollection: FeatureCollection, record: any) => {
    const geojson = convertToGeoJSON(featureCollection);
    onSave?.(geojson, record);
  };

  const handleTrashDelete = () => {
    if (draw?.current !== null) {
      const trashButton = document.querySelector(".mapbox-gl-draw_trash") as HTMLButtonElement | null;
      if (trashButton !== null) {
        trashButton.click();
      }
    }
  };

  const handleStyleLoad = useCallback(() => {
    setStyleLoaded(true);
  }, []);

  const initMap = (isDashboard?: boolean, initialStyle?: MapStyle) => {
    if (map.current) return;

    const requestedStyle =
      initialStyle !== undefined ? initialStyle : isDashboard ? MapStyle.Street : MapStyle.Satellite;
    const styleToUse =
      requestedStyle === MapStyle.GoogleSatellite ? BASEMAP_CONFIGS[MapStyle.GoogleSatellite].style : requestedStyle;

    map.current = new mapboxgl.Map({
      container: mapContainer.current as HTMLDivElement,
      style: styleToUse,
      zoom: zoom,
      minZoom: 2.0,
      accessToken: mapboxToken,
      center: [21.496, 5.456]
    });

    draw.current = new MapboxDraw({
      controls: {
        point: false,
        line_string: false,
        polygon: false,
        trash: true,
        combine_features: false,
        uncombine_features: false
      }
    });

    const addControlToMap = () => {
      const currentMap = map.current as mapboxgl.Map;
      const currentDraw = draw.current as ControlType;
      if (currentMap.hasControl(currentDraw)) {
        currentMap.removeControl(currentDraw);
      }
      currentMap.addControl(currentDraw, "top-right");
    };

    if (map?.current && draw?.current) {
      styleLoadListenerRef.current = handleStyleLoad;
      map.current.on("style.load", handleStyleLoad);

      if (map.current.isStyleLoaded()) {
        handleStyleLoad();
        addControlToMap();
      } else {
        addControlToMap();
      }

      map.current.on("draw.modechange", (event: any) => {
        if (event.mode === "simple_select") {
          setIsUserDrawingEnabled(false);
        }
      });
      map.current.on("draw.create", (feature: FeatureCollection) => {
        handleCreateDraw(feature, record);
        draw.current?.deleteAll();
      });
    }
  };

  const notifyStyleChanging = useCallback(() => {
    setStyleLoaded(false);
  }, []);

  return {
    mapContainer,
    map,
    setZoom,
    styleLoaded,
    draw,
    onCancel,
    initMap,
    setStyleLoaded,
    setChangeStyle,
    changeStyle,
    mapLoaded,
    setMapLoaded,
    handleTrashDelete,
    notifyStyleChanging
  };
};
