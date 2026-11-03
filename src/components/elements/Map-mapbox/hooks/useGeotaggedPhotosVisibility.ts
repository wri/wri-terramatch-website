import { useMapAreaContext } from "@/context/mapArea.provider";
import { usePolygonTableHasSelection } from "@/context/polygonTableInteraction.store";

import { useChampionsMap } from "../championsMap.context";

type UseGeotaggedPhotosVisibilityParams = {
  alwaysShowPhotosOnMap?: boolean;
  hideMediaOnMap?: boolean;
  isPolygonGeometryLoading?: boolean;
};

export function useGeotaggedPhotosVisibility({
  alwaysShowPhotosOnMap = false,
  hideMediaOnMap = false,
  isPolygonGeometryLoading = false
}: UseGeotaggedPhotosVisibilityParams): boolean {
  const championsMap = useChampionsMap();
  const { selectedPolygonsInCheckbox, geotaggedPhotosMapVisible } = useMapAreaContext();
  const hasTableBulkSelection = usePolygonTableHasSelection();

  if (hideMediaOnMap || isPolygonGeometryLoading) {
    return false;
  }

  if (!championsMap && alwaysShowPhotosOnMap) {
    return true;
  }

  if (!championsMap) {
    return false;
  }

  const hasBulkSelection = selectedPolygonsInCheckbox.length > 0 || hasTableBulkSelection;
  if (hasBulkSelection) {
    return false;
  }

  return geotaggedPhotosMapVisible;
}
