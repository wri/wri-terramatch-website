import { first } from "lodash";

import { isPendingErrorState } from "@/store/apiSlice";

export const formatErrorMessage = (error: unknown): string => {
  if (isPendingErrorState(error)) {
    return first(error.message) ?? "An unexpected error occurred";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};
