import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  InitialTableState,
  RowData,
  SortingState,
  Updater,
  useReactTable
} from "@tanstack/react-table";
import classNames from "classnames";
import { DetailedHTMLProps, TableHTMLAttributes, useState } from "react";
import { When } from "react-if";

import Pagination from "@/components/elements/Table/Pagination";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

export interface TableProps<TData> extends DetailedHTMLProps<TableHTMLAttributes<HTMLTableElement>, HTMLTableElement> {
  data: TData[];
  columns: ColumnDef<TData>[];
  serverSideData?: boolean;
  initialTableState?: InitialTableState;
  variant?: "primary" | "secondary";

  onTableStateChange?: (state: TableState) => void;
}

export interface TableState {
  sorting: Updater<SortingState>;
}

export type TableHeader = { title: string; key: string; valueTransformer?: (value: string | number) => string };

/**
 * @param data: Table data
 * @param columns: Table column definition
 * @param serverSideData?: Should be passed if sorting or pagination is server side
 * @param onTableStateChange: Table state change listener
 */
function Table<TData extends RowData>({
  data,
  columns,
  className,
  serverSideData,
  onTableStateChange,
  initialTableState,
  variant = "primary",
  ...props
}: TableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const {
    getHeaderGroups,
    getRowModel,
    previousPage,
    getCanPreviousPage,
    getState,
    nextPage,
    getCanNextPage,
    getPageCount,
    setPageIndex
  } = useReactTable<TData>({
    data: data,
    columns: columns,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: !serverSideData ? getSortedRowModel() : undefined,
    getPaginationRowModel: !serverSideData ? getPaginationRowModel() : undefined,

    manualSorting: serverSideData,
    manualPagination: serverSideData,
    initialState: initialTableState,
    state: {
      sorting
    },

    onSortingChange: sorting => {
      setSorting(sorting);
      onTableStateChange?.({ sorting });
    },
    debugTable: process.env.NODE_ENV === "development"
  });

  const tableState = getState();

  return (
    <div className="overflow-x-auto px-4 md:overflow-x-visible md:px-0">
      <table {...props} className={classNames(className, "w-full border-separate border-spacing-y-4")}>
        <thead className="bg-primary-200">
          {getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(
                header =>
                  !header.isPlaceholder && (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                      className={classNames(
                        "first:rounded-tl-lg first:rounded-bl-lg last:rounded-br-lg last:rounded-tr-lg",
                        "text-bold-subtitle-500 whitespace-nowrap px-6 py-4",
                        header.column.getCanSort() && "cursor-pointer"
                      )}
                      align="left"
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      <When condition={header.column.getCanSort()}>
                        <Icon
                          name={
                            { asc: IconNames.SORT_UP, desc: IconNames.SORT_DOWN }[
                              header.column.getIsSorted() as string
                            ] || IconNames.SORT
                          }
                          className="ml-2 inline fill-neutral-900"
                          width={11}
                          height={14}
                        />
                      </When>
                    </th>
                  )
              )}
            </tr>
          ))}
        </thead>
        <tbody className="space-y-4">
          {getRowModel().rows.map(row => (
            <tr
              key={row.id}
              className={classNames("rounded-lg", variant === "primary" ? "bg-white shadow" : "bg-neutral-50")}
            >
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className={classNames(
                    "first:rounded-tl-lg first:rounded-bl-lg last:rounded-br-lg last:rounded-tr-lg",
                    "text-light-subtitle-400 px-6 py-4"
                  )}
                  //@ts-ignore
                  align={cell.column.columnDef.meta?.align || "left"}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        className="my-8 w-full justify-center"
        getCanNextPage={getCanNextPage}
        getCanPreviousPage={getCanPreviousPage}
        getPageCount={getPageCount}
        nextPage={nextPage}
        pageIndex={tableState.pagination.pageIndex}
        previousPage={previousPage}
        setPageIndex={setPageIndex}
      />
    </div>
  );
}

export default Table;
