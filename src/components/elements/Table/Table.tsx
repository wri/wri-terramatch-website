import {
  Cell,
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
import { useT } from "@transifex/react";
import classNames from "classnames";
import Lottie from "lottie-react";
import { DetailedHTMLProps, PropsWithChildren, TableHTMLAttributes, useMemo, useState } from "react";
import { Else, If, Then, When } from "react-if";

import SpinnerLottie from "@/assets/animations/spinner.json";
import TableFilter, { ColumnFilter, FilterValue } from "@/components/elements/TableFilters/TableFilter";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import Pagination from "@/components/extensive/Pagination";

export interface TableProps<TData>
  extends DetailedHTMLProps<TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>,
    PropsWithChildren {
  data: TData[];
  columns: ColumnDef<TData>[];
  columnFilters?: ColumnFilter[];
  serverSideData?: boolean;
  initialTableState?: InitialTableState;
  variant?: "primary" | "secondary";
  hasPagination?: boolean;
  onTableStateChange?: (state: TableState) => void;
  isLoading?: boolean;
}

export interface TableState {
  sorting: Updater<SortingState>;
  filters: FilterValue[];
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
  columnFilters,
  className,
  serverSideData,
  onTableStateChange,
  initialTableState,
  variant = "primary",
  children,
  isLoading,
  hasPagination = true,
  ...props
}: TableProps<TData>) {
  const t = useT();
  const [sorting, setSorting] = useState<SortingState>(initialTableState?.sorting ?? []);
  const [filters, setFilters] = useState<FilterValue[]>([]);

  const {
    getHeaderGroups,
    getRowModel,
    previousPage,
    getCanPreviousPage,
    setPageSize,
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
      onTableStateChange?.({ sorting, filters });
    },
    debugTable: process.env.NODE_ENV === "development"
  });

  const tableState = getState();

  return (
    <div className="overflow-x-auto px-4 md:px-0 lg:overflow-x-visible">
      <div className="flex items-center justify-between">
        <When condition={!!columnFilters && columnFilters.length > 0}>
          <TableFilter
            filters={filters}
            columnFilters={columnFilters!}
            onChangeFilters={filters => {
              setFilters(filters);
              onTableStateChange?.({ sorting: tableState.sorting, filters: [...filters] });
            }}
          />
        </When>
        {children}
      </div>
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
          <If condition={isLoading}>
            <Then>
              <LoadingCell />
            </Then>
            <Else>
              {getRowModel().rows.length === 0 && (
                <tr className={classNames("rounded-lg", variant === "primary" ? "bg-white shadow" : "bg-neutral-50")}>
                  <td
                    className={classNames(
                      "first:rounded-tl-lg first:rounded-bl-lg last:rounded-br-lg last:rounded-tr-lg",
                      "text-light-subtitle-400 px-6 py-4"
                    )}
                    align={"center"}
                    colSpan={columns.length}
                  >
                    {t("No results")}
                  </td>
                </tr>
              )}
              {getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  className={classNames("rounded-lg", variant === "primary" ? "bg-white shadow" : "bg-neutral-50")}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell<TData> key={cell.id} cell={cell} />
                  ))}
                </tr>
              ))}
            </Else>
          </If>
        </tbody>
      </table>

      {!serverSideData && hasPagination && getPageCount() > 1 && (
        <Pagination
          getCanNextPage={getCanNextPage}
          getCanPreviousPage={getCanPreviousPage}
          getPageCount={getPageCount}
          nextPage={nextPage}
          pageIndex={tableState.pagination.pageIndex}
          previousPage={previousPage}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          defaultPageSize={initialTableState?.pagination?.pageSize || 5}
          containerClassName="mt-6"
          hasPageSizeSelector
        />
      )}
    </div>
  );
}

export default Table;

function TableCell<TData extends RowData>({ cell }: { cell: Cell<TData, unknown> }) {
  const cellContent = useMemo(
    () => flexRender(cell.column.columnDef.cell, cell.getContext()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cell.getValue()]
  );

  return (
    <td
      className={classNames(
        "first:rounded-tl-lg first:rounded-bl-lg last:rounded-br-lg last:rounded-tr-lg",
        "text-light-subtitle-400 px-6 py-4"
      )}
      //@ts-ignore
      align={cell.column.columnDef.meta?.align || "left"}
    >
      {cellContent}
    </td>
  );
}

function LoadingCell() {
  return (
    <tr>
      <td align="center" colSpan={100} className="py-4 px-6">
        <Lottie animationData={SpinnerLottie} className="mb-8 h-8 w-8" />
        <Text variant="text-light-subtitle-400">Loading results, load times might increase with more data</Text>
      </td>
    </tr>
  );
}
