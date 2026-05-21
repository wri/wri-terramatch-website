import { useCallback } from "react";

import { useMapAreaContext } from "@/context/mapArea.provider";

type UseStartSitePolygonDrawingParams = {
  onClearTableSelection: () => void;
};

export const useStartSitePolygonDrawing = ({ onClearTableSelection }: UseStartSitePolygonDrawingParams) => {
  const { setIsUserDrawingEnabled, setSelectedPolygonsInCheckbox } = useMapAreaContext();

  return useCallback(() => {
    onClearTableSelection();
    setSelectedPolygonsInCheckbox([]);
    setIsUserDrawingEnabled(true);
  }, [onClearTableSelection, setIsUserDrawingEnabled, setSelectedPolygonsInCheckbox]);
};
