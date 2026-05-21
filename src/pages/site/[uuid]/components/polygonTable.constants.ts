import { restorationStrategyType, targetLandUseType } from "@/constants/polygons";

import { TARGET_LAND_USE_LABELS } from "./polygonFilter.constants";

export const isRestorationStrategy = (value: string): value is restorationStrategyType => {
  return value === "tree-planting" || value === "assisted-natural-regeneration" || value === "direct-seeding";
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
