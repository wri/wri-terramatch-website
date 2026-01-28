import { Box, TableCell as ChakraTableCell, TableRow } from "@chakra-ui/react";
import { Checkbox, Table as WriTable } from "@worldresources/wri-design-systems";
import { FC, useState } from "react";

import { getThemedColor } from "@/lib/theme";
import type { IMultiActionButtonProps } from "@/redesignComponents/actions/Buttons/MultiActionButton/MultiActionButton";
import type { ProgressTagProps } from "@/redesignComponents/actions/Tags/ProgressTag/ProgressTag";
import { AvatarProps } from "@/redesignComponents/navigation/Avatar/Avatar";

import CustomTableCell from "./components/TableCell";
import TitleCell, { TitleCellProps } from "./components/TitleCell";

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

  if (sortColumn && sortColumn.key !== "") {
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

  const renderRow = (rowData: RowData) => {
    if (rowData.title != null) {
      return (
        <TableRow>
          <ChakraTableCell>
            <TitleCell {...rowData.title} />
          </ChakraTableCell>
          <ChakraTableCell>{rowData.email}</ChakraTableCell>
          <ChakraTableCell>{rowData.age}</ChakraTableCell>
        </TableRow>
      );
    }

    return (
      <TableRow>
        <ChakraTableCell>
          <CustomTableCell
            avatars={rowData.avatars}
            primaryText={rowData.primaryText}
            secondaryText={rowData.secondaryText}
            progressTag={rowData.progressTag}
            trees={rowData.trees}
            jobs={rowData.jobs}
            multiActionButton={rowData.multiActionButton}
          />
        </ChakraTableCell>
        <ChakraTableCell>{rowData.email}</ChakraTableCell>
        <ChakraTableCell>{rowData.age}</ChakraTableCell>
      </TableRow>
    );
  };

  const selectableRenderRow = (rowData: RowData) => {
    if (rowData.title != null) {
      return (
        <TableRow aria-selected={selectedRows?.some(item => item.id === rowData.id)}>
          <ChakraTableCell>
            <Checkbox
              name={`checkbox-${rowData.id}`}
              onCheckedChange={({ checked }: any) => {
                setSelectedRows((current = [] as RowData[]) => {
                  if (checked) {
                    return [...current, rowData];
                  }

                  return current.filter(item => item.id !== rowData.id);
                });
              }}
              checked={selectedRows?.some(item => item.id === rowData.id)}
            />
          </ChakraTableCell>
          <ChakraTableCell>
            <TitleCell {...rowData.title} />
          </ChakraTableCell>
          <ChakraTableCell>{rowData.email}</ChakraTableCell>
          <ChakraTableCell>{rowData.age}</ChakraTableCell>
        </TableRow>
      );
    }

    const handleOnRowSelected = ({ checked }: any) => {
      setSelectedRows((current = [] as RowData[]) => {
        if (checked) {
          return [...current, rowData];
        }

        return current.filter(item => item.id !== rowData.id);
      });
    };

    return (
      <TableRow aria-selected={selectedRows?.some(item => item.id === rowData.id)}>
        <ChakraTableCell>
          <Checkbox
            name={`checkbox-${rowData.id}`}
            onCheckedChange={handleOnRowSelected}
            checked={selectedRows?.some(item => item.id === rowData.id)}
          />
        </ChakraTableCell>
        <ChakraTableCell>
          <CustomTableCell
            label={rowData.name}
            avatars={rowData.avatars}
            primaryText={rowData.primaryText}
            secondaryText={rowData.secondaryText}
            progressTag={rowData.progressTag}
            trees={rowData.trees}
            jobs={rowData.jobs}
            multiActionButton={rowData.multiActionButton}
          />
        </ChakraTableCell>
        <ChakraTableCell>{rowData.email}</ChakraTableCell>
        <ChakraTableCell>{rowData.age}</ChakraTableCell>
      </TableRow>
    );
  };

  const onAllItemsSelected = (checked: boolean) => {
    if (checked) {
      setSelectedRows(dataByPage);
    } else {
      setSelectedRows([]);
    }
  };

  return (
    <Box
      css={{
        "& table tbody tr": {
          backgroundColor: "transparent",
          borderBottom: `1px solid ${getThemedColor("neutral", 300)}`,
          transition: "background-color 0.15s ease-in-out"
        },

        "& table tbody tr:hover": {
          backgroundColor: getThemedColor("primary", 100),
          borderBottom: `1px solid ${getThemedColor("primary", 700)}`
        }
      }}
    >
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
