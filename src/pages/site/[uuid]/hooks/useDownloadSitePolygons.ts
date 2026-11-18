import { useT } from "@transifex/react";
import { pick } from "lodash";
import { useCallback, useMemo, useState } from "react";

import {
  downloadMultiplePolygonsCsv,
  downloadMultiplePolygonsGeoJson,
  downloadSiteGeoJsonPolygons
} from "@/components/elements/Map-mapbox/utils";
import { exportPolygonsCsv, exportPolygonsGeoJson } from "@/connections/GeoJsonExport";
import type { GeoJsonExportAttributes } from "@/generated/v3/researchService/researchServiceSchemas";
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
import type { PolygonDownloadFormat } from "./useSitePolygonBulkActions";

// The table filters the export endpoints accept, so a download matches what the table shows.
const EXPORT_FILTER_KEYS = [
  "polygonStatus",
  "validationStatus",
  "practice",
  "targetSys",
  "submissionCycle",
  "plantStartFrom",
  "plantStartTo",
  "hasOverlap",
  "hasDisturbance",
  "deletedOnly",
  "search",
  "searchFields"
] as const satisfies readonly (keyof GeoJsonExportAttributes)[];

type UseDownloadSitePolygonsParams = {
  siteUuid: string | null | undefined;
  siteName: string | null | undefined;
};

export const useDownloadSitePolygons = ({ siteUuid, siteName }: UseDownloadSitePolygonsParams) => {
  const t = useT();
  const toastLabels = useMemo(() => getPolygonOperationToastLabels(t), [t]);
  const [isDownloading, setIsDownloading] = useState(false);

  const runDownload = useCallback(
    async (polygonCount: number, download: () => Promise<void>) => {
      if (siteUuid == null || siteUuid === "") return;

      setIsDownloading(true);
      try {
        showPolygonProgressToast(t, getDownloadingPolygonsProgressLabel(t), POLYGON_TOAST_IDS.downloading);
        await download();
        trackPolygonDownloaded({
          entityUuid: siteUuid,
          polygonType: "standard",
          polygonCount
        });
        completePolygonProgressToast(POLYGON_TOAST_IDS.downloading, toastLabels.downloadingPolygonsComplete);
      } catch (error) {
        Log.error("Failed to download site polygons:", error);
        closePolygonProgressToast(POLYGON_TOAST_IDS.downloading);
        showPolygonErrorToast(t("Error Downloading Polygons"));
      } finally {
        setIsDownloading(false);
      }
    },
    [siteUuid, t, toastLabels]
  );

  /**
   * Downloads every polygon of the site that matches the table's filters, but not its paging. Without filters
   * the GeoJSON keeps the extended-data download; with filters it goes through the export endpoint, which applies them.
   */
  const downloadWholeEntity = useCallback(
    (format: PolygonDownloadFormat, filter: Partial<GeoJsonExportAttributes>, polygonCount: number) =>
      runDownload(polygonCount, async () => {
        if (siteUuid == null || siteUuid === "") return;
        const filters = pick(filter, EXPORT_FILTER_KEYS);
        const hasFilters = Object.keys(filters).length > 0;
        if (format === "csv") {
          await exportPolygonsCsv({ siteUuids: [siteUuid], ...filters });
        } else if (hasFilters) {
          await exportPolygonsGeoJson({ siteUuids: [siteUuid], ...filters });
        } else {
          await downloadSiteGeoJsonPolygons(siteUuid, siteName ?? "");
        }
      }),
    [runDownload, siteName, siteUuid]
  );

  /** Downloads only the polygon UUIDs passed in, e.g. the rows on the current table page. */
  const downloadCurrentView = useCallback(
    (format: PolygonDownloadFormat, polygonUuids: string[]) =>
      runDownload(polygonUuids.length, async () => {
        if (format === "csv") {
          await downloadMultiplePolygonsCsv(polygonUuids);
        } else {
          await downloadMultiplePolygonsGeoJson(polygonUuids, siteName ?? "polygon");
        }
      }),
    [runDownload, siteName]
  );

  return { downloadWholeEntity, downloadCurrentView, isDownloading };
};
