import { type SystemStyleObject, Box } from "@chakra-ui/react";
import { Table as WriTable } from "@worldresources/wri-design-systems";
import React, { Ref, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import PaginationTable from "@/redesignComponents/navigation/Pagination/PaginationTable";

import { findHorizontalScrollContainer } from "./findHorizontalScrollContainer";
import { getTableWrapperStyles } from "./tableStyles";
import { type BaseRow, type SortColumn, DEFAULT_CURRENT_PAGE } from "./tableUtils";
import { useTablePagination, useTablePaginationState } from "./useTablePagination";
import { useTableSelection } from "./useTableSelection";
import { useTableSorting } from "./useTableSorting";

export type TableColumn = {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  cell?: (rowData: any) => React.ReactNode;
  sticky?: boolean;
};

export type TableRenderRowContext = {
  className?: string;
  getCellProps: (columnKey: string) => Record<string, any>;
};

export const CHECKBOX_COLUMN_KEY = "__checkbox__";

interface TableProps<T extends BaseRow> {
  data: T[];
  columns: TableColumn[];
  selectable?: boolean;
  height?: string;
  stickyHeader?: boolean;
  loading?: boolean;
  renderRow?: (rowData: T, context?: TableRenderRowContext) => React.ReactNode;
  renderDataCell?: (rowData: T, columnKey: string) => React.ReactNode;
  totalItems?: number;
  showItemCount?: boolean;
  paginationVariant?: "default" | "compact" | "compact-with-buttons";
  variant?: "default" | "full-width";
  css?: SystemStyleObject;
  pageSize?: number;
  className?: string;
  showPagination?: boolean;
  containerRef?: Ref<HTMLDivElement>;
  scrollContainerRef?: Ref<HTMLDivElement>;
  selectedRows?: T[];
  onRowSelected?: (rowData: T, checked: boolean) => void;
  onAllItemsSelected?: (checked: boolean, visibleRows: T[]) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSortChange?: (sortColumn: SortColumn) => void;
  currentPage?: number;
}

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
  onAllItemsSelected: controlledOnAllItemsSelected,
  onPageChange: controlledOnPageChange,
  onPageSizeChange: controlledOnPageSizeChange,
  onSortChange,
  currentPage: controlledCurrentPage
}: TableProps<T>) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const isServerPaginated = controlledOnPageChange != null && totalItems != null;
  const [paginationResetKey, setPaginationResetKey] = useState(0);
  const previousControlledPageRef = useRef(controlledCurrentPage);
  const {
    currentPage: internalCurrentPage,
    setCurrentPage,
    pageSize,
    setPageSize
  } = useTablePaginationState(DEFAULT_CURRENT_PAGE, initialPageSize);
  const currentPage = controlledCurrentPage ?? internalCurrentPage;
  const { startRange, endRange } = useTablePagination(currentPage, pageSize);
  const { setSortColumn, sortedData } = useTableSorting(data);
  const {
    selectedRows: internalSelectedRows,
    handleRowSelected: internalHandleRowSelected,
    onAllItemsSelected: internalOnAllItemsSelected
  } = useTableSelection(selectable, isServerPaginated ? data : sortedData);

  const selectedRows = controlledSelectedRows ?? internalSelectedRows;
  const handleRowSelected = controlledOnRowSelected ?? internalHandleRowSelected;

  const actualTotalItems = totalItems ?? data.length;
  const totalPages = Math.ceil(actualTotalItems / pageSize);

  useEffect(() => {
    if (controlledCurrentPage != null) {
      return;
    }
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [controlledCurrentPage, currentPage, totalPages, setCurrentPage]);

  // WriTable keeps internal page state; remount when parent programmatically resets to page 1
  // (sort/filter) so the pager UI matches the controlled currentPage.
  useEffect(() => {
    if (!isServerPaginated || controlledCurrentPage == null) {
      previousControlledPageRef.current = controlledCurrentPage;
      return;
    }
    const previousPage = previousControlledPageRef.current;
    previousControlledPageRef.current = controlledCurrentPage;
    if (controlledCurrentPage === DEFAULT_CURRENT_PAGE && previousPage != null && previousPage > DEFAULT_CURRENT_PAGE) {
      setPaginationResetKey(key => key + 1);
    }
  }, [controlledCurrentPage, isServerPaginated]);

  const dataByPage = isServerPaginated ? data : sortedData.slice(startRange, endRange);

  const handlePageChange = useCallback(
    (page: number) => {
      if (controlledOnPageChange != null) {
        controlledOnPageChange(page);
        return;
      }
      setCurrentPage(page);
    },
    [controlledOnPageChange, setCurrentPage]
  );

  const handlePageSizeChange = useCallback(
    (nextPageSize: number) => {
      setPageSize(nextPageSize);
      if (isServerPaginated) {
        setCurrentPage(DEFAULT_CURRENT_PAGE);
        controlledOnPageChange?.(DEFAULT_CURRENT_PAGE);
        setPaginationResetKey(key => key + 1);
      }
      controlledOnPageSizeChange?.(nextPageSize);
    },
    [controlledOnPageChange, controlledOnPageSizeChange, isServerPaginated, setCurrentPage, setPageSize]
  );

  const handleSortColumn = useCallback(
    (sortColumn: SortColumn) => {
      setSortColumn(sortColumn);
      if (isServerPaginated) {
        setCurrentPage(DEFAULT_CURRENT_PAGE);
        controlledOnPageChange?.(DEFAULT_CURRENT_PAGE);
        setPaginationResetKey(key => key + 1);
      }
      onSortChange?.(sortColumn);
    },
    [controlledOnPageChange, isServerPaginated, onSortChange, setCurrentPage, setSortColumn]
  );

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

  const resolvedColumns = useMemo<TableColumn[]>(
    () =>
      columns.map(column =>
        column.cell == null && customRenderDataCell != null
          ? { ...column, cell: (rowData: T) => customRenderDataCell(rowData, column.key) }
          : column
      ),
    [columns, customRenderDataCell]
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

  const customRenderRowRef = useRef(customRenderRow);
  customRenderRowRef.current = customRenderRow;

  const finalRenderRow = useCallback((rowData: T, context?: TableRenderRowContext) => {
    const renderRow = customRenderRowRef.current;
    if (renderRow == null) {
      return null;
    }
    const enhancedContext: TableRenderRowContext | undefined =
      context != null
        ? {
            ...context,
            getCellProps: (columnKey: string) => {
              const cellProps = context.getCellProps(columnKey);
              return cellProps.width != null ? { ...cellProps, maxWidth: cellProps.width } : cellProps;
            }
          }
        : context;
    return renderRow(rowData, enhancedContext);
  }, []);

  const useCompactPagination = paginationVariant !== "default";
  const hasMultiplePages = pageSize != null && actualTotalItems > pageSize;
  const shouldShowPaginationControls = showPagination && actualTotalItems > 0 && hasMultiplePages;
  const shouldShowItemCountText = showItemCount && shouldShowPaginationControls && !useCompactPagination;

  return (
    <Box
      ref={setWrapperRef}
      css={getTableWrapperStyles(selectable, dataByPage, pageSize, actualTotalItems, css)}
      className={className}
      {...(height != null ? { height } : {})}
    >
      <WriTable
        key={isServerPaginated ? `server-table-${paginationResetKey}` : undefined}
        columns={resolvedColumns}
        data={dataByPage}
        renderRow={
          customRenderRow != null
            ? (finalRenderRow as (rowData: BaseRow, context?: TableRenderRowContext) => React.ReactNode)
            : undefined
        }
        onSortColumn={handleSortColumn}
        onPageSizeChange={handlePageSizeChange}
        onPageChange={handlePageChange}
        pagination={
          shouldShowPaginationControls && !useCompactPagination
            ? {
                totalItems: actualTotalItems,
                currentPage,
                pageSize,
                showItemCount,
                showItemCountText: true
              }
            : undefined
        }
        onAllItemsSelected={selectable ? handleAllItemsSelected : undefined}
        onRowSelected={selectable ? handleRowSelected : undefined}
        selectedRows={selectedRows}
        selectable={selectable}
        variant={variant}
        stickyHeader={stickyHeader}
        loading={loading}
      />
      {shouldShowPaginationControls && useCompactPagination ? (
        <PaginationTable
          pageSize={pageSize}
          currentPage={currentPage}
          totalItems={actualTotalItems}
          onPageSizeChange={handlePageSizeChange}
          onPageChange={handlePageChange}
          showItemCountText={shouldShowItemCountText}
          variant={paginationVariant}
        />
      ) : null}
    </Box>
  );
};

export default Table;
