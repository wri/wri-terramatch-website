import { Map as MapboxMap } from "mapbox-gl";
import { MutableRefObject, useCallback, useEffect, useState } from "react";

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

  useEffect(() => {
    const frame = requestAnimationFrame(() => map.current?.resize());
    return () => cancelAnimationFrame(frame);
  }, [isFullscreen, map]);

  return { isFullscreen, toggleFullscreen };
}
