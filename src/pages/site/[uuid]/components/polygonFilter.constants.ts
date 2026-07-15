import { restorationStrategyType, targetLandUseType } from "@/constants/polygons";
import { type PolygonStatus } from "@/constants/polygonStatuses";

export type SubmissionCycleOption = "1" | "2" | "3" | "4" | "5";

export const SUBMISSION_CYCLE_OPTIONS: SubmissionCycleOption[] = ["1", "2", "3", "4", "5"];

export const SUBMISSION_CYCLE_LABELS: Record<SubmissionCycleOption, string> = {
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5"
};

export const isSubmissionCycleOption = (value: string): value is SubmissionCycleOption =>
  SUBMISSION_CYCLE_OPTIONS.includes(value as SubmissionCycleOption);

export const normalizeSubmissionCycle = (values: string[] | null | undefined): SubmissionCycleOption[] =>
  [...new Set((values ?? []).filter(isSubmissionCycleOption))].sort();

export const formatSubmissionCycleDisplay = (values: SubmissionCycleOption[]): string =>
  values.length > 0 ? values.map(value => SUBMISSION_CYCLE_LABELS[value]).join(", ") : "—";

export type PolygonSubmissionStatus = PolygonStatus;
export type PolygonValidationStatus = "not_checked" | "failed" | "partial" | "passed";

export type PolygonFilterState = {
  polygonStatus: PolygonSubmissionStatus[];
  validationStatus: PolygonValidationStatus[];
  plantStartFrom: string;
  plantStartTo: string;
  practice: restorationStrategyType[];
  targetSys: targetLandUseType[];
  submissionCycle: SubmissionCycleOption[];
  hasOverlap: boolean;
  showDeleted: boolean;
};

export const EMPTY_POLYGON_FILTERS: PolygonFilterState = {
  polygonStatus: [],
  validationStatus: [],
  plantStartFrom: "",
  plantStartTo: "",
  practice: [],
  targetSys: [],
  submissionCycle: [],
  hasOverlap: false,
  showDeleted: false
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
