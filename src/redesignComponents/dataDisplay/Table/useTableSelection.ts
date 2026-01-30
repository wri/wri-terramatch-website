import { useCallback, useState } from "react";

import type { RowData } from "./tableUtils";

export const useTableSelection = (initialSelectable: boolean = false) => {
  const [selectedRows, setSelectedRows] = useState<RowData[]>(initialSelectable ? [] : []);

  const handleRowSelected = useCallback((rowData: RowData, checked: boolean) => {
    setSelectedRows(current => {
      const currentRows = current ?? [];
      if (checked) {
        return [...currentRows, rowData];
      }

      return currentRows.filter(item => item.id !== rowData.id);
    });
  }, []);

  const onAllItemsSelected = useCallback((checked: boolean, dataByPage: RowData[]) => {
    if (checked) {
      setSelectedRows(dataByPage);
    } else {
      setSelectedRows([]);
    }
  }, []);

  return {
    selectedRows,
    setSelectedRows,
    handleRowSelected,
    onAllItemsSelected
  };
};
