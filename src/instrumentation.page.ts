// Next.js calls `register` once per server runtime at startup. This file is named with `.page.ts` because
// Next.js matches the instrumentation hook against `pageExtensions` in next.config.js.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from "@sentry/nextjs";

export const register = async () => {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
};

export const onRequestError = Sentry.captureRequestError;
