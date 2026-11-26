import { restorationStrategyType, targetLandUseType } from "@/constants/polygons";
import { type PolygonStatus } from "@/constants/polygonStatuses";
import { SitePolygonsIndexQueryParams } from "@/generated/v3/researchService/researchServiceComponents";

type Translate = (key: string, params?: Record<string, unknown>) => string;

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

export const normalizeSubmissionCycle = (value: string | null | undefined): SubmissionCycleOption[] =>
  value != null && isSubmissionCycleOption(value) ? [value] : [];

export const formatSubmissionCycleDisplay = (values: SubmissionCycleOption[]): string =>
  values.length > 0 ? values.map(value => SUBMISSION_CYCLE_LABELS[value]).join(", ") : "—";

export type PolygonSubmissionStatus = PolygonStatus;
export type PolygonValidationStatus = "not_checked" | "failed" | "partial" | "passed";

export type SiteFilterOption = { label: string; value: string };

export const toSiteFilterOption = ({ uuid, name }: { uuid: string; name: string | null }): SiteFilterOption => ({
  value: uuid,
  label: name ?? uuid
});

export type PolygonFilterState = {
  sites: SiteFilterOption[];
  polygonStatus: PolygonSubmissionStatus[];
  validationStatus: PolygonValidationStatus[];
  plantStartFrom: string;
  plantStartTo: string;
  calcAreaMin: number | null;
  calcAreaMax: number | null;
  practice: restorationStrategyType[];
  targetSys: targetLandUseType[];
  submissionCycle: SubmissionCycleOption[];
  hasOverlap: boolean;
  hasDisturbance: boolean;
  showDeleted: boolean;
};

export const EMPTY_POLYGON_FILTERS: PolygonFilterState = {
  sites: [],
  polygonStatus: [],
  validationStatus: [],
  plantStartFrom: "",
  plantStartTo: "",
  calcAreaMin: null,
  calcAreaMax: null,
  practice: [],
  targetSys: [],
  submissionCycle: [],
  hasOverlap: false,
  hasDisturbance: false,
  showDeleted: false
};

/** Converts drawer filter state (applied or draft) plus a search term into the v3 site polygon query filter. */
export const toSitePolygonFilter = (filters: PolygonFilterState, search: string) => {
  const filter: Record<string, unknown> = {};
  if (search !== "") {
    filter.search = search;
    filter.searchFields = ["polyName", "polygonUuid"];
  }
  if (filters.showDeleted) {
    filter.deletedOnly = true;
    return filter as Partial<SitePolygonsIndexQueryParams>;
  }

  if (filters.polygonStatus.length > 0) filter.polygonStatus = filters.polygonStatus;
  if (filters.validationStatus.length > 0) filter.validationStatus = filters.validationStatus;
  if (filters.plantStartFrom !== "") filter.plantStartFrom = `${filters.plantStartFrom}T00:00:00.000Z`;
  if (filters.plantStartTo !== "") filter.plantStartTo = `${filters.plantStartTo}T00:00:00.000Z`;
  if (filters.calcAreaMin != null) filter.calcAreaMin = filters.calcAreaMin;
  if (filters.calcAreaMax != null) filter.calcAreaMax = filters.calcAreaMax;
  if (filters.practice.length > 0) filter.practice = filters.practice;
  if (filters.targetSys.length > 0) filter.targetSys = filters.targetSys;
  if (filters.submissionCycle.length > 0) filter.submissionCycle = filters.submissionCycle;
  if (filters.hasOverlap) filter.hasOverlap = true;
  if (filters.hasDisturbance) filter.hasDisturbance = true;
  return filter as Partial<SitePolygonsIndexQueryParams>;
};

export type CalcAreaRange = Pick<PolygonFilterState, "calcAreaMin" | "calcAreaMax">;

export type CalcAreaBounds = { min: number; max: number };

export const formatHectares = (value: number): string => value.toLocaleString("en-US", { maximumFractionDigits: 2 });

export const formatCalcAreaRange = (t: Translate, { calcAreaMin, calcAreaMax }: CalcAreaRange): string | undefined => {
  if (calcAreaMin != null && calcAreaMax != null) {
    return t("{min}–{max} ha", { min: formatHectares(calcAreaMin), max: formatHectares(calcAreaMax) });
  }
  if (calcAreaMin != null) return t("At least {value} ha", { value: formatHectares(calcAreaMin) });
  if (calcAreaMax != null) return t("Up to {value} ha", { value: formatHectares(calcAreaMax) });
  return undefined;
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
