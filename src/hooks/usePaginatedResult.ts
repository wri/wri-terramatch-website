import { useMemo } from "react";
import { InfiniteData } from "react-query";

export function usePaginatedResult<T extends any>(data?: InfiniteData<any>) {
  return useMemo(() => {
    let records: any = [];
    data?.pages.forEach(page => {
      records = [...records, ...(page.data || [])];
    });
    return records;
  }, [data?.pages]) as T[];
}
