import { Box, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { scrollToSitePolygonTabHeader } from "@/components/elements/Map-mapbox/sitePolygonNavigation";
import { resolvePolygonTableRowId } from "@/components/elements/Map-mapbox/sitePolygonPopupUtils";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import { pruneBoundingBoxesCache } from "@/connections/BoundingBox";
import { loadAllSitePolygons, useAllSitePolygons } from "@/connections/SitePolygons";
import { fetchPolygonValidation, useAllSiteValidations } from "@/connections/Validation";
import { AnrMapOverlayProvider } from "@/context/anrMapOverlay.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import {
  openPolygonPopupFromMapArea,
  registerRunPolygonValidationFromMapPopup,
  registerSitePolygonAdminReviewMode,
  unregisterRunPolygonValidationFromMapPopup
} from "@/context/mapArea.utils";
import {
  EMPTY_POLYGONS,
  PolygonEditDrawerDataSync,
  PolygonEditDrawerProvider,
  usePolygonEditDrawer
} from "@/context/polygonEditDrawer.provider";
import { openPolygonEditDrawerForSitePolygon } from "@/context/polygonEditDrawer.utils";
import {
  consumePendingPolygonFocusUuid,
  setPolygonTableHoveredUuid,
  useSyncPolygonTableSelectionStore
} from "@/context/polygonTableInteraction.store";
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { listDelayedJobs } from "@/generated/v3/jobService/jobServiceComponents";
import { ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { hasValidationCriteria, isValidationFreshAfter } from "@/helpers/polygonValidation";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { SITE_POLYGON_TAB_HEADER_ID } from "@/pages/site/[uuid]/constants/sitePolygonMapSizing";
import { HIDDEN_STICKY_COLUMN_EDGE_STYLES } from "@/redesignComponents/dataDisplay/Table/tableStyles";
import { useTableSelection } from "@/redesignComponents/dataDisplay/Table/useTableSelection";
import { DownloadIcon, PlusIcon, UploadIcon } from "@/redesignComponents/foundations/Icons";
import InlineMessage from "@/redesignComponents/status/InlineMessage/InlineMessage";
import Log from "@/utils/log";
import { trackBulkActionCompleted, trackPolygonValidationResults } from "@/utils/polygonAnalytics";
import { isSitePolygonApprovable, toReviewAvailabilityPolygon } from "@/utils/sitePolygonReview";

import { type OverlapFixPolygon } from "../components/Modals/OverlapFix";
import {
  buildPolygonValidationsMap,
  withResolvedValidationStatusFromCriteria
} from "../components/Modals/validationCriteria";
import PolygonBulkActionToolbar from "../components/PolygonBulkActionToolbar";
import PolygonSubmissionAnnouncement from "../components/PolygonSubmissionAnnouncement";
import { PolygonTableRow } from "../components/PolygonTableRow";
import { mapSitePolygonToTableRow } from "../components/polygonTableRow.utils";
import PolygonToolbar from "../components/PolygonToolbar";
import SitePolygonMapSection from "../components/SitePolygonMapSection";
import SitePolygonMetricsSection from "../components/SitePolygonMetricsSection";
import SitePolygonModals from "../components/SitePolygonModals";
import SitePolygonTableSection from "../components/SitePolygonTableSection";
import {
  canAutoFixOverlapSelection,
  getSelectedOverlapFixSummary,
  hasOverlapFailureInSelection,
  hasOverlapValidationFailure
} from "../hooks/overlapFix.utils";
import { useCrossSiteOverlapGeometries } from "../hooks/useCrossSiteOverlapGeometries";
import { useDownloadSitePolygons } from "../hooks/useDownloadSitePolygons";
import { usePolygonDrawUndo } from "../hooks/usePolygonDrawUndo";
import { usePolygonUploadErrorModal } from "../hooks/usePolygonUploadErrorModal";
import { useSelectedSitePolygons } from "../hooks/useSelectedSitePolygons";
import { useSitePolygonBulkActions } from "../hooks/useSitePolygonBulkActions";
import { useSitePolygonFilters } from "../hooks/useSitePolygonFilters";
import { useSitePolygonOverlap } from "../hooks/useSitePolygonOverlap";
import { useSitePolygonTableData } from "../hooks/useSitePolygonTableData";
import { useStartSitePolygonDrawing } from "../hooks/useStartSitePolygonDrawing";
import { showPolygonErrorToast } from "../utils/polygonOperationToasts";
import { getPolygonTableLoadingLabel } from "../utils/polygonTableLoadingLabel";

export type SitePolygonsWorkspaceVariant = "champions" | "adminReview";

export interface SitePolygonsWorkspaceProps {
  site: SiteFullDto;
  variant?: SitePolygonsWorkspaceVariant;
}

export type { PolygonTableRow } from "../components/PolygonTableRow";

const SitePolygonsWorkspaceContent: FC<SitePolygonsWorkspaceProps> = ({ site, variant = "champions" }) => {
  const t = useT();
  const isAdminReview = variant === "adminReview";
  const { isOpen: isEditPolygonOpen, suppressMapSelectionHighlight } = usePolygonEditDrawer();
  const {
    isUserDrawingEnabled,
    editPolygon,
    setSiteData,
    resetSiteMapInteractionState,
    closeMapPopups,
    polygonSubmitConfirmation,
    polygonApproveConfirmation,
    setPolygonApproveConfirmation,
    polygonRequestInformationConfirmation,
    setPolygonRequestInformationConfirmation,
    editPhotoDetailsMedia,
    setEditPhotoDetailsMedia
  } = useMapAreaContext();

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const tableScrollContainerRef = useRef<HTMLDivElement>(null);
  const pendingOverlapFixPolygonIdRef = useRef<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showOverlapFixModal, setOverlapFixModal] = useState(false);
  const [overlapFixResults, setOverlapFixResults] = useState<{
    polygonsFixed: OverlapFixPolygon[];
    polygonsNotFixed: OverlapFixPolygon[];
  }>({ polygonsFixed: [], polygonsNotFixed: [] });
  const {
    openUploadErrorModal: showUploadErrorModal,
    uploadErrorMessage,
    onUploadError,
    onUploadErrorModalOpenChange
  } = usePolygonUploadErrorModal();
  const [uploadedPolygonUuidToOpen, setUploadedPolygonUuidToOpen] = useState<string | null>(null);
  const [focusPolygonUuid, setFocusPolygonUuid] = useState<string | null>(null);
  const [isStickyActive, setIsStickyActive] = useState(false);
  const [pendingValidationPolygonUuids, setPendingValidationPolygonUuids] = useState<string[]>([]);
  const [validationZoomPolygonUuids, setValidationZoomPolygonUuids] = useState<string[]>([]);
  const [skipNextSiteBboxZoomNonce, setSkipNextSiteBboxZoomNonce] = useState(0);
  const [supplementalValidations, setSupplementalValidations] = useState<ValidationDto[]>([]);
  const priorValidationStatusRef = useRef<Map<string, string | null | undefined>>(new Map());
  const pendingValidationTrackBulkRef = useRef(true);
  const validationRunStartedAtRef = useRef(0);
  const pendingValidationKeyRef = useRef("");
  const validationPollingGenerationRef = useRef(0);

  const {
    polygonSearch,
    polygonFilters,
    sitePolygonFilter,
    activeFilterLabels,
    setPolygonSearch,
    setPolygonFilters,
    handleClearPolygonFilters
  } = useSitePolygonFilters({ siteUuid: site.uuid, t });

  const {
    data: polygonsQueryData,
    isLoading: isLoadingPolygons,
    error: polygonLoadError,
    progress: polygonLoadProgress,
    total: polygonLoadTotal,
    refetch: refetchPolygons
  } = useAllSitePolygons({
    entityName: "sites",
    entityUuid: site.uuid,
    enabled: site.uuid != null && site.uuid !== "",
    filter: sitePolygonFilter
  });

  const polygonsQueryDataOrEmpty = polygonsQueryData ?? EMPTY_POLYGONS;
  const { allValidations, fetchAllValidationPages } = useAllSiteValidations(site.uuid);
  const polygonValidations = useMemo(
    () => buildPolygonValidationsMap([...allValidations, ...supplementalValidations]),
    [allValidations, supplementalValidations]
  );
  const polygonsData = useMemo(
    () => withResolvedValidationStatusFromCriteria(polygonsQueryDataOrEmpty, polygonValidations),
    [polygonsQueryDataOrEmpty, polygonValidations]
  );

  const { polygonRows, columns, totalTreesPlanted, totalRestorationAreaHa } = useSitePolygonTableData({
    polygonsData,
    polygonValidations,
    t
  });
  const {
    polygonsWithOverlapCount,
    overlapPolygons,
    overlapValidations,
    overlapValidationsByPolygonUuid,
    fetchOverlapValidations
  } = useSitePolygonOverlap({
    siteUuid: site.uuid,
    polygonsData,
    preferredValidationsByPolygonUuid: polygonValidations,
    t
  });

  const { selectedRows, selectedRowIds, setSelectedRowIds, handleRowSelected, onAllItemsSelected } =
    useTableSelection<PolygonTableRow>(true, polygonRows);
  const {
    selectedPolygonUuids,
    overlapPolygonsForMap,
    editDrawerPolygonUuid,
    selectedTreesPlanted,
    selectedRestorationAreaRounded,
    selectedSitePolygons,
    selectedSitePolygonUuids,
    selectedGeometryPolygonUuids,
    selectedSubmittablePolygons,
    selectedSubmittablePolygonUuids
  } = useSelectedSitePolygons({
    polygonsData,
    selectedRowIds,
    selectedRows,
    overlapPolygons,
    isEditPolygonOpen,
    editPolygonUuid: editPolygon.uuid !== "" ? editPolygon.uuid : null
  });

  const currentSiteGeometryUuids = useMemo(
    () =>
      polygonsData
        .map(polygon => polygon.polygonUuid ?? polygon.uuid)
        .filter((uuid): uuid is string => uuid != null && uuid !== ""),
    [polygonsData]
  );
  const editDrawerPolygonValidation = useMemo(
    () => (editDrawerPolygonUuid != null ? overlapValidationsByPolygonUuid.get(editDrawerPolygonUuid) : undefined),
    [overlapValidationsByPolygonUuid, editDrawerPolygonUuid]
  );
  const { crossSiteOverlapPolygons } = useCrossSiteOverlapGeometries({
    polygonUuid: editDrawerPolygonUuid,
    validation: editDrawerPolygonValidation,
    currentSiteGeometryUuids,
    enabled: isEditPolygonOpen && editDrawerPolygonUuid != null
  });

  const selectedOverlapFixSummary = useMemo(
    () => getSelectedOverlapFixSummary(selectedRows, overlapValidationsByPolygonUuid, polygonsData),
    [selectedRows, overlapValidationsByPolygonUuid, polygonsData]
  );
  const hasSelectedOverlapFailure = hasOverlapFailureInSelection(selectedOverlapFixSummary);
  const hasFixableSelectedOverlap =
    canAutoFixOverlapSelection(selectedOverlapFixSummary) && pendingValidationPolygonUuids.length === 0;

  const openPolygonEditDrawerByPolygonId = useCallback(
    (polygonId: string) => {
      const sitePolygon = polygonsData.find(polygon => polygon.polygonUuid === polygonId || polygon.uuid === polygonId);
      if (sitePolygon != null) {
        openPolygonEditDrawerForSitePolygon(sitePolygon, sitePolygon.name ?? undefined);
      }
    },
    [polygonsData]
  );

  const handleViewOverlapFixPolygon = useCallback(
    (polygonUuid: string) => {
      setOverlapFixModal(false);

      if (polygonFilters.hasOverlap) {
        pendingOverlapFixPolygonIdRef.current = polygonUuid;
        setPolygonFilters(current => ({ ...current, hasOverlap: false }));
        return;
      }

      openPolygonEditDrawerByPolygonId(polygonUuid);
    },
    [openPolygonEditDrawerByPolygonId, polygonFilters.hasOverlap, setPolygonFilters]
  );

  useEffect(() => {
    const pendingPolygonId = pendingOverlapFixPolygonIdRef.current;
    if (pendingPolygonId == null || polygonFilters.hasOverlap || isLoadingPolygons) {
      return;
    }

    pendingOverlapFixPolygonIdRef.current = null;
    openPolygonEditDrawerByPolygonId(pendingPolygonId);
  }, [openPolygonEditDrawerByPolygonId, polygonFilters.hasOverlap, isLoadingPolygons, polygonsData]);

  useEffect(() => {
    if (uploadedPolygonUuidToOpen == null || isLoadingPolygons) {
      return;
    }

    const uploadedPolygonExistsInTableData = polygonsData.some(
      polygon => polygon.uuid === uploadedPolygonUuidToOpen || polygon.polygonUuid === uploadedPolygonUuidToOpen
    );
    if (!uploadedPolygonExistsInTableData) {
      void loadAllSitePolygons({
        entityName: "sites",
        entityUuid: site.uuid,
        enabled: site.uuid != null && site.uuid !== ""
      })
        .then(allSitePolygons => {
          const uploadedPolygon = allSitePolygons.find(
            polygon => polygon.uuid === uploadedPolygonUuidToOpen || polygon.polygonUuid === uploadedPolygonUuidToOpen
          );
          if (uploadedPolygon == null) {
            return;
          }

          openPolygonEditDrawerForSitePolygon(uploadedPolygon, uploadedPolygon.name ?? undefined);
          setUploadedPolygonUuidToOpen(null);
        })
        .catch(error => {
          Log.error("Failed to auto-open uploaded polygon in edit drawer:", error);
        });
      return;
    }

    openPolygonEditDrawerByPolygonId(uploadedPolygonUuidToOpen);
    setUploadedPolygonUuidToOpen(null);
  }, [isLoadingPolygons, openPolygonEditDrawerByPolygonId, polygonsData, site.uuid, uploadedPolygonUuidToOpen]);

  useEffect(() => {
    if (isLoadingPolygons) {
      return;
    }

    const pendingFocusUuid = consumePendingPolygonFocusUuid();
    if (pendingFocusUuid == null || pendingFocusUuid === "") {
      return;
    }

    const rowId = resolvePolygonTableRowId(polygonsData, pendingFocusUuid);
    if (rowId == null) {
      return;
    }

    setPolygonTableHoveredUuid(rowId);
    setFocusPolygonUuid(pendingFocusUuid);

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0 });
      scrollToSitePolygonTabHeader();
    });
  }, [isLoadingPolygons, polygonsData]);

  const handleFocusPolygonConsumed = useCallback(() => {
    const focusedUuid = focusPolygonUuid;
    setFocusPolygonUuid(null);
    if (focusedUuid != null && focusedUuid !== "") {
      openPolygonPopupFromMapArea(focusedUuid);
    }
  }, [focusPolygonUuid]);

  const handleOverlapFixModalClose = useCallback(() => {
    setOverlapFixModal(false);
    setOverlapFixResults({ polygonsFixed: [], polygonsNotFixed: [] });
  }, []);

  const openOverlapFixResultsModal = useCallback(
    (results: { polygonsFixed: OverlapFixPolygon[]; polygonsNotFixed: OverlapFixPolygon[] }) => {
      if (results.polygonsFixed.length === 0 && results.polygonsNotFixed.length === 0) {
        return;
      }

      setOverlapFixResults(results);
      setOverlapFixModal(true);
    },
    []
  );

  useEffect(() => {
    if (site.uuid == null || site.uuid === "") {
      return;
    }
    void fetchAllValidationPages();
  }, [site.uuid, fetchAllValidationPages]);

  const clearValidationPending = useCallback(() => {
    validationPollingGenerationRef.current += 1;
    setPendingValidationPolygonUuids([]);
    setValidationZoomPolygonUuids([]);
    validationRunStartedAtRef.current = 0;
    pendingValidationKeyRef.current = "";
  }, []);

  const markValidationPending = useCallback((polygonUuids: string[]) => {
    const key = [...polygonUuids].sort().join(",");
    validationRunStartedAtRef.current = Date.now();
    pendingValidationKeyRef.current = key;
    setPendingValidationPolygonUuids(polygonUuids);
    setSupplementalValidations(prev =>
      prev.filter(validation => validation.polygonUuid == null || !polygonUuids.includes(validation.polygonUuid))
    );
  }, []);

  const handleValidationUiCleared = useCallback((geometryPolygonUuids: string[]) => {
    if (geometryPolygonUuids.length === 0) {
      return;
    }

    const clearedUuidSet = new Set(geometryPolygonUuids);
    setSupplementalValidations(prev =>
      prev.filter(validation => validation.polygonUuid == null || !clearedUuidSet.has(validation.polygonUuid))
    );
    setPendingValidationPolygonUuids(prev => {
      const nextPendingValidationUuids = prev.filter(uuid => !clearedUuidSet.has(uuid));
      if (nextPendingValidationUuids.length !== prev.length) {
        validationPollingGenerationRef.current += 1;
      }
      return nextPendingValidationUuids;
    });
  }, []);

  const handleValidationJobsStarted = useCallback(
    (polygonUuids: string[], options?: { trackBulkCompletion?: boolean }) => {
      const priorStatuses = new Map<string, string | null | undefined>();
      polygonUuids.forEach(polygonUuid => {
        const sitePolygon = polygonsData.find(item => item.polygonUuid === polygonUuid);
        priorStatuses.set(polygonUuid, sitePolygon?.validationStatus);
      });
      priorValidationStatusRef.current = priorStatuses;
      pendingValidationTrackBulkRef.current = options?.trackBulkCompletion ?? true;
      if (validationRunStartedAtRef.current === 0) {
        validationRunStartedAtRef.current = Date.now();
      }

      const key = [...polygonUuids].sort().join(",");
      if (pendingValidationKeyRef.current !== key) {
        pendingValidationKeyRef.current = key;
        setSupplementalValidations(prev =>
          prev.filter(validation => validation.polygonUuid == null || !polygonUuids.includes(validation.polygonUuid))
        );
        setPendingValidationPolygonUuids(polygonUuids);
      }
      void listDelayedJobs.fetch({});
    },
    [polygonsData]
  );

  useEffect(() => {
    setSiteData(site);
  }, [setSiteData, site]);

  useEffect(() => {
    return () => {
      resetSiteMapInteractionState();
    };
  }, [resetSiteMapInteractionState]);

  useEffect(() => {
    if (isLoadingPolygons) return;
    const visibleRowIds = new Set(polygonRows.map(row => row.id));
    setSelectedRowIds(prev => {
      const next = new Set(Array.from(prev).filter(id => visibleRowIds.has(String(id))));
      return next.size === prev.size ? prev : next;
    });
  }, [polygonRows, setSelectedRowIds, isLoadingPolygons]);

  const clearTableSelection = useCallback(() => {
    setSelectedRowIds(new Set<string>());
  }, [setSelectedRowIds]);

  const clearBulkTableSelection = useCallback(() => {
    clearTableSelection();
    closeMapPopups();
    setPolygonTableHoveredUuid(null);
  }, [clearTableSelection, closeMapPopups]);

  const handleSelectOverlapPolygons = useCallback(() => {
    const visiblePolygonIds = new Set(
      polygonsData
        .map(polygon => polygon.polygonUuid ?? polygon.uuid)
        .filter((id): id is string => id != null && id !== "")
    );
    const overlapRowIds = overlapValidations
      .filter(hasOverlapValidationFailure)
      .map(validation => validation.polygonUuid)
      .filter((id): id is string => id != null && id !== "" && visiblePolygonIds.has(id));
    setSelectedRowIds(new Set(overlapRowIds));
  }, [overlapValidations, polygonsData, setSelectedRowIds]);

  const {
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
    isValidatingPolygons,
    deletingPolygonCount,
    fixingOverlapsCount,
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
  } = useSitePolygonBulkActions({
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
    onOverlapFixResultsOpen: openOverlapFixResultsModal,
    onValidationJobsStarted: handleValidationJobsStarted,
    onValidationPending: markValidationPending,
    onValidationPendingClear: clearValidationPending,
    onValidationUiCleared: handleValidationUiCleared
  });

  useEffect(() => {
    if (pendingValidationPolygonUuids.length === 0) {
      return;
    }

    let cancelled = false;
    const polygonUuids = pendingValidationPolygonUuids;
    const pollingGeneration = validationPollingGenerationRef.current;

    const resolveValidationForPolygons = async () => {
      try {
        for (let attempt = 0; attempt < 20 && !cancelled; attempt++) {
          if (validationPollingGenerationRef.current !== pollingGeneration) {
            return;
          }
          const individualValidations = await Promise.all(polygonUuids.map(uuid => fetchPolygonValidation(uuid)));

          if (cancelled || validationPollingGenerationRef.current !== pollingGeneration) {
            return;
          }

          const allResolved = individualValidations.every(
            validation =>
              validation != null &&
              hasValidationCriteria(validation) &&
              isValidationFreshAfter(validation, validationRunStartedAtRef.current)
          );

          if (allResolved) {
            const fetchedValidations = individualValidations.filter(
              (validation): validation is ValidationDto => validation != null
            );

            setSupplementalValidations(prev => {
              const byPolygonUuid = new Map(prev.map(validation => [validation.polygonUuid, validation]));
              fetchedValidations.forEach(validation => {
                byPolygonUuid.set(validation.polygonUuid, validation);
              });
              return Array.from(byPolygonUuid.values());
            });

            fetchedValidations.forEach(validation => {
              const polygonUuid = validation.polygonUuid;
              if (polygonUuid == null || polygonUuid === "") {
                return;
              }

              trackPolygonValidationResults({
                siteUuid: site.uuid,
                polygonId: polygonUuid,
                validation,
                priorValidationStatus: priorValidationStatusRef.current.get(polygonUuid)
              });
            });

            if (pendingValidationTrackBulkRef.current) {
              trackBulkActionCompleted({
                siteUuid: site.uuid,
                actionType: "run_validation",
                polygonCount: polygonUuids.length
              });
            }

            await refetchPolygons();
            await Promise.all([fetchAllValidationPages(true), fetchOverlapValidations(true)]);
            pruneBoundingBoxesCache();
            setPendingValidationPolygonUuids([]);
            validationRunStartedAtRef.current = 0;
            pendingValidationKeyRef.current = "";
            setValidationZoomPolygonUuids(polygonUuids);
            showValidationResultsModalIfPending();
            return;
          }

          await new Promise(resolve => window.setTimeout(resolve, 1500));
        }

        if (!cancelled && validationPollingGenerationRef.current === pollingGeneration) {
          cancelPendingValidationResultsModal();
          clearValidationPending();
          showPolygonErrorToast(t("Validation results are taking longer than expected. Please try again."));
        }
      } catch (error) {
        Log.error("Failed while polling polygon validation results:", error);
        if (!cancelled && validationPollingGenerationRef.current === pollingGeneration) {
          cancelPendingValidationResultsModal();
          clearValidationPending();
          showPolygonErrorToast(t("Failed to load validation results. Please try again."));
        }
      }
    };

    void resolveValidationForPolygons();

    return () => {
      cancelled = true;
    };
  }, [
    cancelPendingValidationResultsModal,
    clearValidationPending,
    fetchAllValidationPages,
    fetchOverlapValidations,
    pendingValidationPolygonUuids,
    refetchPolygons,
    showValidationResultsModalIfPending,
    site.uuid,
    t
  ]);

  useEffect(() => {
    registerSitePolygonAdminReviewMode(isAdminReview);
    if (isAdminReview) {
      registerRunPolygonValidationFromMapPopup(runValidationWithResultsModal);
    }
    return () => {
      registerSitePolygonAdminReviewMode(false);
      unregisterRunPolygonValidationFromMapPopup();
    };
  }, [isAdminReview, runValidationWithResultsModal]);

  const handleValidationZoomConsumed = useCallback(() => {
    setValidationZoomPolygonUuids([]);
    setSkipNextSiteBboxZoomNonce(nonce => nonce + 1);
  }, []);

  const handleViewValidationDetails = useCallback(
    (row: PolygonTableRow) => {
      handleSystemValidationCompleteModalChange(false);
      openPolygonEditDrawerForRow(row);
    },
    [handleSystemValidationCompleteModalChange, openPolygonEditDrawerForRow]
  );

  const isValidationInProgress = isValidatingPolygons || pendingValidationPolygonUuids.length > 0;
  const isSitePolygonsLoading = isLoadingPolygons || isValidationInProgress || isFixingOverlaps || isDeletingPolygons;
  const freezeCameraZoom =
    isSitePolygonsLoading || pendingValidationPolygonUuids.length > 0 || validationZoomPolygonUuids.length > 0;
  const startDrawing = useStartSitePolygonDrawing({ onClearTableSelection: clearTableSelection });
  const isAdmin = useIsAdmin();
  const { showPolygonUndoButton, handleUndoPolygonDraw } = usePolygonDrawUndo({
    isEditPolygonOpen,
    isUserDrawingEnabled,
    isExistingPolygonOpen: editPolygon.isOpen && editPolygon.uuid !== ""
  });

  const startNewPolygonFlow = useCallback(() => {
    openPolygonEditDrawerForSitePolygon();
    startDrawing();
  }, [startDrawing]);

  const { downloadAll, isDownloading: isDownloadingAllPolygons } = useDownloadSitePolygons({
    siteUuid: site.uuid,
    siteName: site.name
  });

  const polygonTableHighlight = useMemo(
    () => ({
      selectedPolygonUuids: suppressMapSelectionHighlight ? [] : selectedPolygonUuids,
      focusPolygonUuid,
      onFocusPolygonConsumed: handleFocusPolygonConsumed,
      validationZoomPolygonUuids,
      onValidationZoomConsumed: handleValidationZoomConsumed
    }),
    [
      selectedPolygonUuids,
      suppressMapSelectionHighlight,
      focusPolygonUuid,
      handleFocusPolygonConsumed,
      validationZoomPolygonUuids,
      handleValidationZoomConsumed
    ]
  );

  const handleClearHover = useCallback(() => {
    setPolygonTableHoveredUuid(null);
  }, []);

  const [showApprovePolygonConfirmationModal, setShowApprovePolygonConfirmationModal] = useState(false);
  const [approvePayload, setApprovePayload] = useState<{ polygons: PolygonTableRow[] } | null>(null);
  const [showRequestInformationModal, setShowRequestInformationModal] = useState(false);
  const [requestInformationPayload, setRequestInformationPayload] = useState<{ polygons: PolygonTableRow[] } | null>(
    null
  );

  const handleOpenApprovePolygonModal = useCallback(() => {
    const approvableRows = selectedRows.filter(row => isSitePolygonApprovable(toReviewAvailabilityPolygon(row)));
    if (approvableRows.length === 0) {
      return;
    }
    setApprovePayload({ polygons: approvableRows });
    setShowApprovePolygonConfirmationModal(true);
  }, [selectedRows]);

  const handleOpenRequestInformationModal = useCallback(() => {
    setRequestInformationPayload({ polygons: selectedRows });
    setShowRequestInformationModal(true);
  }, [selectedRows]);

  const handleApprovePolygonConfirmationModalChange = useCallback((open: boolean) => {
    setShowApprovePolygonConfirmationModal(open);
    if (!open) setApprovePayload(null);
  }, []);

  const handleRequestInformationModalChange = useCallback((open: boolean) => {
    setShowRequestInformationModal(open);
    if (!open) setRequestInformationPayload(null);
  }, []);

  const resolveSitePolygonUuidsAndNames = useCallback(
    (rows: PolygonTableRow[]) => {
      const sitePolygonUuids: string[] = [];
      const names: string[] = [];

      rows.forEach(row => {
        const sitePolygon = polygonsData.find(polygon => polygon.polygonUuid === row.id || polygon.uuid === row.id);
        if (sitePolygon?.uuid == null || sitePolygon.uuid === "") {
          return;
        }
        sitePolygonUuids.push(sitePolygon.uuid);
        names.push(sitePolygon.name ?? row.polygonName ?? t("Unnamed polygon"));
      });

      return { sitePolygonUuids, names };
    },
    [polygonsData, t]
  );

  const handleApprovePolygons = useCallback(
    async (comment: string, selectedPolygons: PolygonTableRow[]) => {
      const { sitePolygonUuids, names } = resolveSitePolygonUuidsAndNames(selectedPolygons);

      if (sitePolygonUuids.length === 0) {
        setShowApprovePolygonConfirmationModal(false);
        setApprovePayload(null);
        return;
      }

      try {
        await approvePolygons(sitePolygonUuids, names, comment);
        clearBulkTableSelection();
      } catch (error) {
        Log.error("Failed to approve polygons:", error);
      } finally {
        setShowApprovePolygonConfirmationModal(false);
        setApprovePayload(null);
      }
    },
    [approvePolygons, clearBulkTableSelection, resolveSitePolygonUuidsAndNames]
  );

  const handleConfirmRequestInformation = useCallback(
    async (comment: string) => {
      const { sitePolygonUuids, names } = resolveSitePolygonUuidsAndNames(requestInformationPayload?.polygons ?? []);

      if (sitePolygonUuids.length === 0) {
        setShowRequestInformationModal(false);
        setRequestInformationPayload(null);
        return;
      }

      try {
        await requestInformationForPolygons(sitePolygonUuids, names, comment);
        clearBulkTableSelection();
      } catch (error) {
        Log.error("Failed to request information for polygons:", error);
      } finally {
        setShowRequestInformationModal(false);
        setRequestInformationPayload(null);
      }
    },
    [clearBulkTableSelection, requestInformationForPolygons, requestInformationPayload, resolveSitePolygonUuidsAndNames]
  );

  useEffect(() => {
    if (polygonApproveConfirmation == null) return;
    const polygon = polygonsData.find(p => p.uuid === polygonApproveConfirmation);
    setPolygonApproveConfirmation(null);
    if (polygon != null && isSitePolygonApprovable(polygon)) {
      setApprovePayload({ polygons: [mapSitePolygonToTableRow(polygon, t)] });
      setShowApprovePolygonConfirmationModal(true);
    }
  }, [polygonApproveConfirmation, polygonsData, setPolygonApproveConfirmation, t]);

  useEffect(() => {
    if (polygonRequestInformationConfirmation == null) return;
    const polygon = polygonsData.find(p => p.uuid === polygonRequestInformationConfirmation);
    setPolygonRequestInformationConfirmation(null);
    if (polygon != null) {
      setRequestInformationPayload({ polygons: [mapSitePolygonToTableRow(polygon, t)] });
      setShowRequestInformationModal(true);
    }
  }, [polygonRequestInformationConfirmation, polygonsData, setPolygonRequestInformationConfirmation, t]);

  const handleDrawerRequestApproveModal = useCallback(() => {
    const drawerPolygon = polygonsData.find(p => p.polygonUuid === editPolygon.uuid || p.uuid === editPolygon.uuid);
    if (drawerPolygon != null && isSitePolygonApprovable(drawerPolygon)) {
      setApprovePayload({ polygons: [mapSitePolygonToTableRow(drawerPolygon, t)] });
      setShowApprovePolygonConfirmationModal(true);
    }
  }, [editPolygon.uuid, polygonsData, t]);

  const handleDrawerRequestInformationModal = useCallback(() => {
    const drawerPolygon = polygonsData.find(p => p.polygonUuid === editPolygon.uuid || p.uuid === editPolygon.uuid);
    if (drawerPolygon != null) {
      setRequestInformationPayload({ polygons: [mapSitePolygonToTableRow(drawerPolygon, t)] });
      setShowRequestInformationModal(true);
    }
  }, [editPolygon.uuid, polygonsData, t]);

  const hasPolygonSelection = selectedRows.length > 0;
  const shouldShowNoResults = !isSitePolygonsLoading && polygonRows.length === 0;
  const isDeletedAuditView = polygonFilters.showDeleted;

  const mapPopupSubmitPolygons = useMemo(() => {
    const sitePolygonUuid = polygonSubmitConfirmation;
    if (sitePolygonUuid == null || sitePolygonUuid === "") {
      return [];
    }

    const sitePolygon = polygonsData.find(polygon => polygon.uuid === sitePolygonUuid);
    return sitePolygon != null ? [mapSitePolygonToTableRow(sitePolygon, t)] : [];
  }, [polygonSubmitConfirmation, polygonsData, t]);

  useSyncPolygonTableSelectionStore(selectedRowIds);

  const polygonsTableStyles = isStickyActive ? undefined : HIDDEN_STICKY_COLUMN_EDGE_STYLES;
  const bulkToolbarSubmitLabel = useMemo(() => {
    if (hasSelectedOverlapFailure) return t("Fix Overlap");
    return isAdminReview ? t("Approve") : t("Submit");
  }, [hasSelectedOverlapFailure, isAdminReview, t]);
  const isBulkSubmitDisabled =
    !hasSelectedOverlapFailure &&
    (isAdminReview || (hasPolygonSelection && selectedSubmittablePolygonUuids.length === 0));

  useEffect(() => {
    const scrollContainer = tableScrollContainerRef.current;
    if (scrollContainer == null) {
      return;
    }

    const handleScroll = () => {
      setIsStickyActive(scrollContainer.scrollLeft > 0);
    };

    handleScroll();
    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [isSitePolygonsLoading, shouldShowNoResults, polygonRows.length]);

  const loadingLabel = getPolygonTableLoadingLabel({
    t,
    isFixingOverlaps,
    fixingOverlapsCount,
    isValidatingPolygons: isValidationInProgress,
    validatingPolygonCount: isValidatingPolygons ? validatingPolygonCount : pendingValidationPolygonUuids.length,
    isDeletingPolygons,
    deletingPolygonCount,
    polygonLoadProgress,
    polygonLoadTotal
  });

  return (
    <>
      {!isAdminReview ? <PolygonSubmissionAnnouncement /> : null}
      <PolygonEditDrawerDataSync
        polygons={polygonsData}
        onRefetchPolygons={refetchPolygons}
        onOverlapFixed={handleDrawerOverlapFixed}
        onRunValidation={runPolygonValidation}
        onPolygonDeletingChange={handlePolygonDeletingChange}
        onRequestApproveModal={isAdminReview ? handleDrawerRequestApproveModal : undefined}
        onRequestInformationModal={isAdminReview ? handleDrawerRequestInformationModal : undefined}
        onValidationJobsStarted={handleValidationJobsStarted}
      />
      <PageContent className="bg-theme-neutral-100">
        <PageItem
          title={t("Polygons")}
          className="scroll-mt-[5.5rem]"
          flexProps={{ width: "100%", id: SITE_POLYGON_TAB_HEADER_ID }}
          downloadButtonProps={{
            variant: "secondary",
            size: "small",
            children: t("Download All"),
            leftIcon: <DownloadIcon />,
            loading: isDownloadingAllPolygons,
            disabled: site.uuid == null || site.uuid === "",
            onClick: () => {
              void downloadAll();
            }
          }}
          buttonProps={
            isAdmin
              ? {
                  variant: "secondary",
                  size: "small",
                  children: t("Upload Monitoring Plots"),
                  leftIcon: <UploadIcon />,
                  disabled: true
                }
              : undefined
          }
          multiActionButtonProps={
            isDeletedAuditView
              ? undefined
              : {
                  mainActionLabel: t("Add"),
                  size: "small",
                  mainActionLeftIcon: <PlusIcon />,
                  mainActionOnClick: startNewPolygonFlow,
                  otherActions: [
                    {
                      label: t("Draw Polygon"),
                      onClick: startNewPolygonFlow,
                      value: "draw-polygon"
                    },
                    {
                      label: t("Upload"),
                      onClick: () => {
                        setShowUploadModal(true);
                      },
                      value: "upload"
                    }
                  ],
                  variant: "primary"
                }
          }
        >
          <PolygonToolbar
            siteUuid={site.uuid}
            resultCount={polygonRows.length}
            polygonSearch={polygonSearch}
            polygonFilters={polygonFilters}
            activeFilterLabels={activeFilterLabels}
            isAdminReview={isAdminReview}
            onSearchChange={setPolygonSearch}
            onApplyFilters={setPolygonFilters}
            onClearFilters={handleClearPolygonFilters}
          />
        </PageItem>
        <PolygonBulkActionToolbar
          visible={hasPolygonSelection && !isDeletedAuditView}
          itemCount={selectedRows.length}
          isBulkEditDrawerOpen={showBulkEditDrawer}
          isAdminReview={isAdminReview}
          submitLabel={bulkToolbarSubmitLabel}
          polygons={selectedRows}
          selectedGeometryPolygonUuids={selectedGeometryPolygonUuids}
          isDownloading={isDownloadingSelectedPolygons}
          isValidating={isValidatingPolygons}
          onCancel={clearBulkTableSelection}
          onClearSelection={clearBulkTableSelection}
          onDelete={handleOpenDeletePolygonModal}
          onDownload={handleBulkDownloadClick}
          onEdit={handleBulkEditDetails}
          onRunValidation={runValidationWithResultsModal}
          onSubmit={handleOpenSubmitPolygonsModal}
          onOpenApproveModal={handleOpenApprovePolygonModal}
          onOpenRequestInformationModal={handleOpenRequestInformationModal}
          isOverlapFixAction={hasSelectedOverlapFailure}
          canAutoFixOverlap={hasFixableSelectedOverlap}
          isSubmitDisabled={isBulkSubmitDisabled}
        />
        <SitePolygonModals
          siteUuid={site.uuid}
          isEditPolygonOpen={isEditPolygonOpen}
          isAdminReview={isAdminReview}
          siteHasExistingPolygons={polygonsData.length > 0}
          bulkEditPayload={bulkEditPayload}
          deletePayload={deletePayload}
          submitPayload={submitPayload}
          overlapFixResults={overlapFixResults}
          editPhotoDetailsMedia={editPhotoDetailsMedia}
          openBulkEditDrawer={showBulkEditDrawer}
          openDeletePolygonModal={showDeletePolygonModal}
          openOverlapFixModal={showOverlapFixModal}
          openPolygonSubmittedModal={showPolygonSubmittedModal}
          openSubmitPolygonsModal={showSubmitPolygonsModal}
          openSubmitPolygonConfirmationModal={showSubmitPolygonConfirmationModal}
          openUploadErrorModal={showUploadErrorModal}
          uploadErrorMessage={uploadErrorMessage}
          openUploadModal={showUploadModal}
          openMapPopupSubmitConfirmationModal={showMapPopupSubmitConfirmationModal}
          mapPopupSubmitPolygons={mapPopupSubmitPolygons}
          submittedPolygonNames={submittedPolygonNames}
          submittedPolygonComment={submittedPolygonComment}
          isBulkUpdatingPolygons={isBulkUpdatingPolygons}
          onBulkEditDrawerOpenChange={handleBulkEditDrawerOpenChange}
          onBulkEditSave={handleBulkEditSave}
          onDelete={handleBulkDelete}
          onDeletePolygonModalOpenChange={handleDeletePolygonModalChange}
          onEditPhotoDetailsClose={() => setEditPhotoDetailsMedia(null)}
          onMapPopupSubmitConfirmationModalOpenChange={handleMapPopupSubmitConfirmationModalChange}
          onMapPopupSubmit={handleConfirmMapPopupSubmit}
          onOverlapFixClose={handleOverlapFixModalClose}
          onPolygonSubmittedModalOpenChange={handlePolygonSubmittedModalChange}
          onProceedToBulkSubmitConfirmation={handleProceedToBulkSubmitConfirmation}
          onSubmitPolygonConfirmationModalOpenChange={handleSubmitPolygonConfirmationModalChange}
          onSubmitPolygonsModalOpenChange={handleSubmitPolygonsModalChange}
          onSubmitPolygons={handleConfirmBulkSubmit}
          openSystemValidationCompleteModal={isSystemValidationCompleteModalOpen}
          validatedPolygons={validatedPolygons}
          polygonValidations={polygonValidations}
          pendingValidationPolygonIds={pendingValidationPolygonUuids}
          isAwaitingValidationResults={pendingValidationPolygonUuids.length > 0}
          onSystemValidationCompleteModalOpenChange={handleSystemValidationCompleteModalChange}
          onViewValidationDetails={handleViewValidationDetails}
          onUploadError={onUploadError}
          onUploadErrorModalOpenChange={onUploadErrorModalOpenChange}
          onUploadModalOpenChange={setShowUploadModal}
          onUploadSuccess={({ createdSitePolygonUuid, uploadedFileCount }) => {
            if (createdSitePolygonUuid != null && uploadedFileCount === 1) {
              setUploadedPolygonUuidToOpen(createdSitePolygonUuid);
            }
            void refetchPolygons();
          }}
          onViewOverlapPolygon={handleViewOverlapFixPolygon}
          openApprovePolygonConfirmationModal={showApprovePolygonConfirmationModal}
          onApprovePolygonConfirmationModalOpenChange={handleApprovePolygonConfirmationModalChange}
          approvePayload={approvePayload}
          projectUuid={site.projectUuid}
          onApprove={handleApprovePolygons}
          openRequestInformationModal={showRequestInformationModal}
          onRequestInformationModalOpenChange={handleRequestInformationModalChange}
          requestInformationPayload={requestInformationPayload}
          onConfirmRequestInformation={handleConfirmRequestInformation}
          openPolygonApprovedModal={showPolygonApprovedModal && approvedPolygonNames.length > 0}
          onPolygonApprovedModalOpenChange={handlePolygonApprovedModalChange}
          approvedPolygonNames={approvedPolygonNames}
          approvedPolygonComment={approvedPolygonComment}
          openInformationRequestedModal={showInformationRequestedModal && requestedInformationPolygonNames.length > 0}
          onInformationRequestedModalOpenChange={handleInformationRequestedModalChange}
          requestedInformationPolygonNames={requestedInformationPolygonNames}
          requestedInformationComment={requestedInformationComment}
        />
        <SitePolygonMapSection
          isAdmin={isAdmin}
          site={site}
          polygons={polygonsData}
          isEditPolygonOpen={isEditPolygonOpen}
          isSitePolygonsLoading={isSitePolygonsLoading}
          freezeCameraZoom={freezeCameraZoom}
          skipNextSiteBboxZoomNonce={skipNextSiteBboxZoomNonce}
          polygonTableHighlight={polygonTableHighlight}
          overlapPolygons={overlapPolygonsForMap}
          crossSiteOverlapPolygons={crossSiteOverlapPolygons}
          onRefetchPolygons={refetchPolygons}
          showUndoButton={showPolygonUndoButton}
          onUndoDraw={handleUndoPolygonDraw}
          isDeletedAuditView={isDeletedAuditView}
        />
        {polygonLoadError != null && (
          <InlineMessage
            className="mt-4"
            variant="error"
            label={t("Unable to load polygons")}
            caption={t("Please retry loading polygons.")}
            actionLabel={t("Retry")}
            onActionClick={() => {
              void refetchPolygons();
            }}
          />
        )}
        {shouldShowNoResults ? (
          <Box>
            <Text textStyle="400-bold">{t("No results found")}</Text>
            <Text textStyle="400">
              {t("We couldn’t find any site areas matching your search. Try a different keyword.")}
            </Text>
          </Box>
        ) : (
          <>
            {!isDeletedAuditView && (
              <SitePolygonMetricsSection
                totalTreesPlanted={totalTreesPlanted}
                totalRestorationAreaHa={totalRestorationAreaHa}
                restorationAreaGoal={site.hectaresToRestoreGoal}
                hasPolygonSelection={hasPolygonSelection}
                selectedTreesPlanted={selectedTreesPlanted}
                selectedRestorationAreaRounded={selectedRestorationAreaRounded}
                polygonsWithOverlapCount={polygonsWithOverlapCount}
                onSelectOverlapPolygons={handleSelectOverlapPolygons}
              />
            )}
            <SitePolygonTableSection
              tableContainerRef={tableContainerRef}
              tableScrollContainerRef={tableScrollContainerRef}
              tableStyles={polygonsTableStyles}
              isSitePolygonsLoading={isSitePolygonsLoading}
              polygonRows={polygonRows}
              columns={columns}
              selectedRows={selectedRows}
              loadingLabel={loadingLabel}
              onAllItemsSelected={onAllItemsSelected}
              onClearHover={handleClearHover}
              onRowSelected={handleRowSelected}
              readOnly={isDeletedAuditView}
            />
          </>
        )}
      </PageContent>
    </>
  );
};

const SitePolygonsWorkspace: FC<SitePolygonsWorkspaceProps> = ({ site, variant = "champions" }) => (
  <AnrMapOverlayProvider>
    <PolygonEditDrawerProvider>
      <SitePolygonsWorkspaceContent site={site} variant={variant} />
    </PolygonEditDrawerProvider>
  </AnrMapOverlayProvider>
);

export default SitePolygonsWorkspace;
