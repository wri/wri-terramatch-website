import { Checkbox, Table as TableComponent } from "@worldresources/wri-design-systems";
import React from "react";

import { IconNames } from "@/components/extensive/Icon/Icon";

import { useTableStyles } from "./hooks";
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
    placeholder?: string;
  };
}

interface TableProps {
  columns: ColumnOption[];
  data: any[];
  selectable?: boolean;
  stickyHeader?: boolean;
}

const Table = ({ columns, data, selectable = false, stickyHeader = false }: TableProps) => {
  useTableStyles();

  return (
    <div className="custom-table-wrapper">
      <TableComponent
        columns={columns}
        data={data}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        onSortColumn={() => {}}
        selectable={selectable}
        stickyHeader={stickyHeader}
        pagination={{
          currentPage: 1,
          pageSize: 10,
          showItemCount: true,
          totalItems: data.length
        }}
        renderRow={(row: any, index: number) => {
          return (
            <tr key={index} className="hover:!bg-theme-primary-100">
              {selectable && (
                <td key="select" className="px-2">
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
