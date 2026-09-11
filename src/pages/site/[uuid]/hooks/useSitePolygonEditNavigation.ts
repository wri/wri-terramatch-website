import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  buildSitePolygonEditUrl,
  EDIT_POLYGON_QUERY_PARAM,
  scrollToSitePolygonTabHeader
} from "@/components/elements/Map-mapbox/sitePolygonNavigation";
import { resolvePolygonTableRowId } from "@/components/elements/Map-mapbox/sitePolygonPopupUtils";
import { loadSitePolygonByUuid } from "@/connections/SitePolygons";
import { openPolygonPopupFromMapArea } from "@/context/mapArea.utils";
import { openPolygonEditDrawerForSitePolygon } from "@/context/polygonEditDrawer.utils";
import { consumePendingPolygonFocusUuid, setPolygonTableHoveredUuid } from "@/context/polygonTableInteraction.store";
import type {
  SitePolygonLightDto,
  SitePolygonMapEntryDto
} from "@/generated/v3/researchService/researchServiceSchemas";
import Log from "@/utils/log";

import type { PolygonFilterState } from "../components/polygonFilter.constants";

type UseSitePolygonEditNavigationParams = {
  siteUuid: string;
  isAdminReview: boolean;
  isTablePolygonsLoading: boolean;
  mapIndexLoaded: boolean;
  mapPolygons: SitePolygonMapEntryDto[];
  findTableSitePolygon: (polygonId: string) => SitePolygonLightDto | undefined;
  hasOverlapFilter: boolean;
  setPolygonFilters: Dispatch<SetStateAction<PolygonFilterState>>;
  onCloseOverlapFixModal: () => void;
  existingPolygonDuplicate: {
    siteUuid: string;
    sitePolygonUuid: string;
    polygonUuid: string;
  } | null;
};

export const useSitePolygonEditNavigation = ({
  siteUuid,
  isAdminReview,
  isTablePolygonsLoading,
  mapIndexLoaded,
  mapPolygons,
  findTableSitePolygon,
  hasOverlapFilter,
  setPolygonFilters,
  onCloseOverlapFixModal,
  existingPolygonDuplicate
}: UseSitePolygonEditNavigationParams) => {
  const router = useRouter();
  const pendingOverlapFixPolygonIdRef = useRef<string | null>(null);
  const [uploadedPolygonUuidToOpen, setUploadedPolygonUuidToOpen] = useState<string | null>(null);
  const [focusPolygonUuid, setFocusPolygonUuid] = useState<string | null>(null);

  const openPolygonEditDrawerByPolygonId = useCallback(
    (polygonId: string) => {
      const sitePolygon = findTableSitePolygon(polygonId);
      if (sitePolygon != null) {
        openPolygonEditDrawerForSitePolygon(sitePolygon, sitePolygon.name ?? undefined);
        return;
      }

      void loadSitePolygonByUuid({ entityUuid: siteUuid, polygonId })
        .then(loadedPolygon => {
          if (loadedPolygon != null) {
            openPolygonEditDrawerForSitePolygon(loadedPolygon, loadedPolygon.name ?? undefined);
          }
        })
        .catch(error => {
          Log.error("Failed to load polygon for edit drawer:", error);
        });
    },
    [findTableSitePolygon, siteUuid]
  );

  const handleViewOverlapFixPolygon = useCallback(
    (polygonUuid: string) => {
      onCloseOverlapFixModal();

      if (hasOverlapFilter) {
        pendingOverlapFixPolygonIdRef.current = polygonUuid;
        setPolygonFilters(current => ({ ...current, hasOverlap: false }));
        return;
      }

      openPolygonEditDrawerByPolygonId(polygonUuid);
    },
    [hasOverlapFilter, onCloseOverlapFixModal, openPolygonEditDrawerByPolygonId, setPolygonFilters]
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
    const pendingPolygonId = pendingOverlapFixPolygonIdRef.current;
    if (pendingPolygonId == null || hasOverlapFilter || isTablePolygonsLoading) {
      return;
    }

    pendingOverlapFixPolygonIdRef.current = null;
    openPolygonEditDrawerByPolygonId(pendingPolygonId);
  }, [hasOverlapFilter, isTablePolygonsLoading, openPolygonEditDrawerByPolygonId]);

  const editPolygonQueryParam = useMemo(() => {
    if (!router.isReady) {
      return null;
    }

    const value = router.query[EDIT_POLYGON_QUERY_PARAM];
    return typeof value === "string" && value !== "" ? value : null;
  }, [router.isReady, router.query]);

  const clearEditPolygonQueryParam = useCallback(() => {
    if (typeof router.query[EDIT_POLYGON_QUERY_PARAM] !== "string") {
      return;
    }

    const nextQuery = { ...router.query };
    delete nextQuery[EDIT_POLYGON_QUERY_PARAM];
    void router.replace({ pathname: router.pathname, query: nextQuery }, undefined, { shallow: true });
  }, [router]);

  useEffect(() => {
    if (editPolygonQueryParam == null || isTablePolygonsLoading) {
      return;
    }

    const existingInTable = findTableSitePolygon(editPolygonQueryParam);
    if (existingInTable != null) {
      openPolygonEditDrawerForSitePolygon(existingInTable, existingInTable.name ?? undefined);
      clearEditPolygonQueryParam();
      return;
    }

    setUploadedPolygonUuidToOpen(editPolygonQueryParam);
    clearEditPolygonQueryParam();
  }, [clearEditPolygonQueryParam, editPolygonQueryParam, findTableSitePolygon, isTablePolygonsLoading]);

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
    void loadSitePolygonByUuid({ entityUuid: siteUuid, polygonId: polygonIdToOpen })
      .then(loadedPolygon => {
        if (loadedPolygon != null) {
          openPolygonEditDrawerForSitePolygon(loadedPolygon, loadedPolygon.name ?? undefined);
        }
      })
      .catch(error => {
        Log.error("Failed to auto-open uploaded polygon in edit drawer:", error);
      })
      .finally(() => {
        setUploadedPolygonUuidToOpen(current => (current === polygonIdToOpen ? null : current));
      });
  }, [findTableSitePolygon, isTablePolygonsLoading, siteUuid, uploadedPolygonUuidToOpen]);

  useEffect(() => {
    if (!mapIndexLoaded) {
      return;
    }

    const pendingFocusUuid = consumePendingPolygonFocusUuid();
    if (pendingFocusUuid == null || pendingFocusUuid === "") {
      return;
    }

    const rowId = resolvePolygonTableRowId(mapPolygons, pendingFocusUuid);
    if (rowId == null) {
      return;
    }

    setPolygonTableHoveredUuid(rowId);
    setFocusPolygonUuid(pendingFocusUuid);

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0 });
      scrollToSitePolygonTabHeader();
    });
  }, [mapIndexLoaded, mapPolygons]);

  const handleFocusPolygonConsumed = useCallback(() => {
    const focusedUuid = focusPolygonUuid;
    setFocusPolygonUuid(null);
    if (focusedUuid != null && focusedUuid !== "") {
      openPolygonPopupFromMapArea(focusedUuid);
    }
  }, [focusPolygonUuid]);

  return {
    uploadedPolygonUuidToOpen,
    setUploadedPolygonUuidToOpen,
    focusPolygonUuid,
    handleFocusPolygonConsumed,
    openPolygonEditDrawerByPolygonId,
    handleViewOverlapFixPolygon,
    handleViewExistingPolygon
  };
};
