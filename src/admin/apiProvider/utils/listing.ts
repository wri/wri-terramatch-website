import { GetListParams, GetListResult } from "react-admin";

interface ListQueryParams extends Record<string, unknown> {
  search?: string;
  filter?: string;
  sort?: string;
  per_page?: number;
  page?: number;
}

const getFilterKey = (original: string, replace?: { key: string; replaceWith: string }) => {
  if (!replace) {
    return original;
  }

  return replace.replaceWith;
};

export const raListParamsToQueryParams = (
  params: GetListParams,
  sortableList?: string[],
  filterReplaceList: { key: string; replaceWith: string }[] = [],
  sortReplaceList: { key: string; replaceWith: string }[] = []
) => {
  const queryParams: ListQueryParams = {
    per_page: params.pagination.perPage,
    page: params.pagination.page
  };

  if (params.sort.field) {
    params.sort.field = getFilterKey(
      params.sort.field,
      sortReplaceList.find(item => item.key === params.sort.field)
    );
  }

  Object.entries(params.filter).forEach(([k, v]) => {
    if (k === "search" || k === "q") return;
    queryParams[
      `filter[${getFilterKey(
        k,
        filterReplaceList.find(item => item.key === k)
      )}]`
    ] = v;
  });

  const search = params.filter.search || params.filter.q;
  if (search) queryParams.search = search;

  if (sortableList && sortableList.includes(params.sort.field)) {
    queryParams.sort = `${params.sort.order === "DESC" ? "-" : ""}${params.sort.field}`;
  } else if (!sortableList) {
    queryParams.sort = `${params.sort.order === "DESC" ? "-" : ""}${params.sort.field}`;
  }

  return queryParams as any;
};

interface ApiListResponse {
  data?: { [index: string]: any; uuid?: string }[];
  meta?: any;
}

export const apiListResponseToRAListResult = (response: ApiListResponse): GetListResult => {
  return {
    data: response.data?.map(item => ({ ...item, id: item.uuid })) || [],
    total: response.meta?.total as number,
    pageInfo: {
      //@ts-ignore
      hasNextPage: response.meta?.last_page > response.meta?.current_page,
      //@ts-ignore
      hasPreviousPage: response.meta?.current_page > 1
    }
  };
};
