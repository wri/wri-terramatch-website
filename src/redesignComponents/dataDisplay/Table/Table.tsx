import { Box, TableCell as ChakraTableCell, TableRow } from "@chakra-ui/react";
import { Checkbox, Table as WriTable } from "@worldresources/wri-design-systems";
import React, { FC, useCallback, useState } from "react";

import type { IMultiActionButtonProps } from "@/redesignComponents/actions/Buttons/MultiActionButton/MultiActionButton";
import type { ProgressTagProps } from "@/redesignComponents/actions/Tags/ProgressTag/ProgressTag";
import { AvatarProps } from "@/redesignComponents/navigation/Avatar/Avatar";

import CustomTableCell from "./components/TableCell";
import TitleCell, { TitleCellProps } from "./components/TitleCell";
import { tableWrapperStyles } from "./tableStyles";

interface TableProps {
  data: any[];
  columns: any[];
  selectable?: boolean;
}

type RowData = {
  id: string | number;
  name: string;
  email: string;
  age: number;
  title?: TitleCellProps;
  avatars?: AvatarProps[];
  primaryText?: string;
  secondaryText?: string;
  progressTag?: ProgressTagProps;
  trees?: string;
  jobs?: string;
  multiActionButton?: IMultiActionButtonProps;
};

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
  const totalItems = 100;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState<{ key: string; order: string }>({
    key: "",
    order: ""
  });
  const [selectedRows, setSelectedRows] = useState<RowData[]>(selectable ? [] : []);

  const startRange = (currentPage - 1) * pageSize;
  const endRange = startRange + pageSize;

  let fullData = [...data];

  if (sortColumn != null && sortColumn.key !== "") {
    const { key, order } = sortColumn;
    const isDesc = order === "desc";

    fullData = fullData.sort((a, b) => {
      if (typeof a[key] === "string" && typeof b[key] === "string") {
        const newA = a[key];
        const newB = b[key];

        return isDesc ? newA.localeCompare(newB) : newB.localeCompare(newA);
      }

      const newA = a[key] as number;
      const newB = b[key] as number;

      return isDesc ? newA - newB : newB - newA;
    });
  }

  const dataByPage = fullData.slice(startRange, endRange) as RowData[];

  const hasCustomCellContent = useCallback((rowData: RowData) => {
    return (
      rowData.avatars != null ||
      rowData.primaryText != null ||
      rowData.secondaryText != null ||
      rowData.progressTag != null ||
      rowData.trees != null ||
      rowData.jobs != null ||
      rowData.multiActionButton != null
    );
  }, []);

  const renderDataCell = useCallback(
    (rowData: RowData, columnKey: string) => {
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
    },
    [hasCustomCellContent]
  );

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

  const onAllItemsSelected = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedRows(dataByPage);
      } else {
        setSelectedRows([]);
      }
    },
    [dataByPage]
  );

  const handleRowSelected = useCallback((rowData: RowData, checked: boolean) => {
    setSelectedRows(current => {
      const currentRows = current ?? [];
      if (checked) {
        return [...currentRows, rowData];
      }

      return currentRows.filter(item => item.id !== rowData.id);
    });
  }, []);

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
          totalItems,
          currentPage,
          pageSize,
          showItemCount: true
        }}
        onAllItemsSelected={selectable ? onAllItemsSelected : undefined}
        selectedRows={selectedRows}
        selectable={selectable}
      />
    </Box>
  );
};

export default Table;
