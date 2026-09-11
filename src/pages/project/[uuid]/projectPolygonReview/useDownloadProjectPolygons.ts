import { useT } from "@transifex/react";
import { useCallback, useState } from "react";

import { downloadProjectSitePolygonsGeoJson } from "@/components/elements/Map-mapbox/utils";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import Log from "@/utils/log";

/**
 * "Download All" for a project's polygons — a server-side full-project GeoJSON export
 * (`downloadProjectSitePolygonsGeoJson`). Shared by the rollup and flat project-review views so the
 * loading state, error handling, and export options live in one place.
 */
export const useDownloadProjectPolygons = (project: ProjectFullDto) => {
  const t = useT();
  const [isDownloading, setIsDownloading] = useState(false);

  const download = useCallback(async () => {
    setIsDownloading(true);
    try {
      await downloadProjectSitePolygonsGeoJson(project.uuid, project.name ?? t("Project"), {
        includeExtendedData: true
      });
    } catch (error) {
      Log.error("Failed to download project polygons:", error);
    } finally {
      setIsDownloading(false);
    }
  }, [project.uuid, project.name, t]);

  return { isDownloading, download };
};
