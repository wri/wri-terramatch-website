import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { Map as MapboxMap } from "mapbox-gl";

import { dispatchPolygonDrawCanUndoChanged, isPolygonDrawUndoShortcut } from "../interactions/draftDrawEvents";
import { applyMapDrawingCursor } from "../interactions/mapDrawingCursor";

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

const MIN_POLYGON_POINTS = 3;

const canCompletePolygon = (state: DrawPolygonModeState): boolean => state.currentVertexPosition >= MIN_POLYGON_POINTS;

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

export const completeActivePolygonDraw = (): boolean => {
  if (activeDrawModeState == null || activeDrawModeContext == null) return false;
  if (!canCompletePolygon(activeDrawModeState)) return false;

  // @ts-expect-error - activeDrawModeContext is not a valid type for onKeyUp
  baseDrawPolygonMode.onKeyUp?.call(activeDrawModeContext, activeDrawModeState, {
    key: "Enter"
  } as KeyboardEvent);
  syncPolygonDrawCanUndo();
  return true;
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
    applyMapDrawingCursor(this.map as unknown as MapboxMap);
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
    const isVertexClick = event.featureTarget?.properties?.meta === "vertex";
    if (isVertexClick && !canCompletePolygon(state)) {
      syncPolygonDrawCanUndo();
      return;
    }
    const result = baseDrawPolygonMode.onClick?.call(this, state, event);
    syncPolygonDrawCanUndo();
    return result;
  },
  onTap(state, event) {
    activeDrawModeState = state;
    activeDrawModeContext = this as unknown as DrawModeRuntimeContext;
    const isVertexTap = event.featureTarget?.properties?.meta === "vertex";
    if (isVertexTap && !canCompletePolygon(state)) {
      syncPolygonDrawCanUndo();
      return;
    }
    const result = baseDrawPolygonMode.onTap?.call(this, state, event);
    syncPolygonDrawCanUndo();
    return result;
  },
  onKeyUp(state, event) {
    activeDrawModeState = state;
    activeDrawModeContext = this as unknown as DrawModeRuntimeContext;
    if (event.key === "Enter" && !canCompletePolygon(state)) {
      syncPolygonDrawCanUndo();
      return;
    }
    const result = baseDrawPolygonMode.onKeyUp?.call(this, state, event);
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
