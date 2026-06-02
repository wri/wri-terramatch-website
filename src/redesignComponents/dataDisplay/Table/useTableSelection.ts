import { useCallback, useMemo, useState } from "react";

import type { BaseRow } from "./tableUtils";

export const useTableSelection = <T extends BaseRow>(initialSelectable: boolean = false, sortedData?: T[]) => {
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string | number>>(new Set());

  const selectedRows = useMemo(() => {
    if (sortedData == null || sortedData.length === 0) {
      return [];
    }
    return sortedData.filter(row => selectedRowIds.has(row.id));
  }, [sortedData, selectedRowIds]);

  const handleRowSelected = useCallback((rowData: T, checked: boolean) => {
    setSelectedRowIds(current => {
      const newSet = new Set(current);
      if (checked) {
        newSet.add(rowData.id);
      } else {
        newSet.delete(rowData.id);
      }
      return newSet;
    });
  }, []);

  const onAllItemsSelected = useCallback((checked: boolean, dataByPage: T[]) => {
    if (checked) {
      setSelectedRowIds(new Set(dataByPage.map(row => row.id)));
    } else {
      setSelectedRowIds(new Set());
    }
  }, []);

  return {
    selectedRows,
    selectedRowIds,
    setSelectedRowIds,
    handleRowSelected,
    onAllItemsSelected,
    initialSelectable
  };
};
