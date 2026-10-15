import { useCallback, useEffect, useState } from "react";

import type { SitePolygonsIndexQueryParams } from "@/generated/v3/researchService/researchServiceComponents";
import type { SortColumn } from "@/redesignComponents/dataDisplay/Table/tableUtils";

import {
  DEFAULT_POLYGON_TABLE_PAGE_SIZE,
  POLYGON_TABLE_SORT_FIELD_BY_COLUMN
} from "../components/polygonTableSort.constants";

type UsePolygonTablePagingParams = {
  /** The table returns to page 1 whenever this filter changes. */
  filter: Partial<SitePolygonsIndexQueryParams>;
};

export const usePolygonTablePaging = ({ filter }: UsePolygonTablePagingParams) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_POLYGON_TABLE_PAGE_SIZE);
  const [sortField, setSortField] = useState<string | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC" | undefined>(undefined);

  useEffect(() => {
    setPageNumber(1);
  }, [filter]);

  const handlePageSizeChange = useCallback((nextPageSize: number) => {
    setPageSize(nextPageSize);
    setPageNumber(1);
  }, []);

  const handleSortChange = useCallback((sortColumn: SortColumn) => {
    const apiField = POLYGON_TABLE_SORT_FIELD_BY_COLUMN[sortColumn.key];
    if (apiField == null || sortColumn.order === "") {
      setSortField(undefined);
      setSortDirection(undefined);
    } else {
      setSortField(apiField);
      setSortDirection(sortColumn.order === "desc" ? "DESC" : "ASC");
    }
    setPageNumber(1);
  }, []);

  return {
    pageNumber,
    pageSize,
    sortField,
    sortDirection,
    setPageNumber,
    handlePageSizeChange,
    handleSortChange
  };
};
