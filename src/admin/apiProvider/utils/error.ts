import { HttpError } from "react-admin";

import { isPendingErrorState } from "@/store/apiSlice";
import Log from "@/utils/log";

export const v3ErrorForRA = (logMessage: string, err: unknown) => {
  Log.error(logMessage, err);
  if (isPendingErrorState(err)) {
    return new HttpError(Array.isArray(err.message) ? err.message[0] : err.message, err.statusCode);
  } else {
    return new HttpError("Unknown error", -1);
  }
};
