import { useCallback, useEffect, useState } from "react";

import type { RowData } from "./tableUtils";

export const useTableSelection = (initialSelectable: boolean = false, sortedData?: RowData[]) => {
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string | number>>(new Set());
  const [selectedRows, setSelectedRows] = useState<RowData[]>([]);

  useEffect(() => {
    if (sortedData != null && sortedData.length > 0) {
      const syncedRows = sortedData.filter(row => selectedRowIds.has(row.id));
      console.log("useTableSelection - syncedRows:", syncedRows.length);
      setSelectedRows(syncedRows);
    } else {
      setSelectedRows([]);
    }
  }, [sortedData, selectedRowIds]);

  const handleRowSelected = useCallback((rowData: RowData, checked: boolean) => {
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

  const onAllItemsSelected = useCallback((checked: boolean, dataByPage: RowData[]) => {
    if (checked) {
      const newSet = new Set(dataByPage.map(row => row.id));
      setSelectedRowIds(newSet);
    } else {
      setSelectedRowIds(new Set());
    }
  }, []);

  return {
    selectedRows,
    setSelectedRows,
    handleRowSelected,
    onAllItemsSelected,
    initialSelectable
  };
};
