import { cloneElement, isValidElement, ReactElement, ReactNode } from "react";

export const getIconWithProgressColor16 = (
  iconElement: ReactNode,
  progress: number,
  goal: number,
  color?: string
): ReactNode => {
  if (!isValidElement(iconElement)) {
    return iconElement;
  }
  const iconColor = progress === 0 || goal === 0 ? "neutral.400" : color ?? "primary.600";
  return cloneElement(iconElement as ReactElement, { color: iconColor, boxSize: "16px" });
};

export const getIconWithProgressColor24 = (
  iconElement: ReactNode,
  progress: number,
  goal: number,
  color?: string
): ReactNode => {
  if (!isValidElement(iconElement)) {
    return iconElement;
  }
  const iconColor = progress === 0 || goal === 0 ? "neutral.400" : color ?? "primary.600";
  return cloneElement(iconElement as ReactElement, { color: iconColor, boxSize: "24px" });
};
