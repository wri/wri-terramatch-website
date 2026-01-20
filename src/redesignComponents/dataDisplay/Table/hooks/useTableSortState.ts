import { RefObject, useEffect, useState } from "react";

import { ColumnOption, SortingState } from "../Table";

interface UseTableSortStateProps {
  columns: ColumnOption[];
  selectable: boolean;
  data: any[];
  tableWrapperRef: RefObject<HTMLDivElement>;
  onSortColumn?: (sorting: SortingState) => void;
}

/**
 * Custom hook to manage table sorting state and column configuration
 * Handles active sorts Map and sets data-column-key attributes on headers
 */
export const useTableSortState = ({
  columns,
  selectable,
  data,
  tableWrapperRef,
  onSortColumn
}: UseTableSortStateProps) => {
  const [activeSorts, setActiveSorts] = useState<Map<string, string>>(new Map());

  const handleSortColumn = (sorting: SortingState) => {
    setActiveSorts(prev => {
      const newSorts = new Map(prev);
      newSorts.set(sorting.key, sorting.order);
      return newSorts;
    });

    onSortColumn?.(sorting);
  };

  // Add data-column-key attributes to headers after render
  useEffect(() => {
    if (tableWrapperRef.current) {
      const headers = tableWrapperRef.current.querySelectorAll(".chakra-table__columnHeader");
      headers.forEach((header, index) => {
        const columnIndex = selectable ? index - 1 : index;
        if (columnIndex >= 0 && columnIndex < columns.length) {
          header.setAttribute("data-column-key", columns[columnIndex].key);
        }
      });
    }
  }, [columns, selectable, data, tableWrapperRef]);

  return {
    activeSorts,
    handleSortColumn
  };
};
