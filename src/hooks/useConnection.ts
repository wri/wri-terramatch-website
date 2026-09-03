import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { EnabledProp, IndexConnection, LoadFailureConnection } from "@/connections/util/apiConnectionFactory";
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

/**
 * Loads every page of a paginated index connection. Pages are stored by page number to avoid
 * duplicate appends, and page advancement is guarded so a cached page cannot advance twice.
 * `resetKey` can be used to discard accumulated pages after the underlying index is pruned.
 */
export const useAllPages = <
  D,
  S extends IndexConnection<D> & Partial<LoadFailureConnection>,
  P extends PaginatedConnectionProps & EnabledProp
>(
  // & IndexConnection<D> needed to get TS to correctly infer D for the return type
  // https://stackoverflow.com/a/76295763/139109
  connection: Connection<S & IndexConnection<D>, P>,
  props: Omit<P, "pageNumber" | "pageSize">,
  resetKey?: unknown
): [boolean, D[], PendingError | undefined] => {
  const stableProps = useStableProps(props);
  const [pageNumber, setPageNumber] = useState(1);
  const [pagesByNumber, setPagesByNumber] = useState<Record<number, D[]>>({});
  const advancedFromPageRef = useRef<number | null>(null);
  const [paginationIdentity, setPaginationIdentity] = useState({ props: stableProps, resetKey });

  // Reset during render so a filter change cannot paint rows from the previous request.
  if (stableProps !== paginationIdentity.props || resetKey !== paginationIdentity.resetKey) {
    setPaginationIdentity({ props: stableProps, resetKey });
    setPageNumber(1);
    setPagesByNumber({});
    advancedFromPageRef.current = null;
  }

  const [pageLoaded, { data: pageData, indexTotal, loadFailure }] = useConnection(connection, {
    ...stableProps,
    pageNumber,
    pageSize: PAGE_SIZE
  } as P);

  useEffect(() => {
    if (pageData == null) return;
    setPagesByNumber(current => (pageNumber === 1 ? { 1: pageData } : { ...current, [pageNumber]: pageData }));
  }, [pageData, pageNumber]);

  useEffect(() => {
    // A cached page can be delivered without a load transition, so advance from the page data.
    if (!pageLoaded || indexTotal == null || pageData == null) return;

    const maxPage = Math.ceil(indexTotal / PAGE_SIZE);
    if (pageNumber >= maxPage || advancedFromPageRef.current === pageNumber) return;

    advancedFromPageRef.current = pageNumber;
    setPageNumber(currentPage => currentPage + 1);
  }, [pageLoaded, indexTotal, pageNumber, pageData]);

  const data = useMemo(
    () =>
      Object.keys(pagesByNumber)
        .map(Number)
        .sort((a, b) => a - b)
        .flatMap(page => pagesByNumber[page] ?? []),
    [pagesByNumber]
  );

  if (stableProps.enabled === false) return [true, NO_DATA, undefined];
  if (loadFailure != null) return [true, NO_DATA, loadFailure];
  if (indexTotal == null || !pageLoaded) return [false, data, undefined];
  if (pageNumber === 1 && indexTotal === 0) return [true, data, undefined];

  const allPagesLoaded = pageNumber === Math.ceil(indexTotal / PAGE_SIZE);
  return [allPagesLoaded, data, undefined];
};
