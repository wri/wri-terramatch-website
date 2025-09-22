import { RowData, SortingState } from "@tanstack/react-table";
import { useEffect, useState } from "react";

import Table, { TableProps } from "@/components/elements/Table/Table";
import { FilterValue } from "@/components/elements/TableFilters/TableFilter";
import Pagination from "@/components/extensive/Pagination";
import { VARIANT_PAGINATION_DASHBOARD } from "@/components/extensive/Pagination/PaginationVariant";
import { getQueryParams } from "@/helpers/api";
import { useDebounce } from "@/hooks/useDebounce";

import { VARIANT_TABLE_BORDER_ALL } from "../Table/TableVariants";

export interface ServerSideTableState {
  page: number;
  pageSize: number;
  filters: FilterValue[];
  sorting: SortingState;
}

export interface TableMetaInfo {
  last_page: number;
}

export interface ServerSideTableProps<TData> extends Omit<TableProps<TData>, "onTableStateChange"> {
  meta: TableMetaInfo;
  onTableStateChange?: (state: ServerSideTableState) => void;
  onQueryParamChange?: (queryParams: QueryParams) => void;
  defaultPageSize?: number;
  alwaysShowPagination?: boolean;
}

export type QueryParams = {
  sort?: string;
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  update_request_status?: string;
};

export const DEFAULT_PAGE_SIZE = 5;

export function ServerSideTable<TData extends RowData>({
  onTableStateChange,
  onQueryParamChange,
  variant,
  defaultPageSize = DEFAULT_PAGE_SIZE,
  children,
  alwaysShowPagination = false,
  ...props
}: ServerSideTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>(props.initialTableState?.sorting ?? []);
  const [filters, setFilter] = useState<FilterValue[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const onQueryParamChangeDebounced = useDebounce(args => onQueryParamChange?.(args), 500);

  useEffect(() => {
    onQueryParamChangeDebounced?.(getQueryParams({ page, pageSize, filters, sorting }));
    onTableStateChange?.({ page, pageSize, filters, sorting });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, filters, sorting, onQueryParamChange, onTableStateChange]);

  return (
    <div className="mobile:overflow-auto">
      <Table<TData>
        {...props}
        serverSideData
        onTableStateChange={state => {
          setSorting(state.sorting);
          setFilter(state.filters);
        }}
        classNameWrapper="!overflow-visible"
        variant={variant ? variant : VARIANT_TABLE_BORDER_ALL}
        alwaysShowPagination={alwaysShowPagination}
      >
        {children}
      </Table>
      {(props.meta.last_page > 1 || alwaysShowPagination) && (
        <div className="relative z-20 pt-4">
          <Pagination
            variant={VARIANT_PAGINATION_DASHBOARD}
            getCanNextPage={() => page < props.meta.last_page}
            getCanPreviousPage={() => page > 1}
            getPageCount={() => props.meta.last_page || 1}
            nextPage={() => setPage(page => page + 1)}
            pageIndex={page - 1}
            previousPage={() => setPage(page => page - 1)}
            setPageIndex={index => setPage(index + 1)}
            hasPageSizeSelector
            defaultPageSize={pageSize}
            setPageSize={size => {
              setPage(1);
              setPageSize(size);
            }}
            invertSelect
          />
        </div>
      )}
    </div>
  );
}
