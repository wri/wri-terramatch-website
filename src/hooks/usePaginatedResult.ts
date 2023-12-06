import { useMemo } from "react";
import { InfiniteData } from "react-query";

/**
 * To compile useInfiniteQuery data into a flat array
 * @param data useInfiniteQuery data
 * @returns flat array
 */
export function usePaginatedResult<T extends any>(data?: InfiniteData<any>) {
  return useMemo(() => {
    let records: any = [];
    data?.pages.forEach(page => {
      records = [...records, ...(page.data || [])];
    });
    return records;
  }, [data?.pages]) as T[];
}
