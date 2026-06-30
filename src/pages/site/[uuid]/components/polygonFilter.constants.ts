import { restorationStrategyType, targetLandUseType } from "@/constants/polygons";
import { type PolygonStatus } from "@/constants/polygonStatuses";

export type PolygonSubmissionStatus = PolygonStatus;
export type PolygonValidationStatus = "not_checked" | "failed" | "partial" | "passed";

export type PolygonFilterState = {
  polygonStatus: PolygonSubmissionStatus[];
  validationStatus: PolygonValidationStatus[];
  plantStartFrom: string;
  plantStartTo: string;
  practice: restorationStrategyType[];
  targetSys: targetLandUseType[];
  hasOverlap: boolean;
};

export const EMPTY_POLYGON_FILTERS: PolygonFilterState = {
  polygonStatus: [],
  validationStatus: [],
  plantStartFrom: "",
  plantStartTo: "",
  practice: [],
  targetSys: [],
  hasOverlap: false
};

export const TARGET_LAND_USE_VALUES: targetLandUseType[] = [
  "agroforest",
  "agricultural-land",
  "grassland",
  "mangrove",
  "open-natural-ecosystem",
  "natural-forest",
  "peatland",
  "riparian-area-or-wetland",
  "silvopasture",
  "urban-forest",
  "woodlot-or-plantation"
];
