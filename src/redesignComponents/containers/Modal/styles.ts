import {
  getThemedBorderWidth,
  getThemedColor,
  getThemedRadius,
  getThemedSpacing
} from "@worldresources/wri-design-systems";

import { resolveRemSizeValue, SizeValue } from "@/lib/sizing";

import { ModalSize } from "./Modal.types";

const MAX_HEIGHT_BY_SIZE: Record<ModalSize, string> = {
  xsmall: "35rem",
  small: "45rem",
  medium: "45rem",
  large: "45rem",
  xlarge: "45rem",
  "full-width": "unset"
};

const WIDTH_BY_SIZE: Record<ModalSize, string> = {
  xsmall: "15rem",
  small: "20rem",
  medium: "30rem",
  large: "40rem",
  xlarge: "60rem",
  "full-width": "90%"
};

export const modalContainerStyles = (
  size: ModalSize = "medium",
  width?: SizeValue,
  height?: SizeValue,
  maxHeight?: SizeValue
) => {
  const computedWidth = width != null ? resolveRemSizeValue(width) : WIDTH_BY_SIZE[size];
  const computedMaxHeight = maxHeight != null ? resolveRemSizeValue(maxHeight) : MAX_HEIGHT_BY_SIZE[size];
  const cappedMaxHeight = computedMaxHeight === "unset" ? "80vh" : `min(${computedMaxHeight}, 80vh)`;
  let computedHeight = "auto";
  if (height != null) {
    computedHeight = resolveRemSizeValue(height);
  } else if (size === "full-width") {
    computedHeight = "90%";
  }

  return {
    maxWidth: "100%",
    width: computedWidth,
    height: computedHeight,
    maxHeight: cappedMaxHeight,
    backgroundColor: getThemedColor("neutral", 100),
    border: `${getThemedBorderWidth(100)} solid ${getThemedColor("neutral", 300)}`,
    borderRadius: getThemedRadius(300),
    boxShadow: "md"
  };
};

export const modalHeaderStyles = {
  height: "100%",
  minHeight: getThemedSpacing(1000),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: getThemedSpacing(200),
  borderBottom: `${getThemedBorderWidth(100)} solid ${getThemedColor("neutral", 300)}`
};

export const modalCloseButtonStyles = {
  top: getThemedSpacing(300)
};

export const modalContentStyles = {
  padding: getThemedSpacing(300)
};
