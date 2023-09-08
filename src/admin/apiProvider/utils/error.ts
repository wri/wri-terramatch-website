import * as Sentry from "@sentry/nextjs";
import { HttpError } from "react-admin";

import { ErrorWrapper } from "@/generated/apiFetcher";

export const getFormattedErrorForRA = (err: ErrorWrapper<undefined>) => {
  console.log(err);
  Sentry.captureException(err);
  return new HttpError(err?.errors?.map?.(e => e.detail).join(", ") || "", err?.statusCode);
};
