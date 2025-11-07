import { useCallback } from "react";

import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useLoading } from "@/context/loaderAdmin.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useModalContext } from "@/context/modal.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import { usePostV2TerrafundClipPolygonsSiteUuid } from "@/generated/apiComponents";
import { ClippedPolygonResponse } from "@/generated/apiSchemas";
import ApiSlice from "@/store/apiSlice";
import Log from "@/utils/log";

interface UsePolygonFixingProps {
  siteUuid?: string;
  setIsLoadingDelayedJob?: (isLoading: boolean) => void;
  setAlertTitle?: (value: string) => void;
}

export const usePolygonFixing = ({ siteUuid, setIsLoadingDelayedJob, setAlertTitle }: UsePolygonFixingProps) => {
  const { closeModal } = useModalContext();
  const { openNotification } = useNotificationContext();
  const { hideLoader } = useLoading();
  const { setShouldRefetchPolygonData, setShouldRefetchValidation } = useMapAreaContext();
  const context = useSitePolygonData();
  const sitePolygonData = context?.sitePolygonData;
  const sitePolygonRefresh = context?.reloadSiteData;

  const { mutate: clipPolygons } = usePostV2TerrafundClipPolygonsSiteUuid({
    onSuccess: (data: ClippedPolygonResponse) => {
      if (!data.updated_polygons?.length) {
        openNotification("warning", "No polygon have been fixed", "Please run 'Check Polygons' again.");
        hideLoader();
        setIsLoadingDelayedJob?.(false);
        closeModal(ModalId.FIX_POLYGONS);
        return;
      }

      if (data) {
        sitePolygonRefresh?.();
        setShouldRefetchPolygonData(true);
        setShouldRefetchValidation(true);

        if (Array.isArray(sitePolygonData)) {
          const polygonUuids = sitePolygonData
            .map(polygon => polygon.polygonUuid)
            .filter((uuid): uuid is string => Boolean(uuid));
          if (polygonUuids.length > 0) {
            ApiSlice.pruneCache("validations", polygonUuids);
          }
        }

        const updatedPolygonNames = data.updated_polygons
          ?.map(p => p.poly_name)
          .filter(Boolean)
          .join(", ");
        openNotification("success", "Success! The following polygons have been fixed:", updatedPolygonNames);
        hideLoader();
        setIsLoadingDelayedJob?.(false);
      }
      closeModal(ModalId.FIX_POLYGONS);
    },
    onError: error => {
      Log.error("Error clipping polygons:", error);
      openNotification("error", "An error occurred while fixing polygons. Please try again.", "Error");
      hideLoader();
      setIsLoadingDelayedJob?.(false);
    }
  });

  const runFixPolygonOverlaps = useCallback(() => {
    if (siteUuid) {
      closeModal(ModalId.FIX_POLYGONS);
      setIsLoadingDelayedJob?.(true);
      setAlertTitle?.("Fix Polygons");
      clipPolygons({ pathParams: { uuid: siteUuid } });
    } else {
      openNotification("error", "Cannot fix polygons: Site UUID is missing.", "Error");
    }
  }, [siteUuid, closeModal, setIsLoadingDelayedJob, setAlertTitle, clipPolygons, openNotification]);

  return {
    runFixPolygonOverlaps
  };
};
