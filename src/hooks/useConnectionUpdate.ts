import { useCallback, useEffect, useRef } from "react";

import { PendingError } from "@/store/apiSlice";

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
  onSuccess: () => unknown
) => {
  useRequestComplete(
    isFetching,
    useCallback(() => (fetchFailure == null ? onSuccess : () => {}), [fetchFailure, onSuccess])
  );
};
