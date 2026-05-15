import { Map as MapboxMap, Marker as MapboxMarker } from "mapbox-gl";
import { FC, memo, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { InformationRequiredIcon } from "@/redesignComponents/foundations/Icons";

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
    const marker = new MapboxMarker({ element: el }).setLngLat([point.lng, point.lat]).addTo(map);
    return () => {
      marker.remove();
    };
  }, [map, el, point.lng, point.lat]);

  return createPortal(
    <div
      aria-hidden
      className="pointer-events-none flex h-[1.375rem] w-[1.375rem] items-center justify-center rounded-full bg-theme-neutral-100"
    >
      <InformationRequiredIcon boxSize="1.125rem" color="error.500" />
    </div>,
    el
  );
};

export const MemoOverlapMarkerPortal = memo(OverlapMarkerPortal);
