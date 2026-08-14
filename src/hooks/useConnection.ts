import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { EnabledProp, IndexConnection, LoadFailureConnection } from "@/connections/util/apiConnectionFactory";
import { useValueChanged } from "@/hooks/useValueChanged";
import ApiSlice, { PendingError } from "@/store/apiSlice";
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
const NO_DATA: never[] = [];

export const useAllPages = <
  D,
  S extends IndexConnection<D> & Partial<LoadFailureConnection>,
  P extends PaginatedConnectionProps & EnabledProp
>(
  // & IndexConnection<D> needed to get TS to correctly infer D for the return type
  // https://stackoverflow.com/a/76295763/139109
  connection: Connection<S & IndexConnection<D>, P>,
  props: Omit<P, "pageNumber" | "pageSize">,
  // Bumping this value drops the accumulated pages and starts over from the first one. Needed when
  // the index cache has been pruned behind the hook's back and the props themselves haven't changed.
  resetKey?: unknown
): [boolean, D[], PendingError | undefined] => {
  const stableProps = useStableProps(props);
  const [data, setData] = useState<D[]>(NO_DATA);
  const [pageNumber, setPageNumber] = useState(1);

  // Declared before the effects that accumulate pages so that when the props change, the data from
  // the previous query is dropped before the first page of the new one arrives.
  useValueChanged(stableProps, () => {
    setData(NO_DATA);
    setPageNumber(1);
  });
  useValueChanged(resetKey, () => {
    setData(NO_DATA);
    setPageNumber(1);
  });

  const [dataStable, { data: pageData, indexTotal, loadFailure }] = useConnection(connection, {
    ...stableProps,
    pageNumber,
    pageSize: PAGE_SIZE
  } as P);

  useEffect(() => {
    if (pageData != null) setData(data => [...data, ...pageData]);
  }, [pageData]);
  useEffect(() => {
    // Every time the current page lands, walk forward until the last page has been consumed. This
    // depends on the page data rather than on the loaded flag toggling because a page that is
    // already in the store is delivered without a load in between.
    if (!dataStable || indexTotal == null) return;

    const maxPage = Math.ceil(indexTotal / PAGE_SIZE);
    setPageNumber(pageNumber => (pageNumber < maxPage ? pageNumber + 1 : pageNumber));
  }, [dataStable, indexTotal, pageData]);

  if (stableProps.enabled === false) return [true, NO_DATA, undefined];
  if (loadFailure != null) return [true, NO_DATA, loadFailure];
  if (indexTotal == null || !dataStable) return [false, data, undefined];
  if (pageNumber === 1 && indexTotal === 0) return [true, data, undefined];

  const allPagesLoaded = pageNumber === Math.ceil(indexTotal / PAGE_SIZE);
  return [allPagesLoaded, data, undefined];
};
