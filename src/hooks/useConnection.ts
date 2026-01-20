import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { IndexConnection } from "@/connections/util/apiConnectionFactory";
import { useValueChanged } from "@/hooks/useValueChanged";
import ApiSlice from "@/store/apiSlice";
import { AppStore } from "@/store/store";
import { Connected, Connection, OptionalProps, PaginatedConnectionProps } from "@/types/connection";

import { useStableProps } from "./useStableProps";

/**
 * Use a connection to efficiently depend on data in the Redux store.
 */
export function useConnection<TSelected, TProps extends OptionalProps, State>(
  connection: Connection<TSelected, TProps, State>,
  props: TProps | Record<any, never> = {}
): Connected<TSelected> {
  const stableProps = useStableProps(props);
  const selected = useSelector<AppStore, TSelected | undefined>(
    useCallback(
      store => {
        const { getState, selector, isLoaded, load } = connection;
        const state = (getState ?? ApiSlice.getState)(store) as State;
        const selected = selector(state, stableProps);
        const loadingDone = isLoaded == null || isLoaded(selected, stableProps);
        if (load != null) setTimeout(() => load(selected, stableProps));
        return loadingDone ? selected : undefined;
      },
      [connection, stableProps]
    )
  );

  return selected == null ? [false, {}] : [true, selected];
}

const PAGE_SIZE = 100;
export const useAllPages = <D, S extends IndexConnection<D>, P extends PaginatedConnectionProps>(
  // & IndexConnection<D> needed to get TS to correctly infer D for the return type
  // https://stackoverflow.com/a/76295763/139109
  connection: Connection<S & IndexConnection<D>, P>,
  props: Omit<P, "pageNumber" | "pageSize">
): [boolean, D[]] => {
  const [data, setData] = useState<D[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [dataStable, { data: pageData, indexTotal }] = useConnection(connection, {
    ...props,
    pageNumber,
    pageSize: PAGE_SIZE
  } as P);
  useEffect(() => {
    if (pageData != null) setData(data => [...data, ...pageData]);
  }, [pageData]);
  useValueChanged(dataStable, () => {
    if (dataStable && indexTotal != null) {
      setPageNumber(pageNumber => {
        const maxPage = Math.ceil(indexTotal / PAGE_SIZE);
        return pageNumber < maxPage ? pageNumber + 1 : pageNumber;
      });
    }
  });

  const allPagesLoaded = indexTotal == null ? false : dataStable && pageNumber === Math.ceil(indexTotal / PAGE_SIZE);
  return [allPagesLoaded, data];
};
