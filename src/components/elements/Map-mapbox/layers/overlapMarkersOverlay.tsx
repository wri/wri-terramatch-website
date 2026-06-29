import { Map as MapboxMap } from "mapbox-gl";
import { FC, memo } from "react";

import { MemoOverlapMarkerPortal } from "./overlapMarkerPortal";
import { OverlapPolygonPoint } from "./overlapTypes";

type OverlapMarkersOverlayProps = {
  map: MapboxMap;
  points: OverlapPolygonPoint[];
};

const OverlapMarkersOverlay: FC<OverlapMarkersOverlayProps> = ({ map, points }) => (
  <>
    {points.map(point => (
      <MemoOverlapMarkerPortal key={point.polygonUuid} map={map} point={point} />
    ))}
  </>
);

export const MemoOverlapMarkersOverlay = memo(OverlapMarkersOverlay);
