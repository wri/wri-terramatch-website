import { useT } from "@transifex/react";
import classNames from "classnames";
import { remove, uniqBy } from "lodash";
import { DetailedHTMLProps, ElementType, HTMLAttributes } from "react";

import FilterDropDown from "@/components/elements/TableFilters/Inputs/FilterDropDown";
import FilterSearchBox from "@/components/elements/TableFilters/Inputs/FilterSearchBox";
import { Option } from "@/types/common";

import Button from "../Button/Button";

export interface TableFilterProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  columnFilters: ColumnFilter[];
  filters: FilterValue[];
  onChangeFilters: (filters: FilterValue[]) => void;
}

export type ColumnFilter = DropDownColumnFilter | SearchColumnFilter | ButtonColumnFilter;

export interface DropDownColumnFilter {
  accessorKey: string;
  type: "dropDown";
  label: string;
  options: Option[];
  hide?: boolean;
}

export interface SearchColumnFilter {
  accessorKey: string;
  type: "search";
  placeholder: string;
  hide?: boolean;
}

export interface ButtonColumnFilter {
  accessorKey: string;
  type: "button";
  name: string;
  as?: ElementType;
  href?: string;
  hide?: boolean;
}

export interface FilterValue {
  value: string;
  filter: ColumnFilter;
}

const showAllValue = "-1";

function TableFilter({ filters, onChangeFilters, className, columnFilters, ...props }: TableFilterProps) {
  const t = useT();

  const onChangeHandler = (value: string, filter: ColumnFilter) => {
    console.log("🔍 TableFilter onChangeHandler called", {
      value,
      filter: filter.accessorKey,
      currentFilters: filters,
      timestamp: new Date().toISOString()
    });
    remove(filters, f => f.filter.accessorKey === filter.accessorKey);
    if (value !== showAllValue) filters = uniqBy([...filters, { value, filter }], "filter.accessorKey");
    console.log("🔍 TableFilter calling onChangeFilters with:", filters);
    onChangeFilters(filters);
  };

  return (
    <div
      {...props}
      className={classNames(className, "flex w-full items-center justify-between mobile:flex-col mobile:gap-3")}
    >
      <div>
        {columnFilters
          ?.filter(filter => !filter.hide)
          .map(filter => {
            switch (filter.type) {
              case "search":
                return (
                  <FilterSearchBox
                    key={filter.accessorKey}
                    onChange={value => onChangeHandler(value, filter)}
                    placeholder={filter.placeholder}
                    className="w-64"
                  />
                );

              default:
                return null;
            }
          })}
      </div>
      <div className="flex gap-5">
        <div className="flex items-center gap-5 mobile:flex-col">
          {columnFilters
            ?.filter(filter => !filter.hide)
            .map(filter => {
              switch (filter.type) {
                case "dropDown": {
                  const options: Option[] = [{ title: t("Show All"), value: showAllValue }, ...filter.options];

                  return (
                    <FilterDropDown
                      key={filter.accessorKey}
                      options={options}
                      onChange={value => onChangeHandler(value, filter)}
                      label={filter.label}
                      placeholder={t("Show All")}
                      defaultValue={showAllValue}
                    />
                  );
                }

                default:
                  return null;
              }
            })}
        </div>
        <div className="flex items-center gap-5">
          {columnFilters
            ?.filter(filter => !filter.hide)
            .map(filter => {
              switch (filter.type) {
                case "button": {
                  return (
                    <Button as={filter.as} href={filter.href}>
                      {t(filter.name)}
                    </Button>
                  );
                }

                default:
                  return null;
              }
            })}
        </div>
      </div>
    </div>
  );
}

export default TableFilter;
