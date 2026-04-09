import mapboxgl from "mapbox-gl";
import { MutableRefObject, useEffect, useRef } from "react";

import { zoomToBbox, zoomToCenter } from "../adapters/camera";
import { BBox } from "../GeoJSON";

type UseMapCameraParams = {
  map: MutableRefObject<mapboxgl.Map | null>;
  bbox?: BBox;
  center?: [number, number];
  zoom?: number;
  hasControls?: boolean;
  shouldBboxZoom?: boolean;
  polygonFromMap?: { isOpen: boolean; uuid: string } | null;
  polygonBbox?: BBox | null;
  isUserDrawingEnabled?: boolean;
  isEditingGeometry?: boolean;
};

export function useMapCamera({
  map,
  bbox,
  center,
  zoom,
  hasControls,
  shouldBboxZoom,
  polygonFromMap,
  polygonBbox,
  isUserDrawingEnabled,
  isEditingGeometry
}: UseMapCameraParams) {
  const lastPolygonFitUuidRef = useRef<string>("");

  useEffect(() => {
    if (map.current == null || !shouldBboxZoom) return;

    if (center != null && zoom !== undefined) {
      const currentCenter = map.current.getCenter();
      const currentZoom = map.current.getZoom();
      const [lng, lat] = center;
      const centerChanged = Math.abs(currentCenter.lng - lng) > 0.0001 || Math.abs(currentCenter.lat - lat) > 0.0001;
      const zoomChanged = Math.abs(currentZoom - zoom) > 0.01;
      if (centerChanged || zoomChanged) {
        zoomToCenter(center, zoom, map.current);
      }
    } else if (bbox != null) {
      zoomToBbox(bbox, map.current, hasControls ?? false);
    }
  }, [bbox, center, zoom, map, hasControls, shouldBboxZoom]);

  useEffect(() => {
    if (!polygonFromMap?.isOpen || polygonFromMap.uuid === "") {
      lastPolygonFitUuidRef.current = "";
      return;
    }
    if (isUserDrawingEnabled) {
      return;
    }
    if (polygonBbox == null || map.current == null) {
      return;
    }
    const uuid = polygonFromMap.uuid;
    if (isEditingGeometry === true && uuid === lastPolygonFitUuidRef.current) {
      return;
    }
    lastPolygonFitUuidRef.current = uuid;
    zoomToBbox(polygonBbox, map.current, true);
  }, [polygonFromMap?.isOpen, polygonFromMap?.uuid, polygonBbox, map, isUserDrawingEnabled, isEditingGeometry]);
}
