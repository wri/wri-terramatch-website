import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { Search } from "@worldresources/wri-design-systems";
import classNames from "classnames";
import { FC } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import MultiActionButton from "@/redesignComponents/actions/Buttons/MultiActionButton/MultiActionButton";
import Tooltip from "@/redesignComponents/actions/Tooltip/Tooltip";
import { CloseIcon, InfoIcon } from "@/redesignComponents/foundations/Icons";

import Toolbar from "../Toolbar";
import { SearchProps, ToolbarTableProps } from "../ToolBar.type";
import FilterTag from "./FilterTag";

const ToolbarTable: FC<ToolbarTableProps> = ({
  search,
  filters,
  button,
  className,
  onClearFilters,
  tooltipContent,
  showClearFilters = true,
  onClickFilterButton,
  selectedFilters
}) => {
  const t = useT();
  return (
    <Toolbar
      className={classNames("mobile:mb-6 mobile:flex-col mobile:!items-start", className)}
      contentLeft={
        <div className="flex flex-wrap items-center gap-4 mobile:mb-5 mobile:flex-col mobile:items-start mobile:gap-0">
          {search != null && (
            <div className="flex flex-wrap items-center gap-4">
              <div className="mt-2.5 mb-5">
                <Search
                  {...({
                    placeholder: search.placeholder,
                    disabled: search.disabled,
                    options: search.options,
                    resultsMaxHeight: search.resultsMaxHeight,
                    isLoading: search.isLoading,
                    displayResults: search.displayResults ?? "none",
                    onQueryChange: search.onQueryChange,
                    size: "default"
                  } as SearchProps)}
                />
              </div>
              <div className="flex items-center gap-1">
                <Text textStyle="400-bold" color={"primary.900"}>
                  {search.count != null ? `${search.count}` : ""}
                </Text>
                <Text textStyle="400" color={"primary.900"}>
                  {search.label}
                </Text>
              </div>
            </div>
          )}
          {search != null && filters != null && <span className="text-theme-neutral-500 mobile:hidden">&#124;</span>}
          <div className="flex flex-wrap items-center gap-4">
            {filters != null && filters.length > 0 ? (
              <>
                <div className="text-14 flex flex-wrap items-center gap-3 text-theme-neutral-900">
                  {t("Filter by:")}
                  {filters.map((filter, index) => (
                    <MultiActionButton key={index} {...filter} size="small" />
                  ))}
                </div>
              </>
            ) : (
              <Button
                variant="secondary"
                size="small"
                onClick={onClickFilterButton}
                leftIcon={
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M2.5 8.32914V7.21803H7.5V8.32914H2.5ZM1.25 5.55136V4.44025H8.75V5.55136H1.25ZM0 2.77359V1.66248H10V2.77359H0Z"
                      fill="#5C5959"
                    />
                  </svg>
                }
              >
                {selectedFilters && selectedFilters.length > 0
                  ? t("Filter" + " (" + selectedFilters.length + ")")
                  : t("Add Filter")}
              </Button>
            )}
            <FilterTag selectedFilters={selectedFilters} />
            {showClearFilters && (
              <Button variant="borderless" size="small" leftIcon={<CloseIcon />} onClick={onClearFilters}>
                {t("Clear All Filters")}
              </Button>
            )}
          </div>
        </div>
      }
      contentRight={
        <Flex gap={2} alignItems="center" justifyContent="right">
          {button != null && <Button {...button} size="small" />}
          {tooltipContent && (
            <Tooltip content={tooltipContent} position="top">
              <InfoIcon className="text-theme-neutral-800" />
            </Tooltip>
          )}
        </Flex>
      }
    />
  );
};

export default ToolbarTable;
