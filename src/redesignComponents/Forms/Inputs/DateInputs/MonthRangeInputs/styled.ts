import { css } from "@emotion/react";

import { getThemedColor, getThemedFontSize, getThemedLineHeight } from "../../../../../lib/theme";
import { calendarBaseGlobalStyles } from "../styled";

export const monthRangeCalendarGlobalStyles = css`
  ${calendarBaseGlobalStyles}

  [data-scope="date-picker"][data-part="content"].month-range-content {
    min-height: auto;
    width: 17.25rem;
    max-width: 17.25rem;
    padding: 0.75rem;
  }

  .month-range-view {
    width: 100%;
  }

  .month-range-view [data-part="view-control"] {
    width: 100%;
  }

  .month-range-view [data-part="table"] {
    display: block;
    width: 100% !important;
    border-collapse: separate;
    border-spacing: 0;
  }

  .month-range-view [data-part="table-body"] {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    width: 100%;
  }

  .month-range-view [data-part="table-row"] {
    display: flex;
    justify-content: center;
    gap: 0.25rem;
    width: 100%;
  }

  .month-range-view [data-part="table-cell"] {
    display: block;
    height: 3.4375rem;
    padding: 0;
    width: 3.75rem;
  }

  .month-range-view [data-part="table-cell-trigger"],
  .month-range-view [data-part="table-cell-trigger"][data-today],
  .month-range-view [data-part="table-cell-trigger"][data-selected],
  .month-range-view [data-part="table-cell-trigger"][data-in-range],
  .month-range-view [data-part="table-cell-trigger"][data-range-start],
  .month-range-view [data-part="table-cell-trigger"][data-range-end] {
    width: 3.75rem;
    height: 3.4375rem;
    min-height: 3.4375rem;
    border-radius: 0.25rem;
    padding: 0;
    margin: 0;
    font-size: ${getThemedFontSize("300")};
    line-height: ${getThemedLineHeight("500")};
    font-weight: normal;
    border: 0.125rem solid transparent;
    box-sizing: border-box;
  }

  .month-range-view [data-part="table-cell-trigger"] {
    background: ${getThemedColor("neutral", 200)};
    color: ${getThemedColor("neutral", 900)};
  }

  .month-range-view [data-part="table-cell-trigger"]:hover {
    background: ${getThemedColor("primary", 200)};
    color: ${getThemedColor("accessible", "controls-on-neutral-lights")};
    border: 0.125rem solid ${getThemedColor("primary", 500)};
  }

  .month-range-view [data-part="table-cell-trigger"]:focus-visible {
    background: ${getThemedColor("neutral", 100)};
    color: ${getThemedColor("accessible", "controls-on-neutral-lights")};
    border: 0.125rem solid ${getThemedColor("primary", 500)};
    outline: none;
  }

  .month-range-view [data-part="table-cell-trigger"][data-in-range] {
    background: ${getThemedColor("primary", 200)};
    color: ${getThemedColor("accessible", "controls-on-neutral-lights")};
    border: 0.125rem solid transparent;
  }

  .month-range-view [data-part="table-cell-trigger"][data-in-range]:hover {
    background: ${getThemedColor("primary", 200)};
    color: ${getThemedColor("accessible", "controls-on-neutral-lights")};
    border: 0.125rem solid ${getThemedColor("primary", 500)};
  }

  .month-range-view [data-part="table-cell-trigger"][data-selected],
  .month-range-view [data-part="table-cell-trigger"][data-range-start],
  .month-range-view [data-part="table-cell-trigger"][data-range-end] {
    background: ${getThemedColor("primary", 500)};
    color: ${getThemedColor("accessible", "text-on-primary-mids")};
    border-color: transparent;
  }

  .month-range-view [data-part="table-cell-trigger"][data-selected]:hover,
  .month-range-view [data-part="table-cell-trigger"][data-range-start]:hover,
  .month-range-view [data-part="table-cell-trigger"][data-range-end]:hover {
    background: ${getThemedColor("primary", 600)};
    color: ${getThemedColor("accessible", "text-on-primary-mids")};
    border-color: transparent;
  }

  .month-range-view [data-part="table-cell-trigger"][data-today] {
    border-color: transparent;
  }

  .month-range-view [data-part="table-cell"]:has([data-in-range]),
  .month-range-view [data-part="table-cell"]:has([data-range-start]),
  .month-range-view [data-part="table-cell"]:has([data-range-end]),
  .month-range-view [data-part="table-cell"]:has([data-range-start][data-range-end]) {
    background: transparent;
  }
`;
