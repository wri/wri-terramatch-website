import { css } from "@emotion/react";

import { getThemedColor, getThemedFontSize, getThemedLineHeight } from "../../../../lib/theme";

export const dateRangePickerStyles = css`
  font-family: inherit;
  max-width: 20rem;

  [data-part="label"] {
    display: block;
    font-size: ${getThemedFontSize("300")};
    font-weight: 600;
    color: ${getThemedColor("neutral", 900)};
    margin-bottom: 0.375rem;
  }

  [data-part="control"] {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    border: 1px solid ${getThemedColor("neutral", 400)};
    border-radius: 0.5rem;
    padding: 0.375rem 0.75rem;
    background: ${getThemedColor("neutral", 100)};
    transition: border-color 0.15s;
  }

  [data-part="control"]:focus-within {
    border-color: ${getThemedColor("primary", 600)};
    box-shadow: 0 0 0 1px ${getThemedColor("primary", 600)};
  }

  [data-part="input"] {
    border: none;
    outline: none;
    background: transparent;
    font-size: ${getThemedFontSize("300")};
    color: ${getThemedColor("neutral", 900)};
    width: 100%;
    padding: 0.25rem 0;
  }

  [data-part="input"]::placeholder {
    color: ${getThemedColor("neutral", 600)};
  }

  [data-part="trigger"] {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 0.25rem;
    color: ${getThemedColor("neutral", 700)};
    transition: color 0.15s;
  }

  [data-part="trigger"]:hover {
    color: ${getThemedColor("primary", 600)};
  }
`;

export const calendarGlobalStyles = css`
  [data-scope="date-picker"][data-part="positioner"] {
    z-index: 50;
  }

  [data-scope="date-picker"][data-part="content"] {
    background: ${getThemedColor("neutral", 100)};
    border: 1px solid ${getThemedColor("neutral", 600)};
    border-radius: 0.75rem;
    padding: 1rem;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    min-width: 17rem;
    min-height: 320px;
    // max-width: 320px;
    max-width: 286px;
    font-family: inherit;
  }

  [data-scope="date-picker"] [data-part="view-control"] {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
  }

  [data-scope="date-picker"] [data-part="prev-trigger"],
  [data-scope="date-picker"] [data-part="next-trigger"] {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    width: fit-content;
    height: fit-content;
    border: none;
    background: transparent;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: ${getThemedFontSize("400")};
    color: ${getThemedColor("neutral", 700)};
    transition: background 0.15s, color 0.15s;
  }

  [data-scope="date-picker"] [data-part="prev-trigger"]:hover,
  [data-scope="date-picker"] [data-part="next-trigger"]:hover {
    background: transparent;
  }

  [data-scope="date-picker"] [data-part="prev-trigger"] svg,
  [data-scope="date-picker"] [data-part="next-trigger"] svg {
    width: 1rem;
    height: 1rem;
    transition: color 0.15s;
  }

  [data-scope="date-picker"] [data-part="prev-trigger"] svg {
    transform: rotate(180deg);
  }

  [data-scope="date-picker"] [data-part="prev-trigger"]:hover svg,
  [data-scope="date-picker"] [data-part="next-trigger"]:hover svg {
    color: ${getThemedColor("primary", 500)};
  }

  [data-scope="date-picker"] [data-part="view-trigger"] {
    border: none;
    background: transparent;
    font-weight: 600;
    font-size: ${getThemedFontSize("300")};
    color: ${getThemedColor("neutral", 900)};
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    transition: background 0.15s;
  }

  [data-scope="date-picker"] [data-part="view-trigger"]:hover {
    background: ${getThemedColor("neutral", 200)};
  }

  [data-scope="date-picker"] [data-part="range-text"] {
    color: ${getThemedColor("neutral", 900)};
    font-size: ${getThemedFontSize("300")};
    line-height: ${getThemedLineHeight("500")};
    font-weight: normal;
  }

  [data-scope="date-picker"] [data-part="table"] {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
  }

  [data-scope="date-picker"] [data-part="table-header"] {
    width: 2.25rem;
    height: 2.25rem;
    font-size: ${getThemedFontSize("300")};
    line-height: ${getThemedLineHeight("500")};
    font-weight: normal;
    color: ${getThemedColor("neutral", 700)};
    text-align: center;
    padding: 0;
  }

  [data-scope="date-picker"] [data-part="table-cell"] {
    padding: 0;
    text-align: center;
    position: relative;
    height: 2.25rem;
    vertical-align: middle;
  }

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

  [data-scope="date-picker"] [data-part="table-cell-trigger"] {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    margin: 0 auto;
    border: none;
    background: transparent;
    border-radius: 50%;
    font-size: ${getThemedFontSize("300")};
    color: ${getThemedColor("neutral", 900)};
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    position: relative;
    lineHeight: "500",
    fontWeight: "normal"
    z-index: 1;
  }

  [data-scope="date-picker"] [data-part="table-cell-trigger"]:hover {
    background: ${getThemedColor("primary", 200)};
  }

  [data-scope="date-picker"] [data-part="table-cell-trigger"][data-today] {
    color: ${getThemedColor("accessible", "controls-on-neutral-lights")};
    border: 2px solid ${getThemedColor("primary", 500)};
    border-radius: 50%;
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

  [data-scope="date-picker"] [data-part="table-cell-trigger"][data-outside-range] {
    color: ${getThemedColor("neutral", 400)};
  }

  [data-scope="date-picker"] [data-part="table-cell-trigger"][data-disabled] {
    color: ${getThemedColor("neutral", 400)};
    cursor: not-allowed;
  }

  .rect-cell-view [data-part="table-cell"] {
    height: 3.75rem;
  }

  .rect-cell-view [data-part="table-cell-trigger"],
  .rect-cell-view [data-part="table-cell-trigger"][data-today],
  .rect-cell-view [data-part="table-cell-trigger"][data-in-range],
  .rect-cell-view [data-part="table-cell-trigger"][data-selected] {
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

  .rect-cell-view [data-part="table-cell-trigger"][data-outside-range] {
    color: ${getThemedColor("neutral", 900)};
    opacity: 1;
  }

  .rect-cell-view [data-part="table-cell"]:has([data-in-range]),
  .rect-cell-view [data-part="table-cell"]:has([data-range-start]),
  .rect-cell-view [data-part="table-cell"]:has([data-range-end]),
  .rect-cell-view [data-part="table-cell"]:has([data-range-start][data-range-end]) {
    background: transparent;
  }
`;
