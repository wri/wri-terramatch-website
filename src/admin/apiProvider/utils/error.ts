import { HttpError } from "react-admin";

import { ErrorWrapper } from "@/generated/apiFetcher";
import Log from "@/utils/log";

export const getFormattedErrorForRA = (err: ErrorWrapper<undefined>) => {
  Log.error("Network error", err?.statusCode, ...(err?.errors ?? []));
  return new HttpError(err?.errors?.map?.(e => e.detail).join(", ") || "", err?.statusCode);
};
