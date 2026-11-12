import type { MouseEvent } from "react";

export const stopRowClick = (event: MouseEvent) => {
  event.stopPropagation();
};
