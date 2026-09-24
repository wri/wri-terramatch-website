import { useMapAreaContext } from "@/context/mapArea.provider";
import { usePolygonTableHasSelection } from "@/context/polygonTableInteraction.store";

import { useChampionsMap } from "../championsMap.context";
import { OverlapPolygonPoint } from "../layers/overlapTypes";

type UseGeotaggedPhotosVisibilityParams = {
  alwaysShowPhotosOnMap?: boolean;
  hideMediaOnMap?: boolean;
  isPolygonGeometryLoading?: boolean;
  overlapPolygons?: OverlapPolygonPoint[];
};

export function useGeotaggedPhotosVisibility({
  alwaysShowPhotosOnMap = false,
  hideMediaOnMap = false,
  isPolygonGeometryLoading = false,
  overlapPolygons
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
  const hasOverlapIndicators = (overlapPolygons?.length ?? 0) > 0;

  if (hasBulkSelection || hasOverlapIndicators) {
    return false;
  }

  return geotaggedPhotosMapVisible;
}
