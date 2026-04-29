import { mapPlantingStatusToProgressState } from "@/redesignComponents/content/headers/PageHeaders/ProjectHeader/projectHeader.utils";

export const NO_COUNT_TABLE_SPECIES_PER_ROW_DESKTOP = 4;
export const NO_COUNT_TABLE_SPECIES_PER_ROW_MOBILE = 2;
export const NO_COUNT_TABLE_SPECIES_PER_PAGE = 5;
export const COUNT_TABLE_SPECIES_PER_PAGE_MIN = 10;

export const getNoCountTableColumns = (length: number) =>
  Array.from({ length }, (_, i) => ({
    key: String(i + 1),
    label: ""
  }));

export const getPlantingStatus = (status?: string) =>
  ["replacement-planting", "no-restoration-expected"].includes(status!)
    ? "in-progress"
    : mapPlantingStatusToProgressState(status)!;
