import { cloneElement, isValidElement, ReactElement, ReactNode } from "react";

import { getThemedColor } from "@/lib/theme";

export const getIconWithProgressColor16 = (iconElement: ReactNode, progress: number, color?: string): ReactNode => {
  if (!isValidElement(iconElement)) {
    return iconElement;
  }
  const iconColor = progress === 0 ? getThemedColor("neutral", 400) : color ?? "primary.600";
  return cloneElement(iconElement as ReactElement, { color: iconColor, boxSize: "16px" });
};

export const getIconWithProgressColor24 = (iconElement: ReactNode, progress: number, color?: string): ReactNode => {
  if (!isValidElement(iconElement)) {
    return iconElement;
  }
  const iconColor = progress === 0 ? getThemedColor("neutral", 400) : color ?? "primary.600";
  return cloneElement(iconElement as ReactElement, { color: iconColor, boxSize: "24px" });
};
