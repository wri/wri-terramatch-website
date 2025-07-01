import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  DEFAULT_PAGE_SIZE,
  QueryParams,
  ServerSideTable,
  ServerSideTableProps
} from "@/components/elements/ServerSideTable/ServerSideTable";
import { IndexConnection } from "@/connections/util/apiConnectionFactory";
import { useConnection } from "@/hooks/useConnection";
import { Connection, PaginatedConnectionProps } from "@/types/connection";

type ConnectionTableProps<
  TData,
  TSelected extends IndexConnection<TData>,
  TProps extends PaginatedConnectionProps,
  State,
  TResult
> = Omit<ServerSideTableProps<unknown>, "meta" | "onQueryParamChange" | "data" | "isLoading" | "columns"> & {
  connection: Connection<TSelected, TProps, State>;
  connectionProps?: Omit<TProps, keyof PaginatedConnectionProps>;
  columns: ColumnDef<TResult>[];
  onFetch?: (connectedData: TSelected) => void;
  dataProcessor?: (data: TData[]) => TResult[];
};

export const queryParamsToPaginatedConnectionProps = (params: QueryParams): PaginatedConnectionProps => {
  const props: PaginatedConnectionProps = { pageNumber: params.page, pageSize: params.per_page };
  if (params.sort != null) {
    const startWithMinus = params.sort.startsWith("-");
    props.sortDirection = startWithMinus ? "DESC" : "ASC";
    props.sortField = startWithMinus ? params.sort.substring(1, params.sort.length) : params.sort;
  }
  return props;
};

export const usePaginatedConnectionProps = (initialPageSize = DEFAULT_PAGE_SIZE) => {
  const [paginatedConnectionProps, setPaginatedConnectionProps] = useState<PaginatedConnectionProps>({
    pageNumber: 1,
    pageSize: initialPageSize
  });
  const onQueryParamChange = useCallback((params: QueryParams) => {
    setPaginatedConnectionProps(queryParamsToPaginatedConnectionProps(params));
  }, []);
  return { paginatedConnectionProps, onQueryParamChange };
};

export function ConnectionTable<
  TData,
  TSelected extends IndexConnection<TData>,
  TProps extends PaginatedConnectionProps,
  State,
  TResult
>({
  connection,
  connectionProps,
  onFetch,
  dataProcessor,
  ...serverSideTableProps
}: ConnectionTableProps<TData, TSelected, TProps, State, TResult>) {
  const { paginatedConnectionProps, onQueryParamChange } = usePaginatedConnectionProps();
  const [connectionLoaded, connected] = useConnection(connection, {
    ...connectionProps,
    ...paginatedConnectionProps
  } as TProps);

  useEffect(() => {
    if (connectionLoaded) onFetch?.(connected as TSelected);
  }, [connected, connectionLoaded, onFetch]);

  const data = useMemo(() => {
    if (connected?.data == null) return [] as TResult[];
    if (dataProcessor == null) return connected.data as unknown as TResult[];
    return dataProcessor(connected.data);
  }, [connected.data, dataProcessor]);

  const indexTotal = connected?.indexTotal;
  return (
    <ServerSideTable
      meta={{
        last_page:
          indexTotal != null && paginatedConnectionProps.pageSize != null
            ? Math.ceil(indexTotal / paginatedConnectionProps.pageSize)
            : 1
      }}
      isLoading={!connectionLoaded}
      data={data}
      onQueryParamChange={onQueryParamChange}
      {...serverSideTableProps}
    />
  );
}
