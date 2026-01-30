import { useMemo, useState } from "react";

import { calculatePaginationRange, DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE } from "./tableUtils";

export const useTablePagination = (currentPage: number, pageSize: number) => {
  const { startRange, endRange } = useMemo(
    () => calculatePaginationRange(currentPage, pageSize),
    [currentPage, pageSize]
  );

  return {
    startRange,
    endRange
  };
};

export const useTablePaginationState = (
  initialPage: number = DEFAULT_CURRENT_PAGE,
  initialPageSize: number = DEFAULT_PAGE_SIZE
) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  return {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize
  };
};
