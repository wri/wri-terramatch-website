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
  // Grey only when no data or progress is 0. Use color when there is progress.
  const iconColor = progress === 0 ? "neutral.400" : color ?? "primary.600";
  // @ts-ignore
  return cloneElement(iconElement as ReactElement, { color: iconColor, boxSize });
}
