import { css } from "@emotion/react";

import { getThemedColor } from "../../../../lib/theme";

/**
 * Colors used by the portaled calendar popup.
 * These MUST be raw hex values because Portal renders outside
 * ChakraProvider's DOM tree, so CSS variables are unavailable.
 */
const colors = {
  neutral100: "#FFFFFF",
  neutral200: "#F6F6F6",
  neutral300: "#E7E6E6",
  neutral400: "#C9C9C9",
  neutral600: "#A1A1A1",
  neutral700: "#5C5959",
  neutral900: "#1A1919",
  primary200: "#E7F7FD",
  primary300: "#CCECFA",
  primary500: "#78CAED",
  primary600: "#50B6E2",
  primary700: "#11688D"
};

export const dateRangePickerStyles = css`
  font-family: inherit;
  max-width: 20rem;

  [data-part="label"] {
    display: block;
    font-size: 0.875rem;
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
    font-size: 0.875rem;
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
    background: ${colors.neutral100};
    border: 1px solid ${colors.neutral300};
    border-radius: 0.75rem;
    padding: 1rem;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    min-width: 17rem;
    font-family: inherit;
  }

  [data-scope="date-picker"] [data-part="view-control"] {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }

  [data-scope="date-picker"] [data-part="prev-trigger"],
  [data-scope="date-picker"] [data-part="next-trigger"] {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border: none;
    background: transparent;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 1rem;
    color: ${colors.neutral700};
    transition: background 0.15s, color 0.15s;
  }

  [data-scope="date-picker"] [data-part="prev-trigger"]:hover,
  [data-scope="date-picker"] [data-part="next-trigger"]:hover {
    background: ${colors.neutral200};
    color: ${colors.neutral900};
  }

  [data-scope="date-picker"] [data-part="view-trigger"] {
    border: none;
    background: transparent;
    font-weight: 600;
    font-size: 0.875rem;
    color: ${colors.neutral900};
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    transition: background 0.15s;
  }

  [data-scope="date-picker"] [data-part="view-trigger"]:hover {
    background: ${colors.neutral200};
  }

  [data-scope="date-picker"] [data-part="table"] {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
  }

  [data-scope="date-picker"] [data-part="table-header"] {
    font-size: 0.75rem;
    font-weight: 600;
    color: ${colors.neutral600};
    text-align: center;
    padding: 0.5rem 0.25rem;
  }

  [data-scope="date-picker"] [data-part="table-cell"] {
    padding: 0;
    text-align: center;
    position: relative;
    height: 2.25rem;
    vertical-align: middle;
  }

  [data-scope="date-picker"] [data-part="table-cell"]:has([data-in-range]) {
    background: ${colors.primary200};
  }

  [data-scope="date-picker"] [data-part="table-cell"]:has([data-range-start]) {
    background: linear-gradient(to right, transparent 50%, ${colors.primary200} 50%);
  }

  [data-scope="date-picker"] [data-part="table-cell"]:has([data-range-end]) {
    background: linear-gradient(to left, transparent 50%, ${colors.primary200} 50%);
  }

  [data-scope="date-picker"] [data-part="table-cell"]:has([data-range-start][data-range-end]) {
    background: transparent;
  }

  [data-scope="date-picker"] [data-part="table-cell-trigger"] {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.125rem;
    height: 2.125rem;
    margin: 0 auto;
    border: none;
    background: transparent;
    border-radius: 50%;
    font-size: 0.8125rem;
    color: ${colors.neutral900};
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    position: relative;
    z-index: 1;
  }

  [data-scope="date-picker"] [data-part="table-cell-trigger"]:hover {
    background: ${colors.primary200};
  }

  [data-scope="date-picker"] [data-part="table-cell-trigger"][data-today] {
    font-weight: 700;
    border: 1.5px solid ${colors.primary500};
    border-radius: 50%;
    background: ${colors.neutral100};
  }

  [data-scope="date-picker"] [data-part="table-cell-trigger"][data-today][data-in-range] {
    background: ${colors.neutral100};
    border: 1.5px solid ${colors.primary500};
    color: ${colors.neutral900};
  }

  [data-scope="date-picker"] [data-part="table-cell-trigger"][data-in-range] {
    background: transparent;
    border-radius: 50%;
    color: ${colors.neutral900};
  }

  [data-scope="date-picker"] [data-part="table-cell-trigger"][data-in-range]:hover {
    background: ${colors.primary300};
  }

  [data-scope="date-picker"] [data-part="table-cell-trigger"][data-selected] {
    background: ${colors.primary500};
    color: ${colors.neutral100};
    font-weight: 600;
    border: none;
    border-radius: 50%;
  }

  [data-scope="date-picker"] [data-part="table-cell-trigger"][data-selected]:hover {
    background: ${colors.primary600};
  }

  [data-scope="date-picker"] [data-part="table-cell-trigger"][data-outside-range] {
    color: ${colors.neutral400};
  }

  [data-scope="date-picker"] [data-part="table-cell-trigger"][data-disabled] {
    color: ${colors.neutral400};
    cursor: not-allowed;
  }

  [data-scope="date-picker"] [data-part="view"][data-view="month"] [data-part="table-cell-trigger"],
  [data-scope="date-picker"] [data-part="view"][data-view="year"] [data-part="table-cell-trigger"] {
    width: auto;
    height: auto;
    border-radius: 0.375rem;
    padding: 0.375rem 0.75rem;
    font-size: 0.8125rem;
  }

  [data-scope="date-picker"] [data-part="view"][data-view="month"] [data-part="table-cell-trigger"][data-selected],
  [data-scope="date-picker"] [data-part="view"][data-view="year"] [data-part="table-cell-trigger"][data-selected] {
    background: ${colors.primary600};
    color: ${colors.neutral100};
    font-weight: 600;
  }

  [data-scope="date-picker"]
    [data-part="view"][data-view="month"]
    [data-part="table-cell-trigger"][data-selected]:hover,
  [data-scope="date-picker"]
    [data-part="view"][data-view="year"]
    [data-part="table-cell-trigger"][data-selected]:hover {
    background: ${colors.primary700};
  }
`;
