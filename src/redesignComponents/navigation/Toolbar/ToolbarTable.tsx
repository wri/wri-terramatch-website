import { Search } from "@worldresources/wri-design-systems";
import { ReactElement } from "react";

import Button, { IButtonProps } from "@/redesignComponents/Forms/Actions/Button/Button";
import MultiActionButton, {
  IMultiActionButtonProps
} from "@/redesignComponents/Forms/Actions/MultiActionButton/MultiActionButton";

import Toolbar from "./Toolbar";

type ListItemVariant = "data" | "navigation" | "select";

interface ListItemProps {
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

interface SearchProps {
  placeholder?: string;
  disabled?: boolean;
  options: ListItemProps[];
  resultsMaxHeight?: string;
  isLoading?: boolean;
  displayResults?: "none" | "text" | "list" | "custom";
  label?: string;
}

const ToolbarTable = ({
  search,
  filters,
  button
}: {
  search: SearchProps;
  filters: IMultiActionButtonProps[];
  button: IButtonProps;
}) => {
  return (
    <Toolbar
      contentLeft={
        <div className="flex flex-wrap items-center gap-2">
          {search && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="mt-2.5">
                <Search
                  {...({
                    placeholder: search.placeholder,
                    disabled: search.disabled,
                    options: search.options,
                    resultsMaxHeight: search.resultsMaxHeight,
                    isLoading: search.isLoading,
                    displayResults: search.displayResults,
                    size: "default"
                  } as SearchProps)}
                />
              </div>
              <span className="text-14-bold text-theme-neutral-900 flex min-w-fit items-center gap-0.5">
                XX {search.label}
              </span>
            </div>
          )}
          {search && filters && <span className="text-theme-neutral-500">&#124;</span>}
          <div className="text-14 text-theme-neutral-900 flex flex-wrap items-center gap-2">
            Filter by:
            {filters.map((filter, index) => (
              <MultiActionButton key={index} {...filter} size="small" />
            ))}
          </div>
        </div>
      }
      contentRight={<Button {...button} size="small" />}
    />
  );
};

export default ToolbarTable;
