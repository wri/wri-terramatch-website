import { usePrevious } from "react-admin";

import { PendingErrorState } from "@/store/apiSlice";

export const useUpdateComplete = (isUpdating: boolean, onComplete?: () => unknown) => {
  const previousIsUpdating = usePrevious(isUpdating);
  if (previousIsUpdating && !isUpdating) onComplete?.();
};

export const useUpdateSuccess = (
  isUpdating: boolean,
  updateFailure?: PendingErrorState | null,
  onSuccess?: () => unknown
) => {
  useUpdateComplete(isUpdating, updateFailure == null ? () => {} : onSuccess);
};
