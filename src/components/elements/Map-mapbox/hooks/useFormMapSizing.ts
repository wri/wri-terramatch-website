import mapboxgl from "mapbox-gl";
import { MutableRefObject, useEffect } from "react";

type UseFormMapSizingParams = {
  map: MutableRefObject<mapboxgl.Map | null>;
  mapContainer: MutableRefObject<HTMLDivElement | null>;
  disableRequestAnimationFrameResize?: boolean;
};

export const useFormMapSizing = ({
  map,
  mapContainer,
  disableRequestAnimationFrameResize = false
}: UseFormMapSizingParams) => {
  useEffect(() => {
    const mapInstance = map.current;
    const container = mapContainer.current;
    if (mapInstance == null || container == null) return;

    let isResizeQueued = false;
    let rafId: number | null = null;
    const resizeMap = () => {
      if (isResizeQueued) return;
      isResizeQueued = true;
      if (disableRequestAnimationFrameResize) {
        queueMicrotask(() => {
          isResizeQueued = false;
          mapInstance.resize();
        });
      } else {
        if (rafId != null) {
          cancelAnimationFrame(rafId);
        }
        rafId = requestAnimationFrame(() => {
          isResizeQueued = false;
          mapInstance.resize();
        });
      }
    };

    resizeMap();
    const observer = new ResizeObserver(() => {
      resizeMap();
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
      if (rafId != null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [disableRequestAnimationFrameResize, map, mapContainer]);
};
