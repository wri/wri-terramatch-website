import { createSelector } from "reselect";

import { DelayedJobsFindVariables, listDelayedJobs } from "@/generated/v3/jobService/jobServiceComponents";
import { delayedJobsFindFetchFailed } from "@/generated/v3/jobService/jobServicePredicates";
import { DelayedJobDto } from "@/generated/v3/jobService/jobServiceSchemas";
import { ApiDataStore } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

type DelayedJobsConnection = {
  delayedJobs?: DelayedJobDto[];
  isLoading: boolean;
  hasLoadFailed: boolean;
};

type DelayedJobsProps = { uuid: string };

const delayedJobsSelector = (store: ApiDataStore) => {
  const delayedJobsMap = store.delayedJobs || {};
  return Object.values(delayedJobsMap).map(resource => resource.attributes);
};

const delayedJobsLoadFailedSelector = (store: ApiDataStore, { uuid }: DelayedJobsProps) => {
  const variables: DelayedJobsFindVariables = {
    pathParams: { uuid }
  };

  return delayedJobsFindFetchFailed(variables)(store) != null;
};
const connectionIsLoaded = ({ delayedJobs, hasLoadFailed, isLoading }: DelayedJobsConnection) => {
  return (delayedJobs != null && delayedJobs.length > 0) || hasLoadFailed || isLoading;
};

const delayedJobsConnection: Connection<DelayedJobsConnection, DelayedJobsProps> = {
  load: (connection, props) => {
    const isLoaded = connectionIsLoaded(connection);
    if (!isLoaded) {
      listDelayedJobs();
    }
  },
  isLoaded: connectionIsLoaded,
  selector: selectorCache(
    props => props.uuid,
    props =>
      createSelector(
        [delayedJobsSelector, store => delayedJobsLoadFailedSelector(store, props)],
        (delayedJobs, hasLoadFailed): DelayedJobsConnection => ({
          delayedJobs,
          isLoading: delayedJobs == null && !hasLoadFailed,
          hasLoadFailed
        })
      )
  )
};

export const useDelayedJobs = connectionHook(delayedJobsConnection);
