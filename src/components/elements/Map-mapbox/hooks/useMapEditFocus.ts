import { useMemo } from "react";

import { usePolygonEditDrawer } from "@/context/polygonEditDrawer.provider";

import { useChampionsMap } from "../championsMap.context";
import type { EditPolygonState } from "../Map.d";

export type MapEditFocusState = {
  isEditFocusActive: boolean;
  isGeometryEditing: boolean;
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
