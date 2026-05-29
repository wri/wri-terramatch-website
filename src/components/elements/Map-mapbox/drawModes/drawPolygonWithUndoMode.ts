import MapboxDraw from "@mapbox/mapbox-gl-draw";
import type { Map as MapboxMap } from "mapbox-gl";

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

  return didUndo;
};

const isUndoShortcut = (event: KeyboardEvent): boolean => {
  const key = event.key.toLowerCase();
  return (event.ctrlKey || event.metaKey) && key === "z" && event.shiftKey !== true;
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
    return state;
  },
  onStop(state) {
    activeDrawModeState = null;
    activeDrawModeContext = null;
    return baseDrawPolygonMode.onStop?.call(this, state);
  },
  onKeyDown(state, event) {
    activeDrawModeState = state;
    activeDrawModeContext = this as unknown as DrawModeRuntimeContext;

    if (!isUndoShortcut(event)) {
      baseDrawPolygonMode.onKeyDown?.call(this, state, event);
      return;
    }

    event.preventDefault();
    performPolygonDrawUndo();
  }
};
