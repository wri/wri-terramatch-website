import { useT } from "@transifex/react";
import { useCallback, useState } from "react";

import { createSitePolygonsGeoJsonExport } from "@/generated/v3/researchService/researchServiceComponents";
import type { GeoJsonExportAttributes } from "@/generated/v3/researchService/researchServiceSchemas";
import Log from "@/utils/log";

import {
  closePolygonProgressToast,
  completePolygonProgressToast,
  getDownloadingPolygonsProgressLabel,
  POLYGON_TOAST_IDS,
  showPolygonErrorToast,
  showPolygonProgressToast
} from "../../site/[uuid]/utils/polygonOperationToasts";

export const usePolygonGeoJsonExport = () => {
  const t = useT();
  const [isExporting, setIsExporting] = useState(false);

  const startExport = useCallback(
    async (attributes: GeoJsonExportAttributes) => {
      setIsExporting(true);
      showPolygonProgressToast(t, getDownloadingPolygonsProgressLabel(t), POLYGON_TOAST_IDS.downloading);
      try {
        await createSitePolygonsGeoJsonExport.downloadFile({
          body: { data: { type: "geojsonExports", attributes } }
        });
        completePolygonProgressToast(POLYGON_TOAST_IDS.downloading, t("Download Complete"));
      } catch (error) {
        Log.error("Failed to export polygon GeoJSON:", error);
        closePolygonProgressToast(POLYGON_TOAST_IDS.downloading);
        showPolygonErrorToast(t("Error Downloading Polygons"));
      } finally {
        setIsExporting(false);
      }
    },
    [t]
  );

  return { startExport, isExporting };
};
