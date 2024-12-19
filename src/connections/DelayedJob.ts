import { useEffect } from "react";
import { createSelector } from "reselect";

import { bulkUpdateJobs, listDelayedJobs } from "@/generated/v3/jobService/jobServiceComponents";
import {
  bulkUpdateJobsFetchFailed,
  bulkUpdateJobsIsFetching,
  listDelayedJobsFetchFailed
} from "@/generated/v3/jobService/jobServicePredicates";
import { DelayedJobData, DelayedJobDto } from "@/generated/v3/jobService/jobServiceSchemas";
import { useConnection } from "@/hooks/useConnection";
import { ApiDataStore } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionLoader } from "@/utils/connectionShortcuts";

// --- Delayed Jobs Connection ---
type DelayedJobsConnection = {
  delayedJobs?: DelayedJobDto[];
  isLoading: boolean;
  hasLoadFailed: boolean;
};

const delayedJobsSelector = (store: ApiDataStore) =>
  Object.values(store.delayedJobs ?? {}).map(resource => resource.attributes);

const delayedJobsLoadFailedSelector = (store: ApiDataStore) => listDelayedJobsFetchFailed(store) != null;

const connectionIsLoaded = ({ delayedJobs, hasLoadFailed, isLoading }: DelayedJobsConnection) =>
  (delayedJobs != null && delayedJobs.length > 0) || hasLoadFailed || isLoading;

const delayedJobsConnection: Connection<DelayedJobsConnection> = {
  load: connection => {
    const isLoaded = connectionIsLoaded(connection);
    if (!isLoaded) {
      listDelayedJobs();
    }
  },
  isLoaded: connectionIsLoaded,
  selector: createSelector([delayedJobsSelector, delayedJobsLoadFailedSelector], (delayedJobs, hasLoadFailed) => ({
    delayedJobs,
    isLoading: delayedJobs == null && !hasLoadFailed,
    hasLoadFailed
  }))
};

export const useDelayedJobs = () => {
  const connection = useConnection(delayedJobsConnection);

  useEffect(() => {
    const intervalId = setInterval(() => {
      listDelayedJobs();
    }, 1500);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return connection;
};

export const triggerBulkUpdate = (jobs: DelayedJobData[]) => {
  console.log("triggerBulkUpdate", jobs);
  bulkUpdateJobs({ body: { data: jobs } });
};

const bulkUpdateJobsSelector = (store: ApiDataStore) => ({
  isLoading: bulkUpdateJobsIsFetching(store),
  hasLoadFailed: bulkUpdateJobsFetchFailed(store) != null,
  response: store.delayedJobs
});

const bulkUpdateJobsConnection: Connection<DelayedJobsConnection, { jobs: DelayedJobData[] }> = {
  load: (connection, { jobs }) => {
    const isLoaded = connectionBulkUpdateIsLoaded(connection);
    if (!isLoaded) {
      bulkUpdateJobs({ body: { data: jobs } });
    }
  },

  isLoaded: state => !state.isLoading,

  selector: createSelector(bulkUpdateJobsSelector, ({ isLoading, hasLoadFailed, response }) => ({
    isLoading,
    hasLoadFailed,
    response
  }))
};

const connectionBulkUpdateIsLoaded = ({ isLoading, hasLoadFailed }: { isLoading: boolean; hasLoadFailed: boolean }) =>
  !isLoading && !hasLoadFailed;

export const useBulkUpdateJobs = connectionLoader(bulkUpdateJobsConnection);
