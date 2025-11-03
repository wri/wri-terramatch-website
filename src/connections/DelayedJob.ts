import { useEffect, useId } from "react";
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

// The polling interval needs to be truly global so that if more than one component is using
// useDelayedJobs, we don't end up with multiple polling cycles.
let delayedJobPollingInterval: NodeJS.Timer | undefined;
// A set of the instances of useDelayedJobs that are currently requesting polling. The polling
// interval is only cleared when this set is empty.
const useDelayedJobInstances = new Set<string>();

// Ensures that delayed jobs are being polled on a 1500ms cycle.
const startPolling = (id: string) => {
  useDelayedJobInstances.add(id);
  if (delayedJobPollingInterval == null) {
    delayedJobPollingInterval = setInterval(() => {
      listDelayedJobs.fetch({});
    }, 1500);
  }
};

// If this id is the last in the set of registered instances and the polling interval is
// currently running, this will stop it.
const stopPolling = (id: string) => {
  useDelayedJobInstances.delete(id);
  if (delayedJobPollingInterval != null && useDelayedJobInstances.size === 0) {
    clearInterval(delayedJobPollingInterval);
    delayedJobPollingInterval = undefined;
  }
};

export const useDelayedJobs = () => {
  const connection = useConnection(delayedJobsCombinedConnection);
  const [, { data: login }] = useLogin({});
  const id = useId();

  // Make sure to stop polling when we unmount.
  useEffect(() => stopPolling(id), [id]);

  const hasJobs = (connection[1].delayedJobs ?? []).length > 0;
  useValueChanged(hasJobs, () => {
    if (hasJobs) startPolling(id);
    else stopPolling(id);
  });

  useValueChanged(login, () => {
    // make sure we call the listDelayedJobs request at least once when we first mount if we're
    // logged in, or when we log in with a fresh user.
    if (login != null) startPolling(id);
  });

  return connection;
};

export const triggerBulkUpdate = (jobs: DelayedJobData[]) => bulkUpdateJobs.fetch({ body: { data: jobs } });
