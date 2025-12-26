import { useT } from "@transifex/react";
import { useCallback, useEffect, useRef } from "react";

import { useToastContext } from "@/context/toast.provider";
import { PendingError } from "@/store/apiSlice";
import Log from "@/utils/log";

/**
 * Execute a callback when a request is complete based on the isFetching boolean flag.
 *
 * Note: the onComplete callback is a hook dependency and should be stable (use useCallback).
 */
export const useRequestComplete = (isFetching: boolean, onComplete: () => unknown) => {
  const previousIsUpdating = useRef(isFetching);
  useEffect(() => {
    if (previousIsUpdating.current && !isFetching) onComplete();
    previousIsUpdating.current = isFetching;
  }, [isFetching, onComplete]);
};

/**
 * Execute a callback when a request succeeds based on the isFetching boolean flag and fetchFailure.
 *
 * Note: the onSuccess callback is hook dependency and should be stable (use useCallback).
 */
export const useRequestSuccess = (
  isFetching: boolean,
  fetchFailure: PendingError | undefined,
  onSuccess: () => unknown,
  failureMessage?: string
) => {
  const { openToast } = useToastContext();
  const t = useT();
  useRequestComplete(
    isFetching,
    useCallback(() => {
      if (fetchFailure == null) {
        onSuccess();
      } else if (failureMessage != null) {
        Log.error(`Request failed: ${failureMessage}`, fetchFailure);
        openToast(t(failureMessage));
      }
    }, [failureMessage, fetchFailure, onSuccess, openToast, t])
  );
};
