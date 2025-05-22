import { isFetchingSelector, fetchFailedSelector } from "../utils";
import { GetTotalSectionHeadersQueryParams, GetTotalSectionHeadersVariables } from "./dashboardServiceComponents";

export const getTotalSectionHeadersIsFetching = (variables: Omit<GetTotalSectionHeadersVariables, "body">) =>
  isFetchingSelector<GetTotalSectionHeadersQueryParams, {}>({
    url: "/dashboard/v3/totalSectionHeaders",
    method: "get",
    ...variables
  });

export const getTotalSectionHeadersFetchFailed = (variables: Omit<GetTotalSectionHeadersVariables, "body">) =>
  fetchFailedSelector<GetTotalSectionHeadersQueryParams, {}>({
    url: "/dashboard/v3/totalSectionHeaders",
    method: "get",
    ...variables
  });
