import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { downloadMultiplePolygonsGeoJson } from "@/components/elements/Map-mapbox/utils";
import { clipPolygonListAsync } from "@/connections/PolygonClipping";
import type { BulkSitePolygonAttributeChanges, PolygonStatus } from "@/connections/SitePolygons";
import {
  bulkDeleteSitePolygons,
  bulkUpdateSitePolygonAttributes,
  bulkUpdateSitePolygonStatus,
  getStatusUpdateCommentCreatedAt,
  loadAllSitePolygons,
  pruneSitePolygonsCache
} from "@/connections/SitePolygons";
import { useMyUser } from "@/connections/User";
import { createPolygonValidation } from "@/connections/Validation";
import { POLYGON_APPROVED, POLYGON_INFORMATION_REQUIRED, POLYGON_PENDING_APPROVAL } from "@/constants/polygonStatuses";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { openPolygonEditDrawerForSitePolygon } from "@/context/polygonEditDrawer.utils";
import { setPolygonTableHoveredUuid } from "@/context/polygonTableInteraction.store";
import type { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import type { SitePolygonLightDto, ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";
import ApiSlice from "@/store/apiSlice";
import { getPolygonAnalyticsContext, trackPolygonEvent } from "@/utils/ga4";
import Log from "@/utils/log";
import {
  formatPolygonTargetId,
  trackBulkActionCompleted,
  trackPolygonDownloaded,
  trackPolygonRunValidationClicked,
  trackPolygonStatusChanged
} from "@/utils/polygonAnalytics";

import type { OverlapFixPolygon } from "../components/Modals/OverlapFix";
import type {
  PolygonOverlapFixParams,
  PolygonRunValidationWithResultsOptions,
  PolygonValidationJobsStartedOptions
} from "../components/polygonEdit.types";
import { prunePolygonValidationCache } from "../components/polygonEditSave";
import type { PolygonTableRow } from "../components/PolygonTableRow";
import { mapSitePolygonToTableRow } from "../components/polygonTableRow.utils";
import {
  closePolygonProgressToast,
  completePolygonProgressToast,
  getDownloadingPolygonsProgressLabel,
  getPolygonOperationToastLabels,
  POLYGON_TOAST_IDS,
  showPolygonErrorToast,
  showPolygonProgressToast
} from "../utils/polygonOperationToasts";
import {
  type PolygonStatusChangeComment,
  buildStatusChangeComment,
  formatCommentAuthorName
} from "../utils/polygonStatusChangeComment";
import {
  type OverlapFixSelectionSummary,
  buildOverlapFixResultPolygons,
  collectGeometryUuidsForValidationUiClear,
  collectRelatedPartnerUuidsFromFixability,
  extractClippedVersions,
  resolveActivePolygonAfterOverlapFix,
  resolveClippedGeometryUuids
} from "./overlapFix.utils";

const formatAuthorName = formatCommentAuthorName;

export type SubmittedPolygonComment = PolygonStatusChangeComment;

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
  onValidationJobsStarted?: (polygonUuids: string[], options?: PolygonValidationJobsStartedOptions) => void;
  onValidationPendingClear?: () => void;
  /** Drop local/cached validation UI for geometries cleared server-side by clipping. */
  onValidationUiCleared?: (geometryPolygonUuids: string[]) => void;
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
  onOverlapFixResultsOpen,
  onValidationJobsStarted,
  onValidationPendingClear,
  onValidationUiCleared
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
  const [, { user }] = useMyUser();

  const pendingPolygonSubmittedModalRef = useRef(false);
  const proceedingToBulkSubmitConfirmationRef = useRef(false);

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
  const [showSubmitPolygonConfirmationModal, setSubmitPolygonConfirmationModal] = useState(false);
  const [showMapPopupSubmitConfirmationModal, setMapPopupSubmitConfirmationModal] = useState(false);
  const [showPolygonSubmittedModal, setPolygonSubmittedModal] = useState(false);
  const [submittedPolygonNames, setSubmittedPolygonNames] = useState<string[]>([]);
  const [submittedPolygonComment, setSubmittedPolygonComment] = useState<SubmittedPolygonComment | null>(null);
  const [showPolygonApprovedModal, setPolygonApprovedModal] = useState(false);
  const [approvedPolygonNames, setApprovedPolygonNames] = useState<string[]>([]);
  const [approvedPolygonComment, setApprovedPolygonComment] = useState<PolygonStatusChangeComment | null>(null);
  const [showInformationRequestedModal, setInformationRequestedModal] = useState(false);
  const [requestedInformationPolygonNames, setRequestedInformationPolygonNames] = useState<string[]>([]);
  const [requestedInformationComment, setRequestedInformationComment] = useState<PolygonStatusChangeComment | null>(
    null
  );
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
  const [isSubmittingPolygons, setIsSubmittingPolygons] = useState(false);
  const [submittingPolygonCount, setSubmittingPolygonCount] = useState(0);

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
      setSubmittedPolygonComment(null);
    }
  }, []);

  const schedulePolygonSubmittedModal = useCallback(() => {
    window.setTimeout(() => {
      setPolygonSubmittedModal(true);
    }, 200);
  }, []);

  const handlePolygonApprovedModalChange = useCallback((open: boolean) => {
    setPolygonApprovedModal(open);
    if (!open) {
      setApprovedPolygonNames([]);
      setApprovedPolygonComment(null);
    }
  }, []);

  const schedulePolygonApprovedModal = useCallback(() => {
    window.setTimeout(() => {
      setPolygonApprovedModal(true);
    }, 200);
  }, []);

  const handleInformationRequestedModalChange = useCallback((open: boolean) => {
    setInformationRequestedModal(open);
    if (!open) {
      setRequestedInformationPolygonNames([]);
      setRequestedInformationComment(null);
    }
  }, []);

  const scheduleInformationRequestedModal = useCallback(() => {
    window.setTimeout(() => {
      setInformationRequestedModal(true);
    }, 200);
  }, []);

  const handleSubmitPolygonsModalChange = useCallback((open: boolean) => {
    setSubmitPolygonsModal(open);
    if (!open) {
      if (proceedingToBulkSubmitConfirmationRef.current) {
        proceedingToBulkSubmitConfirmationRef.current = false;
        return;
      }
      setSubmitPayload(null);
    }
  }, []);

  const handleProceedToBulkSubmitConfirmation = useCallback(() => {
    proceedingToBulkSubmitConfirmationRef.current = true;
    setSubmitPolygonsModal(false);
    setSubmitPolygonConfirmationModal(true);
  }, []);

  const handleSubmitPolygonConfirmationModalChange = useCallback(
    (open: boolean) => {
      setSubmitPolygonConfirmationModal(open);
      if (!open) {
        setSubmitPayload(null);
        if (pendingPolygonSubmittedModalRef.current) {
          pendingPolygonSubmittedModalRef.current = false;
          schedulePolygonSubmittedModal();
        }
      }
    },
    [schedulePolygonSubmittedModal]
  );

  const handleMapPopupSubmitConfirmationModalChange = useCallback(
    (open: boolean) => {
      setMapPopupSubmitConfirmationModal(open);
      if (!open) {
        setPolygonSubmitConfirmation(null);
        if (pendingPolygonSubmittedModalRef.current) {
          pendingPolygonSubmittedModalRef.current = false;
          schedulePolygonSubmittedModal();
        }
      }
    },
    [schedulePolygonSubmittedModal, setPolygonSubmitConfirmation]
  );

  useEffect(() => {
    if (polygonSubmitConfirmation == null) {
      setMapPopupSubmitConfirmationModal(false);
      return;
    }

    setMapPopupSubmitConfirmationModal(true);
  }, [polygonSubmitConfirmation]);

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
      showToast({
        label: t("Could not find selected polygons to delete"),
        type: "error",
        placement: "bottom",
        duration: 5000
      });
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
      completePolygonProgressToast(POLYGON_TOAST_IDS.deleting, toastLabels.deletingComplete);
    } catch (error) {
      Log.error("Failed to delete selected polygons:", error);
      closePolygonProgressToast(POLYGON_TOAST_IDS.deleting);
      showToast({ label: t("Error Deleting Polygons"), type: "error", placement: "bottom", duration: 5000 });
      throw error;
    } finally {
      setIsDeletingPolygons(false);
      setDeletingPolygonCount(0);
    }
  }, [closeMapPopups, deletePayload, invalidatePolygonMapTiles, refreshPolygonData, t, toastLabels]);

  const runPolygonValidation = useCallback(
    async (polygonUuids: string[], options?: PolygonValidationJobsStartedOptions) => {
      if (polygonUuids.length === 0) {
        return;
      }

      await createPolygonValidation({ polygonUuids });
      ApiSlice.pruneCache("validations");
      onValidationJobsStarted?.(polygonUuids, options);
    },
    [onValidationJobsStarted]
  );

  const handleRunValidation = useCallback(
    async (polygonUuids: string[], options?: PolygonValidationJobsStartedOptions) => {
      if (polygonUuids.length === 0) {
        return;
      }

      try {
        setValidatingPolygonCount(polygonUuids.length);
        setIsValidatingPolygons(true);
        await runPolygonValidation(polygonUuids, options);
      } catch (error) {
        Log.error("Failed to validate selected polygons:", error);
        showToast({ label: t("Failed to Validate Polygons"), type: "error", placement: "bottom", duration: 5000 });
        throw error;
      } finally {
        setIsValidatingPolygons(false);
        setValidatingPolygonCount(0);
      }
    },
    [runPolygonValidation, t]
  );

  const [isSystemValidationCompleteModalOpen, setIsSystemValidationCompleteModalOpen] = useState(false);
  const [validatedPolygons, setValidatedPolygons] = useState<PolygonTableRow[]>([]);
  const validationResultsModalPendingRef = useRef(false);

  const handleSystemValidationCompleteModalChange = useCallback((open: boolean) => {
    setIsSystemValidationCompleteModalOpen(open);
    if (!open) {
      setValidatedPolygons([]);
      validationResultsModalPendingRef.current = false;
    }
  }, []);

  const showValidationResultsModalIfPending = useCallback(() => {
    if (!validationResultsModalPendingRef.current) {
      return;
    }

    validationResultsModalPendingRef.current = false;
    setIsSystemValidationCompleteModalOpen(true);
  }, []);

  const cancelPendingValidationResultsModal = useCallback(() => {
    validationResultsModalPendingRef.current = false;
    setValidatedPolygons([]);
  }, []);

  const runValidationWithResultsModal = useCallback(
    async (geometryPolygonUuids: string[], options?: PolygonRunValidationWithResultsOptions) => {
      if (geometryPolygonUuids.length === 0) {
        return;
      }

      trackPolygonRunValidationClicked({ siteUuid: site.uuid, polygonIds: geometryPolygonUuids });

      const fallbackPolygons = options?.fallbackPolygons ?? [];
      const rows = geometryPolygonUuids
        .map(geometryPolygonUuid => {
          const polygon =
            fallbackPolygons.find(item => (item.polygonUuid ?? item.uuid) === geometryPolygonUuid) ??
            polygonsData.find(item => (item.polygonUuid ?? item.uuid) === geometryPolygonUuid);
          return polygon != null ? mapSitePolygonToTableRow(polygon, t) : null;
        })
        .filter((row): row is PolygonTableRow => row != null);

      const cacheUuids = [
        ...geometryPolygonUuids,
        ...(options?.previousGeometryPolygonUuid != null && options.previousGeometryPolygonUuid !== ""
          ? [options.previousGeometryPolygonUuid]
          : [])
      ];
      cacheUuids.forEach(geometryPolygonUuid => {
        prunePolygonValidationCache(geometryPolygonUuid);
      });
      ApiSlice.pruneCache("validations");

      validationResultsModalPendingRef.current = true;
      setValidatedPolygons(rows);

      const validationJobsStartedOptions: PolygonValidationJobsStartedOptions | undefined =
        options?.validationAfterCriteriaClear === true ? { validationAfterCriteriaClear: true } : undefined;

      try {
        await handleRunValidation(geometryPolygonUuids, validationJobsStartedOptions);
      } catch {
        onValidationPendingClear?.();
        cancelPendingValidationResultsModal();
      }
    },
    [cancelPendingValidationResultsModal, handleRunValidation, onValidationPendingClear, polygonsData, site.uuid, t]
  );

  const handlePolygonDeletingChange = useCallback((isDeleting: boolean, count = 0) => {
    setIsDeletingPolygons(isDeleting);
    setDeletingPolygonCount(count);
  }, []);

  const handlePolygonSubmittingChange = useCallback((isSubmitting: boolean, count = 0) => {
    setIsSubmittingPolygons(isSubmitting);
    setSubmittingPolygonCount(count);
  }, []);

  const clearValidationUiAfterOverlapFix = useCallback(
    async (geometryPolygonUuids: string[]) => {
      onValidationPendingClear?.();

      if (geometryPolygonUuids.length > 0) {
        // Match backend clearValidationForPolygons: drop criteria + status from client caches only.
        prunePolygonValidationCache(...geometryPolygonUuids);
        onValidationUiCleared?.(geometryPolygonUuids);
      }

      const [, overlapValidations] = await Promise.all([fetchAllValidationPages(), fetchOverlapValidations(true)]);

      return overlapValidations ?? [];
    },
    [fetchAllValidationPages, fetchOverlapValidations, onValidationPendingClear, onValidationUiCleared]
  );

  const handleDrawerOverlapFixed = useCallback(
    async (params: PolygonOverlapFixParams) => {
      invalidatePolygonMapTiles();

      const refreshedPolygons = await refreshPolygonData({ loadAll: true });

      const updatedPolygon = resolveActivePolygonAfterOverlapFix(
        refreshedPolygons,
        {
          previousPolygonUuid: params.previousPolygonUuid,
          primaryUuid: params.primaryUuid,
          sitePolygonUuid: params.sitePolygonUuid
        },
        params.clippedVersions ?? []
      );
      const clippedGeometryUuids = resolveClippedGeometryUuids(params.clippedVersions ?? [], refreshedPolygons);
      const currentSiteGeometryUuids = refreshedPolygons
        .map(polygon => polygon.polygonUuid ?? polygon.uuid)
        .filter((uuid): uuid is string => uuid != null && uuid !== "");

      const geometryUuidsToClear = collectGeometryUuidsForValidationUiClear({
        previousGeometryUuids: [params.previousPolygonUuid],
        newGeometryUuids: [updatedPolygon?.polygonUuid, ...clippedGeometryUuids],
        relatedPartnerUuids: params.relatedPartnerUuids,
        allowedGeometryUuids: [...currentSiteGeometryUuids, params.previousPolygonUuid]
      });
      await clearValidationUiAfterOverlapFix(geometryUuidsToClear);

      const fixedId = updatedPolygon?.polygonUuid ?? updatedPolygon?.uuid;
      const fixedName = updatedPolygon?.name ?? null;
      if (fixedId != null && fixedId !== "" && fixedName != null && fixedName !== "") {
        onOverlapFixResultsOpen({ polygonsFixed: [{ id: fixedId, name: fixedName }], polygonsNotFixed: [] });
      } else {
        const originalPolygon = polygonsData.find(
          p => p.polygonUuid === params.previousPolygonUuid || p.uuid === params.sitePolygonUuid
        );
        const name = originalPolygon?.name ?? params.previousPolygonUuid;
        onOverlapFixResultsOpen({ polygonsFixed: [], polygonsNotFixed: [{ id: params.previousPolygonUuid, name }] });
      }

      return updatedPolygon;
    },
    [
      clearValidationUiAfterOverlapFix,
      invalidatePolygonMapTiles,
      onOverlapFixResultsOpen,
      polygonsData,
      refreshPolygonData
    ]
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

      try {
        const response = await clipPolygonListAsync(fixableCandidates.map(candidate => candidate.id));
        const fixedVersions = extractClippedVersions(response);

        invalidatePolygonMapTiles();
        const refreshedPolygons = await refreshPolygonData({ loadAll: true });
        const clippedGeometryUuids = resolveClippedGeometryUuids(fixedVersions, refreshedPolygons);
        const currentSiteGeometryUuids = refreshedPolygons
          .map(polygon => polygon.polygonUuid ?? polygon.uuid)
          .filter((uuid): uuid is string => uuid != null && uuid !== "");

        const geometryUuidsToClearAfterFix = collectGeometryUuidsForValidationUiClear({
          previousGeometryUuids: fixableCandidates.map(candidate => candidate.id),
          newGeometryUuids: clippedGeometryUuids,
          relatedPartnerUuids: collectRelatedPartnerUuidsFromFixability(
            fixableCandidates.map(candidate => candidate.fixabilityResult)
          ),
          allowedGeometryUuids: [...currentSiteGeometryUuids, ...fixableCandidates.map(candidate => candidate.id)]
        });

        const refreshedOverlapValidations = await clearValidationUiAfterOverlapFix(geometryUuidsToClearAfterFix);

        onOverlapFixResultsOpen(
          buildOverlapFixResultPolygons(
            fixedVersions,
            fixableCandidates,
            notFixableCandidates,
            refreshedPolygons,
            refreshedOverlapValidations
          )
        );
        trackBulkActionCompleted({
          siteUuid: site.uuid,
          actionType: "fix_overlap",
          polygonCount: fixableCandidates.length
        });
        closeMapPopups();
        setPolygonTableHoveredUuid(null);
      } catch (error) {
        Log.error("Failed to fix selected polygon overlaps:", error);
        showPolygonErrorToast(t("Failed to Fix Selected Polygon Overlaps"));
      } finally {
        setIsFixingOverlaps(false);
        setFixingOverlapsCount(0);
      }
    },
    [
      clearValidationUiAfterOverlapFix,
      closeMapPopups,
      invalidatePolygonMapTiles,
      onOverlapFixResultsOpen,
      refreshPolygonData,
      site.uuid,
      t
    ]
  );

  const handleOpenSubmitPolygonsModal = useCallback(() => {
    if (hasSelectedOverlapFailure) {
      const overlapSummary = selectedOverlapFixSummary;
      trackPolygonEvent("polygon_overlap_fix_clicked", {
        ...getPolygonAnalyticsContext({ entityType: "site", entityId: site.uuid }),
        polygon_id: formatPolygonTargetId(overlapSummary.fixableCandidates.map(candidate => candidate.id))
      });
      clearBulkTableSelection();
      void handleOverlapFix(overlapSummary);
      return;
    }

    const submittableRowIdsSet = new Set(
      selectedSubmittablePolygons
        .map(p => p.polygonUuid ?? p.uuid)
        .filter((id): id is string => id != null && id.length > 0)
    );
    const eligibleCount = selectedSubmittablePolygons.length;
    const totalCount = selectedSitePolygons.length;
    const hasNonSubmittableSelection = eligibleCount < totalCount;

    setSubmitPayload({
      submittablePolygonUuids: selectedSubmittablePolygonUuids,
      submittedNames: selectedSubmittablePolygons.map(polygon => polygon.name ?? t("Unnamed polygon")),
      eligibleCount,
      totalCount,
      polygons: selectedRows.filter(row => submittableRowIdsSet.has(row.id))
    });
    clearBulkTableSelection();

    if (hasNonSubmittableSelection) {
      setSubmitPolygonsModal(true);
      return;
    }

    setSubmitPolygonConfirmationModal(true);
  }, [
    clearBulkTableSelection,
    handleOverlapFix,
    hasSelectedOverlapFailure,
    selectedOverlapFixSummary,
    selectedRows,
    selectedSitePolygons.length,
    selectedSubmittablePolygonUuids,
    selectedSubmittablePolygons,
    site.uuid,
    t
  ]);

  const submitPolygons = useCallback(
    async (sitePolygonUuids: string[], submittedNames: string[], emptySelectionMessage: string, comment: string) => {
      if (sitePolygonUuids.length === 0) {
        showToast({ label: emptySelectionMessage, type: "error", placement: "bottom", duration: 5000 });
        return;
      }

      setIsSubmittingPolygons(true);
      setSubmittingPolygonCount(sitePolygonUuids.length);

      try {
        const response = await bulkUpdateSitePolygonStatus(
          sitePolygonUuids,
          POLYGON_PENDING_APPROVAL as PolygonStatus,
          comment
        );

        const trimmedComment = comment.trim();
        setSubmittedPolygonComment(
          trimmedComment === ""
            ? null
            : {
                authorName: formatAuthorName(user?.firstName, user?.lastName),
                message: trimmedComment,
                createdAt: getStatusUpdateCommentCreatedAt(response) ?? ""
              }
        );
        closeMapPopups();
        setPolygonTableHoveredUuid(null);
        invalidatePolygonMapTiles();
        setSubmittedPolygonNames(submittedNames);
        setShouldRefetchPolygonData(true);
        const refreshedPolygons = await refreshPolygonData({ loadAll: true });
        pendingPolygonSubmittedModalRef.current = true;
        ApiSlice.pruneCache("auditStatuses");

        const geometryPolygonUuids = sitePolygonUuids
          .map(sitePolygonUuid => refreshedPolygons.find(polygon => polygon.uuid === sitePolygonUuid))
          .map(polygon => polygon?.polygonUuid)
          .filter((uuid): uuid is string => uuid != null && uuid !== "");
        const uniqueGeometryPolygonUuids = [...new Set(geometryPolygonUuids)];

        if (uniqueGeometryPolygonUuids.length > 0) {
          onValidationJobsStarted?.(uniqueGeometryPolygonUuids, { trackBulkCompletion: false });
        }

        for (const sitePolygonUuid of sitePolygonUuids) {
          const sitePolygon = polygonsData.find(polygon => polygon.uuid === sitePolygonUuid);
          const geometryPolygonUuid = sitePolygon?.polygonUuid;
          if (geometryPolygonUuid == null || geometryPolygonUuid === "") {
            continue;
          }

          trackPolygonStatusChanged({
            siteUuid: site.uuid,
            polygonId: geometryPolygonUuid,
            fromStatus: sitePolygon?.status ?? "draft",
            toStatus: POLYGON_PENDING_APPROVAL
          });
        }

        trackBulkActionCompleted({
          siteUuid: site.uuid,
          actionType: "submit",
          polygonCount: sitePolygonUuids.length
        });
      } catch (error) {
        Log.error("Failed to submit selected polygons:", error);
        closePolygonProgressToast(POLYGON_TOAST_IDS.submitting);
        showToast({ label: t("Error Submitting Polygons"), type: "error", placement: "bottom", duration: 5000 });
        throw error;
      } finally {
        setIsSubmittingPolygons(false);
        setSubmittingPolygonCount(0);
      }
    },
    [
      closeMapPopups,
      invalidatePolygonMapTiles,
      onValidationJobsStarted,
      polygonsData,
      refreshPolygonData,
      setShouldRefetchPolygonData,
      site.uuid,
      t,
      user?.firstName,
      user?.lastName
    ]
  );

  const handleConfirmBulkSubmit = useCallback(
    async (comment: string) => {
      const submittablePolygonUuids = submitPayload?.submittablePolygonUuids ?? [];
      const submittedNames = submitPayload?.submittedNames ?? [];

      await submitPolygons(
        submittablePolygonUuids,
        submittedNames,
        t("No selected polygons are eligible for submission"),
        comment
      );
    },
    [submitPayload, submitPolygons, t]
  );

  const handleConfirmMapPopupSubmit = useCallback(
    async (comment: string) => {
      const sitePolygonUuid = polygonSubmitConfirmation;
      if (sitePolygonUuid == null || sitePolygonUuid === "") {
        return;
      }

      const polygon = polygonsData.find(item => item.uuid === sitePolygonUuid);
      await submitPolygons(
        [sitePolygonUuid],
        [polygon?.name ?? t("Unnamed polygon")],
        t("No polygon is eligible for submission"),
        comment
      );
    },
    [polygonSubmitConfirmation, polygonsData, submitPolygons, t]
  );

  const approvePolygons = useCallback(
    async (sitePolygonUuids: string[], approvedNames: string[], comment: string) => {
      if (sitePolygonUuids.length === 0) {
        showToast({
          label: t("No selected polygons are eligible for approval"),
          type: "error",
          placement: "bottom",
          duration: 5000
        });
        return;
      }

      try {
        const response = await bulkUpdateSitePolygonStatus(
          sitePolygonUuids,
          POLYGON_APPROVED as PolygonStatus,
          comment
        );

        setApprovedPolygonComment(
          buildStatusChangeComment(
            comment,
            formatCommentAuthorName(user?.firstName, user?.lastName),
            getStatusUpdateCommentCreatedAt(response)
          )
        );
        closeMapPopups();
        setPolygonTableHoveredUuid(null);
        invalidatePolygonMapTiles();
        setApprovedPolygonNames(approvedNames);
        setShouldRefetchPolygonData(true);
        await refreshPolygonData();
        ApiSlice.pruneCache("auditStatuses");
        schedulePolygonApprovedModal();

        for (const sitePolygonUuid of sitePolygonUuids) {
          const sitePolygon = polygonsData.find(polygon => polygon.uuid === sitePolygonUuid);
          const geometryPolygonUuid = sitePolygon?.polygonUuid;
          if (geometryPolygonUuid == null || geometryPolygonUuid === "") {
            continue;
          }

          trackPolygonStatusChanged({
            siteUuid: site.uuid,
            polygonId: geometryPolygonUuid,
            fromStatus: sitePolygon?.status ?? "pending-approval",
            toStatus: POLYGON_APPROVED
          });
        }

        trackBulkActionCompleted({
          siteUuid: site.uuid,
          actionType: "approve",
          polygonCount: sitePolygonUuids.length
        });
      } catch (error) {
        Log.error("Failed to approve selected polygons:", error);
        showToast({ label: t("Error Approving Polygons"), type: "error", placement: "bottom", duration: 5000 });
        throw error;
      }
    },
    [
      closeMapPopups,
      invalidatePolygonMapTiles,
      polygonsData,
      refreshPolygonData,
      schedulePolygonApprovedModal,
      setShouldRefetchPolygonData,
      site.uuid,
      t,
      user?.firstName,
      user?.lastName
    ]
  );

  const requestInformationForPolygons = useCallback(
    async (sitePolygonUuids: string[], polygonNames: string[], comment: string) => {
      if (sitePolygonUuids.length === 0) {
        showToast({
          label: t("No selected polygons are eligible for this action"),
          type: "error",
          placement: "bottom",
          duration: 5000
        });
        return;
      }

      try {
        const response = await bulkUpdateSitePolygonStatus(
          sitePolygonUuids,
          POLYGON_INFORMATION_REQUIRED as PolygonStatus,
          comment
        );

        setRequestedInformationComment(
          buildStatusChangeComment(
            comment,
            formatCommentAuthorName(user?.firstName, user?.lastName),
            getStatusUpdateCommentCreatedAt(response)
          )
        );
        closeMapPopups();
        setPolygonTableHoveredUuid(null);
        invalidatePolygonMapTiles();
        setRequestedInformationPolygonNames(polygonNames);
        setShouldRefetchPolygonData(true);
        await refreshPolygonData();
        ApiSlice.pruneCache("auditStatuses");
        scheduleInformationRequestedModal();

        for (const sitePolygonUuid of sitePolygonUuids) {
          const sitePolygon = polygonsData.find(polygon => polygon.uuid === sitePolygonUuid);
          const geometryPolygonUuid = sitePolygon?.polygonUuid;
          if (geometryPolygonUuid == null || geometryPolygonUuid === "") {
            continue;
          }

          trackPolygonStatusChanged({
            siteUuid: site.uuid,
            polygonId: geometryPolygonUuid,
            fromStatus: sitePolygon?.status ?? "pending-approval",
            toStatus: POLYGON_INFORMATION_REQUIRED
          });
        }

        trackBulkActionCompleted({
          siteUuid: site.uuid,
          actionType: "request_information",
          polygonCount: sitePolygonUuids.length
        });
      } catch (error) {
        Log.error("Failed to request information for selected polygons:", error);
        showToast({
          label: t("Error Requesting Information for Polygons"),
          type: "error",
          placement: "bottom",
          duration: 5000
        });
        throw error;
      }
    },
    [
      closeMapPopups,
      invalidatePolygonMapTiles,
      polygonsData,
      refreshPolygonData,
      scheduleInformationRequestedModal,
      setShouldRefetchPolygonData,
      site.uuid,
      t,
      user?.firstName,
      user?.lastName
    ]
  );

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
        trackPolygonDownloaded({
          siteUuid: site.uuid,
          polygonType: "standard",
          polygonId: formatPolygonTargetId(geometryPolygonUuids),
          polygonCount: geometryPolygonUuids.length
        });
        trackBulkActionCompleted({
          siteUuid: site.uuid,
          actionType: "download",
          polygonCount: geometryPolygonUuids.length
        });
        completePolygonProgressToast(POLYGON_TOAST_IDS.downloading, toastLabels.downloadingPolygonsComplete);
      } catch (error) {
        Log.error("Failed to download selected polygons:", error);
        closePolygonProgressToast(POLYGON_TOAST_IDS.downloading);
        showToast({
          label: t("Error Downloading Polygon"),
          type: "error",
          placement: "bottom",
          duration: 5000,
          maxWidth: "auto"
        });
      } finally {
        setIsDownloadingSelectedPolygons(false);
      }
    },
    [site.name, site.uuid, t, toastLabels]
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
        showToast({
          label: t("Could not find selected polygons to update"),
          type: "error",
          placement: "bottom",
          duration: 5000
        });
        return;
      }

      try {
        setIsBulkUpdatingPolygons(true);
        showPolygonProgressToast(t, toastLabels.savingChangesProgress, POLYGON_TOAST_IDS.savingChanges);
        await bulkUpdateSitePolygonAttributes(sitePolygonUuids, attributeChanges);
        for (const row of bulkEditPayload?.polygons ?? []) {
          trackPolygonEvent("polygon_attributes_edited", {
            ...getPolygonAnalyticsContext({ entityType: "site", entityId: site.uuid }),
            polygon_id: row.id,
            entry_point: "bulk_actions"
          });
        }
        closeMapPopups();
        setPolygonTableHoveredUuid(null);
        invalidatePolygonMapTiles();
        setShowBulkEditDrawer(false);
        setBulkEditPayload(null);
        await refreshPolygonData();
        completePolygonProgressToast(POLYGON_TOAST_IDS.savingChanges, toastLabels.savingChangesComplete);
      } catch (error) {
        Log.error("Failed to update selected polygon details:", error);
        closePolygonProgressToast(POLYGON_TOAST_IDS.savingChanges);
        showToast({ label: t("Error Updating Polygon Details"), type: "error", placement: "bottom", duration: 5000 });
      } finally {
        setIsBulkUpdatingPolygons(false);
      }
    },
    [bulkEditPayload, closeMapPopups, invalidatePolygonMapTiles, refreshPolygonData, site.uuid, t, toastLabels]
  );

  return {
    bulkEditPayload,
    deletePayload,
    submitPayload,
    showBulkEditDrawer,
    showDeletePolygonModal,
    showPolygonSubmittedModal,
    showSubmitPolygonsModal,
    showSubmitPolygonConfirmationModal,
    showMapPopupSubmitConfirmationModal,
    submittedPolygonNames,
    submittedPolygonComment,
    showPolygonApprovedModal,
    approvedPolygonNames,
    approvedPolygonComment,
    showInformationRequestedModal,
    requestedInformationPolygonNames,
    requestedInformationComment,
    isBulkUpdatingPolygons,
    isDeletingPolygons,
    isDownloadingSelectedPolygons,
    isFixingOverlaps,
    isSubmittingPolygons,
    isValidatingPolygons,
    deletingPolygonCount,
    fixingOverlapsCount,
    submittingPolygonCount,
    validatingPolygonCount,
    approvePolygons,
    requestInformationForPolygons,
    handleBulkDelete,
    handleBulkDownloadClick,
    handleBulkEditDetails,
    handleBulkEditDrawerOpenChange,
    handleBulkEditSave,
    handleConfirmBulkSubmit,
    handleConfirmMapPopupSubmit,
    handleDeletePolygonModalChange,
    handleDrawerOverlapFixed,
    handleInformationRequestedModalChange,
    handleMapPopupSubmitConfirmationModalChange,
    handleOpenDeletePolygonModal,
    handleOpenSubmitPolygonsModal,
    handlePolygonApprovedModalChange,
    handlePolygonDeletingChange,
    handlePolygonSubmittingChange,
    handlePolygonSubmittedModalChange,
    handleProceedToBulkSubmitConfirmation,
    handleRunValidation,
    handleSubmitPolygonConfirmationModalChange,
    handleSubmitPolygonsModalChange,
    handleSystemValidationCompleteModalChange,
    isSystemValidationCompleteModalOpen,
    openPolygonEditDrawerForRow,
    runPolygonValidation,
    runValidationWithResultsModal,
    showValidationResultsModalIfPending,
    cancelPendingValidationResultsModal,
    validatedPolygons
  };
};
