import { Map as MapboxMap, MapSourceDataEvent } from "mapbox-gl";
import { MutableRefObject, useEffect, useRef } from "react";

import { isLargeExtentBbox } from "@/components/elements/Map-mapbox/adapters/bbox";
import { LAYERS_NAMES } from "@/constants/layers";

import { BBox } from "../GeoJSON";
import { getPolygonGeometryFillLayerIds } from "../layers/polygonLayers";

const MIN_ZOOM_FOR_RENDERED_POLYGON_CHECK = 8;

type UsePolygonTilesLoadingParams = {
  map: MutableRefObject<MapboxMap | null>;
  enabled: boolean;
  sourcesAdded: boolean;
  tileLoadRequestId: number;
  polygonsData?: Record<string, string[]>;
  bbox?: BBox;
  shouldBboxZoom?: boolean;
  /** While the edit drawer is open the active polygon is shown via Mapbox Draw, not tile layers. */
  isEditFocusActive?: boolean;
  onLoadingChange?: (value: boolean) => void;
};

const hasPolygonUuids = (polygonsData?: Record<string, string[]>): boolean =>
  Object.values(polygonsData ?? {}).some(uuids => uuids.length > 0);

export function usePolygonTilesLoading({
  map,
  enabled,
  sourcesAdded,
  tileLoadRequestId,
  polygonsData,
  bbox,
  shouldBboxZoom,
  isEditFocusActive = false,
  onLoadingChange
}: UsePolygonTilesLoadingParams): void {
  const sessionRef = useRef(0);

  useEffect(() => {
    if (!enabled || onLoadingChange == null || map.current == null || !sourcesAdded || tileLoadRequestId <= 0) {
      onLoadingChange?.(false);
      return;
    }

    const currentMap = map.current;
    const sourceId = LAYERS_NAMES.POLYGON_GEOMETRY;
    const sessionId = sessionRef.current + 1;
    sessionRef.current = sessionId;

    const hasPolygons = hasPolygonUuids(polygonsData);
    if (!hasPolygons) {
      onLoadingChange(false);
      return;
    }

    const expectsCameraMove = shouldBboxZoom === true && bbox != null;

    let cancelled = false;
    let cameraSettled = !expectsCameraMove;
    let pendingPolygonTiles = 0;

    const safeSetLoading = (value: boolean) => {
      if (cancelled || onLoadingChange == null || sessionId !== sessionRef.current) {
        return;
      }
      onLoadingChange(value);
    };

    const cleanup = () => {
      currentMap.off("sourcedataloading", onSourceDataLoading);
      currentMap.off("sourcedata", onSourceData);
      currentMap.off("idle", onIdle);
      currentMap.off("moveend", onMoveEnd);
    };

    const settleCameraIfStopped = () => {
      if (cameraSettled || currentMap.isMoving()) {
        return;
      }
      cameraSettled = true;
    };

    const shouldRequireRenderedPolygonFeatures = (): boolean => {
      if (isEditFocusActive || isLargeExtentBbox(bbox)) {
        return false;
      }
      return currentMap.getZoom() >= MIN_ZOOM_FOR_RENDERED_POLYGON_CHECK;
    };

    const hasRenderedPolygonFeatures = () => {
      const layerIds = getPolygonGeometryFillLayerIds().filter(layerId => currentMap.getLayer(layerId) != null);
      if (layerIds.length === 0) {
        return false;
      }

      return currentMap.queryRenderedFeatures({ layers: layerIds }).length > 0;
    };

    const isReady = (opts?: { fromIdle?: boolean }) => {
      if (!cameraSettled) {
        return false;
      }
      if (currentMap.getSource(sourceId) == null) {
        return false;
      }
      // Idle means Mapbox finished requested tiles; canceled XHRs often never emit sourcedata,
      // so the pending counter is not trustworthy once idle has fired.
      if (opts?.fromIdle !== true && pendingPolygonTiles > 0) {
        return false;
      }
      if (!currentMap.isSourceLoaded(sourceId)) {
        return false;
      }
      // After idle + source loaded, empty viewport/filters must not keep the spinner forever.
      if (opts?.fromIdle !== true && shouldRequireRenderedPolygonFeatures() && !hasRenderedPolygonFeatures()) {
        return false;
      }
      return true;
    };

    const tryComplete = (opts?: { fromIdle?: boolean }) => {
      settleCameraIfStopped();
      if (!isReady(opts)) {
        return;
      }
      safeSetLoading(false);
      cleanup();
    };

    const failLoading = () => {
      safeSetLoading(false);
      cleanup();
    };

    const onSourceDataLoading = (event: MapSourceDataEvent) => {
      if (event.dataType !== "source" || event.sourceId !== sourceId || event.tile == null) {
        return;
      }
      pendingPolygonTiles += 1;
      safeSetLoading(true);
    };

    const onSourceData = (event: MapSourceDataEvent) => {
      if (event.dataType !== "source" || event.sourceId !== sourceId) {
        return;
      }

      if (event.sourceDataType === "error") {
        failLoading();
        return;
      }

      if (event.tile != null) {
        pendingPolygonTiles = Math.max(0, pendingPolygonTiles - 1);
      }

      if (event.isSourceLoaded === true) {
        pendingPolygonTiles = 0;
      }

      tryComplete();
    };

    const onIdle = () => {
      pendingPolygonTiles = 0;
      tryComplete({ fromIdle: true });
    };

    const onMoveEnd = () => {
      cameraSettled = true;
      tryComplete();
    };

    safeSetLoading(true);
    currentMap.on("sourcedataloading", onSourceDataLoading);
    currentMap.on("sourcedata", onSourceData);
    currentMap.on("idle", onIdle);

    if (expectsCameraMove) {
      currentMap.on("moveend", onMoveEnd);
    }

    return () => {
      cancelled = true;
      cleanup();
      onLoadingChange?.(false);
    };
  }, [
    map,
    enabled,
    sourcesAdded,
    tileLoadRequestId,
    polygonsData,
    bbox,
    shouldBboxZoom,
    isEditFocusActive,
    onLoadingChange
  ]);
}
