import { isFetching, fetchFailed } from "../utils";
import { ApiDataStore } from "@/store/apiSlice";
import { DelayedJobsFindPathParams, DelayedJobsFindVariables } from "./jobServiceComponents";

export const delayedJobsFindIsFetching = (variables: DelayedJobsFindVariables) => (store: ApiDataStore) =>
  isFetching<{}, DelayedJobsFindPathParams>({ store, url: "/jobs/v3/delayedJobs/{uuid}", method: "get", ...variables });

export const delayedJobsFindFetchFailed = (variables: DelayedJobsFindVariables) => (store: ApiDataStore) =>
  fetchFailed<{}, DelayedJobsFindPathParams>({
    store,
    url: "/jobs/v3/delayedJobs/{uuid}",
    method: "get",
    ...variables
  });
