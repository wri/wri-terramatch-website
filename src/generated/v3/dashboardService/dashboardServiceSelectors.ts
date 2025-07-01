import { isFetchingSelector, fetchFailedSelector } from "../utils";
import {
  GetTotalSectionHeadersQueryParams,
  GetTotalSectionHeadersVariables,
  GetTreeRestorationGoalQueryParams,
  GetTreeRestorationGoalVariables
} from "./dashboardServiceComponents";

export const GET_TOTAL_SECTION_HEADERS_URL = "/dashboard/v3/totalSectionHeaders";

export const getTotalSectionHeadersIsFetching = (variables: Omit<GetTotalSectionHeadersVariables, "body">) =>
  isFetchingSelector<GetTotalSectionHeadersQueryParams, {}>({
    url: GET_TOTAL_SECTION_HEADERS_URL,
    method: "get",
    ...variables
  });

export const getTotalSectionHeadersFetchFailed = (variables: Omit<GetTotalSectionHeadersVariables, "body">) =>
  fetchFailedSelector<GetTotalSectionHeadersQueryParams, {}>({
    url: GET_TOTAL_SECTION_HEADERS_URL,
    method: "get",
    ...variables
  });

export const GET_TREE_RESTORATION_GOAL_URL = "/dashboard/v3/treeRestorationGoal";

export const getTreeRestorationGoalIsFetching = (variables: Omit<GetTreeRestorationGoalVariables, "body">) =>
  isFetchingSelector<GetTreeRestorationGoalQueryParams, {}>({
    url: GET_TREE_RESTORATION_GOAL_URL,
    method: "get",
    ...variables
  });

export const getTreeRestorationGoalFetchFailed = (variables: Omit<GetTreeRestorationGoalVariables, "body">) =>
  fetchFailedSelector<GetTreeRestorationGoalQueryParams, {}>({
    url: GET_TREE_RESTORATION_GOAL_URL,
    method: "get",
    ...variables
  });
