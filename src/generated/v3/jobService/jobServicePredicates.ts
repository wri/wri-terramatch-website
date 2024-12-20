import { isFetching, fetchFailed } from "../utils";
import { ApiDataStore } from "@/store/apiSlice";
import { DelayedJobsFindPathParams, DelayedJobsFindVariables } from "./jobServiceComponents";

export const listDelayedJobsIsFetching = (store: ApiDataStore) =>
  isFetching<{}, {}>({ store, url: "/jobs/v3/delayedJobs", method: "get" });

export const listDelayedJobsFetchFailed = (store: ApiDataStore) =>
  fetchFailed<{}, {}>({ store, url: "/jobs/v3/delayedJobs", method: "get" });

export const delayedJobsFindIsFetching = (variables: DelayedJobsFindVariables) => (store: ApiDataStore) =>
  isFetching<{}, DelayedJobsFindPathParams>({ store, url: "/jobs/v3/delayedJobs/{uuid}", method: "get", ...variables });

export const delayedJobsFindFetchFailed = (variables: DelayedJobsFindVariables) => (store: ApiDataStore) =>
  fetchFailed<{}, DelayedJobsFindPathParams>({
    store,
    url: "/jobs/v3/delayedJobs/{uuid}",
    method: "get",
    ...variables
  });

export const bulkUpdateJobsIsFetching = (store: ApiDataStore) =>
  isFetching<{}, {}>({ store, url: "/jobs/v3/delayedJobs/bulk-update", method: "patch" });

export const bulkUpdateJobsFetchFailed = (store: ApiDataStore) =>
  fetchFailed<{}, {}>({ store, url: "/jobs/v3/delayedJobs/bulk-update", method: "patch" });
