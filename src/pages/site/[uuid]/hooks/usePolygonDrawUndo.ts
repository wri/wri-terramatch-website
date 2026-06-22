import { useCallback, useEffect, useState } from "react";

import {
  type PolygonDrawCanUndoChangedDetail,
  dispatchUndoPolygonDrawEvent,
  POLYGON_DRAW_CAN_UNDO_CHANGED_EVENT
} from "@/components/elements/Map-mapbox/interactions/draftDrawEvents";

type UsePolygonDrawUndoParams = {
  isEditPolygonOpen: boolean;
  isUserDrawingEnabled: boolean;
  isExistingPolygonOpen: boolean;
};

export const usePolygonDrawUndo = ({
  isEditPolygonOpen,
  isUserDrawingEnabled,
  isExistingPolygonOpen
}: UsePolygonDrawUndoParams) => {
  const [canUndoPolygonDraw, setCanUndoPolygonDraw] = useState(false);

  const handleUndoPolygonDraw = useCallback(() => {
    dispatchUndoPolygonDrawEvent();
  }, []);

  useEffect(() => {
    const handleCanUndoChanged = (event: Event) => {
      const { canUndo } = (event as CustomEvent<PolygonDrawCanUndoChangedDetail>).detail ?? {};
      setCanUndoPolygonDraw(canUndo === true);
    };

    window.addEventListener(POLYGON_DRAW_CAN_UNDO_CHANGED_EVENT, handleCanUndoChanged);
    return () => {
      window.removeEventListener(POLYGON_DRAW_CAN_UNDO_CHANGED_EVENT, handleCanUndoChanged);
      setCanUndoPolygonDraw(false);
    };
  }, []);

  return {
    showPolygonUndoButton: isEditPolygonOpen && canUndoPolygonDraw && (isUserDrawingEnabled || isExistingPolygonOpen),
    handleUndoPolygonDraw
  };
};
