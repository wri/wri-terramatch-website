import type { MouseEvent } from "react";

const INTERACTIVE_SELECTOR = "a, button, input, select, textarea, [role=button], [role=menuitem]";

export const stopRowClick = (event: MouseEvent) => {
  event.stopPropagation();
};

/**
 * Lets clicks on a cell's empty space reach the row, but stops clicks on its controls and on
 * portaled content (modals opened from the cell), which React bubbles through the row as well.
 */
export const stopInteractiveClick = (event: MouseEvent<HTMLElement>) => {
  const target = event.target as Element;
  if (!event.currentTarget.contains(target) || target.closest(INTERACTIVE_SELECTOR) != null) {
    event.stopPropagation();
  }
};
