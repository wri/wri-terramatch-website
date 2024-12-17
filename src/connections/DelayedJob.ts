import { createSelector } from "reselect";

import { bulkUpdateJobs, listDelayedJobs } from "@/generated/v3/jobService/jobServiceComponents";
import {
  bulkUpdateJobsFetchFailed,
  bulkUpdateJobsIsFetching,
  listDelayedJobsFetchFailed
} from "@/generated/v3/jobService/jobServicePredicates";
import { DelayedJobData, DelayedJobDto } from "@/generated/v3/jobService/jobServiceSchemas";
import { ApiDataStore } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook, connectionLoader } from "@/utils/connectionShortcuts";

// --- Delayed Jobs Connection ---
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

export const triggerBulkUpdate = (jobs: DelayedJobData[]) => {
  return bulkUpdateJobs({ body: { data: jobs } });
};

const bulkUpdateJobsSelector = (store: ApiDataStore) => {
  const bulkUpdateState = store.delayedJobs || {};
  return {
    isLoading: bulkUpdateJobsIsFetching(store),
    hasLoadFailed: bulkUpdateJobsFetchFailed(store) != null,
    response: bulkUpdateState.response
  };
};

const bulkUpdateJobsConnection: Connection<DelayedJobsConnection, { jobs: DelayedJobData[] }> = {
  load: async (connection, { jobs }) => {
    const isLoaded = connectionBulkUpdateIsLoaded(connection);
    if (!isLoaded) {
      await bulkUpdateJobs({ body: { data: jobs } });
    }
  },

  isLoaded: state => !state.isLoading,

  selector: createSelector([store => bulkUpdateJobsSelector(store)], ({ isLoading, hasLoadFailed, response }) => ({
    isLoading,
    hasLoadFailed,
    response
  }))
};

const connectionBulkUpdateIsLoaded = ({ isLoading, hasLoadFailed }: { isLoading: boolean; hasLoadFailed: boolean }) => {
  return !isLoading && !hasLoadFailed;
};

export const useDelayedJobs = connectionHook(delayedJobsConnection);
export const useBulkUpdateJobs = connectionLoader(bulkUpdateJobsConnection);
