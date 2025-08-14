import { useEffect, useMemo, useState } from "react";

export interface UsePolygonsPaginationResult<T> {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  currentPageItems: T[];
}

export function usePolygonsPagination<T>(
  items: T[],
  pageSize: number,
  resetDeps: unknown[] = []
): UsePolygonsPaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(items.length / pageSize)), [items.length, pageSize]);

  const { startIndex, endIndex, currentPageItems } = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return {
      startIndex: start,
      endIndex: end,
      currentPageItems: items.slice(start, end)
    };
  }, [items, currentPage, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, resetDeps);

  return { currentPage, setCurrentPage, totalPages, startIndex, endIndex, currentPageItems };
}
