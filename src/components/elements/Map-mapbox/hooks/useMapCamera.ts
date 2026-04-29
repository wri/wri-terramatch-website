import { Map as MapboxMap } from "mapbox-gl";
import { MutableRefObject, useEffect, useRef } from "react";

import { zoomToBbox, zoomToCenter } from "../adapters/camera";
import { BBox } from "../GeoJSON";
import { PolygonFromMapState } from "../Map.d";

type UseMapCameraParams = {
  map: MutableRefObject<MapboxMap | null>;
  bbox?: BBox;
  center?: [number, number];
  zoom?: number;
  hasControls?: boolean;
  shouldBboxZoom?: boolean;
  polygonFromMap?: Pick<PolygonFromMapState, "isOpen" | "uuid"> | null;
  polygonBbox?: BBox | null;
  isUserDrawingEnabled?: boolean;
  isEditing?: boolean;
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
  isEditing: isEditingGeometry
}: UseMapCameraParams) {
  const lastPolygonFitKeyRef = useRef<string>("");
  const polygonUuidAtDrawStartRef = useRef<string>("");
  const wasPolygonDrawerOpenRef = useRef<boolean>(false);
  const suppressNextAutoCameraMoveRef = useRef<boolean>(false);
  const wasDrawingEnabledRef = useRef<boolean>(false);
  const suppressAutoCameraUntilPolygonSelectionRef = useRef<boolean>(false);

  useEffect(() => {
    if (isUserDrawingEnabled === true) {
      polygonUuidAtDrawStartRef.current =
        polygonFromMap?.isOpen === true && polygonFromMap?.uuid != null ? polygonFromMap.uuid : "";
      wasDrawingEnabledRef.current = true;
      return;
    }
    if (wasDrawingEnabledRef.current === true) {
      suppressAutoCameraUntilPolygonSelectionRef.current = true;
    }
    wasDrawingEnabledRef.current = false;
    if (polygonFromMap?.uuid != null && polygonFromMap.uuid !== polygonUuidAtDrawStartRef.current) {
      polygonUuidAtDrawStartRef.current = "";
    }
  }, [isUserDrawingEnabled, polygonFromMap?.isOpen, polygonFromMap?.uuid]);

  useEffect(() => {
    const isPolygonDrawerOpen =
      polygonFromMap?.isOpen === true && polygonFromMap?.uuid != null && polygonFromMap.uuid !== "";
    if (isPolygonDrawerOpen) {
      suppressAutoCameraUntilPolygonSelectionRef.current = false;
    }
    if (wasPolygonDrawerOpenRef.current === true && isPolygonDrawerOpen === false) {
      suppressNextAutoCameraMoveRef.current = true;
      suppressAutoCameraUntilPolygonSelectionRef.current = true;
    }
    wasPolygonDrawerOpenRef.current = isPolygonDrawerOpen;
  }, [polygonFromMap?.isOpen, polygonFromMap?.uuid]);

  useEffect(() => {
    if (map.current == null || shouldBboxZoom !== true) return;
    if (isUserDrawingEnabled === true) return;

    const polygonIsOpen = polygonFromMap?.isOpen === true && polygonFromMap?.uuid != null && polygonFromMap.uuid !== "";
    if (polygonIsOpen) {
      return;
    }
    if (suppressAutoCameraUntilPolygonSelectionRef.current === true) {
      return;
    }
    if (suppressNextAutoCameraMoveRef.current === true) {
      suppressNextAutoCameraMoveRef.current = false;
      return;
    }

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
  }, [
    bbox,
    center,
    zoom,
    map,
    hasControls,
    shouldBboxZoom,
    isUserDrawingEnabled,
    polygonFromMap?.isOpen,
    polygonFromMap?.uuid
  ]);

  useEffect(() => {
    if (polygonFromMap?.isOpen !== true || polygonFromMap?.uuid == null || polygonFromMap.uuid === "") {
      lastPolygonFitKeyRef.current = "";
      polygonUuidAtDrawStartRef.current = "";
      return;
    }
    if (isUserDrawingEnabled === true) {
      return;
    }
    if (polygonBbox == null || map.current == null) {
      return;
    }
    const uuid = polygonFromMap.uuid;
    if (polygonUuidAtDrawStartRef.current !== "" && polygonUuidAtDrawStartRef.current === uuid) {
      return;
    }

    const currentFitKey = `${uuid}:${polygonBbox.join(",")}`;
    if (currentFitKey === lastPolygonFitKeyRef.current && isEditingGeometry === true) {
      return;
    }
    lastPolygonFitKeyRef.current = currentFitKey;
    zoomToBbox(polygonBbox, map.current, true);
  }, [polygonFromMap?.isOpen, polygonFromMap?.uuid, polygonBbox, map, isUserDrawingEnabled, isEditingGeometry]);
}
