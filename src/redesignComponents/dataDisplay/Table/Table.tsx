import { type SystemStyleObject, Box, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { Table as WriTable } from "@worldresources/wri-design-systems";
import React, { Ref, useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";

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

  // Bridge the legacy renderDataCell API onto the library's native columns[].cell so the
  // library's default row renderer (native checkbox column included) produces cell content.
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
    // TODO: Remove this getCellProps augmentation once the library adds maxWidth to its own
    // cell props. It currently returns only width + minWidth from columns[].width, so columns
    // can still grow past their configured size; we add maxWidth = width to pin the width.
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

  const displayStart = actualTotalItems === 0 ? 0 : startRange + 1;
  const displayEnd = Math.min(endRange, actualTotalItems);

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
        columns={resolvedColumns}
        data={dataByPage}
        renderRow={
          customRenderRow != null
            ? (finalRenderRow as (rowData: BaseRow, context?: TableRenderRowContext) => React.ReactNode)
            : undefined
        }
        onSortColumn={setSortColumn}
        onPageSizeChange={setPageSize}
        onPageChange={setCurrentPage}
        pagination={
          shouldShowPaginationControls && !useCompactPagination
            ? {
                totalItems: actualTotalItems,
                currentPage,
                pageSize,
                showItemCount
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
      {shouldShowItemCountText ? (
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
