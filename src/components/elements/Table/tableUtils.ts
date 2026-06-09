import { Row, RowData } from "@tanstack/react-table";

export const parseTableNumericValue = (value: unknown): number => {
  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, ""));
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  return 0;
};

export const formatTableNumber = (value: number | string | null | undefined, maximumFractionDigits = 0): string =>
  parseTableNumericValue(value).toLocaleString("en-US", { maximumFractionDigits });

export const compareNumericValues = (a: number, b: number): number => a - b;

export const numericSortingFn = <TData extends RowData>(rowA: Row<TData>, rowB: Row<TData>, columnId: string): number =>
  compareNumericValues(
    parseTableNumericValue(rowA.getValue(columnId)),
    parseTableNumericValue(rowB.getValue(columnId))
  );
