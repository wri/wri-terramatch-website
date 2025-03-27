import { isFetchingSelector, fetchFailedSelector, indexMetaSelector } from "../utils";
import { ResourceType } from "@/store/apiSlice";
import { DelayedJobsFindPathParams, DelayedJobsFindVariables } from "./jobServiceComponents";

export const listDelayedJobsIsFetching = isFetchingSelector<{}, {}>({ url: "/jobs/v3/delayedJobs", method: "get" });

export const listDelayedJobsFetchFailed = fetchFailedSelector<{}, {}>({ url: "/jobs/v3/delayedJobs", method: "get" });

export const listDelayedJobsIndexMeta = (resource: ResourceType) =>
  indexMetaSelector<{}, {}>({ url: "/jobs/v3/delayedJobs", resource });

export const delayedJobsFindIsFetching = (variables: Omit<DelayedJobsFindVariables, "body">) =>
  isFetchingSelector<{}, DelayedJobsFindPathParams>({
    url: "/jobs/v3/delayedJobs/{uuid}",
    method: "get",
    ...variables
  });

export const delayedJobsFindFetchFailed = (variables: Omit<DelayedJobsFindVariables, "body">) =>
  fetchFailedSelector<{}, DelayedJobsFindPathParams>({
    url: "/jobs/v3/delayedJobs/{uuid}",
    method: "get",
    ...variables
  });

export const bulkUpdateJobsIsFetching = isFetchingSelector<{}, {}>({
  url: "/jobs/v3/delayedJobs/bulk-update",
  method: "patch"
});

export const bulkUpdateJobsFetchFailed = fetchFailedSelector<{}, {}>({
  url: "/jobs/v3/delayedJobs/bulk-update",
  method: "patch"
});
