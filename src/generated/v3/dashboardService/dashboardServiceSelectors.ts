import { isFetchingSelector, fetchFailedSelector } from "../utils";
import {
  TotalSectionHeaderControllerGetTotalSectionHeaderQueryParams,
  TotalSectionHeaderControllerGetTotalSectionHeaderVariables
} from "./dashboardServiceComponents";

export const totalSectionHeaderControllerGetTotalSectionHeaderIsFetching = (
  variables: Omit<TotalSectionHeaderControllerGetTotalSectionHeaderVariables, "body">
) =>
  isFetchingSelector<TotalSectionHeaderControllerGetTotalSectionHeaderQueryParams, {}>({
    url: "/dashboard/v3/totalSectionHeaders",
    method: "get",
    ...variables
  });

export const totalSectionHeaderControllerGetTotalSectionHeaderFetchFailed = (
  variables: Omit<TotalSectionHeaderControllerGetTotalSectionHeaderVariables, "body">
) =>
  fetchFailedSelector<TotalSectionHeaderControllerGetTotalSectionHeaderQueryParams, {}>({
    url: "/dashboard/v3/totalSectionHeaders",
    method: "get",
    ...variables
  });
