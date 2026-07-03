import { useMemo } from "react";

import { usePolygonEditDrawer } from "@/context/polygonEditDrawer.provider";

import { useChampionsMap } from "../championsMap.context";
import type { EditPolygonState } from "../Map.d";

export type MapEditFocusState = {
  /** True when a polygon edit panel (champions drawer or legacy admin panel) is open. */
  isEditFocusActive: boolean;
  /** True while an existing polygon's geometry is actively being edited on the map. */
  isGeometryEditing: boolean;
  /** Polygon geometry uuid being edited; null when drawing a brand-new polygon. */
  editedPolygonUuid: string | null;
};

export const INACTIVE_MAP_EDIT_FOCUS: MapEditFocusState = {
  isEditFocusActive: false,
  isGeometryEditing: false,
  editedPolygonUuid: null
};

type UseMapEditFocusParams = {
  polygonFromMap?: { isOpen?: boolean; uuid?: string } | null;
  editPolygon?: EditPolygonState | null;
};

const normalizeUuid = (uuid: string | null | undefined): string | null => (uuid == null || uuid === "" ? null : uuid);

/**
 * Single source of truth for the map "edit focus" state. Popups, polygon hover
 * and neighbor dimming all derive from this so they stay consistent regardless
 * of whether edit mode was entered from the bulk action bar or the edit panel.
 */
export function useMapEditFocus({ polygonFromMap, editPolygon }: UseMapEditFocusParams): MapEditFocusState {
  const championsMap = useChampionsMap();
  const { isOpen: isDrawerOpen, polygon: drawerPolygon } = usePolygonEditDrawer();

  const isLegacyEditPanelOpen = !championsMap && polygonFromMap?.isOpen === true;
  const drawerPolygonUuid = drawerPolygon?.polygonUuid;
  const editPolygonUuid = editPolygon?.isOpen === true ? editPolygon?.uuid : undefined;
  const mapPolygonUuid = polygonFromMap?.isOpen === true ? polygonFromMap?.uuid : undefined;
  const legacyPanelUuid = isLegacyEditPanelOpen ? polygonFromMap?.uuid : undefined;

  const geometryEditUuid = normalizeUuid(editPolygonUuid) ?? normalizeUuid(mapPolygonUuid);
  const isGeometryEditing = geometryEditUuid != null;

  return useMemo(() => {
    const isEditFocusActive = isDrawerOpen || isLegacyEditPanelOpen || isGeometryEditing;
    if (!isEditFocusActive) {
      return INACTIVE_MAP_EDIT_FOCUS;
    }
    const editedPolygonUuid = geometryEditUuid ?? normalizeUuid(drawerPolygonUuid) ?? normalizeUuid(legacyPanelUuid);
    return { isEditFocusActive: true, isGeometryEditing, editedPolygonUuid };
  }, [isDrawerOpen, isLegacyEditPanelOpen, isGeometryEditing, geometryEditUuid, drawerPolygonUuid, legacyPanelUuid]);
}
