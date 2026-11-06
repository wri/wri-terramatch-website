import { useT } from "@transifex/react";
import { useCallback, useState } from "react";

import { createSitePolygonsGeoJsonExport } from "@/generated/v3/researchService/researchServiceComponents";
import type { GeoJsonExportAttributes } from "@/generated/v3/researchService/researchServiceSchemas";
import Log from "@/utils/log";
import { trackPolygonDownloaded } from "@/utils/polygonAnalytics";

import { isPolygonBackgroundJob, usePolygonBackgroundJob } from "../../site/[uuid]/hooks/usePolygonBackgroundJob";
import {
  closePolygonProgressToast,
  completePolygonProgressToast,
  getDownloadingPolygonsProgressLabel,
  POLYGON_TOAST_IDS,
  showPolygonErrorToast,
  showPolygonProgressToast
} from "../../site/[uuid]/utils/polygonOperationToasts";

export const usePolygonGeoJsonExport = (projectUuid: string | undefined) => {
  const t = useT();
  const runPolygonBackgroundJob = usePolygonBackgroundJob();
  const [isExporting, setIsExporting] = useState(false);

  const startExport = useCallback(
    async (attributes: GeoJsonExportAttributes, polygonCount: number | undefined) => {
      const exportPolygons = async () => {
        await createSitePolygonsGeoJsonExport.downloadFile({
          body: { data: { type: "geojsonExports", attributes } }
        });
        if (projectUuid != null) {
          trackPolygonDownloaded({
            entityUuid: projectUuid,
            entityType: "projects",
            polygonType: "standard",
            polygonCount
          });
        }
      };

      setIsExporting(true);
      if (polygonCount != null && isPolygonBackgroundJob(polygonCount)) {
        await runPolygonBackgroundJob({
          job: "downloading",
          completeLabel: t("Download Complete"),
          errorLabel: t("Error Downloading Polygons"),
          run: exportPolygons
        });
      } else {
        showPolygonProgressToast(t, getDownloadingPolygonsProgressLabel(t), POLYGON_TOAST_IDS.downloading);
        try {
          await exportPolygons();
          completePolygonProgressToast(POLYGON_TOAST_IDS.downloading, t("Download Complete"));
        } catch (error) {
          Log.error("Failed to export polygon GeoJSON:", error);
          closePolygonProgressToast(POLYGON_TOAST_IDS.downloading);
          showPolygonErrorToast(t("Error Downloading Polygons"));
        }
      }
      setIsExporting(false);
    },
    [projectUuid, runPolygonBackgroundJob, t]
  );

  return { startExport, isExporting };
};
