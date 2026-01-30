import { Box, TableCell as ChakraTableCell, TableRow } from "@chakra-ui/react";
import { Checkbox, Table as WriTable } from "@worldresources/wri-design-systems";
import React, { FC, useCallback } from "react";

import CustomTableCell from "./components/TableCell";
import TitleCell from "./components/TitleCell";
import { tableWrapperStyles } from "./tableStyles";
import { type RowData, DEFAULT_TOTAL_ITEMS, hasCustomCellContent } from "./tableUtils";
import { useTablePagination, useTablePaginationState } from "./useTablePagination";
import { useTableSelection } from "./useTableSelection";
import { useTableSorting } from "./useTableSorting";

interface TableProps {
  data: any[];
  columns: any[];
  selectable?: boolean;
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

const Table: FC<TableProps> = ({ data, columns, selectable = false }) => {
  const { currentPage, setCurrentPage, pageSize, setPageSize } = useTablePaginationState();
  const { startRange, endRange } = useTablePagination(currentPage, pageSize);
  const { setSortColumn, sortedData } = useTableSorting(data);
  const { selectedRows, handleRowSelected, onAllItemsSelected } = useTableSelection(selectable);

  const dataByPage = sortedData.slice(startRange, endRange) as RowData[];

  const renderDataCell = useCallback((rowData: RowData, columnKey: string) => {
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

  const renderRow = useCallback(
    (rowData: RowData) => {
      return (
        <TableRow>
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

  const selectableRenderRow = useCallback(
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

  return (
    <Box css={tableWrapperStyles}>
      <WriTable
        columns={columns}
        data={dataByPage}
        renderRow={selectable ? selectableRenderRow : renderRow}
        onSortColumn={setSortColumn}
        onPageSizeChange={setPageSize}
        onPageChange={setCurrentPage}
        pagination={{
          totalItems: DEFAULT_TOTAL_ITEMS,
          currentPage,
          pageSize,
          showItemCount: true
        }}
        onAllItemsSelected={selectable ? handleAllItemsSelected : undefined}
        selectedRows={selectedRows}
        selectable={selectable}
      />
    </Box>
  );
};

export default Table;
