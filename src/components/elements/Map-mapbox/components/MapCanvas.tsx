import React, { ReactNode, RefObject } from "react";
import { twMerge } from "tailwind-merge";

import { useChampionsMap } from "../championsMap.context";

interface MapCanvasProps {
  mapContainer: RefObject<HTMLDivElement>;
  className?: string;
  children?: ReactNode;
}

const MapCanvas = ({ mapContainer, className, children }: MapCanvasProps) => {
  const championsMap = useChampionsMap();

  return (
    <div
      ref={mapContainer}
      className={twMerge("relative h-[500px] wide:h-[700px]", championsMap ? "champions-map" : undefined, className)}
      id="map-container"
    >
      {children}
    </div>
  );
};

export default MapCanvas;
