import { useCallback, useState } from "react";

import { downloadSiteGeoJsonPolygons } from "@/components/elements/Map-mapbox/utils";
import Log from "@/utils/log";

type UseDownloadSitePolygonsParams = {
  siteUuid: string | null | undefined;
  siteName: string | null | undefined;
};

export const useDownloadSitePolygons = ({ siteUuid, siteName }: UseDownloadSitePolygonsParams) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadAll = useCallback(async () => {
    if (siteUuid == null || siteUuid === "") return;

    setIsDownloading(true);
    try {
      await downloadSiteGeoJsonPolygons(siteUuid, siteName ?? "");
    } catch (error) {
      Log.error("Failed to download site polygons:", error);
    } finally {
      setIsDownloading(false);
    }
  }, [siteUuid, siteName]);

  return { downloadAll, isDownloading };
};
