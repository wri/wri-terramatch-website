import { createSelector } from "reselect";

import { listDelayedJobs } from "@/generated/v3/jobService/jobServiceComponents";
import { listDelayedJobsFetchFailed } from "@/generated/v3/jobService/jobServicePredicates";
import { DelayedJobDto } from "@/generated/v3/jobService/jobServiceSchemas";
import { ApiDataStore } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook } from "@/utils/connectionShortcuts";

type DelayedJobsConnection = {
  delayedJobs?: DelayedJobDto[];
  isLoading: boolean;
  hasLoadFailed: boolean;
};

const delayedJobsSelector = (store: ApiDataStore) => {
  const delayedJobsMap = store.delayedJobs || {};
  return Object.values(delayedJobsMap).map(resource => resource.attributes);
};

const delayedJobsLoadFailedSelector = (store: ApiDataStore) => {
  return listDelayedJobsFetchFailed(store) != null;
};

const connectionIsLoaded = ({ delayedJobs, hasLoadFailed, isLoading }: DelayedJobsConnection) => {
  return (delayedJobs != null && delayedJobs.length > 0) || hasLoadFailed || isLoading;
};

const delayedJobsConnection: Connection<DelayedJobsConnection> = {
  load: connection => {
    const isLoaded = connectionIsLoaded(connection);
    if (!isLoaded) {
      listDelayedJobs();
    }
  },
  isLoaded: connectionIsLoaded,
  selector: createSelector(
    [delayedJobsSelector, store => delayedJobsLoadFailedSelector(store)],
    (delayedJobs, hasLoadFailed): DelayedJobsConnection => ({
      delayedJobs,
      isLoading: delayedJobs == null && !hasLoadFailed,
      hasLoadFailed
    })
  )
};

export const useDelayedJobs = connectionHook(delayedJobsConnection);
