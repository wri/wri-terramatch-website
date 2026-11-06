import { useT } from "@transifex/react";
import { uniqueId } from "lodash";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

import Log from "@/utils/log";

import {
  type PolygonBackgroundJob,
  type PolygonBackgroundToastId,
  closePolygonProgressToast,
  completePolygonProgressToast,
  getPolygonBackgroundJobToastLabels,
  POLYGON_TOAST_IDS,
  showPolygonErrorToast,
  showPolygonProgressToast
} from "../utils/polygonOperationToasts";

/** Must match BULK_ASYNC_THRESHOLD in research-service `site-polygon-bulk.processor.ts`. */
export const POLYGON_BACKGROUND_JOB_THRESHOLD = 50;

export const isPolygonBackgroundJob = (polygonCount: number) => polygonCount > POLYGON_BACKGROUND_JOB_THRESHOLD;

type RunPolygonBackgroundJobParams = {
  job: PolygonBackgroundJob;
  completeLabel: string;
  errorLabel: string;
  /** The v3 fetcher polls a delayed job response, so this resolves when the BE job finishes. */
  run: () => Promise<unknown>;
};

const getPathname = (url: string) => new URL(url, window.location.origin).pathname;

/**
 * Runs a polygon action on more than POLYGON_BACKGROUND_JOB_THRESHOLD polygons without blocking the page.
 * A persistent toast stays up until the job finishes, or until the user leaves the page. The success or
 * error toast then shows wherever the user is, because the request keeps running across client navigation.
 * Errors are handled here, so callers can fire and forget.
 */
export const usePolygonBackgroundJob = () => {
  const t = useT();
  const { events } = useRouter();
  const toastLabels = useMemo(() => getPolygonBackgroundJobToastLabels(t), [t]);

  return useCallback(
    async ({ job, completeLabel, errorLabel, run }: RunPolygonBackgroundJobParams) => {
      const toastId: PolygonBackgroundToastId = `${POLYGON_TOAST_IDS[job]}-${uniqueId()}`;
      const startPathname = window.location.pathname;
      const closeOnPageLeave = (url: string) => {
        if (getPathname(url) !== startPathname) closePolygonProgressToast(toastId);
      };

      showPolygonProgressToast(t, toastLabels[job].label, toastId, toastLabels[job].caption);
      events.on("routeChangeStart", closeOnPageLeave);
      try {
        await run();
        completePolygonProgressToast(toastId, completeLabel);
      } catch (error) {
        Log.error(`Polygon background job failed: ${job}`, error);
        closePolygonProgressToast(toastId);
        showPolygonErrorToast(errorLabel);
      } finally {
        events.off("routeChangeStart", closeOnPageLeave);
      }
    },
    [events, t, toastLabels]
  );
};
