import { Row, RowData } from "@tanstack/react-table";

export const formatTableNumber = (value: unknown, maximumFractionDigits = 0): string =>
  Number(value ?? 0).toLocaleString("en-US", { maximumFractionDigits });

export const compareNumericValues = (a: unknown, b: unknown): number => Number(a ?? 0) - Number(b ?? 0);

export const numericSortingFn = <TData extends RowData>(rowA: Row<TData>, rowB: Row<TData>, columnId: string): number =>
  compareNumericValues(rowA.getValue(columnId), rowB.getValue(columnId));
