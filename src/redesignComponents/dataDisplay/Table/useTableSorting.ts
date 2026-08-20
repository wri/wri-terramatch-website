import { useMemo, useState } from "react";

import { type BaseRow, type SortColumn, sortData } from "./tableUtils";

export const useTableSorting = <T extends BaseRow>(
  data: T[],
  getSortValue?: (row: T, key: string) => unknown,
  customKeys?: ReadonlySet<string>
) => {
  const [sortColumn, setSortColumn] = useState<SortColumn>({
    key: "",
    order: ""
  });

  const sortedData = useMemo(() => {
    return sortData(data, sortColumn, getSortValue, customKeys);
  }, [customKeys, data, getSortValue, sortColumn]);

  return {
    sortColumn,
    setSortColumn,
    sortedData
  };
};
