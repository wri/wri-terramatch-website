import { restorationStrategyType, targetLandUseType } from "@/constants/polygons";

import { TARGET_LAND_USE_LABELS } from "./polygonFilter.constants";

export const isRestorationStrategy = (value: string): value is restorationStrategyType => {
  return (
    value === "tree-planting" ||
    value === "sapling-planting" ||
    value === "assisted-natural-regeneration" ||
    value === "direct-seeding"
  );
};

export const isTargetLandUseType = (value: string): value is targetLandUseType => {
  return value in TARGET_LAND_USE_LABELS;
};

export const formatDistributionValue = (value: string): string => {
  return value
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/** Stable sort key for multi-value polygon attributes (sorted before join). */
export const toSortableJoinedList = (values: string[]): string =>
  [...values].sort((a, b) => a.localeCompare(b)).join(", ");

export const formatPolygonSource = (source: string | null | undefined): string => {
  if (source == null || source === "") {
    return "—";
  }
  if (source === "terramatch") {
    return "TerraMatch";
  }
  return source;
};
