import type { SystemStyleObject } from "@chakra-ui/react";

import type { ModalSize, SizeValue } from "./types";

const sizeWidths: Record<ModalSize, string> = {
  xsmall: "15rem",
  small: "20rem",
  medium: "30rem",
  large: "40rem",
  xlarge: "60rem",
  "full-width": "90%"
};

const sizeMaxHeights: Record<ModalSize, string> = {
  xsmall: "35rem",
  small: "45rem",
  medium: "45rem",
  large: "45rem",
  xlarge: "45rem",
  "full-width": "unset"
};

const toCssValue = (value: SizeValue) => (typeof value === "number" ? `${value}px` : value);

export const modalContainerStyles = (
  size: ModalSize = "medium",
  width?: SizeValue,
  height?: SizeValue,
  maxHeight?: SizeValue
): SystemStyleObject => {
  const resolvedWidth = width != null ? toCssValue(width) : sizeWidths[size];
  const resolvedMaxHeight = maxHeight != null ? toCssValue(maxHeight) : sizeMaxHeights[size];
  const maxHeightValue = resolvedMaxHeight === "unset" ? "80vh" : `min(${resolvedMaxHeight}, 80vh)`;

  let resolvedHeight = "auto";
  if (height != null) {
    resolvedHeight = toCssValue(height);
  } else if (size === "full-width") {
    resolvedHeight = "90%";
  }

  return {
    maxWidth: "100%",
    width: resolvedWidth,
    height: resolvedHeight,
    maxHeight: maxHeightValue,
    backgroundColor: "var(--chakra-colors-neutral-100)",
    border: "1px solid var(--chakra-colors-neutral-300)",
    borderRadius: "var(--chakra-radii-l3)",
    boxShadow: "0 0.25rem 0.375rem -0.25rem #0000001a, 0 0.625rem 0.9375rem -0.1875rem #0000001a"
  };
};

export const modalHeaderStyles: SystemStyleObject = {
  height: "100%",
  minHeight: "var(--chakra-sizes-10)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "var(--chakra-spacing-2)",
  borderBottom: "1px solid var(--chakra-colors-neutral-300)"
};

export const modalCloseButtonStyles: SystemStyleObject = {
  top: "var(--chakra-spacing-3)"
};

export const modalContentStyles: SystemStyleObject = {
  padding: "var(--chakra-spacing-3)"
};
