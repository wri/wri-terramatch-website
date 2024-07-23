import MapboxDraw from "@mapbox/mapbox-gl-draw";
import mapboxgl from "mapbox-gl";
import { useRef, useState } from "react";
import { useShowContext } from "react-admin";

import { useMapAreaContext } from "@/context/mapArea.provider";

import { FeatureCollection } from "../GeoJSON";
import type { ControlType } from "../Map.d";
import { addFilterOfPolygonsData, convertToGeoJSON, loadLayersInMap } from "../utils";

const MAP_STYLE = "mapbox://styles/terramatch/clv3bkxut01y301pk317z5afu";
const INITIAL_ZOOM = 2.5;
const MAPBOX_TOKEN =
  process.env.REACT_APP_MAPBOX_TOKEN ||
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
      console.log("on CANCEL", parsedPolygonData);
      addFilterOfPolygonsData(currentMap, parsedPolygonData);
    }
  };

  const handleCreateDraw = (featureCollection: FeatureCollection, record: any) => {
    const geojson = convertToGeoJSON(featureCollection);
    onSave?.(geojson, record);
  };

  const refreshMapPolygon = (parsedPolygonData: any) => {
    const currentMap = map.current as mapboxgl.Map;
    console.log("resfresg parsedPolygonData", parsedPolygonData);
    loadLayersInMap(currentMap, parsedPolygonData);
  };

  const initMap = () => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current as HTMLDivElement,
      style: MAP_STYLE,
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
      map.current.on("style.load", onLoad);
      addControlToMap();
      map.current.on("draw.modechange", (event: any) => {
        if (event.mode === "simple_select") {
          setIsUserDrawingEnabled(false);
        }
      });
      map.current.on("draw.create", (feature: FeatureCollection) => {
        handleCreateDraw(feature, record);
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
    refreshMapPolygon,
    setStyleLoaded,
    setChangeStyle,
    changeStyle,
    mapLoaded,
    setMapLoaded
  };
};
