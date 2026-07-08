import { Map as MapboxMap } from "mapbox-gl";
import { MutableRefObject, useCallback, useEffect, useLayoutEffect, useState } from "react";

type UseMapFullscreenParams = {
  map: MutableRefObject<MapboxMap | null>;
};

const isLayeredUiOpen = (): boolean =>
  document.querySelector('[role="dialog"], [role="alertdialog"], [role="menu"]') != null;

export function useMapFullscreen({ map }: UseMapFullscreenParams) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(current => !current);
  }, []);

  useEffect(() => {
    if (!isFullscreen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      if (isLayeredUiOpen()) return;
      setIsFullscreen(false);
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen]);

  const scheduleMapResize = useCallback(() => {
    const resizeNow = () => map.current?.resize();
    const firstFrame = requestAnimationFrame(() => {
      resizeNow();
      requestAnimationFrame(resizeNow);
    });
    const timeoutId = window.setTimeout(resizeNow, 0);

    return () => {
      cancelAnimationFrame(firstFrame);
      window.clearTimeout(timeoutId);
    };
  }, [map]);

  useLayoutEffect(() => {
    return scheduleMapResize();
  }, [isFullscreen, scheduleMapResize]);

  useEffect(() => {
    if (!isFullscreen) return;

    const handleViewportChange = () => {
      scheduleMapResize();
    };

    window.addEventListener("resize", handleViewportChange);
    document.addEventListener("fullscreenchange", handleViewportChange);
    window.visualViewport?.addEventListener("resize", handleViewportChange);

    return () => {
      window.removeEventListener("resize", handleViewportChange);
      document.removeEventListener("fullscreenchange", handleViewportChange);
      window.visualViewport?.removeEventListener("resize", handleViewportChange);
    };
  }, [isFullscreen, scheduleMapResize]);

  return { isFullscreen, toggleFullscreen };
}
