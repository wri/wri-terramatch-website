import { useT } from "@transifex/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { downloadMultiplePolygonsGeoJson } from "@/components/elements/Map-mapbox/utils";
import { clipPolygonListAsync } from "@/connections/PolygonClipping";
import type { BulkSitePolygonAttributeChanges, PolygonStatus } from "@/connections/SitePolygons";
import {
  bulkDeleteSitePolygons,
  bulkUpdateSitePolygonAttributes,
  bulkUpdateSitePolygonStatus,
  getStatusUpdateCommentCreatedAt,
  loadActiveSitePolygonVersion,
  loadSitePolygonMapIndex
} from "@/connections/SitePolygons";
import { useMyUser } from "@/connections/User";
import { createPolygonValidation } from "@/connections/Validation";
import {
  POLYGON_APPROVED,
  POLYGON_DRAFT,
  POLYGON_INFORMATION_REQUIRED,
  POLYGON_PENDING_APPROVAL
} from "@/constants/polygonStatuses";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { openPolygonEditDrawerForSitePolygon } from "@/context/polygonEditDrawer.utils";
import { setPolygonTableHoveredUuid } from "@/context/polygonTableInteraction.store";
import type { SitePolygonLightDto, ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { showToast } from "@/redesignComponents/status/Toast/showToast";
import ApiSlice from "@/store/apiSlice";
import { isNotNull } from "@/utils/array";
import { getPolygonAnalyticsContext, trackPolygonEvent } from "@/utils/ga4";
import Log from "@/utils/log";
import {
  type BulkActionType,
  formatPolygonTargetId,
  trackBulkActionCompleted,
  trackPolygonDeleted,
  trackPolygonDownloaded,
  trackPolygonRunValidationClicked,
  trackPolygonStatusChanged
} from "@/utils/polygonAnalytics";

import type { OverlapFixPolygon } from "../components/Modals/OverlapFix";
import type {
  PolygonOverlapFixParams,
  PolygonRunValidationWithResultsOptions,
  PolygonValidationJobsStartedCallback,
  PolygonValidationJobsStartedOptions
} from "../components/polygonEdit.types";
import { prunePolygonValidationCache } from "../components/polygonEditSave";
import type { PolygonTableRow } from "../components/PolygonTableRow";
import {
  type SitePolygonTableRowSource,
  type ValidatablePolygon,
  isValidatablePolygon,
  mapSitePolygonToTableRow
} from "../components/polygonTableRow.utils";
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
  resolveClippedGeometryUuids
} from "./overlapFix.utils";
import { isPolygonBackgroundJob, usePolygonBackgroundJob } from "./usePolygonBackgroundJob";

const formatAuthorName = formatCommentAuthorName;

export type SubmittedPolygonComment = PolygonStatusChangeComment;

type FetchValidations = (clearCache?: boolean) => Promise<ValidationDto[] | undefined>;

type BulkEditPayload = {
  polygons: PolygonTableRow[];
  sitePolygonUuids: string[];
  geometryPolygonUuids: string[];
};

type PolygonStatusChange = {
  status: PolygonStatus;
  comment: string;
  actionType: BulkActionType;
  defaultFromStatus: string;
};

type UseSitePolygonBulkActionsParams = {
  entityName: "sites" | "projects";
  entityUuid: string;
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
  onValidationJobsStarted?: PolygonValidationJobsStartedCallback;
  onValidationPendingClear?: () => void;
  /** Drop local/cached validation UI for geometries cleared server-side by clipping. */
  onValidationUiCleared?: (geometryPolygonUuids: string[]) => void;
};

export const useSitePolygonBulkActions = ({
  entityName,
  entityUuid,
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
  const runPolygonBackgroundJob = usePolygonBackgroundJob();

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
  const [bulkEditPayload, setBulkEditPayload] = useState<BulkEditPayload | null>(null);
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
    async ({ refreshValidations = false }: { refreshValidations?: boolean } = {}) => {
      const refreshPromises: Promise<unknown>[] = [refetchPolygons()];
      if (refreshValidations) {
        refreshPromises.push(fetchAllValidationPages(true), fetchOverlapValidations(true));
      }

      await Promise.all(refreshPromises);
    },
    [fetchAllValidationPages, fetchOverlapValidations, refetchPolygons]
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

  const deletePolygons = useCallback(
    async (sitePolygonUuids: string[]) => {
      await bulkDeleteSitePolygons(sitePolygonUuids);
      closeMapPopups();
      setPolygonTableHoveredUuid(null);
      invalidatePolygonMapTiles();
      await refreshPolygonData();
    },
    [closeMapPopups, invalidatePolygonMapTiles, refreshPolygonData]
  );

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

    const deletedRows = deletePayload?.polygons ?? [];
    const parentSiteUuids = new Set(
      entityName === "sites" ? [entityUuid] : deletedRows.map(({ entity }) => entity?.siteUuid).filter(isNotNull)
    );
    const trackDeleted = () => {
      trackPolygonDeleted({
        siteUuid: parentSiteUuids.size === 1 ? Array.from(parentSiteUuids)[0] : undefined,
        polygonIds: deletedRows.map(({ id }) => id),
        polygonCount: sitePolygonUuids.length
      });
      trackBulkActionCompleted({
        entityUuid,
        entityType: entityName,
        actionType: "delete",
        polygonCount: sitePolygonUuids.length
      });
    };

    if (isPolygonBackgroundJob(sitePolygonUuids.length)) {
      setDeletePolygonModal(false);
      setDeletePayload(null);
      void runPolygonBackgroundJob({
        job: "deleting",
        completeLabel: toastLabels.deletingComplete,
        errorLabel: t("Error Deleting Polygons"),
        run: async () => {
          await deletePolygons(sitePolygonUuids);
          trackDeleted();
        }
      });
      return;
    }

    setIsDeletingPolygons(true);
    setDeletingPolygonCount(sitePolygonUuids.length);

    try {
      await deletePolygons(sitePolygonUuids);
      trackDeleted();
      setDeletePolygonModal(false);
      setDeletePayload(null);
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
  }, [deletePayload, deletePolygons, entityName, entityUuid, runPolygonBackgroundJob, t, toastLabels]);

  const runPolygonValidation = useCallback(
    async (polygons: ValidatablePolygon[], options?: PolygonValidationJobsStartedOptions) => {
      if (polygons.length === 0) {
        return;
      }

      const startedAtMs = Date.now();
      await createPolygonValidation({ polygonUuids: polygons.map(polygon => polygon.polygonUuid) });
      ApiSlice.pruneCache("validations");
      onValidationJobsStarted?.(polygons, { ...options, startedAtMs });
    },
    [onValidationJobsStarted]
  );

  const handleRunValidation = useCallback(
    async (polygons: ValidatablePolygon[], options?: PolygonValidationJobsStartedOptions) => {
      if (polygons.length === 0) {
        return;
      }

      try {
        setValidatingPolygonCount(polygons.length);
        setIsValidatingPolygons(true);
        await runPolygonValidation(polygons, options);
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
    async (polygons: SitePolygonTableRowSource[], options?: PolygonRunValidationWithResultsOptions) => {
      const validatablePolygons = polygons.filter(isValidatablePolygon);
      if (validatablePolygons.length === 0) {
        return;
      }

      const geometryPolygonUuids = validatablePolygons.map(polygon => polygon.polygonUuid);
      trackPolygonRunValidationClicked({
        entityUuid,
        entityType: entityName,
        polygonIds: geometryPolygonUuids
      });

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
      setValidatedPolygons(validatablePolygons.map(polygon => mapSitePolygonToTableRow(polygon, t)));

      try {
        await handleRunValidation(validatablePolygons, {
          validationAfterCriteriaClear: options?.validationAfterCriteriaClear
        });
      } catch {
        onValidationPendingClear?.();
        cancelPendingValidationResultsModal();
      }
    },
    [cancelPendingValidationResultsModal, handleRunValidation, onValidationPendingClear, entityName, entityUuid, t]
  );

  const handleBulkRunValidation = useCallback(() => {
    void runValidationWithResultsModal(selectedSitePolygons);
  }, [runValidationWithResultsModal, selectedSitePolygons]);

  const handlePolygonDeletingChange = useCallback((isDeleting: boolean, count = 0) => {
    setIsDeletingPolygons(isDeleting);
    setDeletingPolygonCount(count);
  }, []);

  const handlePolygonSubmittingChange = useCallback((isSubmitting: boolean, count = 0) => {
    setIsSubmittingPolygons(isSubmitting);
    setSubmittingPolygonCount(count);
  }, []);

  const clearValidationUi = useCallback(
    async (geometryPolygonUuids: string[]) => {
      if (geometryPolygonUuids.length > 0) {
        // Match backend criteria clearing: drop criteria + status from client caches only.
        prunePolygonValidationCache(...geometryPolygonUuids);
        onValidationUiCleared?.(geometryPolygonUuids);
      }

      const [, overlapValidations] = await Promise.all([fetchAllValidationPages(), fetchOverlapValidations(true)]);

      return overlapValidations ?? [];
    },
    [fetchAllValidationPages, fetchOverlapValidations, onValidationUiCleared]
  );

  const clearValidationUiAfterOverlapFix = useCallback(
    (geometryPolygonUuids: string[]) => {
      onValidationPendingClear?.();
      return clearValidationUi(geometryPolygonUuids);
    },
    [clearValidationUi, onValidationPendingClear]
  );

  const handleDrawerOverlapFixed = useCallback(
    async (params: PolygonOverlapFixParams) => {
      invalidatePolygonMapTiles();
      await refreshPolygonData();

      const mapIndexResponse = await loadSitePolygonMapIndex({
        entityName,
        entityUuid,
        enabled: entityUuid !== ""
      });
      const refreshedMapPolygons = mapIndexResponse.data?.polygons ?? [];

      const clippedGeometryUuids = resolveClippedGeometryUuids(params.clippedVersions ?? [], refreshedMapPolygons);
      const updatedPolygon = await loadActiveSitePolygonVersion({
        entityName,
        entityUuid,
        primaryUuid: params.primaryUuid,
        versionPolygonUuids: clippedGeometryUuids,
        polygonId: params.sitePolygonUuid ?? params.previousPolygonUuid
      });

      const currentSiteGeometryUuids = refreshedMapPolygons
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
      refreshPolygonData,
      entityName,
      entityUuid
    ]
  );

  const fixOverlaps = useCallback(
    async ({ fixableCandidates, notFixableCandidates }: OverlapFixSelectionSummary) => {
      const response = await clipPolygonListAsync(fixableCandidates.map(candidate => candidate.id));
      const fixedVersions = extractClippedVersions(response);

      invalidatePolygonMapTiles();
      await refreshPolygonData();

      const mapIndexResponse = await loadSitePolygonMapIndex({
        entityName,
        entityUuid,
        enabled: entityUuid !== ""
      });
      const refreshedPolygons = mapIndexResponse.data?.polygons ?? [];

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

      trackBulkActionCompleted({
        entityUuid,
        entityType: entityName,
        actionType: "fix_overlap",
        polygonCount: fixableCandidates.length
      });
      closeMapPopups();
      setPolygonTableHoveredUuid(null);

      return buildOverlapFixResultPolygons(
        fixedVersions,
        fixableCandidates,
        notFixableCandidates,
        refreshedPolygons,
        refreshedOverlapValidations
      );
    },
    [
      clearValidationUiAfterOverlapFix,
      closeMapPopups,
      invalidatePolygonMapTiles,
      refreshPolygonData,
      entityName,
      entityUuid
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

      if (isPolygonBackgroundJob(fixableCandidates.length)) {
        void runPolygonBackgroundJob({
          job: "fixingOverlaps",
          completeLabel: toastLabels.fixingOverlapsComplete,
          errorLabel: t("Failed to Fix Selected Polygon Overlaps"),
          run: () => fixOverlaps(overlapSummary)
        });
        return;
      }

      setFixingOverlapsCount(fixableCandidates.length);
      setIsFixingOverlaps(true);

      try {
        onOverlapFixResultsOpen(await fixOverlaps(overlapSummary));
      } catch (error) {
        Log.error("Failed to fix selected polygon overlaps:", error);
        showPolygonErrorToast(t("Failed to Fix Selected Polygon Overlaps"));
      } finally {
        setIsFixingOverlaps(false);
        setFixingOverlapsCount(0);
      }
    },
    [fixOverlaps, onOverlapFixResultsOpen, runPolygonBackgroundJob, t, toastLabels]
  );

  const handleOpenSubmitPolygonsModal = useCallback(() => {
    if (hasSelectedOverlapFailure) {
      const overlapSummary = selectedOverlapFixSummary;
      trackPolygonEvent("polygon_overlap_fix_clicked", {
        ...getPolygonAnalyticsContext({ entityType: entityName, entityId: entityUuid }),
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
    entityName,
    entityUuid,
    t
  ]);

  const changePolygonStatus = useCallback(
    async (sitePolygonUuids: string[], { status, comment, actionType, defaultFromStatus }: PolygonStatusChange) => {
      const response = await bulkUpdateSitePolygonStatus(sitePolygonUuids, status, comment);
      closeMapPopups();
      setPolygonTableHoveredUuid(null);
      invalidatePolygonMapTiles();
      setShouldRefetchPolygonData(true);
      await refreshPolygonData();
      ApiSlice.pruneCache("auditStatuses");

      for (const sitePolygonUuid of sitePolygonUuids) {
        const sitePolygon = polygonsData.find(polygon => polygon.uuid === sitePolygonUuid);
        const geometryPolygonUuid = sitePolygon?.polygonUuid;
        if (geometryPolygonUuid == null || geometryPolygonUuid === "") {
          continue;
        }

        trackPolygonStatusChanged({
          entityUuid,
          entityType: entityName,
          polygonId: geometryPolygonUuid,
          fromStatus: sitePolygon?.status ?? defaultFromStatus,
          toStatus: status
        });
      }

      trackBulkActionCompleted({
        entityUuid,
        entityType: entityName,
        actionType,
        polygonCount: sitePolygonUuids.length
      });

      return response;
    },
    [
      closeMapPopups,
      invalidatePolygonMapTiles,
      polygonsData,
      refreshPolygonData,
      setShouldRefetchPolygonData,
      entityName,
      entityUuid
    ]
  );

  const submitPolygons = useCallback(
    async (sitePolygonUuids: string[], submittedNames: string[], emptySelectionMessage: string, comment: string) => {
      if (sitePolygonUuids.length === 0) {
        showToast({ label: emptySelectionMessage, type: "error", placement: "bottom", duration: 5000 });
        return;
      }

      const statusChange: PolygonStatusChange = {
        status: POLYGON_PENDING_APPROVAL as PolygonStatus,
        comment,
        actionType: "submit",
        defaultFromStatus: POLYGON_DRAFT
      };
      if (isPolygonBackgroundJob(sitePolygonUuids.length)) {
        void runPolygonBackgroundJob({
          job: "submitting",
          completeLabel: toastLabels.submittingComplete,
          errorLabel: t("Error Submitting Polygons"),
          run: () => changePolygonStatus(sitePolygonUuids, statusChange)
        });
        return;
      }

      setIsSubmittingPolygons(true);
      setSubmittingPolygonCount(sitePolygonUuids.length);

      try {
        const response = await changePolygonStatus(sitePolygonUuids, statusChange);

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
        setSubmittedPolygonNames(submittedNames);
        pendingPolygonSubmittedModalRef.current = true;
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
    [changePolygonStatus, runPolygonBackgroundJob, t, toastLabels, user?.firstName, user?.lastName]
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

      const statusChange: PolygonStatusChange = {
        status: POLYGON_APPROVED as PolygonStatus,
        comment,
        actionType: "approve",
        defaultFromStatus: POLYGON_PENDING_APPROVAL
      };
      if (isPolygonBackgroundJob(sitePolygonUuids.length)) {
        void runPolygonBackgroundJob({
          job: "approving",
          completeLabel: t("Polygons approved"),
          errorLabel: t("Error Approving Polygons"),
          run: () => changePolygonStatus(sitePolygonUuids, statusChange)
        });
        return;
      }

      try {
        const response = await changePolygonStatus(sitePolygonUuids, statusChange);
        setApprovedPolygonComment(
          buildStatusChangeComment(
            comment,
            formatCommentAuthorName(user?.firstName, user?.lastName),
            getStatusUpdateCommentCreatedAt(response)
          )
        );
        setApprovedPolygonNames(approvedNames);
        schedulePolygonApprovedModal();
      } catch (error) {
        Log.error("Failed to approve selected polygons:", error);
        showToast({ label: t("Error Approving Polygons"), type: "error", placement: "bottom", duration: 5000 });
        throw error;
      }
    },
    [changePolygonStatus, runPolygonBackgroundJob, schedulePolygonApprovedModal, t, user?.firstName, user?.lastName]
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

      const statusChange: PolygonStatusChange = {
        status: POLYGON_INFORMATION_REQUIRED as PolygonStatus,
        comment,
        actionType: "request_information",
        defaultFromStatus: POLYGON_PENDING_APPROVAL
      };
      if (isPolygonBackgroundJob(sitePolygonUuids.length)) {
        void runPolygonBackgroundJob({
          job: "requestingInformation",
          completeLabel: t("Information requested"),
          errorLabel: t("Error Requesting Information for Polygons"),
          run: () => changePolygonStatus(sitePolygonUuids, statusChange)
        });
        return;
      }

      try {
        const response = await changePolygonStatus(sitePolygonUuids, statusChange);
        setRequestedInformationComment(
          buildStatusChangeComment(
            comment,
            formatCommentAuthorName(user?.firstName, user?.lastName),
            getStatusUpdateCommentCreatedAt(response)
          )
        );
        setRequestedInformationPolygonNames(polygonNames);
        scheduleInformationRequestedModal();
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
      changePolygonStatus,
      runPolygonBackgroundJob,
      scheduleInformationRequestedModal,
      t,
      user?.firstName,
      user?.lastName
    ]
  );

  const downloadPolygons = useCallback(
    async (geometryPolygonUuids: string[], downloadSitePolygons: SitePolygonLightDto[]) => {
      await downloadMultiplePolygonsGeoJson(geometryPolygonUuids, downloadSitePolygons[0]?.name ?? "polygon");
      trackPolygonDownloaded({
        entityUuid,
        entityType: entityName,
        polygonType: "standard",
        polygonId: formatPolygonTargetId(geometryPolygonUuids),
        polygonCount: geometryPolygonUuids.length
      });
      trackBulkActionCompleted({
        entityUuid,
        entityType: entityName,
        actionType: "download",
        polygonCount: geometryPolygonUuids.length
      });
    },
    [entityName, entityUuid]
  );

  const handleBulkDownload = useCallback(
    async (geometryPolygonUuids: string[], downloadSitePolygons: SitePolygonLightDto[]) => {
      if (geometryPolygonUuids.length === 0) {
        showToast({
          label: t("Could not find selected polygons to download"),
          type: "error",
          placement: "bottom",
          duration: 5000
        });
        return;
      }

      setIsDownloadingSelectedPolygons(true);
      if (isPolygonBackgroundJob(geometryPolygonUuids.length)) {
        await runPolygonBackgroundJob({
          job: "downloading",
          completeLabel: toastLabels.downloadingPolygonsComplete,
          errorLabel: t("Error Downloading Polygons"),
          run: () => downloadPolygons(geometryPolygonUuids, downloadSitePolygons)
        });
      } else {
        showPolygonProgressToast(
          t,
          getDownloadingPolygonsProgressLabel(t, geometryPolygonUuids.length),
          POLYGON_TOAST_IDS.downloading
        );
        try {
          await downloadPolygons(geometryPolygonUuids, downloadSitePolygons);
          completePolygonProgressToast(POLYGON_TOAST_IDS.downloading, toastLabels.downloadingPolygonsComplete);
        } catch (error) {
          Log.error("Failed to download selected polygons:", error);
          closePolygonProgressToast(POLYGON_TOAST_IDS.downloading);
          showToast({
            label: t("Error Downloading Polygon"),
            type: "error",
            placement: "bottom",
            duration: 5000
          });
        }
      }
      setIsDownloadingSelectedPolygons(false);
    },
    [downloadPolygons, runPolygonBackgroundJob, t, toastLabels]
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
      sitePolygonUuids: selectedSitePolygonUuids,
      geometryPolygonUuids: selectedGeometryPolygonUuids
    });
    clearBulkTableSelection();
    setShowBulkEditDrawer(true);
  }, [
    clearBulkTableSelection,
    openPolygonEditDrawerForRow,
    selectedGeometryPolygonUuids,
    selectedRows,
    selectedSitePolygonUuids
  ]);

  const handleBulkEditDrawerOpenChange = useCallback((open: boolean) => {
    setShowBulkEditDrawer(open);
    if (!open) {
      setBulkEditPayload(null);
    }
  }, []);

  const updatePolygonAttributes = useCallback(
    async ({ polygons, sitePolygonUuids }: BulkEditPayload, attributeChanges: BulkSitePolygonAttributeChanges) => {
      await bulkUpdateSitePolygonAttributes(sitePolygonUuids, attributeChanges);
      for (const row of polygons) {
        trackPolygonEvent("polygon_attributes_edited", {
          ...getPolygonAnalyticsContext({ entityType: entityName, entityId: entityUuid }),
          polygon_id: row.id,
          entry_point: "bulk_actions"
        });
      }
    },
    [entityName, entityUuid]
  );

  const refreshUpdatedPolygons = useCallback(
    async (geometryPolygonUuids: string[]) => {
      closeMapPopups();
      setPolygonTableHoveredUuid(null);
      invalidatePolygonMapTiles();
      await Promise.all([refreshPolygonData(), clearValidationUi(geometryPolygonUuids)]);
    },
    [clearValidationUi, closeMapPopups, invalidatePolygonMapTiles, refreshPolygonData]
  );

  const handleBulkEditSave = useCallback(
    async (attributeChanges: BulkSitePolygonAttributeChanges) => {
      if (bulkEditPayload == null || bulkEditPayload.sitePolygonUuids.length === 0) {
        showToast({
          label: t("Could not find selected polygons to update"),
          type: "error",
          placement: "bottom",
          duration: 5000
        });
        return;
      }

      const payload = bulkEditPayload;
      if (isPolygonBackgroundJob(payload.sitePolygonUuids.length)) {
        setShowBulkEditDrawer(false);
        setBulkEditPayload(null);
        void runPolygonBackgroundJob({
          job: "savingChanges",
          completeLabel: toastLabels.savingChangesComplete,
          errorLabel: t("Error Updating Polygon Details"),
          run: async () => {
            await updatePolygonAttributes(payload, attributeChanges);
            await refreshUpdatedPolygons(payload.geometryPolygonUuids);
          }
        });
        return;
      }

      try {
        setIsBulkUpdatingPolygons(true);
        showPolygonProgressToast(t, toastLabels.savingChangesProgress, POLYGON_TOAST_IDS.savingChanges);
        await updatePolygonAttributes(payload, attributeChanges);
        setShowBulkEditDrawer(false);
        setBulkEditPayload(null);
        await refreshUpdatedPolygons(payload.geometryPolygonUuids);
        completePolygonProgressToast(POLYGON_TOAST_IDS.savingChanges, toastLabels.savingChangesComplete);
      } catch (error) {
        Log.error("Failed to update selected polygon details:", error);
        closePolygonProgressToast(POLYGON_TOAST_IDS.savingChanges);
        showToast({ label: t("Error Updating Polygon Details"), type: "error", placement: "bottom", duration: 5000 });
      } finally {
        setIsBulkUpdatingPolygons(false);
      }
    },
    [bulkEditPayload, refreshUpdatedPolygons, runPolygonBackgroundJob, t, toastLabels, updatePolygonAttributes]
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
    clearValidationUi,
    handleBulkDelete,
    handleBulkDownloadClick,
    handleBulkEditDetails,
    handleBulkEditDrawerOpenChange,
    handleBulkEditSave,
    handleBulkRunValidation,
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
