import { useMemo, useState } from "react";

import type { RowData } from "./tableUtils";
import { type SortColumn, sortData } from "./tableUtils";

export const useTableSorting = (data: RowData[]) => {
  const [sortColumn, setSortColumn] = useState<SortColumn>({
    key: "",
    order: ""
  });

  const sortedData = useMemo(() => {
    return sortData(data, sortColumn);
  }, [data, sortColumn]);

  return {
    sortColumn,
    setSortColumn,
    sortedData
  };
};
