import MapboxDraw from "@mapbox/mapbox-gl-draw";
import type { Map as MapboxMap } from "mapbox-gl";

import { dispatchPolygonDrawCanUndoChanged, isPolygonDrawUndoShortcut } from "../interactions/draftDrawEvents";

type DrawPolygonModeState = {
  polygon: MapboxDraw.DrawPolygon;
  currentVertexPosition: number;
};

type DrawModeRuntimeContext = MapboxDraw.DrawCustomModeThis & {
  _ctx: {
    store: {
      render: () => void;
    };
    map: MapboxMap;
  };
};

const baseDrawPolygonMode = MapboxDraw.modes.draw_polygon as MapboxDraw.DrawCustomMode<DrawPolygonModeState>;

let activeDrawModeState: DrawPolygonModeState | null = null;
let activeDrawModeContext: DrawModeRuntimeContext | null = null;

export const canPerformPolygonDrawUndo = (): boolean => (activeDrawModeState?.currentVertexPosition ?? 0) > 0;

const syncPolygonDrawCanUndo = (): void => {
  dispatchPolygonDrawCanUndoChanged(canPerformPolygonDrawUndo());
};

const refreshActiveDrawDisplay = (featureId: string): void => {
  if (activeDrawModeContext == null) return;

  activeDrawModeContext.doRender(featureId);
  activeDrawModeContext._ctx.store.render();
  activeDrawModeContext._ctx.map.triggerRepaint();
};

export const performPolygonDrawUndo = (): boolean => {
  if (activeDrawModeState == null || activeDrawModeContext == null) return false;

  const didUndo = undoLastPolygonPoint(activeDrawModeState);
  if (didUndo) {
    const featureId = String(activeDrawModeState.polygon.id);
    refreshActiveDrawDisplay(featureId);
    requestAnimationFrame(() => {
      refreshActiveDrawDisplay(featureId);
    });
  }

  syncPolygonDrawCanUndo();
  return didUndo;
};

export const undoLastPolygonPoint = (state: DrawPolygonModeState): boolean => {
  if (state.currentVertexPosition <= 0) return false;
  const ring = state.polygon.coordinates[0] ?? [];
  const committedPoints = ring.slice(0, state.currentVertexPosition);
  const updatedCommittedPoints = committedPoints.slice(0, -1);

  if (updatedCommittedPoints.length === 0) {
    state.polygon.setCoordinates([[]]);
    state.currentVertexPosition = 0;
    return true;
  }

  const lastCommittedPoint = updatedCommittedPoints[updatedCommittedPoints.length - 1];
  const previewPoint: GeoJSON.Position = [lastCommittedPoint[0], lastCommittedPoint[1]];
  const rebuiltRing = [...updatedCommittedPoints, previewPoint];

  state.polygon.setCoordinates([rebuiltRing]);
  state.currentVertexPosition = updatedCommittedPoints.length;

  return true;
};

export const drawPolygonWithUndoMode: MapboxDraw.DrawCustomMode<DrawPolygonModeState> = {
  ...baseDrawPolygonMode,
  onSetup(options) {
    const state = baseDrawPolygonMode.onSetup!.call(this, options);
    activeDrawModeState = state;
    activeDrawModeContext = this as unknown as DrawModeRuntimeContext;
    syncPolygonDrawCanUndo();
    return state;
  },
  onStop(state) {
    const result = baseDrawPolygonMode.onStop?.call(this, state);
    activeDrawModeState = null;
    activeDrawModeContext = null;
    dispatchPolygonDrawCanUndoChanged(false);
    return result;
  },
  onClick(state, event) {
    activeDrawModeState = state;
    activeDrawModeContext = this as unknown as DrawModeRuntimeContext;
    const result = baseDrawPolygonMode.onClick?.call(this, state, event);
    syncPolygonDrawCanUndo();
    return result;
  },
  onTap(state, event) {
    activeDrawModeState = state;
    activeDrawModeContext = this as unknown as DrawModeRuntimeContext;
    const result = baseDrawPolygonMode.onTap?.call(this, state, event);
    syncPolygonDrawCanUndo();
    return result;
  },
  onKeyDown(state, event) {
    activeDrawModeState = state;
    activeDrawModeContext = this as unknown as DrawModeRuntimeContext;

    if (!isPolygonDrawUndoShortcut(event)) {
      baseDrawPolygonMode.onKeyDown?.call(this, state, event);
      return;
    }

    event.preventDefault();
    performPolygonDrawUndo();
  }
};
