import type { IButtonProps } from "@/redesignComponents/actions/Buttons/Button/Button";
import type { IMultiActionButtonProps } from "@/redesignComponents/actions/Buttons/MultiActionButton/MultiActionButton";
import type { ProgressTagProps } from "@/redesignComponents/actions/Tags/ProgressTag/ProgressTag";
import { AvatarProps } from "@/redesignComponents/navigation/Avatar/Avatar";

import type { TitleCellProps } from "./components/TitleCell";

export type BaseRow = { id: string | number };

export type ActionCellProps = {
  button: IButtonProps;
  onButtonIconClick: () => void;
};

export type RowData = BaseRow & {
  uuid?: string;
  fullName: string;
  emailAddress: string;
  organisationName: string;
  roleName: string;
  status: string;
  isManager: boolean;
  title?: TitleCellProps;
  avatars?: AvatarProps[];
  primaryText?: string;
  secondaryText?: string;
  progressTag?: ProgressTagProps;
  trees?: string;
  jobs?: string;
  multiActionButton?: IMultiActionButtonProps;
  actionCell?: ActionCellProps;
};

export const DEFAULT_TOTAL_ITEMS = 100;
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_CURRENT_PAGE = 1;

export type SortColumn = {
  key: string;
  order: string;
};

export const hasCustomCellContent = (rowData: RowData): boolean => {
  return (
    rowData.avatars != null ||
    rowData.primaryText != null ||
    rowData.secondaryText != null ||
    rowData.progressTag != null ||
    rowData.trees != null ||
    rowData.jobs != null ||
    rowData.multiActionButton != null
  );
};

export const calculatePaginationRange = (currentPage: number, pageSize: number) => {
  const startRange = (currentPage - 1) * pageSize;
  const endRange = startRange + pageSize;
  return { startRange, endRange };
};

export const sortData = <T extends BaseRow>(
  data: T[],
  sortColumn: SortColumn | null,
  getSortValue?: (row: T, key: string) => unknown,
  customKeys?: ReadonlySet<string>
): T[] => {
  if (sortColumn == null || sortColumn.key === "") {
    return [...data];
  }

  const { key, order } = sortColumn;
  const isDesc = order === "desc";
  const isCustom = customKeys?.has(key) === true;

  return [...data].sort((a, b) => {
    const aVal = getSortValue != null ? getSortValue(a, key) : (a as Record<string, unknown>)[key];
    const bVal = getSortValue != null ? getSortValue(b, key) : (b as Record<string, unknown>)[key];

    if (isCustom && typeof aVal === "number" && typeof bVal === "number") {
      return isDesc ? bVal - aVal : aVal - bVal;
    }

    if (typeof aVal === "string" || typeof bVal === "string") {
      const aStr = aVal == null ? "" : String(aVal);
      const bStr = bVal == null ? "" : String(bVal);
      return isDesc ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    }

    const aNum = typeof aVal === "number" ? aVal : 0;
    const bNum = typeof bVal === "number" ? bVal : 0;
    return isDesc ? aNum - bNum : bNum - aNum;
  });
};
