import { Map as MapboxMap } from "mapbox-gl";
import { MutableRefObject, useEffect, useState } from "react";

import Log from "@/utils/log";

type DocumentWithFullscreen = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void>;
};

type HTMLElementWithFullscreen = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void>;
};

type UseMapFullscreenParams = {
  mapContainer: MutableRefObject<HTMLDivElement | null>;
  map: MutableRefObject<MapboxMap | null>;
};

const getIsFullscreen = (): boolean => {
  const doc = document as DocumentWithFullscreen;
  return doc.fullscreenElement != null || doc.webkitFullscreenElement != null;
};

export function useMapFullscreen({ mapContainer, map }: UseMapFullscreenParams) {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(getIsFullscreen);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(getIsFullscreen());
      if (map.current != null) {
        requestAnimationFrame(() => map.current?.resize());
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, [map]);

  const toggleFullscreen = async () => {
    if (mapContainer.current == null) return;

    const element = mapContainer.current as HTMLElementWithFullscreen;
    const doc = document as DocumentWithFullscreen;

    try {
      if (!getIsFullscreen()) {
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
          await element.webkitRequestFullscreen();
        }
      } else {
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        }
      }
    } catch (error) {
      Log.error("Fullscreen error:", error);
    }
  };

  return { isFullscreen, toggleFullscreen };
}
