import MapboxDraw from "@mapbox/mapbox-gl-draw";

type DrawPolygonModeState = {
  polygon: MapboxDraw.DrawPolygon;
  currentVertexPosition: number;
};

const baseDrawPolygonMode = MapboxDraw.modes.draw_polygon as MapboxDraw.DrawCustomMode<DrawPolygonModeState>;

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
  onKeyDown(state, event) {
    if (!isUndoShortcut(event)) {
      baseDrawPolygonMode.onKeyDown?.call(this, state, event);
      return;
    }

    event.preventDefault();
    undoLastPolygonPoint(state);
  }
};
