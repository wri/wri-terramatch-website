import { useT } from "@transifex/react";
import classNames from "classnames";
import { remove, uniqBy } from "lodash";
import { DetailedHTMLProps, HTMLAttributes } from "react";

import FilterDropDown from "@/components/elements/TableFilters/Inputs/FilterDropDown";
import FilterSearchBox from "@/components/elements/TableFilters/Inputs/FilterSearchBox";
import { Option } from "@/types/common";

export interface TableFilterProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  columnFilters: ColumnFilter[];
  filters: FilterValue[];
  onChangeFilters: (filters: FilterValue[]) => void;
}

export type ColumnFilter = DropDownColumnFilter | SearchColumnFilter;

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

export interface FilterValue {
  value: string;
  filter: ColumnFilter;
}

const showAllValue = "-1";

function TableFilter({ filters, onChangeFilters, className, columnFilters, ...props }: TableFilterProps) {
  const t = useT();

  const onChangeHandler = (value: string, filter: ColumnFilter) => {
    remove(filters, f => f.filter.accessorKey === filter.accessorKey);
    if (value !== showAllValue) filters = uniqBy([...filters, { value, filter }], "filter.accessorKey");
    onChangeFilters(filters);
  };

  return (
    <div {...props} className={classNames(className, "flex w-full items-center justify-between")}>
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
      <div className="flex items-center gap-12">
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
    </div>
  );
}

export default TableFilter;
