import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";
import { useCallback, useMemo, useRef, useState } from "react";

import { downloadMultiplePolygonsGeoJson } from "@/components/elements/Map-mapbox/utils";
import { clipPolygonListAsync } from "@/connections/PolygonClipping";
import type { BulkSitePolygonAttributeChanges, PolygonStatus } from "@/connections/SitePolygons";
import {
  bulkDeleteSitePolygons,
  bulkUpdateSitePolygonAttributes,
  bulkUpdateSitePolygonStatus,
  loadAllSitePolygons,
  pruneSitePolygonsCache
} from "@/connections/SitePolygons";
import { createPolygonValidation } from "@/connections/Validation";
import { POLYGON_PENDING_APPROVAL } from "@/constants/polygonStatuses";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { openPolygonEditDrawerForSitePolygon } from "@/context/polygonEditDrawer.utils";
import { setPolygonTableHoveredUuid } from "@/context/polygonTableInteraction.store";
import type { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { listDelayedJobs } from "@/generated/v3/jobService/jobServiceComponents";
import type { SitePolygonLightDto, ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";
import ApiSlice from "@/store/apiSlice";
import Log from "@/utils/log";

import type { OverlapFixPolygon } from "../components/Modals/OverlapFix";
import type { PolygonOverlapFixParams } from "../components/polygonEdit.types";
import { prunePolygonValidationCache } from "../components/polygonEditSave";
import type { PolygonTableRow } from "../components/PolygonTableRow";
import {
  closePolygonProgressToast,
  getDownloadingPolygonsProgressLabel,
  getFixingOverlapsProgressLabel,
  getPolygonOperationToastLabels,
  getSubmittingProgressLabel,
  POLYGON_TOAST_IDS,
  showPolygonCompleteToast,
  showPolygonErrorToast,
  showPolygonProgressToast
} from "../utils/polygonOperationToasts";
import {
  type OverlapFixSelectionSummary,
  buildOverlapFixResultPolygons,
  extractClippedVersions,
  resolveActivePolygonAfterOverlapFix
} from "./overlapFix.utils";

type FetchValidations = (clearCache?: boolean) => Promise<ValidationDto[] | undefined>;

type UseSitePolygonBulkActionsParams = {
  site: SiteFullDto;
  polygonsData: SitePolygonLightDto[];
  selectedRows: PolygonTableRow[];
  selectedSitePolygons: SitePolygonLightDto[];
  selectedSitePolygonUuids: string[];
  selectedGeometryPolygonUuids: string[];
  selectedSubmittablePolygons: SitePolygonLightDto[];
  selectedSubmittablePolygonUuids: string[];
  selectedOverlapFixSummary: OverlapFixSelectionSummary;
  hasSelectedOverlapFailure: boolean;
  clearBulkTableSelection: () => void;
  refetchPolygons: () => Promise<unknown>;
  fetchAllValidationPages: FetchValidations;
  fetchOverlapValidations: FetchValidations;
  onOverlapFixResultsOpen: (results: {
    polygonsFixed: OverlapFixPolygon[];
    polygonsNotFixed: OverlapFixPolygon[];
  }) => void;
};

export const useSitePolygonBulkActions = ({
  site,
  polygonsData,
  selectedRows,
  selectedSitePolygons,
  selectedSitePolygonUuids,
  selectedGeometryPolygonUuids,
  selectedSubmittablePolygons,
  selectedSubmittablePolygonUuids,
  selectedOverlapFixSummary,
  hasSelectedOverlapFailure,
  clearBulkTableSelection,
  refetchPolygons,
  fetchAllValidationPages,
  fetchOverlapValidations,
  onOverlapFixResultsOpen
}: UseSitePolygonBulkActionsParams) => {
  const t = useT();
  const toastLabels = useMemo(() => getPolygonOperationToastLabels(t), [t]);
  const {
    closeMapPopups,
    invalidatePolygonMapTiles,
    polygonSubmitConfirmation,
    setPolygonSubmitConfirmation,
    setShouldRefetchPolygonData
  } = useMapAreaContext();
  const { openNotification } = useNotificationContext();

  const pendingPolygonSubmittedModalRef = useRef(false);

  const [deletePayload, setDeletePayload] = useState<{
    polygons: PolygonTableRow[];
    sitePolygonUuids: string[];
  } | null>(null);
  const [submitPayload, setSubmitPayload] = useState<{
    submittablePolygonUuids: string[];
    submittedNames: string[];
    eligibleCount: number;
    totalCount: number;
    polygons: PolygonTableRow[];
  } | null>(null);
  const [bulkEditPayload, setBulkEditPayload] = useState<{
    polygons: PolygonTableRow[];
    sitePolygonUuids: string[];
  } | null>(null);
  const [showSubmitPolygonsModal, setSubmitPolygonsModal] = useState(false);
  const [showPolygonSubmittedModal, setPolygonSubmittedModal] = useState(false);
  const [submittedPolygonNames, setSubmittedPolygonNames] = useState<string[]>([]);
  const [showDeletePolygonModal, setDeletePolygonModal] = useState(false);
  const [showBulkEditDrawer, setShowBulkEditDrawer] = useState(false);
  const [isDownloadingSelectedPolygons, setIsDownloadingSelectedPolygons] = useState(false);
  const [isBulkUpdatingPolygons, setIsBulkUpdatingPolygons] = useState(false);
  const [isValidatingPolygons, setIsValidatingPolygons] = useState(false);
  const [validatingPolygonCount, setValidatingPolygonCount] = useState(0);
  const [isFixingOverlaps, setIsFixingOverlaps] = useState(false);
  const [fixingOverlapsCount, setFixingOverlapsCount] = useState(0);
  const [isDeletingPolygons, setIsDeletingPolygons] = useState(false);
  const [deletingPolygonCount, setDeletingPolygonCount] = useState(0);

  const refreshPolygonData = useCallback(
    async ({
      refreshValidations = false,
      loadAll = false
    }: { refreshValidations?: boolean; loadAll?: boolean } = {}) => {
      pruneSitePolygonsCache();

      const allPolygonsPromise = loadAll
        ? loadAllSitePolygons({
            entityName: "sites",
            entityUuid: site.uuid,
            enabled: site.uuid != null && site.uuid !== ""
          })
        : Promise.resolve<SitePolygonLightDto[]>([]);

      const refreshPromises: Promise<unknown>[] = [refetchPolygons(), allPolygonsPromise];
      if (refreshValidations) {
        refreshPromises.push(fetchAllValidationPages(true), fetchOverlapValidations(true));
      }

      const [, refreshedPolygons] = await Promise.all(refreshPromises);
      return refreshedPolygons as SitePolygonLightDto[];
    },
    [fetchAllValidationPages, fetchOverlapValidations, refetchPolygons, site.uuid]
  );

  const openPolygonEditDrawerForRow = useCallback(
    (row: PolygonTableRow) => {
      const sitePolygon = polygonsData.find(polygon => (polygon.polygonUuid ?? polygon.uuid) === row.id);
      openPolygonEditDrawerForSitePolygon(sitePolygon, row.polygonName);
    },
    [polygonsData]
  );

  const handlePolygonSubmittedModalChange = useCallback((open: boolean) => {
    setPolygonSubmittedModal(open);
    if (!open) {
      setSubmittedPolygonNames([]);
    }
  }, []);

  const schedulePolygonSubmittedModal = useCallback(() => {
    window.setTimeout(() => {
      setPolygonSubmittedModal(true);
    }, 200);
  }, []);

  const handleSubmitPolygonsModalChange = useCallback(
    (open: boolean) => {
      setSubmitPolygonsModal(open);
      if (!open) {
        setSubmitPayload(null);
      }
      if (!open && pendingPolygonSubmittedModalRef.current) {
        pendingPolygonSubmittedModalRef.current = false;
        schedulePolygonSubmittedModal();
      }
    },
    [schedulePolygonSubmittedModal]
  );

  const handleMapPopupSubmitModalChange = useCallback(
    (open: boolean) => {
      if (open) {
        return;
      }
      setPolygonSubmitConfirmation(null);
      if (pendingPolygonSubmittedModalRef.current) {
        pendingPolygonSubmittedModalRef.current = false;
        schedulePolygonSubmittedModal();
      }
    },
    [schedulePolygonSubmittedModal, setPolygonSubmitConfirmation]
  );

  const handleOpenDeletePolygonModal = useCallback(() => {
    setDeletePayload({
      polygons: selectedRows,
      sitePolygonUuids: selectedSitePolygonUuids
    });
    clearBulkTableSelection();
    setDeletePolygonModal(true);
  }, [clearBulkTableSelection, selectedRows, selectedSitePolygonUuids]);

  const handleDeletePolygonModalChange = useCallback((open: boolean) => {
    setDeletePolygonModal(open);
    if (!open) {
      setDeletePayload(null);
    }
  }, []);

  const handleBulkDelete = useCallback(async () => {
    const sitePolygonUuids = deletePayload?.sitePolygonUuids ?? [];
    if (sitePolygonUuids.length === 0) {
      openNotification("error", t("Error!"), t("Could not find selected polygons to delete"));
      return;
    }

    setIsDeletingPolygons(true);
    setDeletingPolygonCount(sitePolygonUuids.length);

    try {
      await bulkDeleteSitePolygons(sitePolygonUuids);
      setDeletePolygonModal(false);
      setDeletePayload(null);
      closeMapPopups();
      setPolygonTableHoveredUuid(null);
      invalidatePolygonMapTiles();
      await refreshPolygonData();
      closePolygonProgressToast(POLYGON_TOAST_IDS.deleting);
      showPolygonCompleteToast(toastLabels.deletingComplete);
    } catch (error) {
      Log.error("Failed to delete selected polygons:", error);
      closePolygonProgressToast(POLYGON_TOAST_IDS.deleting);
      openNotification("error", t("Error!"), t("Error deleting polygons"));
      throw error;
    } finally {
      setIsDeletingPolygons(false);
      setDeletingPolygonCount(0);
    }
  }, [closeMapPopups, deletePayload, invalidatePolygonMapTiles, openNotification, refreshPolygonData, t, toastLabels]);

  const runPolygonValidation = useCallback(async (polygonUuids: string[]) => {
    if (polygonUuids.length === 0) {
      return;
    }

    await createPolygonValidation({ polygonUuids });
    ApiSlice.pruneCache("validations");
    await listDelayedJobs.fetch({});
  }, []);

  const handleRunValidation = useCallback(
    async (polygonUuids: string[]) => {
      if (polygonUuids.length === 0) {
        return;
      }

      try {
        setValidatingPolygonCount(polygonUuids.length);
        setIsValidatingPolygons(true);
        await runPolygonValidation(polygonUuids);
      } catch (error) {
        Log.error("Failed to validate selected polygons:", error);
        openNotification("error", t("Error!"), t("Failed to validate polygons"));
        throw error;
      } finally {
        setIsValidatingPolygons(false);
        setValidatingPolygonCount(0);
      }
    },
    [openNotification, runPolygonValidation, t]
  );

  const handlePolygonDeletingChange = useCallback((isDeleting: boolean, count = 0) => {
    setIsDeletingPolygons(isDeleting);
    setDeletingPolygonCount(count);
  }, []);

  const handleDrawerOverlapFixed = useCallback(
    async (params: PolygonOverlapFixParams) => {
      prunePolygonValidationCache(params.previousPolygonUuid);
      invalidatePolygonMapTiles();

      const refreshedPolygons = await refreshPolygonData({ refreshValidations: true, loadAll: true });

      const updatedPolygon = resolveActivePolygonAfterOverlapFix(
        refreshedPolygons,
        {
          previousPolygonUuid: params.previousPolygonUuid,
          primaryUuid: params.primaryUuid,
          sitePolygonUuid: params.sitePolygonUuid
        },
        params.clippedVersions ?? []
      );

      if (updatedPolygon?.polygonUuid != null && updatedPolygon.polygonUuid !== "") {
        prunePolygonValidationCache(params.previousPolygonUuid, updatedPolygon.polygonUuid);
      }

      return updatedPolygon;
    },
    [invalidatePolygonMapTiles, refreshPolygonData]
  );

  const handleOverlapFix = useCallback(
    async (overlapSummary: OverlapFixSelectionSummary) => {
      const { fixableCandidates, notFixableCandidates } = overlapSummary;

      if (fixableCandidates.length === 0) {
        onOverlapFixResultsOpen({
          polygonsFixed: [],
          polygonsNotFixed: notFixableCandidates.map(({ id, name }) => ({ id, name }))
        });
        return;
      }

      setFixingOverlapsCount(fixableCandidates.length);
      setIsFixingOverlaps(true);
      showPolygonProgressToast(
        t,
        getFixingOverlapsProgressLabel(t, fixableCandidates.length),
        POLYGON_TOAST_IDS.fixingOverlaps
      );

      try {
        const response = await clipPolygonListAsync(fixableCandidates.map(candidate => candidate.id));
        const fixedVersions = extractClippedVersions(response);

        ApiSlice.pruneCache("validations");
        invalidatePolygonMapTiles();

        const refreshedPolygons = await loadAllSitePolygons({
          entityName: "sites",
          entityUuid: site.uuid,
          enabled: site.uuid != null && site.uuid !== ""
        });

        const [, , refreshedOverlapValidations] = await Promise.all([
          refreshPolygonData(),
          fetchAllValidationPages(true),
          fetchOverlapValidations(true)
        ]);

        onOverlapFixResultsOpen(
          buildOverlapFixResultPolygons(
            fixedVersions,
            fixableCandidates,
            notFixableCandidates,
            refreshedPolygons,
            refreshedOverlapValidations
          )
        );
        closeMapPopups();
        setPolygonTableHoveredUuid(null);
        closePolygonProgressToast(POLYGON_TOAST_IDS.fixingOverlaps);
        showPolygonCompleteToast(toastLabels.fixingOverlapsComplete);
      } catch (error) {
        Log.error("Failed to fix selected polygon overlaps:", error);
        closePolygonProgressToast(POLYGON_TOAST_IDS.fixingOverlaps);
        showPolygonErrorToast(t("Failed to fix selected polygon overlaps"));
      } finally {
        setIsFixingOverlaps(false);
        setFixingOverlapsCount(0);
      }
    },
    [
      closeMapPopups,
      fetchAllValidationPages,
      fetchOverlapValidations,
      invalidatePolygonMapTiles,
      onOverlapFixResultsOpen,
      refreshPolygonData,
      site.uuid,
      t,
      toastLabels
    ]
  );

  const handleOpenSubmitPolygonsModal = useCallback(() => {
    if (hasSelectedOverlapFailure) {
      const overlapSummary = selectedOverlapFixSummary;
      clearBulkTableSelection();
      void handleOverlapFix(overlapSummary);
      return;
    }

    const submittableRowIdsSet = new Set(
      selectedSubmittablePolygons
        .map(p => p.polygonUuid ?? p.uuid)
        .filter((id): id is string => id != null && id.length > 0)
    );
    setSubmitPayload({
      submittablePolygonUuids: selectedSubmittablePolygonUuids,
      submittedNames: selectedSubmittablePolygons.map(polygon => polygon.name ?? t("Unnamed polygon")),
      eligibleCount: selectedSubmittablePolygons.length,
      totalCount: selectedSitePolygons.length,
      polygons: selectedRows.filter(row => submittableRowIdsSet.has(row.id))
    });
    clearBulkTableSelection();
    setSubmitPolygonsModal(true);
  }, [
    clearBulkTableSelection,
    handleOverlapFix,
    hasSelectedOverlapFailure,
    selectedOverlapFixSummary,
    selectedRows,
    selectedSitePolygons.length,
    selectedSubmittablePolygonUuids,
    selectedSubmittablePolygons,
    t
  ]);

  const submitPolygons = useCallback(
    async (sitePolygonUuids: string[], submittedNames: string[], emptySelectionMessage: string) => {
      if (sitePolygonUuids.length === 0) {
        openNotification("error", t("Error!"), emptySelectionMessage);
        return;
      }

      try {
        showPolygonProgressToast(
          t,
          getSubmittingProgressLabel(t, sitePolygonUuids.length),
          POLYGON_TOAST_IDS.submitting
        );
        await bulkUpdateSitePolygonStatus(sitePolygonUuids, POLYGON_PENDING_APPROVAL as PolygonStatus, "");
        closeMapPopups();
        setPolygonTableHoveredUuid(null);
        invalidatePolygonMapTiles();
        setSubmittedPolygonNames(submittedNames);
        setShouldRefetchPolygonData(true);
        await refreshPolygonData();
        closePolygonProgressToast(POLYGON_TOAST_IDS.submitting);
        showPolygonCompleteToast(toastLabels.submittingComplete);
        pendingPolygonSubmittedModalRef.current = true;
      } catch (error) {
        Log.error("Failed to submit selected polygons:", error);
        closePolygonProgressToast(POLYGON_TOAST_IDS.submitting);
        openNotification("error", t("Error!"), t("Error submitting polygons"));
        throw error;
      }
    },
    [
      closeMapPopups,
      invalidatePolygonMapTiles,
      openNotification,
      refreshPolygonData,
      setShouldRefetchPolygonData,
      t,
      toastLabels
    ]
  );

  const handleConfirmBulkSubmit = useCallback(async () => {
    const submittablePolygonUuids = submitPayload?.submittablePolygonUuids ?? [];
    const submittedNames = submitPayload?.submittedNames ?? [];

    await submitPolygons(
      submittablePolygonUuids,
      submittedNames,
      t("No selected polygons are eligible for submission")
    );
    setSubmitPayload(null);
  }, [submitPayload, submitPolygons, t]);

  const handleConfirmMapPopupSubmit = useCallback(async () => {
    const sitePolygonUuid = polygonSubmitConfirmation?.sitePolygonUuid;
    if (sitePolygonUuid == null || sitePolygonUuid === "") {
      return;
    }

    const polygon = polygonsData.find(item => item.uuid === sitePolygonUuid);
    await submitPolygons(
      [sitePolygonUuid],
      [polygon?.name ?? t("Unnamed polygon")],
      t("No polygon is eligible for submission")
    );
  }, [polygonSubmitConfirmation?.sitePolygonUuid, polygonsData, submitPolygons, t]);

  const handleBulkDownload = useCallback(
    async (geometryPolygonUuids: string[], downloadSitePolygons: SitePolygonLightDto[]) => {
      if (geometryPolygonUuids.length === 0) {
        showToast({
          label: t("Could not find selected polygons to download"),
          type: "error",
          placement: "bottom",
          duration: 5000,
          maxWidth: "auto"
        });
        return;
      }

      try {
        setIsDownloadingSelectedPolygons(true);
        showPolygonProgressToast(
          t,
          getDownloadingPolygonsProgressLabel(t, geometryPolygonUuids.length),
          POLYGON_TOAST_IDS.downloading
        );
        const filename =
          downloadSitePolygons.length === 1
            ? downloadSitePolygons[0].name ?? "polygon"
            : `${site.name ?? "polygons"}-${new Date().toISOString().slice(0, 10)}`;
        await downloadMultiplePolygonsGeoJson(geometryPolygonUuids, filename);
        closePolygonProgressToast(POLYGON_TOAST_IDS.downloading);
        showPolygonCompleteToast(toastLabels.downloadingPolygonsComplete);
      } catch (error) {
        Log.error("Failed to download selected polygons:", error);
        closePolygonProgressToast(POLYGON_TOAST_IDS.downloading);
        showToast({
          label: t("Error downloading polygon"),
          type: "error",
          placement: "bottom",
          duration: 5000,
          maxWidth: "auto"
        });
      } finally {
        setIsDownloadingSelectedPolygons(false);
      }
    },
    [site.name, t, toastLabels]
  );

  const handleBulkDownloadClick = useCallback(() => {
    const geometryPolygonUuids = selectedGeometryPolygonUuids;
    const downloadSitePolygons = selectedSitePolygons;
    clearBulkTableSelection();
    void handleBulkDownload(geometryPolygonUuids, downloadSitePolygons);
  }, [clearBulkTableSelection, handleBulkDownload, selectedGeometryPolygonUuids, selectedSitePolygons]);

  const handleBulkEditDetails = useCallback(() => {
    if (selectedRows.length === 0) {
      return;
    }
    if (selectedRows.length === 1) {
      openPolygonEditDrawerForRow(selectedRows[0]);
      clearBulkTableSelection();
      return;
    }
    setBulkEditPayload({
      polygons: selectedRows,
      sitePolygonUuids: selectedSitePolygonUuids
    });
    clearBulkTableSelection();
    setShowBulkEditDrawer(true);
  }, [clearBulkTableSelection, openPolygonEditDrawerForRow, selectedRows, selectedSitePolygonUuids]);

  const handleBulkEditDrawerOpenChange = useCallback((open: boolean) => {
    setShowBulkEditDrawer(open);
    if (!open) {
      setBulkEditPayload(null);
    }
  }, []);

  const handleBulkEditSave = useCallback(
    async (attributeChanges: BulkSitePolygonAttributeChanges) => {
      const sitePolygonUuids = bulkEditPayload?.sitePolygonUuids ?? [];
      if (sitePolygonUuids.length === 0) {
        openNotification("error", t("Error!"), t("Could not find selected polygons to update"));
        return;
      }

      try {
        setIsBulkUpdatingPolygons(true);
        showPolygonProgressToast(t, toastLabels.savingChangesProgress, POLYGON_TOAST_IDS.savingChanges);
        await bulkUpdateSitePolygonAttributes(sitePolygonUuids, attributeChanges);
        closeMapPopups();
        setPolygonTableHoveredUuid(null);
        invalidatePolygonMapTiles();
        setShowBulkEditDrawer(false);
        setBulkEditPayload(null);
        await refreshPolygonData();
        closePolygonProgressToast(POLYGON_TOAST_IDS.savingChanges);
        showPolygonCompleteToast(toastLabels.savingChangesComplete);
      } catch (error) {
        Log.error("Failed to update selected polygon details:", error);
        closePolygonProgressToast(POLYGON_TOAST_IDS.savingChanges);
        openNotification("error", t("Error!"), t("Error updating polygon details"));
      } finally {
        setIsBulkUpdatingPolygons(false);
      }
    },
    [bulkEditPayload, closeMapPopups, invalidatePolygonMapTiles, openNotification, refreshPolygonData, t, toastLabels]
  );

  return {
    bulkEditPayload,
    deletePayload,
    submitPayload,
    showBulkEditDrawer,
    showDeletePolygonModal,
    showPolygonSubmittedModal,
    showSubmitPolygonsModal,
    submittedPolygonNames,
    isBulkUpdatingPolygons,
    isDeletingPolygons,
    isDownloadingSelectedPolygons,
    isFixingOverlaps,
    isValidatingPolygons,
    deletingPolygonCount,
    fixingOverlapsCount,
    validatingPolygonCount,
    handleBulkDelete,
    handleBulkDownloadClick,
    handleBulkEditDetails,
    handleBulkEditDrawerOpenChange,
    handleBulkEditSave,
    handleConfirmBulkSubmit,
    handleConfirmMapPopupSubmit,
    handleDeletePolygonModalChange,
    handleDrawerOverlapFixed,
    handleMapPopupSubmitModalChange,
    handleOpenDeletePolygonModal,
    handleOpenSubmitPolygonsModal,
    handlePolygonDeletingChange,
    handlePolygonSubmittedModalChange,
    handleRunValidation,
    handleSubmitPolygonsModalChange,
    openPolygonEditDrawerForRow,
    runPolygonValidation
  };
};
