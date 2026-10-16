import { Map as MapboxMap, Marker as MapboxMarker } from "mapbox-gl";
import { FC, memo, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { getThemedColor } from "@/lib/theme";
import { TreePlantingIcon } from "@/redesignComponents/foundations/Icons";
import PointMarker from "@/redesignComponents/geospatial/PointMarker/PointMarker";

export type ProjectMarkerPoint = {
  uuid: string;
  name: string;
  lat: number;
  lng: number;
};

const MARKER_CLASS = "project-marker";
const MARKER_COLOR = getThemedColor("secondary", 600);

type ProjectMarkerPortalProps = {
  map: MapboxMap;
  point: ProjectMarkerPoint;
};

const ProjectMarkerPortal: FC<ProjectMarkerPortalProps> = ({ map, point }) => {
  const [el] = useState<HTMLDivElement>(() => {
    const div = document.createElement("div");
    div.className = MARKER_CLASS;
    return div;
  });

  useEffect(() => {
    const marker = new MapboxMarker({ element: el }).setLngLat([point.lng, point.lat]).addTo(map);
    return () => {
      marker.remove();
    };
  }, [map, el, point.lng, point.lat]);

  return createPortal(
    <PointMarker
      ariaLabel={point.name}
      variant="icon"
      icon={<TreePlantingIcon color="neutral.100" />}
      backgroundColor={MARKER_COLOR}
    />,
    el
  );
};

const MemoProjectMarkerPortal = memo(ProjectMarkerPortal);

type ProjectMarkersOverlayProps = {
  map: MapboxMap;
  points: ProjectMarkerPoint[];
};

const ProjectMarkersOverlay: FC<ProjectMarkersOverlayProps> = ({ map, points }) => (
  <>
    {points.map(point => (
      <MemoProjectMarkerPortal key={point.uuid} map={map} point={point} />
    ))}
  </>
);

export const MemoProjectMarkersOverlay = memo(ProjectMarkersOverlay);
