import * as yup from "yup";

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
  plants: Array<{ name?: string | null }>,
  speciesPerRow: number
): Array<Record<number, string> & { id: number }> {
  const rows: Array<Record<number, string> & { id: number }> = [];
  for (let i = 0; i < plants.length; i += speciesPerRow) {
    const row: Record<number, string> & { id: number } = {
      id: Math.floor(i / speciesPerRow) + 1
    };
    for (let j = 0; j < speciesPerRow; j++) {
      row[j + 1] = plants[i + j]?.name ?? "";
    }
    rows.push(row);
  }
  return rows;
}
