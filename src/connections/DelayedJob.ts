import { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import { bulkUpdateJobs, listDelayedJobs } from "@/generated/v3/jobService/jobServiceComponents";
import { bulkUpdateJobsFetchFailed, bulkUpdateJobsIsFetching } from "@/generated/v3/jobService/jobServicePredicates";
import { DelayedJobData, DelayedJobDto } from "@/generated/v3/jobService/jobServiceSchemas";
import { useConnection } from "@/hooks/useConnection";
import { ApiDataStore } from "@/store/apiSlice";
import { JobsDataStore } from "@/store/jobsSlice";
import { AppStore } from "@/store/store";
import { Connection } from "@/types/connection";

type DelayedJobCombinedConnection = {
  delayedJobs?: DelayedJobDto[] | undefined;
  delayedJobsIsLoading: boolean;
  delayedJobsHasFailed: boolean;
  bulkUpdateJobsIsLoading: boolean;
  bulkUpdateJobsHasFailed: boolean;
};

const delayedJobsSelector = (store: ApiDataStore) =>
  Object.values(store.delayedJobs ?? {})
    .map(resource => resource.attributes)
    .filter(({ isAcknowledged }) => !isAcknowledged);

const combinedSelector = createSelector(
  [delayedJobsSelector, bulkUpdateJobsIsFetching, bulkUpdateJobsFetchFailed],
  (delayedJobs, bulkUpdateJobsIsLoading, bulkUpdateJobsFailure) => ({
    delayedJobs,
    delayedJobsIsLoading: delayedJobs == null && !bulkUpdateJobsFailure,
    delayedJobsHasFailed: Boolean(bulkUpdateJobsFailure),
    bulkUpdateJobsIsLoading,
    bulkUpdateJobsHasFailed: bulkUpdateJobsFailure != null
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

export const useJobProgress = () => useSelector<AppStore, JobsDataStore>(({ jobs }) => jobs);

export const useDelayedJobs = () => {
  const connection = useConnection(delayedJobsCombinedConnection);
  const { totalContent } = useJobProgress();
  const intervalRef = useRef<NodeJS.Timer | undefined>();

  const stopPolling = useCallback(() => {
    if (intervalRef.current != null) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, []);
  const startPolling = useCallback(() => {
    if (intervalRef.current == null) {
      intervalRef.current = setInterval(() => {
        listDelayedJobs();
      }, 1500);
    }
  }, []);

  // Make sure we call listDelayedJobs once on mount and stop polling when we unmount.
  useEffect(() => {
    listDelayedJobs();
    return stopPolling;
  }, [stopPolling]);

  const hasJobs = (connection[0] ? connection[1].delayedJobs ?? [] : []).length > 0;
  useEffect(() => {
    console.log("checking polling", { totalContent, hasJobs });

    if (totalContent > 0) {
      startPolling();
      // Don't process the connection content because we need it to poll once before giving up; the
      // currently cached poll result is going to claim there are no jobs.
      // Note: this is a little fragile because it depends on some code somewhere to call
      // JobsSlice.reset() when it's done watching the job, but that's better than accidentally not
      // polling when we're supposed to.
      return;
    }

    if (hasJobs) startPolling();
    else stopPolling();
  }, [hasJobs, startPolling, stopPolling, totalContent]);

  return connection;
};

export const triggerBulkUpdate = (jobs: DelayedJobData[]) => bulkUpdateJobs({ body: { data: jobs } });
