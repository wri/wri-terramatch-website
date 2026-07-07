import { useMapAreaContext } from "@/context/mapArea.provider";
import { usePolygonTableHasSelection } from "@/context/polygonTableInteraction.store";

import { useChampionsMap } from "../championsMap.context";
import { OverlapPolygonPoint } from "../layers/overlapTypes";

type UseGeotaggedPhotosVisibilityParams = {
  alwaysShowPhotosOnMap?: boolean;
  hideMediaOnMap?: boolean;
  isPolygonGeometryLoading?: boolean;
  isEditFocusActive: boolean;
  overlapPolygons?: OverlapPolygonPoint[];
};

/** Champions map: visible by default; in edit mode only when the geotagged-photos switch is on; hidden for bulk/overlap. */
export function useGeotaggedPhotosVisibility({
  alwaysShowPhotosOnMap = false,
  hideMediaOnMap = false,
  isPolygonGeometryLoading = false,
  isEditFocusActive,
  overlapPolygons
}: UseGeotaggedPhotosVisibilityParams): boolean {
  const championsMap = useChampionsMap();
  const { selectedPolygonsInCheckbox, geotaggedPhotosMapVisible } = useMapAreaContext();
  const hasTableBulkSelection = usePolygonTableHasSelection();

  if (hideMediaOnMap || isPolygonGeometryLoading) {
    return false;
  }

  // Legacy admin map (MapControlsOverlayLegacy + pulsing dot): always show when media is loaded.
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

  if (isEditFocusActive) {
    return geotaggedPhotosMapVisible;
  }

  return true;
}
