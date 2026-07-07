import { Map as MapboxMap } from "mapbox-gl";
import { MutableRefObject, useEffect } from "react";

import { applyPolygonNeighborDimming } from "./polygonEditFocusStyle";

type UsePolygonEditFocusStyleParams = {
  map: MutableRefObject<MapboxMap | null>;
  styleReady: boolean;
  styleVersion: number;
  sourcesAdded: boolean;
  tileLoadRequestId: number;
  /** True while the polygon edit drawer/panel is open (entire edit modal, not only geometry draw). */
  isEditFocusActive: boolean;
  /** Geometry uuid of the polygon being edited; kept at full opacity while neighbors dim. */
  editedPolygonUuid: string | null;
};

export function usePolygonEditFocusStyle({
  map,
  styleReady,
  styleVersion,
  sourcesAdded,
  tileLoadRequestId,
  isEditFocusActive,
  editedPolygonUuid
}: UsePolygonEditFocusStyleParams): void {
  useEffect(() => {
    if (!styleReady || !sourcesAdded || map.current == null) return;

    const m = map.current;
    const excludeUuid = isEditFocusActive ? editedPolygonUuid : null;
    applyPolygonNeighborDimming(m, isEditFocusActive, excludeUuid);

    if (!isEditFocusActive) return;

    const onIdle = () => {
      if (map.current !== m) return;
      applyPolygonNeighborDimming(m, true, editedPolygonUuid);
    };

    m.on("idle", onIdle);
    return () => {
      m.off("idle", onIdle);
    };
  }, [map, styleReady, styleVersion, sourcesAdded, tileLoadRequestId, isEditFocusActive, editedPolygonUuid]);
}
