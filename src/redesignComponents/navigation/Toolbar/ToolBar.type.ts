import { ReactElement } from "react";

import { IButtonProps } from "@/redesignComponents/actions/Buttons/Button/Button";
import { IMultiActionButtonProps } from "@/redesignComponents/actions/Buttons/MultiActionButton/MultiActionButton";

import { BreadcrumbProps } from "../Breadcrumbs/Breadcrumb";
import { TabBarWriProps } from "../TabBar/TabBar";

export interface ToolbarProps {
  contentLeft: React.ReactNode;
  contentRight?: React.ReactNode;
  contentCenter?: React.ReactNode;
  className?: string;
  classNameContentRight?: string;
  classNameContentCenter?: string;
  classNameContentLeft?: string;
}

export interface BulkActionToolbarProps {
  primaryButtonProps?: IButtonProps;
  secondaryButtonProps?: IButtonProps;
  tertiaryButtonProps?: IButtonProps;
  quantityButtonProps?: IButtonProps;
  items?: string;
  ButtonCancel: IButtonProps;
  ButtonDelete: IButtonProps;
}

export interface ToolbarFormProps {
  cancelButtonProps?: IButtonProps;
  primaryButtonProps?: IButtonProps;
  secondaryButtonProps?: IButtonProps;
  tertiaryButtonProps?: IButtonProps;
}

export interface ToolbarSlot {
  title: string;
  description: string;
}

export interface ToolbarObjectProps {
  breadcrumbs: BreadcrumbProps;
  suffix?: React.ReactNode;
  className?: string;
  classNameSuffix?: string;
}

export type ListItemVariant = "data" | "navigation" | "select";

export interface ListItemProps {
  id?: string;
  label: string;
  caption?: string;
  icon?: ReactElement;
  value?: string;
  variant?: ListItemVariant;
  isExpanded?: boolean;
  onItemClick?: () => void;
  ariaLabel?: string;
  disabled?: boolean;
  isHighlighted?: boolean;
}

export interface SearchProps {
  placeholder?: string;
  disabled?: boolean;
  options: ListItemProps[];
  resultsMaxHeight?: string;
  isLoading?: boolean;
  displayResults?: "none" | "text" | "list" | "custom";
  label?: string;
  onQueryChange?: (query: string) => void;
  count?: number;
}

export interface ToolbarTableProps {
  search: SearchProps;
  filters: IMultiActionButtonProps[];
  onClearFilters: () => void;
  button: IButtonProps;
  className?: string;
  tooltipContent?: string;
  showClearFilters?: boolean;
}

export interface ViewToolbarProps {
  tabBar: TabBarWriProps;
}
