import { useEffect } from "react";
import { createSelector } from "reselect";

import { bulkUpdateJobs, listDelayedJobs } from "@/generated/v3/jobService/jobServiceComponents";
import { bulkUpdateJobsFetchFailed, bulkUpdateJobsIsFetching } from "@/generated/v3/jobService/jobServicePredicates";
import { DelayedJobData, DelayedJobDto } from "@/generated/v3/jobService/jobServiceSchemas";
import { useConnection } from "@/hooks/useConnection";
import { ApiDataStore } from "@/store/apiSlice";
import { Connection } from "@/types/connection";

type DelayedJobCombinedConnection = {
  delayedJobs?: DelayedJobDto[] | undefined;
  delayedJobsIsLoading: boolean;
  delayedJobsHasFailed: boolean;
  bulkUpdateJobsIsLoading: boolean;
  bulkUpdateJobsHasFailed: boolean;
  updatedJobsResponse?: DelayedJobDto[];
};

const delayedJobsSelector = (store: ApiDataStore) =>
  Object.values(store.delayedJobs ?? {}).map(resource => resource.attributes);

const bulkUpdateJobsSelector = (store: ApiDataStore) => ({
  bulkUpdateJobsIsLoading: bulkUpdateJobsIsFetching(store),
  bulkUpdateJobsHasFailed: bulkUpdateJobsFetchFailed(store) != null,
  updatedJobsResponse: Object.values(store.delayedJobs ?? {}).map(resource => resource.attributes as DelayedJobDto)
});

const combinedSelector = createSelector(
  [delayedJobsSelector, bulkUpdateJobsSelector],
  (delayedJobs, { bulkUpdateJobsIsLoading, bulkUpdateJobsHasFailed, updatedJobsResponse }) => ({
    delayedJobs,
    delayedJobsIsLoading: delayedJobs == null && !bulkUpdateJobsHasFailed,
    delayedJobsHasFailed: bulkUpdateJobsHasFailed,
    bulkUpdateJobsIsLoading,
    bulkUpdateJobsHasFailed,
    updatedJobsResponse
  })
);

const combinedLoad = (connection: DelayedJobCombinedConnection) => {
  if (!combinedIsLoaded(connection)) {
    listDelayedJobs();
  }
};

const combinedIsLoaded = ({
  delayedJobs,
  delayedJobsHasFailed,
  bulkUpdateJobsIsLoading,
  bulkUpdateJobsHasFailed
}: DelayedJobCombinedConnection) =>
  (delayedJobs != null || delayedJobsHasFailed) && !bulkUpdateJobsIsLoading && !bulkUpdateJobsHasFailed;

const delayedJobsCombinedConnection: Connection<DelayedJobCombinedConnection> = {
  load: combinedLoad,
  isLoaded: combinedIsLoaded,
  selector: combinedSelector
};

export const useDelayedJobs = () => {
  const connection = useConnection(delayedJobsCombinedConnection);

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
export const triggerBulkUpdate = (jobs: DelayedJobData[]) => bulkUpdateJobs({ body: { data: jobs } });
