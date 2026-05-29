export const CLEAR_DRAFT_DRAW_EVENT = "terramatch:clear-draft-draw";
export const UNDO_POLYGON_DRAW_EVENT = "terramatch:undo-polygon-draw";

export const dispatchClearDraftDrawEvent = (): void => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CLEAR_DRAFT_DRAW_EVENT));
};

export const dispatchUndoPolygonDrawEvent = (): void => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(UNDO_POLYGON_DRAW_EVENT));
};
