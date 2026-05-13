import { Box, TableCell as ChakraTableCell, TableRow, Text } from "@chakra-ui/react";
import { Checkbox, Table as WriTable } from "@worldresources/wri-design-systems";
import React, { Ref, useCallback, useEffect } from "react";

import { getThemedColor } from "@/lib/theme";

import { getTableWrapperStyles } from "./tableStyles";
import { type BaseRow, DEFAULT_CURRENT_PAGE } from "./tableUtils";
import { useTablePagination, useTablePaginationState } from "./useTablePagination";
import { useTableSelection } from "./useTableSelection";
import { useTableSorting } from "./useTableSorting";

export type TableColumn = {
  key: string;
  label: string;
  sortable?: boolean;
};

interface TableProps<T extends BaseRow> {
  data: T[];
  columns: TableColumn[];
  selectable?: boolean;
  height?: string;
  stickyHeader?: boolean;
  loading?: boolean;
  renderRow?: (rowData: T, rowProps?: Record<string, unknown>) => React.ReactNode;
  renderDataCell?: (rowData: T, columnKey: string) => React.ReactNode;
  totalItems?: number;
  showItemCount?: boolean;
  variant?: "default" | "full-width";
  css?: any;
  pageSize?: number;
  className?: string;
  showPagination?: boolean;
  /** Ref forwarded to the wrapper Box. Useful for consumers that need to listen to scroll on the
   *  WriTable scroll container (e.g. for sticky columns). */
  containerRef?: Ref<HTMLDivElement>;
  // Controlled selection state. When provided, overrides the internal useTableSelection state.
  selectedRows?: T[];
  /** Called when the "select all" header checkbox is toggled. Receives the checked flag and the
   *  currently visible page rows so the consumer can sync their own selectedRows state. */
  onAllItemsSelected?: (checked: boolean, visibleRows: T[]) => void;
}

interface SelectableRowProps<T extends BaseRow> {
  rowData: T;
  columns: TableColumn[];
  renderDataCell: (rowData: T, columnKey: string) => React.ReactNode;
  selectedRows: T[];
  onRowSelected: (rowData: T, checked: boolean) => void;
}

const SelectableRow = <T extends BaseRow>({
  rowData,
  columns,
  renderDataCell,
  selectedRows,
  onRowSelected
}: SelectableRowProps<T>) => {
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

const Table = <T extends BaseRow>({
  data,
  columns,
  selectable = false,
  height,
  stickyHeader,
  loading,
  renderRow: customRenderRow,
  renderDataCell: customRenderDataCell,
  totalItems,
  showItemCount = true,
  variant = "default",
  css,
  pageSize: initialPageSize,
  className,
  showPagination = true,
  containerRef,
  selectedRows: controlledSelectedRows,
  onAllItemsSelected: controlledOnAllItemsSelected
}: TableProps<T>) => {
  const { currentPage, setCurrentPage, pageSize, setPageSize } = useTablePaginationState(
    DEFAULT_CURRENT_PAGE,
    initialPageSize
  );
  const { startRange, endRange } = useTablePagination(currentPage, pageSize);
  const { setSortColumn, sortedData } = useTableSorting(data);
  const {
    selectedRows: internalSelectedRows,
    handleRowSelected,
    onAllItemsSelected: internalOnAllItemsSelected
  } = useTableSelection(selectable, sortedData);

  // When a consumer passes controlled selectedRows, use those; otherwise fall back to internal state.
  const selectedRows = controlledSelectedRows ?? internalSelectedRows;

  const actualTotalItems = totalItems ?? data.length;
  const totalPages = Math.ceil(actualTotalItems / pageSize);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages, setCurrentPage]);

  const dataByPage = sortedData.slice(startRange, endRange);

  const defaultRenderDataCell = useCallback((rowData: T, columnKey: string) => {
    return (rowData as Record<string, unknown>)[columnKey] as React.ReactNode;
  }, []);

  const renderDataCell = customRenderDataCell ?? defaultRenderDataCell;

  const defaultRenderRow = useCallback(
    (rowData: T) => {
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
      if (controlledOnAllItemsSelected != null) {
        controlledOnAllItemsSelected(checked, dataByPage);
      } else {
        internalOnAllItemsSelected(checked, dataByPage);
      }
    },
    [controlledOnAllItemsSelected, internalOnAllItemsSelected, dataByPage]
  );

  const defaultSelectableRenderRow = useCallback(
    (rowData: T) => {
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
    (rowData: T, rowProps?: Record<string, unknown>) => {
      if (customRenderRow != null) {
        return customRenderRow(rowData, rowProps);
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
      ref={containerRef}
      css={getTableWrapperStyles(selectable, dataByPage, pageSize, actualTotalItems, css)}
      className={className}
      {...(height != null ? { height } : {})}
    >
      <WriTable
        columns={columns}
        data={dataByPage}
        renderRow={finalRenderRow as (rowData: BaseRow, rowProps?: Record<string, unknown>) => React.ReactNode}
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
        stickyHeader={stickyHeader}
        loading={loading}
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
