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

type DelayedJobsConnection = {
  delayedJobs?: DelayedJobDto[];
  delayedJobsIsLoading: boolean;
  delayedJobsHasFailed: boolean;
};

const delayedJobsSelector = (store: ApiDataStore) =>
  Object.values(store.delayedJobs ?? {}).map(resource => resource.attributes);

const delayedJobsLoadFailedSelector = (store: ApiDataStore) => listDelayedJobsFetchFailed(store) != null;

const delayedJobsIsLoaded = ({ delayedJobs, delayedJobsHasFailed, delayedJobsIsLoading }: DelayedJobsConnection) =>
  (delayedJobs != null && delayedJobs.length > 0) || delayedJobsHasFailed || delayedJobsIsLoading;

const delayedJobsConnection: Connection<DelayedJobsConnection> = {
  load: connection => {
    if (!delayedJobsIsLoaded(connection)) {
      listDelayedJobs();
    }
  },
  isLoaded: delayedJobsIsLoaded,
  selector: createSelector(
    [delayedJobsSelector, delayedJobsLoadFailedSelector],
    (delayedJobs, delayedJobsHasFailed) => ({
      delayedJobs,
      delayedJobsIsLoading: delayedJobs == null && !delayedJobsHasFailed,
      delayedJobsHasFailed
    })
  )
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

type BulkUpdateJobsConnection = {
  bulkUpdateJobsIsLoading: boolean;
  bulkUpdateJobsHasFailed: boolean;
  updatedJobsResponse?: DelayedJobDto[];
};

const bulkUpdateJobsSelector = (store: ApiDataStore) => ({
  bulkUpdateJobsIsLoading: bulkUpdateJobsIsFetching(store),
  bulkUpdateJobsHasFailed: bulkUpdateJobsFetchFailed(store) != null,
  updatedJobsResponse: Object.values(store.delayedJobs ?? {}).map(resource => resource.attributes as DelayedJobDto)
});

const bulkUpdateJobsIsLoaded = ({ bulkUpdateJobsIsLoading, bulkUpdateJobsHasFailed }: BulkUpdateJobsConnection) =>
  !bulkUpdateJobsIsLoading && !bulkUpdateJobsHasFailed;

const bulkUpdateJobsConnection: Connection<BulkUpdateJobsConnection, { jobs: DelayedJobData[] }> = {
  load: (connection, { jobs }) => {
    if (!bulkUpdateJobsIsLoaded(connection)) {
      bulkUpdateJobs({ body: { data: jobs } });
    }
  },
  isLoaded: bulkUpdateJobsIsLoaded,
  selector: createSelector(
    bulkUpdateJobsSelector,
    ({ bulkUpdateJobsIsLoading, bulkUpdateJobsHasFailed, updatedJobsResponse }) => ({
      bulkUpdateJobsIsLoading,
      bulkUpdateJobsHasFailed,
      updatedJobsResponse
    })
  )
};

export const useBulkUpdateJobs = connectionLoader(bulkUpdateJobsConnection);

// Function to trigger bulk update
export const triggerBulkUpdate = (jobs: DelayedJobData[]) => bulkUpdateJobs({ body: { data: jobs } });
