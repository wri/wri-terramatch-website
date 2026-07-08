import React, { ReactNode, RefObject } from "react";
import { twMerge } from "tailwind-merge";

import { useChampionsMap } from "../championsMap.context";

interface MapCanvasProps {
  mapContainer: RefObject<HTMLDivElement>;
  className?: string;
  isFullscreen?: boolean;
  children?: ReactNode;
}

const FULLSCREEN_CLASSES = "fixed inset-0 z-40 !h-screen !w-screen wide:!h-screen wide:!w-screen";

const MapCanvas = ({ mapContainer, className, isFullscreen = false, children }: MapCanvasProps) => {
  const championsMap = useChampionsMap();
  const baseClasses = championsMap ? "relative h-full min-h-0 w-full" : "relative h-[500px] wide:h-[700px]";

  return (
    <div
      ref={mapContainer}
      className={twMerge(
        baseClasses,
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
