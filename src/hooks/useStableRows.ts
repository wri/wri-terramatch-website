import { useRef } from "react";

type CachedRow<Result> = { inputs: unknown[]; value: Result };

const sameInputs = (a: unknown[], b: unknown[]) =>
  a.length === b.length && a.every((value, index) => value === b[index]);

/**
 * Maps items to rows, but hands back the previous row object for any item whose inputs did not change.
 * Keeps memoized row components from re-rendering when a batch of unrelated rows is appended.
 */
export const useStableRows = <Item, Result>(
  items: Item[],
  getKey: (item: Item) => string,
  getInputs: (item: Item) => unknown[],
  build: (item: Item) => Result
): Result[] => {
  const cacheRef = useRef(new Map<string, CachedRow<Result>>());
  const nextCache = new Map<string, CachedRow<Result>>();

  const rows = items.map(item => {
    const key = getKey(item);
    const inputs = getInputs(item);
    const cached = cacheRef.current.get(key);
    const row = cached != null && sameInputs(cached.inputs, inputs) ? cached : { inputs, value: build(item) };
    nextCache.set(key, row);
    return row.value;
  });

  cacheRef.current = nextCache;
  return rows;
};
