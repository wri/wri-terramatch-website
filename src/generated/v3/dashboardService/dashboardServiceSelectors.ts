import { isFetchingSelector, fetchFailedSelector } from "../utils";
import {
  GetTotalSectionHeadersQueryParams,
  GetTotalSectionHeadersVariables,
  GetTreeRestorationGoalQueryParams,
  GetTreeRestorationGoalVariables
} from "./dashboardServiceComponents";

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

export const getTreeRestorationGoalIsFetching = (variables: Omit<GetTreeRestorationGoalVariables, "body">) =>
  isFetchingSelector<GetTreeRestorationGoalQueryParams, {}>({
    url: "/dashboard/v3/treeRestorationGoal",
    method: "get",
    ...variables
  });

export const getTreeRestorationGoalFetchFailed = (variables: Omit<GetTreeRestorationGoalVariables, "body">) =>
  fetchFailedSelector<GetTreeRestorationGoalQueryParams, {}>({
    url: "/dashboard/v3/treeRestorationGoal",
    method: "get",
    ...variables
  });
