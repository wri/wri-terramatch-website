import { createSelector } from "reselect";

import { delayedJobsFind } from "@/generated/v3/jobService/jobServiceComponents";
import { delayedJobsFindFetchFailed, delayedJobsFindIsFetching } from "@/generated/v3/jobService/jobServicePredicates";
import { DelayedJobDto } from "@/generated/v3/jobService/jobServiceSchemas";
import { useConnection } from "@/hooks/useConnection";
import { useValueChanged } from "@/hooks/useValueChanged";
import { ApiDataStore } from "@/store/apiSlice";
import { Connected, Connection } from "@/types/connection";
import { loadConnection } from "@/utils/loadConnection";
import { selectorCache } from "@/utils/selectorCache";

type DelayedJobConnection = {
  job?: DelayedJobDto;
  findingJob: boolean;
  jobFindFailed: boolean;
};

type DelayedJobConnectionProps = {
  delayedJobId?: string;
};

const delayedJobSelector = (delayedJobId?: string) => (store: ApiDataStore) =>
  delayedJobId == null ? undefined : store.delayedJobs?.[delayedJobId];
const findDelayedJobProps = (delayedJobId?: string) => ({ pathParams: { uuid: delayedJobId ?? "missingId" } });
const findDelayedJob = (delayedJobId: string) => delayedJobsFind(findDelayedJobProps(delayedJobId));

const delayedJobConnection: Connection<DelayedJobConnection, DelayedJobConnectionProps> = {
  load: ({ jobFindFailed, job }, { delayedJobId }) => {
    if (delayedJobId != null && job == null && !jobFindFailed) findDelayedJob(delayedJobId);
  },

  isLoaded: ({ jobFindFailed, job }, { delayedJobId }) => delayedJobId == null || job != null || jobFindFailed,

  selector: selectorCache(
    ({ delayedJobId }) => delayedJobId ?? "",
    ({ delayedJobId }) =>
      createSelector(
        [
          delayedJobSelector(delayedJobId),
          delayedJobsFindIsFetching(findDelayedJobProps(delayedJobId)),
          delayedJobsFindFetchFailed(findDelayedJobProps(delayedJobId))
        ],
        (job, jobLoading, jobLoadFailure) => ({
          job: job?.attributes,
          findingJob: jobLoading,
          jobFindFailed: jobLoadFailure != null
        })
      )
  )
};

const JOB_POLL_TIMEOUT = 300; // in ms
export const useDelayedJobResult = (delayedJobId?: string): Connected<DelayedJobConnection> => {
  const [loaded, jobResult] = useConnection(delayedJobConnection);
  useValueChanged(jobResult?.job, () => {
    if (delayedJobId != null && jobResult?.job?.status === "pending") {
      // If we received an updated job and the status is pending, ask the server again after the
      // defined timeout
      setTimeout(() => {
        findDelayedJob(delayedJobId);
      }, JOB_POLL_TIMEOUT);
    }
  });

  // Don't claim to our parent component that we're done loading until the connection is loaded
  // and either there is no job (there's a failure instead) or the job status is not pending.
  const status = jobResult?.job?.status;
  return loaded && status !== "pending" ? [true, jobResult] : [false, {}];
};

export async function loadDelayedJobResult<T>(fetchPromise: Promise<{ job_uuid?: string }>): Promise<T> {
  const initialResult = await fetchPromise;
  if (initialResult.job_uuid != null) {
    return initialResult as T;
  }

  const loadJob = () => loadConnection(delayedJobConnection, { delayedJobId: initialResult.job_uuid });

  // Load the job initially, and then keep loading the job after the defined timeout until we either
  // get a job find failed, or the job status is not pending.
  let jobResult: DelayedJobConnection;
  for (
    jobResult = await loadJob();
    !jobResult.jobFindFailed && jobResult.job!.status === "pending";
    jobResult = await loadJob()
  ) {
    await new Promise(resolve => setTimeout(resolve, JOB_POLL_TIMEOUT));
  }

  if (jobResult.jobFindFailed) throw new Error("The jobs endpoint encountered an error");
  if (jobResult.job!.status === "failed") throw new Error("Delayed job failed");

  return jobResult.job!.payload as T;
}
