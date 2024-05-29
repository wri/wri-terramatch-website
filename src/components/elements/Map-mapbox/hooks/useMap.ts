import MapboxDraw from "@mapbox/mapbox-gl-draw";
import mapboxgl from "mapbox-gl";
import { useRef, useState } from "react";
import { useShowContext } from "react-admin";

import { useSitePolygonData } from "@/context/sitePolygon.provider";
import { fetchPostV2TerrafundPolygon, fetchPostV2TerrafundSitePolygonUuidSiteUuid } from "@/generated/apiComponents";

import { FeatureCollection } from "../GeoJSON";
import type { ControlType } from "../Map.d";
import { addFilterOfPolygonsData, addSourcesToLayers, convertToGeoJSON } from "../utils";

const MAP_STYLE = "mapbox://styles/terramatch/clv3bkxut01y301pk317z5afu";
const INITIAL_ZOOM = 2.5;
const MAPBOX_TOKEN =
  process.env.REACT_APP_MAPBOX_TOKEN ||
  "pk.eyJ1IjoidGVycmFtYXRjaCIsImEiOiJjbHN4b2drNnAwNHc0MnBtYzlycmQ1dmxlIn0.ImQurHBtutLZU5KAI5rgng";

export const useMap = () => {
  const { record } = useShowContext();
  const context = useSitePolygonData();

  const { toggleAttribute, reloadSiteData } = context || {};

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const draw = useRef<MapboxDraw | null>(null);

  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [styleLoaded, setStyleLoaded] = useState(false);
  const [polygonCreated, setPolygonCreated] = useState(false);

  async function storePolygon(geojson: any, record: any) {
    setPolygonCreated(false);
    const currentMap = map.current as mapboxgl.Map;
    if (geojson && geojson[0]) {
      const response = await fetchPostV2TerrafundPolygon({
        body: { geometry: JSON.stringify(geojson[0].geometry) }
      });
      const polygonUUID = response.uuid;
      if (polygonUUID) {
        const site_id = record.uuid;
        await fetchPostV2TerrafundSitePolygonUuidSiteUuid({
          body: {},
          pathParams: { uuid: polygonUUID, siteUuid: site_id }
        }).then(() => {
          if (reloadSiteData) {
            reloadSiteData();
          }
          addSourcesToLayers(currentMap);
          setPolygonCreated(true);
        });
        toggleAttribute?.(true);
      }
    }
  }

  const onCancel = (map: mapboxgl.Map, draw: MapboxDraw, parsedPolygonData: any) => {
    if (map && draw) {
      draw.deleteAll();
      addFilterOfPolygonsData(map, parsedPolygonData);
    }
  };

  function handleCreateDraw(featureCollection: FeatureCollection, record: any) {
    const geojson = convertToGeoJSON(featureCollection);
    storePolygon(geojson, record);
  }

  function initMap() {
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
      const currentMap = map.current as mapboxgl.Map;
      addSourcesToLayers(currentMap);
    };

    const addControlToMap = () => {
      setStyleLoaded(true);
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
      map.current.on("draw.create", (feature: FeatureCollection) => handleCreateDraw(feature, record));
    }
  }

  return {
    mapContainer,
    map,
    setZoom,
    styleLoaded,
    draw,
    onCancel,
    initMap,
    polygonCreated
  };
};
