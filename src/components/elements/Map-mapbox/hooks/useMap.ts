import MapboxDraw from "@mapbox/mapbox-gl-draw";
import mapboxgl from "mapbox-gl";
import { useRef, useState } from "react";
import { useShowContext } from "react-admin";

import { useMapAreaContext } from "@/context/mapArea.provider";

import { FeatureCollection } from "../GeoJSON";
import type { ControlType } from "../Map.d";
import { MapStyle } from "../MapControls/types";
import { addFilterOfPolygonsData, convertToGeoJSON } from "../utils";

const INITIAL_ZOOM = 2.5;
const MAPBOX_TOKEN =
  process.env.NEXT_APP_MAPBOX_TOKEN ||
  "pk.eyJ1IjoidGVycmFtYXRjaCIsImEiOiJjbHN4b2drNnAwNHc0MnBtYzlycmQ1dmxlIn0.ImQurHBtutLZU5KAI5rgng";

export const useMap = (onSave?: (geojson: any, record: any) => void) => {
  const { record } = useShowContext();
  const { setIsUserDrawingEnabled } = useMapAreaContext();

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const draw = useRef<MapboxDraw | null>(null);
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
  const initMap = (isDashboard?: string) => {
    if (map.current) return;
    const mapStyle = isDashboard ? MapStyle.Street : MapStyle.Satellite;

    map.current = new mapboxgl.Map({
      container: mapContainer.current as HTMLDivElement,
      style: mapStyle,
      zoom: zoom,
      accessToken: MAPBOX_TOKEN
    });

    draw.current = new MapboxDraw({
      controls: {
        point: false,
        line_string: false,
        polygon: false,
        trash: false,
        combine_features: false,
        uncombine_features: false
      }
    });

    const onLoad = () => {
      setStyleLoaded(true);
    };

    const addControlToMap = () => {
      const currentMap = map.current as mapboxgl.Map;
      const currentDraw = draw.current as ControlType;
      if (currentMap.hasControl(currentDraw)) {
        currentMap.removeControl(currentDraw);
      }
      currentMap.addControl(currentDraw, "top-right");
    };
    if (map?.current && draw?.current) {
      if (map.current.isStyleLoaded()) {
        onLoad();
        addControlToMap();
      } else {
        map.current.on("style.load", () => {
          onLoad();
        });
        map.current.once("styledata", () => {
          onLoad();
        });
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
    setMapLoaded
  };
};
