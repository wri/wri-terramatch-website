import { Checkbox, Table as TableComponent } from "@worldresources/wri-design-systems";
import { useId, useRef } from "react";

import { IconNames } from "@/components/extensive/Icon/Icon";

import { useTableSortState, useTableStyles } from "./hooks";
import { renderCellByType } from "./utils";

export type CellType = "buttons" | "data" | "link" | "miscellaneous" | "profile" | "text";

export interface ColumnOption {
  key: string;
  label: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  cellClassName?: string;
  cellStyle?: React.CSSProperties;
  renderCell?: (value: any, row: any, index: number) => React.ReactNode;
  width?: string | number;
  sticky?: boolean;
  cellType?: CellType;
  cellOptions?: {
    buttonLabels?: string[];
    onButtonClick?: (buttonIndex: number, row: any, index: number) => void;
    dataIcon?: "tree" | "jobs" | IconNames;
    linkHref?: (value: any, row: any) => string;
    truncate?: boolean;
    profileImage?: (value: any, row: any) => string | React.ReactNode;
    title?: string;
    description?: string;
    widthLinkCell?: string;
  };
}

export interface SortingState {
  key: string;
  order: string;
}

interface TableProps {
  columns: ColumnOption[];
  data: any[];
  selectable?: boolean;
  stickyHeader?: boolean;
  pagination?: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    showPagination: boolean;
  };
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSortColumn?: (sorting: SortingState) => void;
}

const Table = ({
  columns,
  data,
  selectable = false,
  stickyHeader = false,
  pagination,
  onSortColumn,
  onPageChange,
  onPageSizeChange
}: TableProps) => {
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const tableId = useId();

  const { activeSorts, handleSortColumn } = useTableSortState({
    columns,
    selectable,
    data,
    tableWrapperRef,
    onSortColumn
  });

  useTableStyles(activeSorts, tableWrapperRef);

  return (
    <div ref={tableWrapperRef} id={tableId} className="custom-table-wrapper w-full">
      <TableComponent
        columns={columns}
        data={data}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        onSortColumn={handleSortColumn}
        selectable={selectable}
        stickyHeader={stickyHeader}
        pagination={pagination}
        renderRow={(row: any, index: number) => {
          return (
            <tr key={index} className="hover:!bg-theme-primary-100">
              {selectable && (
                <td key="select" className="pl-3 pr-2">
                  <Checkbox
                    name={row.id}
                    checked={row.selected}
                    onChange={() => {
                      row.selected = !row.selected;
                    }}
                  />
                </td>
              )}
              {columns.map((column: ColumnOption) => {
                const cellValue = row[column.key];
                let cellContent: React.ReactNode;

                if (column.renderCell) {
                  cellContent = column.renderCell(cellValue, row, index);
                } else if (column.cellType) {
                  cellContent = renderCellByType(column.cellType, cellValue, row, index, column);
                } else {
                  cellContent = cellValue;
                }

                return (
                  <td
                    key={column.key}
                    align={column.align || "left"}
                    className={column.cellClassName}
                    style={{
                      ...column.cellStyle,
                      ...(column.sticky && { position: "sticky", zIndex: 1 }),
                      ...(column.width && { width: column.width }),
                      padding: "8px"
                    }}
                  >
                    {cellContent}
                  </td>
                );
              })}
            </tr>
          );
        }}
      />
    </div>
  );
};

export default Table;
