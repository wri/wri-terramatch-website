import { Row, RowData } from "@tanstack/react-table";

export const formatTableNumber = (value: number, maximumFractionDigits = 0): string =>
  value.toLocaleString("en-US", { maximumFractionDigits });

export const compareNumericValues = (a: number, b: number): number => a - b;

export const numericSortingFn = <TData extends RowData>(rowA: Row<TData>, rowB: Row<TData>, columnId: string): number =>
  compareNumericValues(Number(rowA.getValue(columnId) ?? 0), Number(rowB.getValue(columnId) ?? 0));
