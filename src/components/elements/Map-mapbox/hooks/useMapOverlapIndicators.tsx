import { Map as MapboxMap } from "mapbox-gl";
import { MutableRefObject, useEffect } from "react";

import { addOverlapMarkers, removeOverlapMarkers } from "../layers/overlapMarkers";
import { OverlapPolygonPoint } from "../layers/overlapTypes";

type UseMapOverlapIndicatorsParams = {
  map: MutableRefObject<MapboxMap | null>;
  styleReady: boolean;
  styleVersion: number;
  overlapPolygons?: OverlapPolygonPoint[];
};

export function useMapOverlapIndicators({
  map,
  styleReady,
  styleVersion,
  overlapPolygons
}: UseMapOverlapIndicatorsParams) {
  useEffect(() => {
    const mapInstance = map.current;
    if (mapInstance == null || !styleReady) return;

    if (overlapPolygons == null || overlapPolygons.length === 0) {
      removeOverlapMarkers(mapInstance);
      return () => removeOverlapMarkers(mapInstance);
    }

    addOverlapMarkers(mapInstance, overlapPolygons);
    return () => removeOverlapMarkers(mapInstance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overlapPolygons, styleReady, styleVersion]);
}
