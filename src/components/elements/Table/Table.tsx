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
import { DetailedHTMLProps, PropsWithChildren, TableHTMLAttributes, useEffect, useMemo, useRef, useState } from "react";
import { Else, If, Then, When } from "react-if";
import { twMerge as tw } from "tailwind-merge";

import SpinnerLottie from "@/assets/animations/spinner.json";
import TableFilter, { ColumnFilter, FilterValue } from "@/components/elements/TableFilters/TableFilter";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import Pagination from "@/components/extensive/Pagination";

import { TableVariant, VARIANT_TABLE_PRIMARY } from "./TableVariants";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue = unknown> {
    sticky?: boolean;
    left?: string | number;
    align?: "left" | "center" | "right";
    data?: TData | TValue;
    width?: string;
    className?: string;
    style?: React.CSSProperties;
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
  resetOnDataChange?: boolean;
  onTableStateChange?: (state: TableState) => void;
  isLoading?: boolean;
  invertSelectPagination?: boolean;
  visibleRows?: number;
  onRowClick?: (row: TData) => void;
  contentClassName?: string;
  classNameTableWrapper?: string;
  galleryType?: string;
  classPagination?: string;
  alwaysShowPagination?: boolean;
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
  classNameTableWrapper,
  isLoading,
  invertSelectPagination = false,
  hasPagination = false,
  visibleRows = 10,
  resetOnDataChange = true, // maintains default behavior
  onRowClick,
  contentClassName,
  galleryType,
  classPagination,
  alwaysShowPagination = false,
  ...props
}: TableProps<TData>) {
  const t = useT();
  const [sorting, setSorting] = useState<SortingState>(initialTableState?.sorting ?? []);
  const [filters, setFilters] = useState<FilterValue[]>([]);

  const spanRefs = useRef<HTMLSpanElement[]>([]);
  const iconRefs = useRef<HTMLSpanElement[]>([]);

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

    // Uncomment for local debug testing fo the table.
    // debugTable: process.env.NODE_ENV === "development",

    autoResetAll: resetOnDataChange
  });

  const tableState = getState();
  const defaultPageSize = galleryType === "treeSpeciesPD" ? 8 : initialTableState?.pagination?.pageSize || 5;
  const rowCount = Object.keys(getRowModel().rowsById).length;
  const verifyPageSize = alwaysShowPagination ? alwaysShowPagination : rowCount > defaultPageSize;

  useEffect(() => {
    setSorting(initialTableState?.sorting ?? []);
    setPageSize(visibleRows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleRows]);

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
        <div className={classNames(variant.tableWrapper, classNameTableWrapper)}>
          <table {...props} className={classNames(className, "w-full", variant.table)}>
            <thead className={variant.thead}>
              {getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className={variant.trHeader}>
                  {headerGroup.headers.map(header => {
                    if (!header.isPlaceholder) {
                      const isSticky = header.column.columnDef.meta?.sticky;

                      return (
                        <th
                          key={header.id}
                          colSpan={header.colSpan}
                          onClick={header.column.getToggleSortingHandler()}
                          className={tw(
                            `text-bold-subtitle-500 whitespace-nowrap px-6 py-4 ${variant.thHeader}`,

                            classNames({ "cursor-pointer": header.column.getCanSort() }),
                            classNames({ [variant.thHeaderSort || ""]: !header.column.getCanSort() }),
                            classNames({ [variant.thHeaderSticky || ""]: isSticky }),
                            classNames({
                              [header.column.columnDef.meta?.className || ""]: header.column.columnDef.meta?.className
                            })
                          )}
                          align="left"
                          style={
                            header.column.columnDef.meta?.style
                              ? header.column.columnDef.meta?.style
                              : { width: header.column.columnDef.meta?.width }
                          }
                        >
                          <div
                            className="inline w-full max-w-full"
                            style={{
                              fontSize: "inherit",
                              fontWeight: "inherit",
                              color: "currentColor",
                              fontFamily: "inherit"
                            }}
                          >
                            <div
                              className="font-inherit relative w-full max-w-full"
                              style={{
                                paddingRight: `${iconRefs.current[header.index]?.getBoundingClientRect().width}px`
                              }}
                            >
                              <span
                                className="font-inherit "
                                ref={el => {
                                  if (
                                    el &&
                                    !spanRefs.current.includes(el) &&
                                    flexRender(header.column.columnDef.header, header.getContext())
                                  ) {
                                    spanRefs.current.push(el);
                                  }
                                }}
                              >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                              </span>
                              <When condition={header.column.getCanSort()}>
                                <span
                                  ref={el => {
                                    if (el && !iconRefs.current.includes(el)) {
                                      iconRefs.current.push(el);
                                    }
                                  }}
                                  className="absolute left-[calc(100%+10px)] top-1/2 z-auto -translate-y-1/2 transform"
                                  style={{ left: `${spanRefs.current[header.index]?.getBoundingClientRect().width}px` }}
                                >
                                  <Icon
                                    name={
                                      { asc: IconNames.SORT_UP, desc: IconNames.SORT_DOWN }[
                                        header.column.getIsSorted() as string
                                      ] ?? IconNames.SORT
                                    }
                                    className={classNames(
                                      "ml-2 inline h-4 w-3.5 min-w-[14px] fill-neutral-900 lg:min-w-[16px]",
                                      variant.iconSort
                                    )}
                                    width={11}
                                    height={14}
                                  />
                                </span>
                              </When>
                            </div>
                          </div>
                        </th>
                      );
                    }
                    return null;
                  })}
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
          defaultPageSize={defaultPageSize}
          containerClassName={classNames("mt-6", classPagination)}
          hasPageSizeSelector={verifyPageSize}
          invertSelect={invertSelectPagination}
          galleryType={galleryType}
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

  const isSticky = cell.column.columnDef.meta?.sticky;

  return (
    <td
      className={classNames("text-normal-subtitle-400", variant.tdBody, { [variant.tdBodySticky || ""]: isSticky })}
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
