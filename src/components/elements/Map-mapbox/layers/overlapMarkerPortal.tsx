import { Map as MapboxMap, Marker as MapboxMarker } from "mapbox-gl";
import { FC, memo, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { OverlapMarkerView } from "./overlapMarkerView";
import { OverlapPolygonPoint } from "./overlapTypes";

const MARKER_CLASS = "overlap-indicator-marker";

const stopPropagation = (event: Event): void => event.stopPropagation();

type OverlapMarkerPortalProps = {
  map: MapboxMap;
  point: OverlapPolygonPoint;
};

const OverlapMarkerPortal: FC<OverlapMarkerPortalProps> = ({ map, point }) => {
  const [el] = useState<HTMLDivElement>(() => {
    const div = document.createElement("div");
    div.className = MARKER_CLASS;
    div.addEventListener("click", stopPropagation);
    div.addEventListener("mousedown", stopPropagation);
    div.addEventListener("touchstart", stopPropagation);
    return div;
  });

  useEffect(() => {
    let marker: MapboxMarker | null = null;
    let cancelled = false;
    let rafId = 0;

    const attach = (): boolean => {
      if (cancelled) return true;
      if (marker != null) return true;
      const canvasContainer = map.getCanvasContainer?.();
      if (canvasContainer == null) return false;
      marker = new MapboxMarker({ element: el }).setLngLat([point.lng, point.lat]).addTo(map);
      return true;
    };

    const retryUntilAttached = (): void => {
      if (cancelled || attach()) return;
      rafId = window.requestAnimationFrame(retryUntilAttached);
    };

    const onMapLoad = (): void => {
      if (attach()) return;
      retryUntilAttached();
    };

    if (attach()) {
      return () => {
        cancelled = true;
        marker?.remove();
      };
    }

    map.once("load", onMapLoad);
    if (map.loaded()) {
      queueMicrotask(onMapLoad);
    }

    return () => {
      cancelled = true;
      map.off("load", onMapLoad);
      window.cancelAnimationFrame(rafId);
      marker?.remove();
    };
  }, [map, el, point.lng, point.lat]);

  return createPortal(<OverlapMarkerView />, el);
};

export const MemoOverlapMarkerPortal = memo(OverlapMarkerPortal);
