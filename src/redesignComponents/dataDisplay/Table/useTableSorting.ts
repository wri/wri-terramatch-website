import { useMemo, useState } from "react";

import { type BaseRow, type SortColumn, sortData } from "./tableUtils";

export const useTableSorting = <T extends BaseRow>(data: T[]) => {
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
