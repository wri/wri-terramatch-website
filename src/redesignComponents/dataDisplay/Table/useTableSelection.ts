import { useCallback, useEffect, useState } from "react";

import type { BaseRow } from "./tableUtils";

export const useTableSelection = <T extends BaseRow>(initialSelectable: boolean = false, sortedData?: T[]) => {
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string | number>>(new Set());
  const [selectedRows, setSelectedRows] = useState<T[]>([]);

  useEffect(() => {
    if (sortedData != null && sortedData.length > 0) {
      const syncedRows = sortedData.filter(row => selectedRowIds.has(row.id));
      setSelectedRows(syncedRows);
    } else {
      setSelectedRows([]);
    }
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
    setSelectedRows,
    setSelectedRowIds,
    handleRowSelected,
    onAllItemsSelected,
    initialSelectable
  };
};
