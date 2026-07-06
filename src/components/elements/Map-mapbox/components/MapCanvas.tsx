import React, { ReactNode, RefObject } from "react";
import { twMerge } from "tailwind-merge";

import { useChampionsMap } from "../championsMap.context";

interface MapCanvasProps {
  mapContainer: RefObject<HTMLDivElement>;
  className?: string;
  isFullscreen?: boolean;
  children?: ReactNode;
}

const FULLSCREEN_CLASSES = "fixed inset-0 z-40 h-screen w-screen";

const MapCanvas = ({ mapContainer, className, isFullscreen = false, children }: MapCanvasProps) => {
  const championsMap = useChampionsMap();

  return (
    <div
      ref={mapContainer}
      className={twMerge(
        "relative h-[500px] wide:h-[700px]",
        championsMap ? "champions-map" : undefined,
        className,
        isFullscreen ? FULLSCREEN_CLASSES : undefined
      )}
      id="map-container"
    >
      {children}
    </div>
  );
};

export default MapCanvas;
