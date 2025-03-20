import { HttpError } from "react-admin";

import { ErrorWrapper } from "@/generated/apiFetcher";
import { isPendingErrorState } from "@/store/apiSlice";
import Log from "@/utils/log";

export const getFormattedErrorForRA = (err: ErrorWrapper<undefined>) => {
  Log.error("Network error", err?.statusCode, ...(err?.errors ?? []));
  return new HttpError(err?.errors?.map?.(e => e.detail).join(", ") || "", err?.statusCode);
};

export const v3ErrorForRA = (logMessage: string, err: unknown) => {
  Log.error(logMessage, err);
  if (isPendingErrorState(err)) {
    return new HttpError(err.message, err.statusCode);
  } else {
    return new HttpError("Unknown error", -1);
  }
};
