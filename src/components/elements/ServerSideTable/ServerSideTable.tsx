import { RowData, SortingState } from "@tanstack/react-table";
import { useEffect, useState } from "react";

import Table, { TableProps } from "@/components/elements/Table/Table";
import { FilterValue } from "@/components/elements/TableFilters/TableFilter";
import Pagination from "@/components/extensive/Pagination";
import { getQueryParams } from "@/helpers/api";
import { useDebounce } from "@/hooks/useDebounce";

import { VARIANT_TABLE_SECONDARY_WHITE } from "../Table/TableVariants";

export interface ServerSideTableState {
  page: number;
  pageSize: number;
  filters: FilterValue[];
  sorting: SortingState;
}

export interface ServerSideTableProps<TData> extends Omit<TableProps<TData>, "onTableStateChange"> {
  meta: any;
  onTableStateChange?: (state: ServerSideTableState) => void;
  onQueryParamChange?: (queryParams: any) => void;
  treeSpeciesShow?: boolean;
}

export function ServerSideTable<TData extends RowData>({
  onTableStateChange,
  onQueryParamChange,
  children,
  ...props
}: ServerSideTableProps<TData>) {
  const defaultPageSize = 5;

  const [sorting, setSorting] = useState<SortingState>([]);
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
    <>
      <Table<TData>
        {...props}
        serverSideData
        onTableStateChange={state => {
          setSorting(state.sorting);
          setFilter(state.filters);
        }}
        variant={VARIANT_TABLE_SECONDARY_WHITE}
      >
        {children}
      </Table>
      {props.meta?.last_page > 1 && (
        <Pagination
          getCanNextPage={() => page < props.meta?.last_page!}
          getCanPreviousPage={() => page > 1}
          getPageCount={() => props.meta?.last_page || 1}
          nextPage={() => setPage(page => page + 1)}
          pageIndex={page - 1}
          previousPage={() => setPage(page => page - 1)}
          setPageIndex={index => setPage(index + 1)}
          hasPageSizeSelector
          defaultPageSize={defaultPageSize}
          setPageSize={size => {
            setPage(1);
            setPageSize(size);
          }}
          treeSpeciesShow={props.treeSpeciesShow}
        />
      )}
    </>
  );
}
