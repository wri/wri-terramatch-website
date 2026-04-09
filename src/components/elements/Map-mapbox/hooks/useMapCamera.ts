import mapboxgl from "mapbox-gl";
import { MutableRefObject, useEffect } from "react";

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
};

export function useMapCamera({
  map,
  bbox,
  center,
  zoom,
  hasControls,
  shouldBboxZoom,
  polygonFromMap,
  polygonBbox
}: UseMapCameraParams) {
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
    if (polygonFromMap?.isOpen && polygonFromMap?.uuid && polygonBbox != null && map.current != null) {
      zoomToBbox(polygonBbox, map.current, true);
    }
  }, [polygonFromMap, polygonBbox, map]);
}
