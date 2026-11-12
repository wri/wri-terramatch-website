import type { MouseEvent } from "react";

/** Keeps clicks on interactive elements (checkbox cell, name link, actions cell) from also toggling the row selection. */
export const stopRowClick = (event: MouseEvent) => {
  event.stopPropagation();
};
