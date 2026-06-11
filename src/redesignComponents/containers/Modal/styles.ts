import {
  getThemedBorderWidth,
  getThemedColor,
  getThemedRadius,
  getThemedSpacing
} from "@worldresources/wri-design-systems";

import { resolveRemSizeValue, SizeValue } from "@/lib/sizing";

import { ModalSize } from "./Modal.types";

export const modalContainerStyles = (
  size: ModalSize = "medium",
  width?: SizeValue,
  height?: SizeValue,
  maxHeight?: SizeValue
) => {
  const widthMap: Record<ModalSize, string> = {
    xsmall: "15rem",
    small: "20rem",
    medium: "30rem",
    large: "40rem",
    xlarge: "60rem",
    "full-width": "90%"
  };
  const maxHeightMap: Record<ModalSize, string> = {
    xsmall: "35rem",
    small: "45rem",
    medium: "45rem",
    large: "45rem",
    xlarge: "45rem",
    "full-width": "unset"
  };
  const computedWidth = width ? resolveRemSizeValue(width) : widthMap[size];
  const computedMaxHeight = maxHeight ? resolveRemSizeValue(maxHeight) : maxHeightMap[size];
  const cappedMaxHeight = computedMaxHeight === "unset" ? "80vh" : `min(${computedMaxHeight}, 80vh)`;
  let computedHeight = "auto";
  if (height) {
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
    boxShadow: "0 0.25rem 0.375rem -0.25rem #0000001a, 0 0.625rem 0.9375rem -0.1875rem #0000001a"
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
