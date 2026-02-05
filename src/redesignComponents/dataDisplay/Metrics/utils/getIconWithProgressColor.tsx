import { cloneElement, isValidElement, ReactElement, ReactNode } from "react";

import { MetricCardVariant } from "../types";

export function getIconWithProgressColor(
  iconElement: ReactNode,
  progress: number,
  goal: number,
  boxSize: string,
  color?: string,
  variant?: MetricCardVariant
): ReactNode {
  if (!isValidElement(iconElement)) {
    return iconElement;
  }
  const iconColor =
    progress === 0 || (goal === 0 && (variant === "progressBar" || variant === "donutChart"))
      ? "neutral.400"
      : color ?? "primary.600";
  return cloneElement(iconElement as ReactElement, { color: iconColor, boxSize });
}
