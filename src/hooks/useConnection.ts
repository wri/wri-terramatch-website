import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";

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

/**
 * Loads every page of a paginated index connection. Follows the same accumulation pattern as
 * `useAllMedias`: pages are stored by number (avoids duplicate appends) and page advancement is
 * guarded so a cached page cannot advance twice.
 *
 * `resetKey` drops accumulated pages when the index was pruned without the filter props changing
 * (e.g. reports index bulk actions).
 */
export const useAllPages = <
  D,
  S extends IndexConnection<D> & Partial<LoadFailureConnection>,
  P extends PaginatedConnectionProps & EnabledProp
>(
  // & IndexConnection<D> needed to get TS to correctly infer D for the return type
  // https://stackoverflow.com/a/76295763/139109
  connection: Connection<S & IndexConnection<D>, P>,
  props: Omit<P, "pageNumber" | "pageSize">
): [boolean, D[], PendingError | undefined] => {
  const stableProps = useStableProps(props);
  const [pageNumber, setPageNumber] = useState(1);
  const [pagesByNumber, setPagesByNumber] = useState<Record<number, D[]>>({});
  const advancedFromPageRef = useRef<number | null>(null);

  const resetPagination = useCallback(() => {
    setPageNumber(1);
    setPagesByNumber({});
    advancedFromPageRef.current = null;
  }, []);

  // Declared before the effects that accumulate pages so stale pages are dropped before the first
  // page of the new query arrives.
  useValueChanged(stableProps, resetPagination);

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
    // Walk forward until the last page has been consumed. Depends on page data rather than only
    // the loaded flag because a page already in the store is delivered without a load in between.
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

type InfinitePagesState<D, P> = {
  props: P;
  pageCount: number;
  // The most recently loaded data for each page, displayed while that page is being refetched.
  lastDataByPage: Record<number, D[]>;
  // The index total as of the most recently loaded page
  total?: number;
};

/**
 * Loads a paginated index connection one page at a time, for use with infinite scroll. The first
 * page is loaded immediately, and each call to `loadMore` requests the next page once the last one
 * has arrived. Accumulated pages are dropped whenever the props change.
 *
 * Every page that has been loaded is selected from the store, so if the cache for the connection's
 * resource is pruned, all of the loaded pages are refetched. The previously loaded data for a page
 * continues to be delivered until its refetch completes.
 */
export const useInfinitePages = <
  D,
  S extends IndexConnection<D> & Partial<LoadFailureConnection>,
  P extends PaginatedConnectionProps & EnabledProp
>(
  // & IndexConnection<D> needed to get TS to correctly infer D for the return type
  // https://stackoverflow.com/a/76295763/139109
  connection: Connection<S & IndexConnection<D>, P>,
  props: Omit<P, "pageNumber" | "pageSize">,
  pageSize = PAGE_SIZE
) => {
  const stableProps = useStableProps(props);
  const [state, setState] = useState<InfinitePagesState<D, typeof stableProps>>(() => ({
    props: stableProps,
    pageCount: 1,
    lastDataByPage: {}
  }));

  // Reset during render (instead of in an effect) so that a request is never made for a stale
  // page number with the new props.
  let current = state;
  if (state.props !== stableProps) {
    current = { props: stableProps, pageCount: 1, lastDataByPage: {} };
    setState(current);
  }
  const { pageCount, lastDataByPage, total } = current;

  const pageProps = useMemo(
    () => Array.from({ length: pageCount }, (_, index) => ({ ...stableProps, pageNumber: index + 1, pageSize } as P)),
    [pageCount, pageSize, stableProps]
  );

  const { getState, selector, isLoaded, load } = connection;
  // The connection selector is cached per set of props, so each page's selection is stable until
  // the store data for that page changes.
  const selectedPages = useSelector((store: AppStore) => {
    const state = (getState ?? ApiSlice.getState)(store);
    return pageProps.map(props => selector(state, props));
  }, shallowEqual);

  // Each page's data, or undefined if it hasn't (re)loaded yet.
  const loadedPages = useMemo(
    () =>
      selectedPages.map((selected, index) =>
        isLoaded == null || isLoaded(selected, pageProps[index]) ? selected : undefined
      ),
    [isLoaded, pageProps, selectedPages]
  );

  useEffect(() => {
    if (load == null) return;
    // load() only issues a request for a page that isn't loaded and isn't already in progress.
    selectedPages.forEach((selected, index) => load(selected, pageProps[index]));
  }, [load, pageProps, selectedPages]);

  useEffect(() => {
    setState(current => {
      if (current.props !== stableProps) return current;

      let next = current;
      loadedPages.forEach((selected, index) => {
        const pageNumber = index + 1;
        if (selected?.data == null || next.lastDataByPage[pageNumber] === selected.data) return;
        next = {
          ...next,
          lastDataByPage: { ...next.lastDataByPage, [pageNumber]: selected.data },
          total: selected.indexTotal ?? next.total
        };
      });
      return next;
    });
  }, [loadedPages, stableProps]);

  const pages = useMemo(
    () => loadedPages.map((selected, index) => selected?.data ?? lastDataByPage[index + 1]),
    [lastDataByPage, loadedPages]
  );
  const data = useMemo(() => pages.flatMap(page => page ?? []), [pages]);
  const loadFailure = loadedPages.find(selected => selected?.loadFailure != null)?.loadFailure;

  const lastPageLoaded = pages[pageCount - 1] != null;
  const hasMore = total != null && pageCount * pageSize < total;
  const loadMore = useCallback(() => {
    if (!hasMore || !lastPageLoaded) return;
    setState(current => (current.props !== stableProps ? current : { ...current, pageCount: pageCount + 1 }));
  }, [hasMore, lastPageLoaded, pageCount, stableProps]);

  const disabled = stableProps.enabled === false;
  return {
    loaded: disabled || loadFailure != null || pages[0] != null,
    data: disabled || loadFailure != null ? NO_DATA : data,
    loadFailure,
    hasMore: !disabled && loadFailure == null && hasMore,
    loadingMore: pageCount > 1 && !lastPageLoaded,
    loadMore
  };
};
