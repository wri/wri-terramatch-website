import { useT } from "@transifex/react";
import { useCallback, useState } from "react";

import { createSitePolygonsGeoJsonExport } from "@/generated/v3/researchService/researchServiceComponents";
import type { GeoJsonExportAttributes } from "@/generated/v3/researchService/researchServiceSchemas";
import Log from "@/utils/log";
import { trackPolygonDownloaded } from "@/utils/polygonAnalytics";

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
  const [isExporting, setIsExporting] = useState(false);

  const startExport = useCallback(
    async (attributes: GeoJsonExportAttributes, polygonCount: number | undefined) => {
      setIsExporting(true);
      showPolygonProgressToast(t, getDownloadingPolygonsProgressLabel(t), POLYGON_TOAST_IDS.downloading);
      try {
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
        completePolygonProgressToast(POLYGON_TOAST_IDS.downloading, t("Download Complete"));
      } catch (error) {
        Log.error("Failed to export polygon GeoJSON:", error);
        closePolygonProgressToast(POLYGON_TOAST_IDS.downloading);
        showPolygonErrorToast(t("Error Downloading Polygons"));
      } finally {
        setIsExporting(false);
      }
    },
    [projectUuid, t]
  );

  return { startExport, isExporting };
};
