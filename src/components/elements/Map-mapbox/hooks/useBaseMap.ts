import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { Map as MapboxMap } from "mapbox-gl";
import { useCallback, useRef, useState } from "react";

import { mapboxToken } from "@/constants/environment";
import { useMapAreaContext } from "@/context/mapArea.provider";

import { FeatureCollection } from "../GeoJSON";
import type { ControlType } from "../Map.d";
import { BASEMAP_CONFIGS, MapStyle } from "../MapControls/types";
import { addFilterOfPolygonsData, convertToGeoJSON } from "../utils";

const INITIAL_ZOOM = 2.4;

export const useBaseMap = (onSave?: (geojson: unknown, record: unknown) => void, record?: unknown) => {
  const { setIsUserDrawingEnabled } = useMapAreaContext();

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapboxMap | null>(null);
  const draw = useRef<MapboxDraw | null>(null);

  const [, _forceRerender] = useState(false);

  const onCancel = (parsedPolygonData: Record<string, string[]> | undefined) => {
    if (map.current != null && draw.current != null) {
      draw.current.deleteAll();
      addFilterOfPolygonsData(map.current, parsedPolygonData);
    }
  };

  const handleCreateDraw = (featureCollection: FeatureCollection) => {
    const geojson = convertToGeoJSON(featureCollection);
    onSave?.(geojson, record);
  };

  const handleTrashDelete = () => {
    if (draw.current != null) {
      const trashButton = document.querySelector(".mapbox-gl-draw_trash") as HTMLButtonElement | null;
      if (trashButton != null) {
        trashButton.click();
      }
    }
  };

  const handleFirstStyleLoad = useCallback(() => {
    _forceRerender(v => !v);
  }, []);

  const initMap = (useDashboardStyle?: boolean, initialStyle?: MapStyle) => {
    if (map.current != null) return;

    const requestedStyle =
      initialStyle !== undefined ? initialStyle : useDashboardStyle ? MapStyle.Street : MapStyle.Satellite;
    const styleToUse =
      requestedStyle === MapStyle.GoogleSatellite ? BASEMAP_CONFIGS[MapStyle.GoogleSatellite].style : requestedStyle;

    map.current = new MapboxMap({
      container: mapContainer.current as HTMLDivElement,
      style: styleToUse,
      zoom: INITIAL_ZOOM,
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
      const currentMap = map.current as MapboxMap;
      const currentDraw = draw.current as ControlType;
      if (currentMap.hasControl(currentDraw)) {
        currentMap.removeControl(currentDraw);
      }
      currentMap.addControl(currentDraw, "top-right");
    };

    if (map.current != null && draw.current != null) {
      map.current.on("style.load", handleFirstStyleLoad);

      if (map.current.isStyleLoaded()) {
        handleFirstStyleLoad();
        addControlToMap();
      } else {
        addControlToMap();
      }

      map.current.on("draw.modechange", (event: { mode: string }) => {
        if (event.mode === "simple_select") {
          setIsUserDrawingEnabled(false);
        }
      });
      map.current.on("draw.create", (feature: FeatureCollection) => {
        handleCreateDraw(feature);
        draw.current?.deleteAll();
      });
    }
  };

  const setStyleLoaded = (_value: boolean) => {};

  return {
    mapContainer,
    map,
    draw,
    onCancel,
    initMap,
    setStyleLoaded,
    handleTrashDelete
  };
};
