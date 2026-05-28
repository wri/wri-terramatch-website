export const CLEAR_DRAFT_DRAW_EVENT = "terramatch:clear-draft-draw";

export const dispatchClearDraftDrawEvent = (): void => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CLEAR_DRAFT_DRAW_EVENT));
};
