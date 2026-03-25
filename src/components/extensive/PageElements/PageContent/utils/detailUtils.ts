import * as yup from "yup";

import { NO_COUNT_TABLE_SPECIES_PER_ROW } from "@/pages/project/[uuid]/tabs/constants/Detail.constants";

export const getFieldsRequiringAttentionCount = (
  validation: yup.ObjectSchema<Record<string, unknown>>,
  values: Record<string, unknown> | undefined
): number => {
  if (values == null) return 0;
  try {
    validation.validateSync(values, { abortEarly: false });
    return 0;
  } catch (err: unknown) {
    const yupError = err as { inner?: unknown[] };
    return yupError.inner?.length ?? 0;
  }
};

export function plantsToNoCountRows(
  plants: Array<{ name?: string | null }>
): Array<Record<number, string> & { id: number }> {
  const rows: Array<Record<number, string> & { id: number }> = [];
  for (let i = 0; i < plants.length; i += NO_COUNT_TABLE_SPECIES_PER_ROW) {
    const row: Record<number, string> & { id: number } = {
      id: Math.floor(i / NO_COUNT_TABLE_SPECIES_PER_ROW) + 1
    };
    for (let j = 0; j < NO_COUNT_TABLE_SPECIES_PER_ROW; j++) {
      row[j + 1] = plants[i + j]?.name ?? "";
    }
    rows.push(row);
  }
  return rows;
}
