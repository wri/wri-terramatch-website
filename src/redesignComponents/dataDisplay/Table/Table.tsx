import { Box, TableCell as ChakraTableCell, TableRow, Text } from "@chakra-ui/react";
import { Checkbox, Table as WriTable } from "@worldresources/wri-design-systems";
import React, { FC, useCallback, useEffect } from "react";

import { getThemedColor } from "@/lib/theme";

import ActionCell from "./components/ActionCell";
import CustomTableCell from "./components/TableCell";
import TitleCell from "./components/TitleCell";
import { getTableWrapperStyles } from "./tableStyles";
import { type RowData, hasCustomCellContent } from "./tableUtils";
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
  showItemCount = true
}) => {
  const { currentPage, setCurrentPage, pageSize, setPageSize } = useTablePaginationState();
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
    if (columnKey === "actions" && rowData.actionCell != null) {
      return <ActionCell button={rowData.actionCell.button} onButtonIconClick={rowData.actionCell.onButtonIconClick} />;
    }

    if (columnKey === "name") {
      if (rowData.title != null) {
        return <TitleCell {...rowData.title} />;
      }

      if (hasCustomCellContent(rowData)) {
        return (
          <CustomTableCell
            avatars={rowData.avatars}
            primaryText={rowData.primaryText}
            secondaryText={rowData.secondaryText}
            progressTag={rowData.progressTag}
            trees={rowData.trees}
            jobs={rowData.jobs}
            multiActionButton={rowData.multiActionButton}
          />
        );
      }

      return rowData.name;
    }

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

  return (
    <Box css={getTableWrapperStyles(sortColumn, columns, selectable, isScrollable, scrollableWidth, scrollableHeight)}>
      <WriTable
        columns={columns}
        data={dataByPage}
        renderRow={finalRenderRow}
        onSortColumn={setSortColumn}
        onPageSizeChange={setPageSize}
        onPageChange={setCurrentPage}
        pagination={{
          totalItems: actualTotalItems,
          currentPage,
          pageSize,
          showItemCount
        }}
        onAllItemsSelected={selectable ? handleAllItemsSelected : undefined}
        selectedRows={selectedRows}
        selectable={selectable}
      />
      {showItemCount && (
        <Text
          fontSize="18px"
          fontWeight="400"
          lineHeight="28px"
          color={getThemedColor("neutral", 700)}
          className="absolute bottom-[30px] left-1/2 w-fit -translate-x-1/2 text-center"
        >
          Showing {`${startRange + 1} - ${endRange} of ${actualTotalItems}`}
        </Text>
      )}
    </Box>
  );
};

export default Table;
