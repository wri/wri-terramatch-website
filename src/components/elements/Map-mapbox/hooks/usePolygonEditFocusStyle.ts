import { Map as MapboxMap } from "mapbox-gl";
import { MutableRefObject, useEffect } from "react";

import { applyPolygonNeighborDimming } from "./polygonEditFocusStyle";

type UsePolygonEditFocusStyleParams = {
  map: MutableRefObject<MapboxMap | null>;
  styleReady: boolean;
  styleVersion: number;
  sourcesAdded: boolean;
  tileLoadRequestId: number;
  /** True while an existing polygon's geometry is being edited on the map. */
  isGeometryEditing: boolean;
};

/**
 * Dims all tile-rendered polygons while geometry edit is active. Re-applies after
 * tile layer reloads and map idle so paints are not lost when filters or sources refresh.
 */
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

    // filterPolygonFromLayers and tile reloads reset paint — re-apply after tiles settle.
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
