import React, { ReactNode, RefObject } from "react";
import { twMerge } from "tailwind-merge";

interface MapCanvasProps {
  mapContainer: RefObject<HTMLDivElement>;
  className?: string;
  children?: ReactNode;
}

const MapCanvas = ({ mapContainer, className, children }: MapCanvasProps) => {
  return (
    <div ref={mapContainer} className={twMerge("relative h-[500px] wide:h-[700px]", className)} id="map-container">
      {children}
    </div>
  );
};

export default MapCanvas;
