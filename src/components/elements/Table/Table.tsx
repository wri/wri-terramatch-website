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
import { DetailedHTMLProps, PropsWithChildren, TableHTMLAttributes, useEffect, useMemo, useState } from "react";
import { Else, If, Then, When } from "react-if";
import { twMerge as tw } from "tailwind-merge";

import SpinnerLottie from "@/assets/animations/spinner.json";
import TableFilter, { ColumnFilter, FilterValue } from "@/components/elements/TableFilters/TableFilter";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import Pagination from "@/components/extensive/Pagination";

import { TableVariant, VARIANT_TABLE_PRIMARY } from "./TableVariants";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    width?: string;
    align?: "left" | "center" | "right";
  }
}

export interface TableProps<TData>
  extends DetailedHTMLProps<TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>,
    PropsWithChildren {
  data: TData[];
  columns: ColumnDef<TData>[];
  columnFilters?: ColumnFilter[];
  serverSideData?: boolean;
  classNameWrapper?: string;
  initialTableState?: InitialTableState;
  variant?: TableVariant;
  hasPagination?: boolean;
  onTableStateChange?: (state: TableState) => void;
  isLoading?: boolean;
  invertSelectPagination?: boolean;
  visibleRows?: number;
  onRowClick?: (row: TData) => void;
  contentClassName?: string;
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
  classNameWrapper,
  serverSideData,
  onTableStateChange,
  initialTableState,
  variant = VARIANT_TABLE_PRIMARY,
  children,
  isLoading,
  invertSelectPagination = false,
  hasPagination = false,
  visibleRows = 10,
  onRowClick,
  contentClassName,
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
    getRowId: (row: any) => row.uuid,
    debugTable: process.env.NODE_ENV === "development"
  });

  const tableState = getState();

  useEffect(() => {
    setSorting(initialTableState?.sorting ?? []);
    setPageSize(visibleRows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, visibleRows]);

  return (
    <div className={classNames("w-full", variant.className, contentClassName)}>
      <div className={`overflow-x-auto px-4 md:px-0 ${classNameWrapper}`}>
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
        <div className={variant.tableWrapper}>
          <table {...props} className={classNames(className, "w-full", variant.table)}>
            <thead className={variant.thead}>
              {getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className={variant.trHeader}>
                  {headerGroup.headers.map(
                    header =>
                      !header.isPlaceholder && (
                        <th
                          key={header.id}
                          colSpan={header.colSpan}
                          onClick={header.column.getToggleSortingHandler()}
                          className={tw(
                            `text-bold-subtitle-500 whitespace-nowrap px-6 py-4 ${variant.thHeader}`,
                            classNames({ "cursor-pointer": header.column.getCanSort() })
                          )}
                          align="left"
                          style={{ width: header.column.columnDef.meta?.width }}
                        >
                          <div
                            className="flex items-center"
                            style={{
                              fontSize: "inherit",
                              fontWeight: "inherit",
                              color: "currentColor",
                              fontFamily: "inherit"
                            }}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                            <When condition={header.column.getCanSort()}>
                              <Icon
                                name={
                                  { asc: IconNames.SORT_UP, desc: IconNames.SORT_DOWN }[
                                    header.column.getIsSorted() as string
                                  ] ?? IconNames.SORT
                                }
                                className="ml-2 inline h-4 w-3.5 min-w-3.5 fill-neutral-900 lg:min-w-4"
                                width={11}
                                height={14}
                              />
                            </When>
                          </div>
                        </th>
                      )
                  )}
                </tr>
              ))}
            </thead>
            <tbody className={variant.tBody}>
              <If condition={isLoading}>
                <Then>
                  <LoadingCell />
                </Then>
                <Else>
                  {getRowModel().rows.length === 0 && (
                    <tr className={variant.trHeader}>
                      <td
                        className={classNames(`text-normal-subtitle-400 px-6 py-4 ${variant.tdBody}`)}
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
                      className={classNames("rounded-lg", variant.trBody)}
                      onClick={() => onRowClick?.(row.original)}
                    >
                      {row.getVisibleCells().map(cell => (
                        <TableCell<TData> key={cell.id} cell={cell} variant={variant} />
                      ))}
                    </tr>
                  ))}
                </Else>
              </If>
            </tbody>
          </table>
        </div>
      </div>
      {hasPagination && (
        <Pagination
          variant={variant.paginationVariant}
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
          invertSelect={invertSelectPagination}
        />
      )}
    </div>
  );
}

export default Table;

function TableCell<TData extends RowData>({ cell, variant }: { cell: Cell<TData, unknown>; variant: TableVariant }) {
  const cellContent = useMemo(
    () => flexRender(cell.column.columnDef.cell, cell.getContext()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cell.getValue()]
  );

  return (
    <td
      className={classNames("text-normal-subtitle-400", variant.tdBody)}
      //@ts-ignore
      align={cell.column.columnDef.meta?.align || "left"}
    >
      {cellContent}
    </td>
  );
}

function LoadingCell() {
  const t = useT();
  return (
    <tr>
      <td align="center" colSpan={100} className="px-6 py-4">
        <Lottie animationData={SpinnerLottie} className="mb-8 h-8 w-8" />
        <Text variant="text-normal-subtitle-400">{t("Loading results, load times might increase with more data")}</Text>
      </td>
    </tr>
  );
}
