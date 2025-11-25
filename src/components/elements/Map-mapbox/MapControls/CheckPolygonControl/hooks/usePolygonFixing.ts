import { useCallback, useEffect, useState } from "react";

import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useDelayedJobs } from "@/connections/DelayedJob";
import { clipPolygonsForSite } from "@/connections/PolygonClipping";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useModalContext } from "@/context/modal.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import ApiSlice from "@/store/apiSlice";

interface UsePolygonFixingProps {
  siteUuid?: string;
  setIsLoadingDelayedJob?: (isLoading: boolean) => void;
  setAlertTitle?: (value: string) => void;
}

export const usePolygonFixing = ({ siteUuid, setIsLoadingDelayedJob, setAlertTitle }: UsePolygonFixingProps) => {
  const { closeModal } = useModalContext();
  const { openNotification } = useNotificationContext();
  const { setShouldRefetchPolygonData, setShouldRefetchValidation } = useMapAreaContext();
  const context = useSitePolygonData();
  const sitePolygonData = context?.sitePolygonData;
  const sitePolygonRefresh = context?.reloadSiteData;
  const [, { delayedJobs }] = useDelayedJobs();
  const [pendingClipping, setPendingClipping] = useState(false);

  const runFixPolygonOverlaps = useCallback(() => {
    if (siteUuid) {
      closeModal(ModalId.FIX_POLYGONS);
      setIsLoadingDelayedJob?.(true);
      setAlertTitle?.("Fix Polygons");
      clipPolygonsForSite(siteUuid);
      setPendingClipping(true);
    } else {
      openNotification("error", "Cannot fix polygons: Site UUID is missing.", "Error");
    }
  }, [siteUuid, closeModal, setIsLoadingDelayedJob, setAlertTitle, openNotification]);

  useEffect(() => {
    if (!(pendingClipping && delayedJobs && delayedJobs.length > 0)) {
      return;
    }

    const completedClippingJob = delayedJobs.find(job => {
      const isCompleted = job.status === "succeeded" || job.status === "failed";
      const isPolygonClipping = job.name === "Polygon Clipping";
      return isCompleted && isPolygonClipping;
    });

    if (completedClippingJob) {
      if (completedClippingJob.status === "succeeded") {
        const clippedData = completedClippingJob.payload?.data;
        let polygonNames = "";

        if (Array.isArray(clippedData) && clippedData.length > 0) {
          polygonNames = clippedData
            .map((item: any) => item.attributes?.polyName)
            .filter(Boolean)
            .join(", ");
        } else if (clippedData && typeof clippedData === "object" && clippedData.attributes?.polyName) {
          polygonNames = clippedData.attributes.polyName;
        }

        if (polygonNames) {
          openNotification("success", "Success! The following polygons have been fixed:", polygonNames);
        } else {
          openNotification("warning", "No polygon have been fixed", "Please run 'Check Polygons' again.");
        }

        sitePolygonRefresh?.();
        setShouldRefetchPolygonData(true);
        setShouldRefetchValidation(true);
        ApiSlice.pruneCache("validations");
      } else {
        openNotification("error", "An error occurred while fixing polygons. Please try again.", "Error");
      }

      setIsLoadingDelayedJob?.(false);
      setPendingClipping(false);
    }
  }, [
    delayedJobs,
    pendingClipping,
    openNotification,
    sitePolygonRefresh,
    setShouldRefetchPolygonData,
    setShouldRefetchValidation,
    sitePolygonData,
    setIsLoadingDelayedJob
  ]);

  return {
    runFixPolygonOverlaps
  };
};
