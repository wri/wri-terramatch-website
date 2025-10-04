import { SortingState } from "@tanstack/react-table";

import { FilterValue } from "@/components/elements/TableFilters/TableFilter";
import { tableSortingStateToQueryParamsSort } from "@/utils/dataTransformation";

type getQueryParamsOpts = { page: number; pageSize: number; filters: FilterValue[]; sorting: SortingState };

export type QueryParamsResult = {
  page: number;
  per_page: number;
  sort?: string;
  search?: string;
} & Record<string, string | number | boolean | undefined>;

export const getQueryParams = ({ page, pageSize, filters, sorting }: getQueryParamsOpts): QueryParamsResult => {
  let queryParams: QueryParamsResult = { page, per_page: pageSize };

  filters?.forEach?.(filter => {
    if (filter.filter.type === "dropDown") {
      queryParams[filter.filter.accessorKey] = filter.value;
    } else if (filter.filter.type === "search") {
      queryParams.search = filter.value;
    }
  });

  const sort = tableSortingStateToQueryParamsSort(sorting);
  if (sort) {
    queryParams.sort = sort;
  }

  return queryParams;
};
