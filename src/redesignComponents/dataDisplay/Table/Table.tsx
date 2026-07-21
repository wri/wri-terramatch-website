import { Box, TableCell as ChakraTableCell, TableRow, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { Checkbox, Table as WriTable } from "@worldresources/wri-design-systems";
import React, { Ref, useCallback, useEffect, useLayoutEffect, useRef } from "react";

import { getThemedColor } from "@/lib/theme";
import PaginationTable from "@/redesignComponents/navigation/Pagination/PaginationTable";

import { findHorizontalScrollContainer } from "./findHorizontalScrollContainer";
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
  paginationVariant?: "default" | "compact" | "compact-with-buttons";
  variant?: "default" | "full-width";
  css?: any;
  pageSize?: number;
  className?: string;
  showPagination?: boolean;
  containerRef?: Ref<HTMLDivElement>;
  scrollContainerRef?: Ref<HTMLDivElement>;
  selectedRows?: T[];
  onRowSelected?: (rowData: T, checked: boolean) => void;
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
  paginationVariant = "default",
  variant = "default",
  css,
  pageSize: initialPageSize,
  className,
  showPagination = true,
  containerRef,
  scrollContainerRef,
  selectedRows: controlledSelectedRows,
  onRowSelected: controlledOnRowSelected,
  onAllItemsSelected: controlledOnAllItemsSelected
}: TableProps<T>) => {
  const t = useT();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const { currentPage, setCurrentPage, pageSize, setPageSize } = useTablePaginationState(
    DEFAULT_CURRENT_PAGE,
    initialPageSize
  );
  const { startRange, endRange } = useTablePagination(currentPage, pageSize);
  const { setSortColumn, sortedData } = useTableSorting(data);
  const {
    selectedRows: internalSelectedRows,
    handleRowSelected: internalHandleRowSelected,
    onAllItemsSelected: internalOnAllItemsSelected
  } = useTableSelection(selectable, sortedData);

  // When a consumer passes controlled selectedRows, use those; otherwise fall back to internal state.
  const selectedRows = controlledSelectedRows ?? internalSelectedRows;
  const handleRowSelected = controlledOnRowSelected ?? internalHandleRowSelected;

  const actualTotalItems = totalItems ?? data.length;
  const totalPages = Math.ceil(actualTotalItems / pageSize);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages, setCurrentPage]);

  const dataByPage = sortedData.slice(startRange, endRange);

  const assignRef = useCallback((ref: Ref<HTMLDivElement> | undefined, node: HTMLDivElement | null) => {
    if (ref == null) {
      return;
    }
    if (typeof ref === "function") {
      ref(node);
      return;
    }
    (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
  }, []);

  const setWrapperRef = useCallback(
    (node: HTMLDivElement | null) => {
      wrapperRef.current = node;
      assignRef(containerRef, node);
    },
    [assignRef, containerRef]
  );

  useLayoutEffect(() => {
    const root = wrapperRef.current;
    if (root == null || scrollContainerRef == null) {
      return;
    }

    const scrollNode = findHorizontalScrollContainer(root) as HTMLDivElement | null;
    assignRef(scrollContainerRef, scrollNode);
    return () => {
      assignRef(scrollContainerRef, null);
    };
  }, [assignRef, dataByPage.length, scrollContainerRef, selectable]);

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

  const customRenderRowRef = useRef(customRenderRow);
  customRenderRowRef.current = customRenderRow;

  const finalRenderRow = useCallback(
    (rowData: T, rowProps?: Record<string, unknown>) => {
      const renderRow = customRenderRowRef.current;
      if (renderRow != null) {
        return renderRow(rowData, rowProps);
      }
      if (selectable) {
        return defaultSelectableRenderRow(rowData);
      }
      return defaultRenderRow(rowData);
    },
    [selectable, defaultSelectableRenderRow, defaultRenderRow]
  );

  const displayStart = actualTotalItems === 0 ? 0 : startRange + 1;
  const displayEnd = Math.min(endRange, actualTotalItems);

  const shouldShowPagination = actualTotalItems > 0 && (pageSize == null || actualTotalItems >= pageSize);
  const useCompactPagination = paginationVariant !== "default";

  return (
    <Box
      ref={setWrapperRef}
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
          showPagination && shouldShowPagination && !useCompactPagination
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
      {showPagination && shouldShowPagination && useCompactPagination ? (
        <Box>
          <PaginationTable
            pageSize={pageSize}
            currentPage={currentPage}
            totalItems={actualTotalItems}
            onPageSizeChange={setPageSize}
            onPageChange={setCurrentPage}
            showItemCountText={false}
            variant={paginationVariant}
          />
        </Box>
      ) : null}
      {showItemCount && shouldShowPagination && !useCompactPagination ? (
        <Text
          textStyle="500"
          fontWeight="400"
          color={getThemedColor("neutral", 700)}
          className="absolute bottom-0 left-1/2 w-fit -translate-x-1/2 text-center mobile:hidden"
        >
          {t("Showing {start} - {end} of {total}", { start: displayStart, end: displayEnd, total: actualTotalItems })}
        </Text>
      ) : null}
    </Box>
  );
};

export default Table;
