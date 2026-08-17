import { css } from "@emotion/react";

import { getThemedColor } from "../../../../../lib/theme";
import { calendarBaseGlobalStyles } from "../styled";

export const calendarGlobalStyles = css`
  ${calendarBaseGlobalStyles}

  [data-scope="date-picker"] [data-part="table-cell"]:has([data-in-range]) {
    background: ${getThemedColor("primary", 200)};
  }

  [data-scope="date-picker"] [data-part="table-cell"]:has([data-range-start]) {
    background: linear-gradient(to right, transparent 50%, ${getThemedColor("primary", 200)} 50%);
  }

  [data-scope="date-picker"] [data-part="table-cell"]:has([data-range-end]) {
    background: linear-gradient(to left, transparent 50%, ${getThemedColor("primary", 200)} 50%);
  }

  [data-scope="date-picker"] [data-part="table-cell"]:has([data-range-start][data-range-end]) {
    background: transparent;
  }

  [data-scope="date-picker"] [data-part="table-cell"]:has([data-hover-range-start]) {
    background: linear-gradient(to right, transparent 50%, ${getThemedColor("primary", 200)} 50%);
  }

  [data-scope="date-picker"] [data-part="table-cell"]:has([data-hover-range-end]) {
    background: linear-gradient(to left, transparent 50%, ${getThemedColor("primary", 200)} 50%);
  }

  [data-scope="date-picker"] [data-part="table-cell"]:has([data-hover-range-start][data-hover-range-end]) {
    background: transparent;
  }

  [data-scope="date-picker"] [data-part="table-cell-trigger"][data-today][data-in-range] {
    color: ${getThemedColor("accessible", "controls-on-neutral-lights")};
    border: none;
  }

  [data-scope="date-picker"] [data-part="table-cell-trigger"][data-in-range] {
    background: transparent;
    border-radius: 50%;
    color: ${getThemedColor("neutral", 900)};
  }

  [data-scope="date-picker"] [data-part="table-cell-trigger"][data-in-range]:hover {
    background: ${getThemedColor("primary", 200)};
  }

  [data-scope="date-picker"] [data-part="table-cell-trigger"][data-selected] {
    background: ${getThemedColor("primary", 500)};
    color: ${getThemedColor("neutral", 100)};
    border: none;
    border-radius: 50%;
  }

  [data-scope="date-picker"] [data-part="table-cell-trigger"][data-selected]:hover {
    background: ${getThemedColor("primary", 600)};
  }

  .rect-cell-view [data-part="table-cell-trigger"][data-in-range] {
    width: auto;
    height: auto;
    border-radius: 0.375rem;
    padding: 0.375rem 0.75rem;
    font-size: 0.8125rem;
  }

  .rect-cell-view [data-part="table-cell-trigger"][data-selected] {
    background: ${getThemedColor("primary", 500)};
    color: ${getThemedColor("neutral", 100)};
  }

  .rect-cell-view [data-part="table-cell-trigger"][data-selected]:hover {
    background: ${getThemedColor("primary", 600)};
  }

  .rect-cell-view [data-part="table-cell"]:has([data-in-range]),
  .rect-cell-view [data-part="table-cell"]:has([data-range-start]),
  .rect-cell-view [data-part="table-cell"]:has([data-range-end]),
  .rect-cell-view [data-part="table-cell"]:has([data-range-start][data-range-end]) {
    background: transparent;
  }
`;
