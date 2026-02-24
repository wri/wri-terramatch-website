export const NO_COUNT_TABLE_SPECIES_PER_ROW = 5;
export const NO_COUNT_TABLE_SPECIES_COLUMNS = 4;

export const noCountTableColumns = Array.from({ length: NO_COUNT_TABLE_SPECIES_COLUMNS }, (_, i) => ({
  key: String(i + 1),
  label: ""
}));
