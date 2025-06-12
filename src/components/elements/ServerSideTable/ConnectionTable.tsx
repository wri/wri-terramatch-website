import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useEffect, useState } from "react";

import {
  DEFAULT_PAGE_SIZE,
  QueryParams,
  ServerSideTable,
  ServerSideTableProps
} from "@/components/elements/ServerSideTable/ServerSideTable";
import { useConnection } from "@/hooks/useConnection";
import { Connection, PaginatedConnectionProps } from "@/types/connection";

type ConnectionTableProps<TData, TSelected, TProps extends PaginatedConnectionProps, State> = Omit<
  ServerSideTableProps<unknown>,
  "meta" | "onQueryParamChange" | "data" | "isLoading" | "columns"
> & {
  connection: Connection<TSelected, TProps, State>;
  connectionProps?: Omit<TProps, keyof PaginatedConnectionProps>;
  dataProp: keyof TSelected;
  totalProp: keyof TSelected;
  columns: ColumnDef<TData>[];
  onFetch?: (connectedData: TSelected) => void;
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

export function ConnectionTable<TData, TSelected, TProps extends PaginatedConnectionProps, State>({
  connection,
  connectionProps,
  dataProp,
  totalProp,
  onFetch,
  ...serverSideTableProps
}: ConnectionTableProps<TData, TSelected, TProps, State>) {
  const { paginatedConnectionProps, onQueryParamChange } = usePaginatedConnectionProps();
  const [connectionLoaded, connected] = useConnection(connection, {
    ...connectionProps,
    ...paginatedConnectionProps
  } as TProps);

  useEffect(() => {
    if (connectionLoaded) onFetch?.(connected as TSelected);
  }, [connected, connectionLoaded, onFetch]);

  const indexTotal = connected?.[totalProp] as number | undefined;
  return (
    <ServerSideTable
      meta={{
        last_page:
          indexTotal != null && paginatedConnectionProps.pageSize != null
            ? Math.ceil(indexTotal / paginatedConnectionProps.pageSize)
            : 1
      }}
      isLoading={!connectionLoaded}
      data={(connected?.[dataProp] ?? []) as TData[]}
      onQueryParamChange={onQueryParamChange}
      {...serverSideTableProps}
    />
  );
}
