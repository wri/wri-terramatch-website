import { useCallback, useEffect, useState } from "react";

import { useDelayedJobs } from "@/connections/DelayedJob";
import { triggerSiteValidation, useAllSiteValidations } from "@/connections/Validation";
import { useLoading } from "@/context/loaderAdmin.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import { useValueChanged } from "@/hooks/useValueChanged";
import ApiSlice from "@/store/apiSlice";
import { OVERLAPPING_CRITERIA_ID } from "@/types/validation";

interface UseSiteValidationProps {
  siteUuid?: string;
  setIsLoadingDelayedJob?: (isLoading: boolean) => void;
  setAlertTitle?: (value: string) => void;
}

export const useSiteValidation = ({ siteUuid, setIsLoadingDelayedJob, setAlertTitle }: UseSiteValidationProps) => {
  const [pendingSiteValidation, setPendingSiteValidation] = useState(false);
  const [clickedValidation, setClickedValidation] = useState(false);

  const context = useSitePolygonData();
  const sitePolygonData = context?.sitePolygonData;
  const { showLoader, hideLoader } = useLoading();
  const { setShouldRefetchValidation } = useMapAreaContext();
  const { openNotification } = useNotificationContext();
  const [, { delayedJobs }] = useDelayedJobs();

  const { allValidations: overlapValidations, fetchAllValidationPages: fetchOverlapValidations } =
    useAllSiteValidations(siteUuid ?? "", OVERLAPPING_CRITERIA_ID);

  const displayNotification = useCallback(
    (message: string, type: "success" | "error" | "warning", title: string) => {
      openNotification(type, title, message);
    },
    [openNotification]
  );

  const runSiteValidation = useCallback(async () => {
    if (!siteUuid) return;

    try {
      showLoader();
      await triggerSiteValidation(siteUuid);
      setPendingSiteValidation(true);
      setClickedValidation(false);
      hideLoader();
    } catch (error) {
      hideLoader();
      setIsLoadingDelayedJob?.(false);
      setClickedValidation(false);
      setPendingSiteValidation(false);
      displayNotification("Please try again later.", "error", "Error! TerraMatch could not review polygons");
    }
  }, [siteUuid, showLoader, hideLoader, setIsLoadingDelayedJob, displayNotification]);

  const handleSiteValidationComplete = useCallback(() => {
    if (!siteUuid) return;

    fetchOverlapValidations(true);
    setShouldRefetchValidation(true);
    ApiSlice.pruneCache("sitePolygons");

    if (Array.isArray(sitePolygonData)) {
      const polygonUuids = sitePolygonData
        .map(polygon => polygon.polygonUuid)
        .filter((uuid): uuid is string => Boolean(uuid));
      if (polygonUuids.length > 0) {
        ApiSlice.pruneCache("validations", polygonUuids);
      }
    }

    displayNotification(
      "Please update and re-run if any polygons fail.",
      "success",
      "Success! TerraMatch reviewed all polygons"
    );

    setIsLoadingDelayedJob?.(false);
    setPendingSiteValidation(false);
  }, [
    siteUuid,
    fetchOverlapValidations,
    setShouldRefetchValidation,
    sitePolygonData,
    displayNotification,
    setIsLoadingDelayedJob
  ]);

  useEffect(() => {
    if (!(pendingSiteValidation && delayedJobs && delayedJobs.length > 0)) {
      return;
    }

    const completedValidationJob = delayedJobs.find(job => {
      const isCompleted = job.status === "succeeded" || job.status === "failed";
      const isPolygonValidation = job.name === "Polygon Validation";
      const matchesSite = job.payload?.siteUuid === siteUuid;

      return isCompleted && isPolygonValidation && matchesSite;
    });

    if (completedValidationJob) {
      handleSiteValidationComplete();
    }
  }, [delayedJobs, pendingSiteValidation, handleSiteValidationComplete, siteUuid]);

  useValueChanged(sitePolygonData, () => {
    if (sitePolygonData && siteUuid != null && !pendingSiteValidation) {
      fetchOverlapValidations();
    }
  });

  useValueChanged(clickedValidation, () => {
    if (clickedValidation) {
      setIsLoadingDelayedJob?.(true);
      setAlertTitle?.("Check Polygons");
      runSiteValidation();
    }
  });

  return {
    overlapValidations,
    pendingSiteValidation,
    clickedValidation,
    setClickedValidation,
    runSiteValidation,
    handleSiteValidationComplete
  };
};
