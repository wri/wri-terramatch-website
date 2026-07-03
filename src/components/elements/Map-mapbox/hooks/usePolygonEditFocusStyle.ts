import { Map as MapboxMap } from "mapbox-gl";
import { MutableRefObject, useEffect } from "react";

import { applyPolygonNeighborDimming } from "./polygonEditFocusStyle";

type UsePolygonEditFocusStyleParams = {
  map: MutableRefObject<MapboxMap | null>;
  styleReady: boolean;
  styleVersion: number;
  sourcesAdded: boolean;
  tileLoadRequestId: number;
  isGeometryEditing: boolean;
};

export function usePolygonEditFocusStyle({
  map,
  styleReady,
  styleVersion,
  sourcesAdded,
  tileLoadRequestId,
  isGeometryEditing
}: UsePolygonEditFocusStyleParams): void {
  useEffect(() => {
    if (!styleReady || !sourcesAdded || map.current == null) return;

    const m = map.current;
    applyPolygonNeighborDimming(m, isGeometryEditing);

    if (!isGeometryEditing) return;

    const onIdle = () => {
      if (map.current !== m) return;
      applyPolygonNeighborDimming(m, true);
    };

    m.on("idle", onIdle);
    return () => {
      m.off("idle", onIdle);
    };
  }, [map, styleReady, styleVersion, sourcesAdded, tileLoadRequestId, isGeometryEditing]);
}
