import { usePrevious } from "react-admin";

import { PendingError } from "@/store/apiSlice";

export const useRequestComplete = (isFetching: boolean, onComplete: () => unknown) => {
  const previousIsUpdating = usePrevious(isFetching);
  if (previousIsUpdating && !isFetching) onComplete();
};

export const useRequestSuccess = (
  isFetching: boolean,
  fetchFailure: PendingError | undefined,
  onSuccess: () => unknown
) => {
  useRequestComplete(isFetching, fetchFailure == null ? onSuccess : () => {});
};
