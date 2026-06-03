import { useT } from "@transifex/react";
import { useCallback, useMemo, useState } from "react";

import { downloadSiteGeoJsonPolygons } from "@/components/elements/Map-mapbox/utils";
import Log from "@/utils/log";

import {
  getPolygonOperationToastLabels,
  showPolygonCompleteToast,
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
      showPolygonProgressToast(t, toastLabels.downloadingPolygonsProgress);
      await downloadSiteGeoJsonPolygons(siteUuid, siteName ?? "");
      showPolygonCompleteToast(toastLabels.downloadingPolygonsComplete);
    } catch (error) {
      Log.error("Failed to download site polygons:", error);
      showPolygonErrorToast(t("Error downloading polygons"));
    } finally {
      setIsDownloading(false);
    }
  }, [siteUuid, siteName, t, toastLabels]);

  return { downloadAll, isDownloading };
};
