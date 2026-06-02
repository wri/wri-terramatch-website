import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";
import { useCallback, useState } from "react";

import { downloadSiteGeoJsonPolygons } from "@/components/elements/Map-mapbox/utils";
import Log from "@/utils/log";

type UseDownloadSitePolygonsParams = {
  siteUuid: string | null | undefined;
  siteName: string | null | undefined;
};

const TOAST_PLACEMENT = "bottom-end" as const;
const TOAST_DURATION_MS = 5000;

export const useDownloadSitePolygons = ({ siteUuid, siteName }: UseDownloadSitePolygonsParams) => {
  const t = useT();
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadAll = useCallback(async () => {
    if (siteUuid == null || siteUuid === "") return;

    setIsDownloading(true);
    try {
      showToast({
        label: t("Downloading Polygons..."),
        type: "info",
        placement: TOAST_PLACEMENT,
        duration: TOAST_DURATION_MS,
        closableLabel: t("Close")
      });
      await downloadSiteGeoJsonPolygons(siteUuid, siteName ?? "");
      showToast({
        label: t("Download Complete"),
        type: "success",
        placement: TOAST_PLACEMENT,
        duration: TOAST_DURATION_MS
      });
    } catch (error) {
      Log.error("Failed to download site polygons:", error);
      showToast({
        label: t("Error downloading polygons"),
        type: "error",
        placement: TOAST_PLACEMENT,
        duration: TOAST_DURATION_MS
      });
    } finally {
      setIsDownloading(false);
    }
  }, [siteUuid, siteName, t]);

  return { downloadAll, isDownloading };
};
