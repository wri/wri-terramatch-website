import { useT } from "@transifex/react";
import { useCallback, useMemo, useState } from "react";

import { downloadSiteGeoJsonPolygons } from "@/components/elements/Map-mapbox/utils";
import Log from "@/utils/log";
import { trackPolygonDownloaded } from "@/utils/polygonAnalytics";

import {
  closePolygonProgressToast,
  completePolygonProgressToast,
  getDownloadingPolygonsProgressLabel,
  getPolygonOperationToastLabels,
  POLYGON_TOAST_IDS,
  showPolygonErrorToast,
  showPolygonProgressToast
} from "../utils/polygonOperationToasts";

type UseDownloadSitePolygonsParams = {
  siteUuid: string | null | undefined;
  siteName: string | null | undefined;
};

export const useDownloadSitePolygons = ({ siteUuid, siteName }: UseDownloadSitePolygonsParams) => {
  const t = useT();
  const toastLabels = useMemo(() => getPolygonOperationToastLabels(t), [t]);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadAll = useCallback(async () => {
    if (siteUuid == null || siteUuid === "") return;

    setIsDownloading(true);
    try {
      showPolygonProgressToast(t, getDownloadingPolygonsProgressLabel(t), POLYGON_TOAST_IDS.downloading);
      await downloadSiteGeoJsonPolygons(siteUuid, siteName ?? "");
      trackPolygonDownloaded({
        siteUuid,
        polygonType: "standard",
        polygonCount: 1
      });
      completePolygonProgressToast(POLYGON_TOAST_IDS.downloading, toastLabels.downloadingPolygonsComplete);
    } catch (error) {
      Log.error("Failed to download site polygons:", error);
      closePolygonProgressToast(POLYGON_TOAST_IDS.downloading);
      showPolygonErrorToast(t("Error downloading polygons"));
    } finally {
      setIsDownloading(false);
    }
  }, [siteUuid, siteName, t, toastLabels]);

  return { downloadAll, isDownloading };
};
