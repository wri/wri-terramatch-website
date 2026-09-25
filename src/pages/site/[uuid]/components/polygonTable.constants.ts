import { restorationStrategyType, targetLandUseType } from "@/constants/polygons";
import { isSitePolygonAdminReviewMode } from "@/context/mapArea.utils";

import { TARGET_LAND_USE_VALUES } from "./polygonFilter.constants";

export const isRestorationStrategy = (value: string): value is restorationStrategyType => {
  return (
    value === "tree-planting" ||
    value === "sapling-planting" ||
    value === "assisted-natural-regeneration" ||
    value === "direct-seeding"
  );
};

export const isTargetLandUseType = (value: string): value is targetLandUseType => {
  return (TARGET_LAND_USE_VALUES as string[]).includes(value);
};

export const formatDistributionValue = (value: string): string => {
  return value
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

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

export const getDisturbanceReportViewPath = (disturbanceReportUuid: string): string => {
  if (isSitePolygonAdminReviewMode()) {
    return `/admin#/disturbanceReport/${disturbanceReportUuid}/show`;
  }
  return `/reports/disturbance-report/${disturbanceReportUuid}`;
};

export const openDisturbanceReportInNewTab = (disturbanceReportUuid: string): void => {
  window.open(getDisturbanceReportViewPath(disturbanceReportUuid), "_blank", "noopener,noreferrer");
};
