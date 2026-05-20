import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CircularProgress from "@mui/material/CircularProgress";
import { useT } from "@transifex/react";
import { ChangeEvent, FC, useCallback, useEffect, useRef, useState } from "react";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import {
  deleteAnrPlotGeometry,
  upsertAnrPlotGeometryResource,
  useAnrPlotGeometry
} from "@/connections/AnrPlotGeometry";
import { useAnrMapOverlayOptional } from "@/context/anrMapOverlay.provider";
import { useModalContext } from "@/context/modal.provider";
import { useNotificationContext } from "@/context/notification.provider";
import ApiSlice from "@/store/apiSlice";
import Log from "@/utils/log";
function getAnrPlotGeometryErrorMessage(error: unknown, fallback: string): string {
  if (error != null && typeof error === "object" && "message" in error) {
    try {
      const parsedMessage = JSON.parse((error as any).message as string);
      if (parsedMessage != null && typeof parsedMessage === "object" && "message" in parsedMessage) {
        return parsedMessage.message as string;
      }
    } catch {
      return (error as any).message as string;
    }
  }
  return fallback;
}

const AnrMonitoringPlots: FC<{
  sitePolygonUuid: string;
  dataFetchEnabled?: boolean;
}> = ({ sitePolygonUuid, dataFetchEnabled = true }) => {
  const t = useT();
  const { openModal, closeModal } = useModalContext();
  const { openNotification } = useNotificationContext();
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const prevSitePolygonUuidRef = useRef<string | null>(null);
  const [plotsVisible, setPlotsVisible] = useState(true);
  const anrMapOverlay = useAnrMapOverlayOptional();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [connectionReady, { data: anrPlotGeometry, isLoading }] = useAnrPlotGeometry({
    sitePolygonUuid,
    enabled: sitePolygonUuid !== "" && dataFetchEnabled
  });

  const isPlotsRequestPending = !connectionReady || Boolean(isLoading) || isUploading;

  const hasAnrPlotGeometry = anrPlotGeometry?.geojson?.features != null;

  useEffect(() => {
    if (sitePolygonUuid === "") {
      prevSitePolygonUuidRef.current = "";
      return;
    }
    const prev = prevSitePolygonUuidRef.current;
    if (prev != null && prev !== "" && prev !== sitePolygonUuid) {
      setPlotsVisible(false);
    }
    prevSitePolygonUuidRef.current = sitePolygonUuid ?? null;
  }, [sitePolygonUuid]);

  useEffect(() => {
    if (anrMapOverlay == null) {
      return;
    }
    anrMapOverlay.setShowPlotsOnMap(plotsVisible);
  }, [anrMapOverlay, plotsVisible]);

  const refreshAnrPlotGeometryAfterUpload = useCallback(() => {
    if (sitePolygonUuid == null) return;
    ApiSlice.pruneCache("anrPlotGeometries", [sitePolygonUuid]);
    ApiSlice.pruneCache("geojsonExports", [sitePolygonUuid]);
  }, [sitePolygonUuid]);

  const refreshAnrPlotGeometryAfterDelete = useCallback(() => {
    if (sitePolygonUuid == null) return;
    ApiSlice.pruneCache("anrPlotGeometries", [sitePolygonUuid]);
    ApiSlice.pruneCache("geojsonExports", [sitePolygonUuid]);
  }, [sitePolygonUuid]);

  const uploadAnrPlotGeometry = useCallback(async () => {
    if (sitePolygonUuid == null) {
      setIsUploading(false);
      return;
    }
    try {
      const file = uploadInputRef.current?.files?.[0];
      if (file == null) {
        setIsUploading(false);
        return;
      }
      await upsertAnrPlotGeometryResource(sitePolygonUuid, file);
      refreshAnrPlotGeometryAfterUpload();
      openNotification("success", t("Success!"), t("ANR monitoring plots uploaded successfully"));
    } catch (error) {
      refreshAnrPlotGeometryAfterUpload();
      const errorMessage = getAnrPlotGeometryErrorMessage(error, t("Error uploading ANR monitoring plots"));
      // TODO: review errorMessage possible values and translate them
      openNotification("error", t("Error!"), t(errorMessage));
      Log.error("Error uploading ANR monitoring plots", error);
    } finally {
      setIsUploading(false);
      if (uploadInputRef.current != null) {
        uploadInputRef.current.value = "";
      }
    }
  }, [openNotification, refreshAnrPlotGeometryAfterUpload, sitePolygonUuid, t]);

  const onSelectGeoJsonFile = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file == null) return;
      const hasGeoJsonExtension = file.name.toLowerCase().endsWith(".geojson");
      if (!hasGeoJsonExtension) {
        openNotification("error", t("Invalid file"), t("Please upload a .geojson file."));
        event.target.value = "";
        return;
      }
      setIsUploading(true);
      await uploadAnrPlotGeometry();
    },
    [openNotification, t, uploadAnrPlotGeometry]
  );

  const openDeleteConfirmModal = useCallback(() => {
    openModal(
      ModalId.CONFIRM_ANR_MONITORING_PLOTS_DELETION,
      <ModalConfirm
        title={t("Delete ANR Monitoring Plots")}
        content={t("Are you sure you want to delete ANR monitoring plots for this polygon? This cannot be undone.")}
        onClose={() => closeModal(ModalId.CONFIRM_ANR_MONITORING_PLOTS_DELETION)}
        onConfirm={async () => {
          if (sitePolygonUuid == null) {
            closeModal(ModalId.CONFIRM_ANR_MONITORING_PLOTS_DELETION);
            return;
          }
          try {
            setIsDeleting(true);
            await deleteAnrPlotGeometry(sitePolygonUuid);
            refreshAnrPlotGeometryAfterDelete();
            openNotification("success", t("Success!"), t("ANR monitoring plots deleted successfully"));
          } catch (error) {
            refreshAnrPlotGeometryAfterDelete();
            const errorMessage = getAnrPlotGeometryErrorMessage(error, t("Error deleting ANR monitoring plots"));
            // TODO: review errorMessage possible values and translate them
            openNotification("error", t("Error!"), t(errorMessage));
            Log.error("Error deleting ANR monitoring plots", error);
          } finally {
            setIsDeleting(false);
            closeModal(ModalId.CONFIRM_ANR_MONITORING_PLOTS_DELETION);
          }
        }}
      />
    );
  }, [closeModal, openModal, openNotification, refreshAnrPlotGeometryAfterDelete, sitePolygonUuid, t]);

  const openUploadDialog = useCallback(() => {
    uploadInputRef.current?.click();
  }, []);

  const geoJsonInput = (
    <input ref={uploadInputRef} type="file" accept=".geojson" className="hidden" onChange={onSelectGeoJsonFile} />
  );

  if (sitePolygonUuid == null) {
    return (
      <div className="flex flex-col gap-3">
        <Text variant="text-14" className="text-gray-500">
          {t("ANR Monitoring Plots")}
        </Text>
        <Text variant="text-12" className="text-gray-400">
          {t("Select a polygon to view ANR monitoring plots.")}
        </Text>
        {geoJsonInput}
      </div>
    );
  }

  if (!dataFetchEnabled) {
    return (
      <div className="flex flex-col gap-3">
        <Text variant="text-14" className="text-darkCustom">
          {t("ANR Monitoring Plots")}
        </Text>
        <Text variant="text-12" className="text-gray-500">
          {t(
            "ANR monitoring plots are only available for approved polygons that include Assisted Natural Regeneration as a restoration practice."
          )}
        </Text>
      </div>
    );
  }

  if (isPlotsRequestPending) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-4">
        <CircularProgress size={28} aria-label={t("Loading")} />
        <Text variant="text-14-light">{t("Loading ANR monitoring plots...")}</Text>
      </div>
    );
  }

  if (hasAnrPlotGeometry) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-1.5">
          <Text variant="text-14-semibold" className="text-darkCustom">
            {t("Assisted Natural Regeneration Monitoring Plots")}
          </Text>
          <button
            type="button"
            className="group text-darkCustom"
            onClick={() => setPlotsVisible(prev => !prev)}
            aria-label={plotsVisible ? t("Hide ANR monitoring plots") : t("Show ANR monitoring plots")}
          >
            {plotsVisible ? (
              <Visibility sx={{ fontSize: 22 }} className="group-hover:text-primary-500" />
            ) : (
              <VisibilityOff sx={{ fontSize: 22 }} className="group-hover:text-primary-500" />
            )}
          </button>
        </div>
        <Button
          onClick={openUploadDialog}
          variant="semi-black"
          iconProps={{ name: IconNames.UPLOAD_CLOUD_CUSTOM }}
          className="border-[1px]"
          disabled={isUploading}
        >
          <span className="text-12-bold normal-case text-darkCustom">{t("Replace ANR Monitoring Plots")}</span>
        </Button>
        <Button
          onClick={openDeleteConfirmModal}
          variant="semi-red"
          iconProps={{ name: IconNames.TRASH_PA }}
          className="border-[1px]"
          disabled={isDeleting}
        >
          <span className="text-12-bold normal-case text-darkCustom">{t("Delete ANR Monitoring Plots")}</span>
        </Button>
        {geoJsonInput}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Text variant="text-14-semibold" className="text-darkCustom">
        {t("Assisted Natural Regeneration Monitoring Plots")}
      </Text>
      <Text variant="text-12-semibold" className="text-gray-500">
        {t("Upload ANR Monitoring Plots")}
      </Text>
      <Button onClick={openUploadDialog} variant="semi-black" iconProps={{ name: IconNames.UPLOAD_CLOUD_CUSTOM }}>
        <span className="text-12-bold normal-case text-darkCustom">{t("Upload")}</span>
      </Button>
      {geoJsonInput}
    </div>
  );
};

export default AnrMonitoringPlots;
