import _ from "lodash";
import { useState } from "react";

import { isProjectPitchesEntityName } from "@/helpers/entity";

import { downloadMultiplePolygonsGeoJson, downloadProjectPolygonsGeoJson } from "../utils";

type UseMapDownloadParams = {
  polygonsData?: Record<string, string[]>;
  entityData?: { entityName?: string; entityUUID?: string };
  record?: { organisation?: { name?: string } };
  t: (key: string) => string;
  openNotification: (type: "success" | "error" | "warning", title: string, message?: any) => void;
};

type UseMapDownloadReturn = {
  isDownloadingPolygons: boolean;
  downloadGeoJsonPolygon: () => Promise<void>;
};

export function useMapDownload({
  polygonsData,
  entityData,
  record,
  t,
  openNotification
}: UseMapDownloadParams): UseMapDownloadReturn {
  const [isDownloadingPolygons, setIsDownloadingPolygons] = useState(false);

  const downloadGeoJsonPolygon = async () => {
    setIsDownloadingPolygons(true);
    try {
      const isProjectContext = isProjectPitchesEntityName(entityData?.entityName ?? "");
      const projectPitchUuid = entityData?.entityUUID;

      if (isProjectContext && projectPitchUuid != null) {
        const projectName = record?.organisation?.name ?? "project";
        const filename = `${_.replace(projectName, /\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}`;
        await downloadProjectPolygonsGeoJson(projectPitchUuid, filename);
        openNotification("success", t("Success"), t("Successfully downloaded project polygons."));
      } else {
        const polygonsToDownload: string[] = polygonsData
          ? Object.values(polygonsData).flatMap(statusPolygons => (Array.isArray(statusPolygons) ? statusPolygons : []))
          : [];

        if (polygonsToDownload.length === 0) {
          openNotification("error", t("Error"), t("No polygons found to download."));
          return;
        }

        const nameFile = record?.organisation?.name ?? "polygons";
        const filename = `${_.replace(nameFile, /\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}`;
        await downloadMultiplePolygonsGeoJson(polygonsToDownload, filename);
        openNotification(
          "success",
          t("Success"),
          t(`Successfully downloaded ${polygonsToDownload.length} polygon(s).`)
        );
      }
    } catch (error: any) {
      const errorMessage = error?.message ?? t("Failed to download polygons. Please try again.");
      openNotification("error", t("Error"), errorMessage);
    } finally {
      setIsDownloadingPolygons(false);
    }
  };

  return { isDownloadingPolygons, downloadGeoJsonPolygon };
}
