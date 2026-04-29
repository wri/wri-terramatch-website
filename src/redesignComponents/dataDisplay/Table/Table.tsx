import { Box, TableCell as ChakraTableCell, TableRow, Text } from "@chakra-ui/react";
import { Checkbox, Table as WriTable } from "@worldresources/wri-design-systems";
import React, { FC, useCallback, useEffect } from "react";

import { getThemedColor } from "@/lib/theme";

import { getTableWrapperStyles } from "./tableStyles";
import { type RowData, DEFAULT_CURRENT_PAGE } from "./tableUtils";
import { useTablePagination, useTablePaginationState } from "./useTablePagination";
import { useTableSelection } from "./useTableSelection";
import { useTableSorting } from "./useTableSorting";

interface TableProps {
  data: any[];
  columns: any[];
  selectable?: boolean;
  isScrollable?: boolean;
  scrollableWidth?: string;
  scrollableHeight?: string;
  renderRow?: (rowData: RowData) => React.ReactNode;
  renderDataCell?: (rowData: RowData, columnKey: string) => React.ReactNode;
  totalItems?: number;
  showItemCount?: boolean;
  variant?: "default" | "full-width";
  css?: any;
  pageSize?: number;
  className?: string;
  showPagination?: boolean;
}

interface SelectableRowProps {
  rowData: RowData;
  columns: any[];
  renderDataCell: (rowData: RowData, columnKey: string) => React.ReactNode;
  selectedRows: RowData[];
  onRowSelected: (rowData: RowData, checked: boolean) => void;
}

const SelectableRow: FC<SelectableRowProps> = ({ rowData, columns, renderDataCell, selectedRows, onRowSelected }) => {
  const handleOnRowSelected = useCallback(
    ({ checked }: any) => {
      onRowSelected(rowData, checked);
    },
    [rowData, onRowSelected]
  );

  const isRowSelected = selectedRows != null && selectedRows.some(item => item.id === rowData.id);

  return (
    <TableRow aria-selected={isRowSelected}>
      <ChakraTableCell>
        <Checkbox name={`checkbox-${rowData.id}`} onCheckedChange={handleOnRowSelected} checked={isRowSelected} />
      </ChakraTableCell>
      {columns.map(column => (
        <ChakraTableCell key={`${rowData.id}-${column.key}`}>{renderDataCell(rowData, column.key)}</ChakraTableCell>
      ))}
    </TableRow>
  );
};

const Table: FC<TableProps> = ({
  data,
  columns,
  selectable = false,
  isScrollable = false,
  scrollableWidth = "100%",
  scrollableHeight = "100%",
  renderRow: customRenderRow,
  renderDataCell: customRenderDataCell,
  totalItems,
  showItemCount = true,
  variant = "default",
  css,
  pageSize: initialPageSize,
  className,
  showPagination = true
}) => {
  const { currentPage, setCurrentPage, pageSize, setPageSize } = useTablePaginationState(
    DEFAULT_CURRENT_PAGE,
    initialPageSize
  );
  const { startRange, endRange } = useTablePagination(currentPage, pageSize);
  const { sortColumn, setSortColumn, sortedData } = useTableSorting(data);
  const { selectedRows, handleRowSelected, onAllItemsSelected } = useTableSelection(selectable, sortedData);

  const actualTotalItems = totalItems ?? data.length;
  const totalPages = Math.ceil(actualTotalItems / pageSize);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages, setCurrentPage]);

  const dataByPage = sortedData.slice(startRange, endRange) as RowData[];

  const defaultRenderDataCell = useCallback((rowData: RowData, columnKey: string) => {
    return (rowData as any)[columnKey];
  }, []);

  const renderDataCell = customRenderDataCell ?? defaultRenderDataCell;

  const defaultRenderRow = useCallback(
    (rowData: RowData) => {
      return (
        <TableRow className="group">
          {columns.map(column => (
            <ChakraTableCell key={`${rowData.id}-${column.key}`}>{renderDataCell(rowData, column.key)}</ChakraTableCell>
          ))}
        </TableRow>
      );
    },
    [columns, renderDataCell]
  );

  const handleAllItemsSelected = useCallback(
    (checked: boolean) => {
      onAllItemsSelected(checked, dataByPage);
    },
    [onAllItemsSelected, dataByPage]
  );

  const defaultSelectableRenderRow = useCallback(
    (rowData: RowData) => {
      return (
        <SelectableRow
          rowData={rowData}
          columns={columns}
          renderDataCell={renderDataCell}
          selectedRows={selectedRows}
          onRowSelected={handleRowSelected}
        />
      );
    },
    [columns, renderDataCell, selectedRows, handleRowSelected]
  );

  const finalRenderRow = useCallback(
    (rowData: RowData) => {
      if (customRenderRow != null) {
        return customRenderRow(rowData);
      }

      if (selectable) {
        return defaultSelectableRenderRow(rowData);
      }

      return defaultRenderRow(rowData);
    },
    [customRenderRow, selectable, defaultSelectableRenderRow, defaultRenderRow]
  );

  const displayStart = actualTotalItems === 0 ? 0 : startRange + 1;
  const displayEnd = Math.min(endRange, actualTotalItems);

  const shouldShowPagination = actualTotalItems > 0 && (pageSize == null || actualTotalItems >= pageSize);

  return (
    <Box
      css={getTableWrapperStyles(
        sortColumn,
        columns,
        selectable,
        isScrollable,
        scrollableWidth,
        scrollableHeight,
        dataByPage,
        pageSize,
        actualTotalItems,
        css
      )}
      className={className}
    >
      <WriTable
        columns={columns}
        data={dataByPage}
        renderRow={finalRenderRow}
        onSortColumn={setSortColumn}
        onPageSizeChange={setPageSize}
        onPageChange={setCurrentPage}
        pagination={
          showPagination && shouldShowPagination
            ? {
                totalItems: actualTotalItems,
                currentPage,
                pageSize,
                showItemCount
              }
            : undefined
        }
        onAllItemsSelected={selectable ? handleAllItemsSelected : undefined}
        selectedRows={selectedRows}
        selectable={selectable}
        variant={variant}
      />
      {showItemCount && shouldShowPagination && (
        <Text
          textStyle="500"
          fontWeight="400"
          color={getThemedColor("neutral", 700)}
          className="absolute bottom-[1.875rem] left-1/2 w-fit -translate-x-1/2 text-center mobile:hidden"
        >
          Showing {`${displayStart} - ${displayEnd} of ${actualTotalItems}`}
        </Text>
      )}
    </Box>
  );
};

export default Table;
