import { useCallback, useEffect, useState } from "react";

import { buildSitePolygonEditUrl } from "@/components/elements/Map-mapbox/sitePolygonNavigation";
import {
  openPolygonEditDrawerForPolygonId,
  openPolygonEditDrawerForSitePolygon
} from "@/context/polygonEditDrawer.utils";
import type { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import Log from "@/utils/log";

export type ExistingPolygonDuplicate = {
  siteUuid: string;
  sitePolygonUuid: string;
  polygonUuid: string;
};

type UseOpenSitePolygonInDrawerParams = {
  siteUuid: string;
  isAdminReview: boolean;
  isTablePolygonsLoading: boolean;
  findTableSitePolygon: (polygonId: string) => SitePolygonLightDto | undefined;
  existingPolygonDuplicate: ExistingPolygonDuplicate | null;
};

/**
 * Opens a site's polygon in the edit drawer: by id, after an upload (once the table has had a chance to load it),
 * or from the "existing polygon" duplicate modal (polygons on another site open in a new tab).
 */
export const useOpenSitePolygonInDrawer = ({
  siteUuid,
  isAdminReview,
  isTablePolygonsLoading,
  findTableSitePolygon,
  existingPolygonDuplicate
}: UseOpenSitePolygonInDrawerParams) => {
  const [uploadedPolygonUuidToOpen, setUploadedPolygonUuidToOpen] = useState<string | null>(null);

  const openPolygonEditDrawerByPolygonId = useCallback(
    (polygonId: string) =>
      openPolygonEditDrawerForPolygonId({
        polygonId,
        entityName: "sites",
        entityUuid: siteUuid,
        findCachedSitePolygon: findTableSitePolygon
      }),
    [findTableSitePolygon, siteUuid]
  );

  const handleViewExistingPolygon = useCallback(() => {
    if (existingPolygonDuplicate == null) {
      return;
    }

    const { siteUuid: duplicateSiteUuid, sitePolygonUuid, polygonUuid } = existingPolygonDuplicate;
    const isSameSite = duplicateSiteUuid === "" || duplicateSiteUuid === siteUuid;

    if (isSameSite) {
      const existingInTable = findTableSitePolygon(sitePolygonUuid) ?? findTableSitePolygon(polygonUuid);
      if (existingInTable != null) {
        openPolygonEditDrawerForSitePolygon(existingInTable, existingInTable.name ?? undefined);
        return;
      }

      setUploadedPolygonUuidToOpen(sitePolygonUuid);
      return;
    }

    window.open(
      buildSitePolygonEditUrl(duplicateSiteUuid, sitePolygonUuid, { adminReview: isAdminReview }),
      "_blank",
      "noopener,noreferrer"
    );
  }, [existingPolygonDuplicate, findTableSitePolygon, isAdminReview, siteUuid]);

  useEffect(() => {
    if (uploadedPolygonUuidToOpen == null) {
      return;
    }

    const uploadedPolygon = findTableSitePolygon(uploadedPolygonUuidToOpen);
    if (uploadedPolygon != null) {
      openPolygonEditDrawerForSitePolygon(uploadedPolygon, uploadedPolygon.name ?? undefined);
      setUploadedPolygonUuidToOpen(null);
      return;
    }

    if (isTablePolygonsLoading) {
      return;
    }

    const polygonIdToOpen = uploadedPolygonUuidToOpen;
    void openPolygonEditDrawerByPolygonId(polygonIdToOpen)
      .catch(error => {
        Log.error("Failed to auto-open uploaded polygon in edit drawer:", error);
      })
      .finally(() => {
        setUploadedPolygonUuidToOpen(current => (current === polygonIdToOpen ? null : current));
      });
  }, [findTableSitePolygon, isTablePolygonsLoading, openPolygonEditDrawerByPolygonId, uploadedPolygonUuidToOpen]);

  return {
    uploadedPolygonUuidToOpen,
    setUploadedPolygonUuidToOpen,
    openPolygonEditDrawerByPolygonId,
    handleViewExistingPolygon
  };
};
