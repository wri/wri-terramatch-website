import { isFetchingSelector, fetchFailedSelector, indexMetaSelector } from "../utils";
import { ResourceType } from "@/store/apiSlice";
import { DelayedJobsFindPathParams, DelayedJobsFindVariables } from "./jobServiceComponents";

export const LIST_DELAYED_JOBS_URL = "/jobs/v3/delayedJobs";

export const listDelayedJobsIsFetching = (_?: Omit<void, "body">) =>
  isFetchingSelector<{}, {}>({ url: LIST_DELAYED_JOBS_URL, method: "get" });

export const listDelayedJobsFetchFailed = (_?: Omit<void, "body">) =>
  fetchFailedSelector<{}, {}>({ url: LIST_DELAYED_JOBS_URL, method: "get" });

export const listDelayedJobsIndexMeta = (resource: ResourceType, _?: Omit<void, "body">) =>
  indexMetaSelector<{}, {}>({ url: LIST_DELAYED_JOBS_URL, resource });

export const DELAYED_JOBS_FIND_URL = "/jobs/v3/delayedJobs/{uuid}";

export const delayedJobsFindIsFetching = (variables: Omit<DelayedJobsFindVariables, "body">) =>
  isFetchingSelector<{}, DelayedJobsFindPathParams>({ url: DELAYED_JOBS_FIND_URL, method: "get", ...variables });

export const delayedJobsFindFetchFailed = (variables: Omit<DelayedJobsFindVariables, "body">) =>
  fetchFailedSelector<{}, DelayedJobsFindPathParams>({ url: DELAYED_JOBS_FIND_URL, method: "get", ...variables });

export const BULK_UPDATE_JOBS_URL = "/jobs/v3/delayedJobs/bulk-update";

export const bulkUpdateJobsIsFetching = (_?: Omit<void, "body">) =>
  isFetchingSelector<{}, {}>({ url: BULK_UPDATE_JOBS_URL, method: "patch" });

export const bulkUpdateJobsFetchFailed = (_?: Omit<void, "body">) =>
  fetchFailedSelector<{}, {}>({ url: BULK_UPDATE_JOBS_URL, method: "patch" });
