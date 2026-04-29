import { useEffect } from "react";

import { useDelayedJobs } from "@/connections/DelayedJob";
import { DelayedJobDto } from "@/generated/v3/jobService/jobServiceSchemas";

type UsePolygonClippingCompletionArgs = {
  pendingClipping: boolean;
  setPendingClipping: (value: boolean) => void;
  onSuccess?: (job: DelayedJobDto) => void | Promise<void>;
  onFailure?: (job: DelayedJobDto) => void | Promise<void>;
};

export const usePolygonClippingCompletion = ({
  pendingClipping,
  setPendingClipping,
  onSuccess,
  onFailure
}: UsePolygonClippingCompletionArgs) => {
  const [, { delayedJobs }] = useDelayedJobs();

  useEffect(() => {
    if (!(pendingClipping && delayedJobs != null && delayedJobs.length > 0)) {
      return;
    }

    const completedClippingJob = delayedJobs.find(job => {
      const isCompleted = job.status === "succeeded" || job.status === "failed";
      const isPolygonClipping = job.name === "Polygon Clipping";
      return isCompleted && isPolygonClipping;
    });

    if (completedClippingJob == null) {
      return;
    }

    let cancelled = false;

    const handleCompletedJob = async () => {
      if (completedClippingJob.status === "succeeded") {
        if (onSuccess != null) {
          await onSuccess(completedClippingJob);
        }
      } else if (onFailure != null) {
        await onFailure(completedClippingJob);
      }

      if (!cancelled) {
        setPendingClipping(false);
      }
    };

    void handleCompletedJob();

    return () => {
      cancelled = true;
    };
  }, [delayedJobs, pendingClipping, onSuccess, onFailure, setPendingClipping]);
};
