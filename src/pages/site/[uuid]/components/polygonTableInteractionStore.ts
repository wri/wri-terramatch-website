export {
  getPolygonRowIsHovered,
  getPolygonRowIsSelected,
  getPolygonTableHoveredUuid,
  setPolygonTableHoveredUuid,
  syncPolygonTableSelectedRowIds,
  usePolygonRowHovered,
  usePolygonRowSelected,
  usePolygonTableHoveredUuid,
  useSyncPolygonTableSelectionStore
} from "@/context/polygonTableInteraction.store";

/** @deprecated Use useSyncPolygonTableSelectionStore */
export { useSyncPolygonTableSelectionStore as useSyncPolygonTableInteractionStore } from "@/context/polygonTableInteraction.store";
