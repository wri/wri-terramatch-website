import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { getThemedColor, getThemedFontSize, getThemedLineHeight } from "../../../../lib/theme";

export const FieldContainer = styled.div<{ $size: "default" | "small"; $noMarginBottom?: boolean }>`
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: ${({ $size }) => ($size === "small" ? "0.75rem" : "1rem")};
  margin-bottom: ${({ $noMarginBottom }) => ($noMarginBottom ? "0" : "1.25rem")};
`;

export const FieldErrorBar = styled.div`
  width: 0.1875rem;
  height: 100%;
  background-color: ${getThemedColor("error", 900)};
  position: absolute;
  top: 0;
  left: 0;
`;

export const FieldLabel = styled.label<{ $size: "default" | "small"; $disabled?: boolean }>`
  color: ${({ $disabled }) => getThemedColor("neutral", $disabled ? 600 : 900)};
  font-size: ${({ $size }) => ($size === "small" ? "0.875rem" : "1rem")};
  font-weight: 400;
  line-height: ${({ $size }) => ($size === "small" ? "1.25rem" : "1.5rem")};
  margin-bottom: 0.125rem;
  display: flex;
  align-items: flex-start;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
  cursor: text;
  gap: 0.25rem;

  span {
    color: ${({ $disabled }) => getThemedColor("neutral", $disabled ? 600 : 700)};
  }

  .chakra-field__requiredIndicator {
    margin-top: 0.25rem;
    color: ${({ $disabled }) => ($disabled ? getThemedColor("neutral", 600) : getThemedColor("error", 500))} !important;
  }
`;

export const RequiredIndicator = styled.span<{ $disabled?: boolean }>`
  margin-top: 0.25rem;
  color: ${({ $disabled }) => ($disabled ? getThemedColor("neutral", 600) : getThemedColor("error", 500))} !important;
`;

export const FieldCaption = styled.p<{ $size: "default" | "small"; $disabled?: boolean }>`
  color: ${({ $disabled }) => getThemedColor("neutral", $disabled ? 600 : 700)};
  font-size: ${({ $size }) => ($size === "small" ? "0.75rem" : "0.875rem")};
  font-weight: 400;
  line-height: ${({ $size }) => ($size === "small" ? "1rem" : "1.25rem")};

  &:first-letter {
    text-transform: uppercase;
  }
`;

export const FieldErrorMessage = styled.p<{ $size: "default" | "small" }>`
  color: ${getThemedColor("error", 900)};
  font-size: ${({ $size }) => ($size === "small" ? "0.75rem" : "0.875rem")};
  font-weight: 700;
  line-height: ${({ $size }) => ($size === "small" ? "1rem" : "1.25rem")};
  margin-top: 0.125rem;
`;

export const datePickerControlStyles = (size: "default" | "small" = "default") => css`
  font-family: inherit;

  [data-part="label"] {
    position: absolute;
    width: 0.0625rem;
    height: 0.0625rem;
    padding: 0;
    margin: -0.0625rem;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  [data-part="control"] {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    height: ${size === "small" ? "1.75rem" : "2.5rem"};
    border: 0.0625rem solid ${getThemedColor("neutral", 400)};
    border-radius: ${size === "small" ? "0.25rem" : "0.5rem"};
    padding: ${size === "small" ? "0.25rem 0.5rem" : "0.75rem"};
    background: ${getThemedColor("neutral", 100)};
    box-shadow: 0 0.0625rem 0.125rem 0 #0000000d;
    transition: border-color 0.15s;
  }

  [data-part="control"]:active,
  [data-state="open"] [data-part="control"],
  [data-part="control"]:has(input:not(:placeholder-shown)) {
    border: 0.0625rem solid ${getThemedColor("neutral", 700)};
  }

  &[data-invalid] [data-part="control"] {
    border-color: ${getThemedColor("error", 500)};
  }

  [data-part="control"]:focus-visible {
    border: 0.125rem solid ${getThemedColor("neutral", 700)};
    outline: 0.125rem solid ${getThemedColor("primary", 700)};
    outline-offset: 0.125rem;
    box-shadow: 0 0 0 0.125rem ${getThemedColor("neutral", 100)}, rgba(0, 0, 0, 0.05) 0 0.125rem 0.125rem 0.25rem;
  }

  &[data-invalid] [data-part="control"]:focus-visible {
    border: 0.125rem solid ${getThemedColor("error", 900)};
    outline: 0.125rem solid ${getThemedColor("primary", 700)};
    outline-offset: 0.125rem;
    box-shadow: 0 0 0 0.125rem ${getThemedColor("neutral", 100)}, rgba(0, 0, 0, 0.05) 0 0.125rem 0.125rem 0.25rem;
  }

  [data-part="input"] {
    border: none;
    outline: none;
    background: transparent;
    font-size: ${size === "small" ? "0.875rem" : "1rem"};
    color: ${getThemedColor("neutral", 900)};
    width: 100%;
    padding: 0;
  }

  [data-part="input"]::placeholder {
    color: ${getThemedColor("neutral", 600)};
  }

  [data-part="control"] > .chakra-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: ${getThemedColor("neutral", 700)};
    transition: color 0.15s;
    margin-right: 0.25rem;
  }

  [data-part="control"]:hover > .chakra-icon {
    color: ${getThemedColor("primary", 600)};
  }

  [data-part="control"][data-disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }

  [data-part="control"][data-disabled] > .chakra-icon {
    color: ${getThemedColor("neutral", 500)};
  }

  [data-part="control"][data-disabled]:hover > .chakra-icon {
    color: ${getThemedColor("neutral", 500)};
  }
`;

export const calendarBaseGlobalStyles = css`
  [data-scope="date-picker"][data-part="positioner"] {
    z-index: 50;
  }

  [data-scope="date-picker"][data-part="content"] {
    background: ${getThemedColor("neutral", 100)};
    border: 0.0625rem solid ${getThemedColor("neutral", 600)};
    border-radius: 0.75rem;
    padding: 1rem;
    box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.12);
    min-width: 17rem;
    min-height: 23.25rem;
    max-width: 17.875rem;
    font-family: inherit;
  }

  [data-scope="date-picker"] [data-part="view-control"] {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.375rem;
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
    display: inline-block;
  }

  [data-scope="date-picker"] [data-part="range-text"]::first-letter {
    text-transform: uppercase;
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
    line-height: ${getThemedLineHeight("500")};
    font-weight: normal;
    z-index: 1;
  }

  [data-scope="date-picker"] [data-part="table-cell-trigger"]:hover {
    background: ${getThemedColor("primary", 200)};
  }

  [data-scope="date-picker"] [data-part="table-cell-trigger"][data-today] {
    color: ${getThemedColor("accessible", "controls-on-neutral-lights")};
    border: 0.125rem solid ${getThemedColor("primary", 500)};
    border-radius: 50%;
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
`;
