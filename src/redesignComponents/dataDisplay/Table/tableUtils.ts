import type { IButtonProps } from "@/redesignComponents/actions/Buttons/Button/Button";
import type { IMultiActionButtonProps } from "@/redesignComponents/actions/Buttons/MultiActionButton/MultiActionButton";
import type { ProgressTagProps } from "@/redesignComponents/actions/Tags/ProgressTag/ProgressTag";
import { AvatarProps } from "@/redesignComponents/navigation/Avatar/Avatar";

import type { TitleCellProps } from "./components/TitleCell";

// Minimal contract every row must satisfy — the Table component only depends on this.
export type BaseRow = { id: string | number };

export type ActionCellProps = {
  button: IButtonProps;
  onButtonIconClick: () => void;
};

// Domain-specific row shape used by the admin user / team-member tables.
// Keep this here so existing consumers don't need to change their import path.
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

export const sortData = <T extends BaseRow>(data: T[], sortColumn: SortColumn | null): T[] => {
  if (sortColumn == null || sortColumn.key === "") {
    return [...data];
  }

  const { key, order } = sortColumn;
  const isDesc = order === "desc";

  return [...data].sort((a, b) => {
    const aVal = (a as Record<string, unknown>)[key];
    const bVal = (b as Record<string, unknown>)[key];

    if (typeof aVal === "string" && typeof bVal === "string") {
      return isDesc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }

    return isDesc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });
};
