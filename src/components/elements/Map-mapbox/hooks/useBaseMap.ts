import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { Map as MapboxMap } from "mapbox-gl";
import { useCallback, useEffect, useRef, useState } from "react";

import { mapboxToken } from "@/constants/environment";
import { useMapAreaContext } from "@/context/mapArea.provider";

import { drawPolygonWithUndoMode, performPolygonDrawUndo } from "../drawModes/drawPolygonWithUndoMode";
import { FeatureCollection } from "../GeoJSON";
import { CLEAR_DRAFT_DRAW_EVENT, UNDO_POLYGON_DRAW_EVENT } from "../interactions/draftDrawEvents";
import type { ControlType } from "../Map.d";
import { BASEMAP_CONFIGS, MapStyle } from "../MapControls/types";
import { applyMapDrawStatusStyles, createMapDrawStyles } from "../mapStyle";
import { addFilterOfPolygonsData, convertToGeoJSON } from "../utils";

const INITIAL_ZOOM = 2.4;

type UseBaseMapOptions = {
  deferDrawCreateSave?: boolean;
};

export type PolygonGeometryFeature = Pick<GeoJSON.Feature<GeoJSON.Geometry>, "geometry">;

export type MapDrawSaveRecord = {
  uuid?: string;
};

export type MapDrawSaveHandler = (
  geojson: PolygonGeometryFeature[],
  record?: MapDrawSaveRecord
) => void | Promise<void>;

export const useBaseMap = (onSave?: MapDrawSaveHandler, record?: MapDrawSaveRecord, options?: UseBaseMapOptions) => {
  const { setIsUserDrawingEnabled, setDraftPolygonGeometry } = useMapAreaContext();
  const deferDrawCreateSave = options?.deferDrawCreateSave === true;

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapboxMap | null>(null);
  const draw = useRef<MapboxDraw | null>(null);

  const [, _forceRerender] = useState(false);

  const onCancel = useCallback(
    (parsedPolygonData: Record<string, string[]> | undefined) => {
      if (map.current != null && draw.current != null) {
        draw.current.deleteAll();
        applyMapDrawStatusStyles(map.current);
        addFilterOfPolygonsData(map.current, parsedPolygonData);
        setDraftPolygonGeometry(undefined);
      }
    },
    [setDraftPolygonGeometry]
  );

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

  useEffect(() => {
    if (deferDrawCreateSave !== true) return;

    const handleClearDraftDraw = () => {
      draw.current?.deleteAll();
      setDraftPolygonGeometry(undefined);
    };

    const handleUndoPolygonDraw = () => {
      if (draw.current?.getMode() !== "draw_polygon") return;
      performPolygonDrawUndo();
    };

    window.addEventListener(CLEAR_DRAFT_DRAW_EVENT, handleClearDraftDraw);
    window.addEventListener(UNDO_POLYGON_DRAW_EVENT, handleUndoPolygonDraw);
    return () => {
      window.removeEventListener(CLEAR_DRAFT_DRAW_EVENT, handleClearDraftDraw);
      window.removeEventListener(UNDO_POLYGON_DRAW_EVENT, handleUndoPolygonDraw);
    };
  }, [deferDrawCreateSave, setDraftPolygonGeometry]);

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
      ...(deferDrawCreateSave === true
        ? {
            modes: {
              ...MapboxDraw.modes,
              draw_polygon: drawPolygonWithUndoMode
            }
          }
        : {}),
      styles: createMapDrawStyles(),
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
        if (deferDrawCreateSave) {
          const geojson = convertToGeoJSON(feature);
          const geometry = geojson[0]?.geometry;
          setDraftPolygonGeometry(geometry as GeoJSON.Geometry | undefined);
          return;
        }

        handleCreateDraw(feature);
        draw.current?.deleteAll();
      });
      map.current.on("draw.delete", () => {
        if (deferDrawCreateSave) {
          setDraftPolygonGeometry(undefined);
        }
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
