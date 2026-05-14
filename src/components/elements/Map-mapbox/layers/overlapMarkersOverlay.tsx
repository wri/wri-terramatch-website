import { Map as MapboxMap } from "mapbox-gl";
import { FC } from "react";

import { MemoOverlapMarkerPortal } from "./overlapMarkerPortal";
import { OverlapPolygonPoint } from "./overlapTypes";

type OverlapMarkersOverlayProps = {
  map: MapboxMap;
  points: OverlapPolygonPoint[];
};

export const OverlapMarkersOverlay: FC<OverlapMarkersOverlayProps> = ({ map, points }) => (
  <>
    {points.map(point => (
      <MemoOverlapMarkerPortal key={point.polygonUuid} map={map} point={point} />
    ))}
  </>
);
