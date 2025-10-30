import { useCallback, useEffect, useRef } from "react";
import { createSelector } from "reselect";

import { useLogin } from "@/connections/Login";
import { bulkUpdateJobs, listDelayedJobs } from "@/generated/v3/jobService/jobServiceComponents";
import { DelayedJobData, DelayedJobDto } from "@/generated/v3/jobService/jobServiceSchemas";
import { useConnection } from "@/hooks/useConnection";
import { useValueChanged } from "@/hooks/useValueChanged";
import { ApiDataStore } from "@/store/apiSlice";
import { Connection } from "@/types/connection";

type DelayedJobCombinedConnection = {
  delayedJobs?: DelayedJobDto[] | undefined;
  delayedJobsIsLoading: boolean;
  delayedJobsHasFailed: boolean;
  bulkUpdateJobsIsLoading: boolean;
  bulkUpdateJobsHasFailed: boolean;
};

const delayedJobsSelector = (store: ApiDataStore) => store.delayedJobs;

const combinedSelector = createSelector(
  [delayedJobsSelector, bulkUpdateJobs.isFetchingSelector({}), bulkUpdateJobs.fetchFailedSelector({})],
  (delayedJobs, bulkUpdateJobsIsLoading, bulkUpdateJobsFailure) => ({
    delayedJobs: Object.values(delayedJobs ?? {})
      .map(({ attributes }) => attributes)
      .filter(({ isAcknowledged }) => !isAcknowledged),
    delayedJobsIsLoading: delayedJobs == null && !bulkUpdateJobsFailure,
    delayedJobsHasFailed: Boolean(bulkUpdateJobsFailure),
    bulkUpdateJobsIsLoading,
    bulkUpdateJobsHasFailed: bulkUpdateJobsFailure != null
  })
);

const delayedJobsCombinedConnection: Connection<DelayedJobCombinedConnection> = {
  selector: combinedSelector
};

export const useDelayedJobs = () => {
  const connection = useConnection(delayedJobsCombinedConnection);
  const intervalRef = useRef<NodeJS.Timer | undefined>();
  const [, { data: login }] = useLogin({});

  const stopPolling = useCallback(() => {
    if (intervalRef.current != null) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, []);
  const startPolling = useCallback(() => {
    if (intervalRef.current == null) {
      intervalRef.current = setInterval(() => {
        listDelayedJobs.fetch({});
      }, 1500);
    }
  }, []);

  // Make sure to stop polling when we unmount.
  useEffect(() => stopPolling, [stopPolling]);

  const hasJobs = (connection[1].delayedJobs ?? []).length > 0;
  useValueChanged(hasJobs, () => {
    if (hasJobs) startPolling();
    else stopPolling();
  });

  useValueChanged(login, () => {
    // make sure we call the listDelayedJobs request at least once when we first mount if we're
    // logged in, or when we log in with a fresh user.
    if (login != null) listDelayedJobs.fetch({});
  });

  return connection;
};

export const triggerBulkUpdate = (jobs: DelayedJobData[]) => bulkUpdateJobs.fetch({ body: { data: jobs } });
