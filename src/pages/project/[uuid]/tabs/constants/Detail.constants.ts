export const NO_COUNT_TABLE_SPECIES_PER_ROW = 4;
export const NO_COUNT_TABLE_SPECIES_PER_PAGE = 5;
export const COUNT_TABLE_SPECIES_PER_PAGE_MIN = 10;

export const noCountTableColumns = Array.from({ length: NO_COUNT_TABLE_SPECIES_PER_ROW }, (_, i) => ({
  key: String(i + 1),
  label: ""
}));
