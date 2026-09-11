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
  skipNextSiteBboxZoomNonce?: number;
  polygonFromMap?: Pick<PolygonFromMapState, "isOpen" | "uuid"> | null;
  polygonBbox?: BBox | null;
  isUserDrawingEnabled?: boolean;
  isEditing?: boolean;
  // REVISIT (2026-09-09): standalone zoom-out-after-save fix, opt-in for the project flat view.
  // Normally the camera is suppressed on drawer close (stays put). When true, the map instead
  // restores the overview (fits the all-polygons bbox) on close — needed there because the
  // whole-project post-save reload keeps freezeCameraZoom true and swallows the natural zoom-out.
  // Remove/reconcile this if the surgical post-save refresh (perf work) lands and makes the natural
  // zoom-out fire again. See docs/plans/project-polygons-geometry-editing-plan.md (task 2).
  zoomToBboxOnEditClose?: boolean;
};

export function useMapCamera({
  map,
  bbox,
  center,
  zoom,
  hasControls,
  shouldBboxZoom,
  skipNextSiteBboxZoomNonce = 0,
  polygonFromMap,
  polygonBbox,
  isUserDrawingEnabled,
  isEditing: isEditingGeometry,
  zoomToBboxOnEditClose = false
}: UseMapCameraParams) {
  const lastPolygonFitKeyRef = useRef<string>("");
  const polygonUuidAtDrawStartRef = useRef<string>("");
  const wasPolygonDrawerOpenRef = useRef<boolean>(false);
  const suppressNextAutoCameraMoveRef = useRef<boolean>(false);
  const wasDrawingEnabledRef = useRef<boolean>(false);
  const suppressAutoCameraUntilPolygonSelectionRef = useRef<boolean>(false);
  const lastSkipNextSiteBboxZoomNonceRef = useRef(0);

  useEffect(() => {
    if (skipNextSiteBboxZoomNonce > lastSkipNextSiteBboxZoomNonceRef.current) {
      lastSkipNextSiteBboxZoomNonceRef.current = skipNextSiteBboxZoomNonce;
      suppressNextAutoCameraMoveRef.current = true;
    }
  }, [skipNextSiteBboxZoomNonce]);

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
      // REVISIT (2026-09-09): opt-in zoom-out-after-save for the project flat view. Default behavior
      // suppresses the camera so it stays put on close; when zoomToBboxOnEditClose is set we instead
      // restore the overview by fitting the all-polygons bbox (the flat view's whole-project reload
      // otherwise keeps the camera frozen through close and swallows the natural zoom-out). Remove if
      // the surgical post-save refresh (perf work) restores the natural zoom-out.
      if (zoomToBboxOnEditClose === true && map.current != null && bbox != null && isUserDrawingEnabled !== true) {
        suppressNextAutoCameraMoveRef.current = false;
        suppressAutoCameraUntilPolygonSelectionRef.current = false;
        const mapInstance = map.current;
        const targetBbox = bbox;
        const fitControls = hasControls ?? false;
        // The map container shrinks from fullscreen back to inline on close. Resize the map to the
        // settled viewport BEFORE fitting — otherwise fitBounds computes zoom for the fullscreen size
        // and lands under-zoomed-out (not the default landing view). Defer across frames so the
        // layout change has applied, and resize again just before the fit.
        requestAnimationFrame(() => {
          mapInstance.resize();
          requestAnimationFrame(() => {
            mapInstance.resize();
            zoomToBbox(targetBbox, mapInstance, fitControls);
          });
        });
      } else {
        suppressNextAutoCameraMoveRef.current = true;
        suppressAutoCameraUntilPolygonSelectionRef.current = true;
      }
    }
    wasPolygonDrawerOpenRef.current = isPolygonDrawerOpen;
  }, [
    polygonFromMap?.isOpen,
    polygonFromMap?.uuid,
    zoomToBboxOnEditClose,
    bbox,
    map,
    hasControls,
    isUserDrawingEnabled
  ]);

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
