import { useT } from "@transifex/react";
import { useCallback, useEffect, useRef } from "react";

import { ToastType, useToastContext } from "@/context/toast.provider";
import { PendingError } from "@/store/apiSlice";
import Log from "@/utils/log";

/**
 * Execute a callback when a request is complete based on the isFetching boolean flag.
 *
 * Note: the onComplete callback is a hook dependency and should be stable (use useCallback).
 */
export const useRequestComplete = (
  isFetching: boolean,
  fetchFailure: PendingError | undefined,
  onComplete: (failure?: PendingError) => unknown
) => {
  const previousIsUpdating = useRef(isFetching);
  const failureRef = useRef(fetchFailure);
  failureRef.current = fetchFailure;
  useEffect(() => {
    if (previousIsUpdating.current && !isFetching) onComplete(failureRef.current);
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
    fetchFailure,
    useCallback(
      failure => {
        if (failure == null) {
          onSuccess();
        } else if (failureMessage != null) {
          Log.error(`Request failed: ${failureMessage}`, failure);
          openToast(t(failureMessage), ToastType.ERROR);
        }
      },
      [failureMessage, onSuccess, openToast, t]
    )
  );
};

export const useFailureToast = (
  isFetching: boolean,
  fetchFailure: PendingError | undefined,
  failureMessage?: string
) => {
  useRequestSuccess(
    isFetching,
    fetchFailure,
    useCallback(() => {}, []),
    failureMessage
  );
};
