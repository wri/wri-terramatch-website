import { restorationStrategyType, targetLandUseType } from "@/constants/polygons";
import {
  type PolygonStatus,
  POLYGON_APPROVED,
  POLYGON_DRAFT,
  POLYGON_INFORMATION_REQUIRED,
  POLYGON_PENDING_APPROVAL
} from "@/constants/polygonStatuses";

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

export const SUBMISSION_STATUS_OPTIONS: { value: PolygonSubmissionStatus; label: string }[] = [
  { value: POLYGON_DRAFT, label: "Draft" },
  { value: POLYGON_PENDING_APPROVAL, label: "Pending Approval" },
  { value: POLYGON_INFORMATION_REQUIRED, label: "Information Required" },
  { value: POLYGON_APPROVED, label: "Approved" }
];

export const VALIDATION_STATUS_OPTIONS: { value: PolygonValidationStatus; label: string }[] = [
  { value: "not_checked", label: "Not Started" },
  { value: "failed", label: "Failed" },
  { value: "partial", label: "Partially Passed" },
  { value: "passed", label: "Passed" }
];

export const RESTORATION_PRACTICE_OPTIONS: { value: restorationStrategyType; label: string }[] = [
  { value: "tree-planting", label: "Tree Planting" },
  { value: "direct-seeding", label: "Direct Seeding" },
  { value: "assisted-natural-regeneration", label: "Assisted Natural Regeneration" }
];

export const TARGET_LAND_USE_OPTIONS: { value: targetLandUseType; label: string }[] = [
  { value: "agroforest", label: "Agroforest" },
  { value: "agricultural-land", label: "Agricultural Land" },
  { value: "grassland", label: "Grassland" },
  { value: "open-natural-ecosystem", label: "Open Natural Ecosystem" },
  { value: "natural-forest", label: "Natural Forest" },
  { value: "mangrove", label: "Mangrove" },
  { value: "peatland", label: "Peatland" },
  { value: "riparian-area-or-wetland", label: "Riparian Area / Wetland" },
  { value: "silvopasture", label: "Silvopasture" },
  { value: "urban-forest", label: "Urban Forest" },
  { value: "woodlot-or-plantation", label: "Woodlot / Plantation" }
];

export const SUBMISSION_STATUS_LABELS: Record<PolygonSubmissionStatus, string> = {
  [POLYGON_DRAFT]: "Draft",
  [POLYGON_PENDING_APPROVAL]: "Pending Approval",
  [POLYGON_INFORMATION_REQUIRED]: "Information Required",
  [POLYGON_APPROVED]: "Approved"
};

export const VALIDATION_STATUS_LABELS: Record<PolygonValidationStatus, string> = {
  not_checked: "Not Started",
  failed: "Failed",
  partial: "Partially Passed",
  passed: "Passed"
};

export const RESTORATION_PRACTICE_LABELS: Record<restorationStrategyType, string> = {
  "tree-planting": "Tree Planting",
  "assisted-natural-regeneration": "Assisted Natural Regeneration",
  "direct-seeding": "Direct Seeding"
};

export const TARGET_LAND_USE_LABELS: Record<targetLandUseType, string> = {
  agroforest: "Agroforest",
  "agricultural-land": "Agricultural Land",
  grassland: "Grassland",
  mangrove: "Mangrove",
  "open-natural-ecosystem": "Open Natural Ecosystem",
  "natural-forest": "Natural Forest",
  peatland: "Peatland",
  "riparian-area-or-wetland": "Riparian Area / Wetland",
  silvopasture: "Silvopasture",
  "urban-forest": "Urban Forest",
  "woodlot-or-plantation": "Woodlot / Plantation"
};
