import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";
import { useCallback, useState } from "react";

import { deleteAnrPlotGeometry, upsertAnrPlotGeometryResource } from "@/connections/AnrPlotGeometry";
import { releaseModalScrollLock } from "@/hooks/useModalScrollFix";
import ApiSlice from "@/store/apiSlice";
import Log from "@/utils/log";

const ANR_ACCEPTED_UPLOAD_FORMATS = ".geojson";

const isAcceptedAnrUploadFile = (file: File): boolean => file.name.toLowerCase().endsWith(".geojson");

const parseErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (error != null && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string") {
      try {
        const parsed = JSON.parse(message) as { message?: unknown };
        if (parsed != null && typeof parsed.message === "string" && parsed.message !== "") {
          return parsed.message;
        }
      } catch {
        return message;
      }
      return message;
    }
  }

  return fallbackMessage;
};

type AnrMonitoringPlotActionMode = "upload" | "replace";

type UseAnrMonitoringPlotActionsProps = {
  sitePolygonUuid: string;
  onDeleted?: () => void;
  onUploaded?: () => void;
};

export const useAnrMonitoringPlotActions = ({
  sitePolygonUuid,
  onDeleted,
  onUploaded
}: UseAnrMonitoringPlotActionsProps) => {
  const t = useT();
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const pruneAnrCaches = useCallback(() => {
    if (sitePolygonUuid == null || sitePolygonUuid === "") {
      return;
    }

    ApiSlice.pruneCache("anrPlotGeometries", [sitePolygonUuid]);
    ApiSlice.pruneCache("geojsonExports", [sitePolygonUuid]);
  }, [sitePolygonUuid]);

  const uploadAnrPlotFile = useCallback(
    async (file: File, mode: AnrMonitoringPlotActionMode): Promise<boolean> => {
      if (sitePolygonUuid == null || sitePolygonUuid === "") {
        showToast({
          label: t("Upload Failed"),
          caption: t("Missing polygon information."),
          type: "error",
          placement: "bottom",
          duration: 5000,
          maxWidth: "auto"
        });
        return false;
      }

      if (!isAcceptedAnrUploadFile(file)) {
        showToast({
          label: t("Invalid file"),
          caption: t("Please upload a .geojson file."),
          type: "error",
          placement: "bottom",
          duration: 5000,
          maxWidth: "auto"
        });
        return false;
      }

      setIsUploading(true);
      try {
        await upsertAnrPlotGeometryResource(sitePolygonUuid, file);
        pruneAnrCaches();
        onUploaded?.();
        showToast({
          label: mode === "replace" ? t("Monitoring plots updated") : t("Monitoring plots uploaded"),
          type: "success",
          placement: "bottom",
          duration: 5000,
          maxWidth: "auto"
        });
        return true;
      } catch (error) {
        pruneAnrCaches();
        const errorMessage = parseErrorMessage(error, t("Error uploading ANR monitoring plots"));
        showToast({
          label: t("Upload Failed"),
          caption: t(errorMessage),
          type: "error",
          placement: "bottom",
          duration: 5000,
          maxWidth: "auto"
        });
        Log.error("Failed to upload ANR monitoring plots:", error);
        return false;
      } finally {
        setIsUploading(false);
        releaseModalScrollLock();
      }
    },
    [onUploaded, pruneAnrCaches, sitePolygonUuid, t]
  );

  const deleteAnrPlotFile = useCallback(async (): Promise<boolean> => {
    if (sitePolygonUuid == null || sitePolygonUuid === "") {
      showToast({
        label: t("Delete Failed"),
        caption: t("Missing polygon information."),
        type: "error",
        placement: "bottom",
        duration: 5000,
        maxWidth: "auto"
      });
      return false;
    }

    setIsDeleting(true);
    try {
      await deleteAnrPlotGeometry(sitePolygonUuid);
      pruneAnrCaches();
      onDeleted?.();
      showToast({
        label: t("Monitoring plots deleted"),
        type: "success",
        placement: "bottom",
        duration: 5000,
        maxWidth: "auto"
      });
      return true;
    } catch (error) {
      pruneAnrCaches();
      const errorMessage = parseErrorMessage(error, t("Error deleting ANR monitoring plots"));
      showToast({
        label: t("Delete Failed"),
        caption: t(errorMessage),
        type: "error",
        placement: "bottom",
        duration: 5000,
        maxWidth: "auto"
      });
      Log.error("Failed to delete ANR monitoring plots:", error);
      return false;
    } finally {
      setIsDeleting(false);
      releaseModalScrollLock();
    }
  }, [onDeleted, pruneAnrCaches, sitePolygonUuid, t]);

  return {
    deleteAnrPlotFile,
    isDeleting,
    isUploading,
    uploadAnrPlotFile
  };
};

export { ANR_ACCEPTED_UPLOAD_FORMATS, isAcceptedAnrUploadFile };
