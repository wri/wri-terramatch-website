import { Box, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { ComponentProps, FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { pruneSitePolygonsCache } from "@/connections/SitePolygons";
import { usePolygonValidations } from "@/connections/Validation";
import { AnrMapOverlayProvider } from "@/context/anrMapOverlay.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import {
  registerOpenPolygonEditDrawerByPolygonIdFromMapPopup,
  registerRunPolygonValidationFromMapPopup,
  registerSitePolygonAdminReviewMode,
  unregisterOpenPolygonEditDrawerByPolygonIdFromMapPopup,
  unregisterRunPolygonValidationFromMapPopup
} from "@/context/mapArea.utils";
import {
  EMPTY_POLYGONS,
  PolygonEditDrawerDataSync,
  PolygonEditDrawerProvider,
  usePolygonEditDrawer
} from "@/context/polygonEditDrawer.provider";
import { openPolygonEditDrawerForSitePolygon } from "@/context/polygonEditDrawer.utils";
import { setPolygonTableHoveredUuid, useSyncPolygonTableSelectionStore } from "@/context/polygonTableInteraction.store";
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useTableSelection } from "@/redesignComponents/dataDisplay/Table/useTableSelection";
import InlineMessage from "@/redesignComponents/status/InlineMessage/InlineMessage";

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
import SitePolygonsHeader from "../components/SitePolygonsHeader";
import SitePolygonTableSection from "../components/SitePolygonTableSection";
import {
  canAutoFixOverlapSelection,
  getSelectedOverlapFixSummary,
  hasOverlapFailureInSelection
} from "../hooks/overlapFix.utils";
import { useCrossSiteOverlapGeometries } from "../hooks/useCrossSiteOverlapGeometries";
import { useDownloadSitePolygons } from "../hooks/useDownloadSitePolygons";
import { useExistingPolygonModal } from "../hooks/useExistingPolygonModal";
import { usePolygonDrawUndo } from "../hooks/usePolygonDrawUndo";
import { usePolygonTablePaging } from "../hooks/usePolygonTablePaging";
import { usePolygonTableStickyStyles } from "../hooks/usePolygonTableStickyStyles";
import { usePolygonUploadErrorModal } from "../hooks/usePolygonUploadErrorModal";
import { useSelectedSitePolygons } from "../hooks/useSelectedSitePolygons";
import { useSitePolygonBulkActions } from "../hooks/useSitePolygonBulkActions";
import { useSitePolygonDisturbanceMarkers } from "../hooks/useSitePolygonDisturbanceMarkers";
import { useSitePolygonEditNavigation } from "../hooks/useSitePolygonEditNavigation";
import { useSitePolygonFilters } from "../hooks/useSitePolygonFilters";
import { useSitePolygonOverlap } from "../hooks/useSitePolygonOverlap";
import { useSitePolygonReviewActions } from "../hooks/useSitePolygonReviewActions";
import { useSitePolygonTableData } from "../hooks/useSitePolygonTableData";
import { useSitePolygonValidationPoll, useSitePolygonValidationState } from "../hooks/useSitePolygonValidationPolling";
import { useSitePolygonWorkspaceData } from "../hooks/useSitePolygonWorkspaceData";
import { useStartSitePolygonDrawing } from "../hooks/useStartSitePolygonDrawing";
import { getPolygonTableLoadingLabel } from "../utils/polygonTableLoadingLabel";
import type { DuplicatePolygonUploadInfo } from "../utils/polygonUploadDuplicate";
import {
  mergeMapAlertPolygons,
  mergeSelectionPolygons,
  mergeSelectionTableRows
} from "../utils/sitePolygonsWorkspace.utils";

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
    setPolygonData,
    resetSiteMapInteractionState,
    closeMapPopups,
    polygonSubmitConfirmation,
    polygonApproveConfirmation,
    setPolygonApproveConfirmation,
    polygonRequestInformationConfirmation,
    setPolygonRequestInformationConfirmation,
    editPhotoDetailsMediaUuid,
    setEditPhotoDetailsMediaUuid
  } = useMapAreaContext();

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const tableScrollContainerRef = useRef<HTMLDivElement>(null);
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
  const {
    openExistingPolygonModal: showExistingPolygonModal,
    existingPolygonDuplicate,
    onDuplicateDetected,
    onExistingPolygonModalOpenChange
  } = useExistingPolygonModal();

  const {
    polygonSearch,
    polygonFilters,
    sitePolygonFilter,
    activeFilterLabels,
    setPolygonSearch,
    setPolygonFilters,
    handleClearPolygonFilters
  } = useSitePolygonFilters({ t });

  const {
    pageNumber: tablePageNumber,
    pageSize: tablePageSize,
    sortField: tableSortField,
    sortDirection: tableSortDirection,
    setPageNumber: setTablePageNumber,
    handlePageSizeChange: handleTablePageSizeChange,
    handleSortChange: handleTableSortChange
  } = usePolygonTablePaging({ filter: sitePolygonFilter });

  const {
    tablePolygonsLoaded,
    tablePolygonsPageData,
    tableTotalItems,
    polygonLoadError,
    mapIndexLoaded,
    mapPolygons,
    mapPolygonTotal,
    mapPolygonUuids,
    disturbancePolygonUuids,
    totalTreesPlanted,
    totalRestorationAreaHa
  } = useSitePolygonWorkspaceData({
    entityName: "sites",
    entityUuid: site.uuid,
    filter: sitePolygonFilter,
    pageNumber: tablePageNumber,
    pageSize: tablePageSize,
    sortField: tableSortField,
    sortDirection: tableSortDirection
  });

  const refetchPolygons = useCallback(async () => {
    pruneSitePolygonsCache();
  }, []);

  const tablePagePolygonUuids = useMemo(
    () =>
      (tablePolygonsPageData ?? EMPTY_POLYGONS)
        .map(polygon => polygon.polygonUuid)
        .filter((uuid): uuid is string => uuid != null && uuid !== ""),
    [tablePolygonsPageData]
  );

  const findTableSitePolygon = useCallback(
    (polygonId: string) =>
      (tablePolygonsPageData ?? EMPTY_POLYGONS).find(
        polygon => polygon.polygonUuid === polygonId || polygon.uuid === polygonId
      ),
    [tablePolygonsPageData]
  );

  const {
    pendingValidationPolygonUuids,
    validationZoomPolygonUuids,
    skipNextSiteBboxZoomNonce,
    supplementalValidations,
    setSupplementalValidations,
    setPendingValidationPolygonUuids,
    setValidationZoomPolygonUuids,
    priorValidationStatusRef,
    pendingValidationTrackBulkRef,
    validationRunStartedAtRef,
    validationAfterCriteriaClearRef,
    pendingValidationKeyRef,
    validationPollingGenerationRef,
    clearValidationPending,
    handleValidationUiCleared,
    handleValidationJobsStarted,
    handleValidationZoomConsumed
  } = useSitePolygonValidationState({ findTableSitePolygon });

  const { validations: pageValidations, fetchValidations: fetchPageValidations } =
    usePolygonValidations(tablePagePolygonUuids);
  const polygonValidations = useMemo(
    () => buildPolygonValidationsMap([...pageValidations, ...supplementalValidations]),
    [pageValidations, supplementalValidations]
  );
  const tablePolygonsData = useMemo(
    () => withResolvedValidationStatusFromCriteria(tablePolygonsPageData ?? EMPTY_POLYGONS, polygonValidations),
    [tablePolygonsPageData, polygonValidations]
  );

  useEffect(() => {
    setPolygonData(tablePolygonsData);
  }, [setPolygonData, tablePolygonsData]);

  const { polygonRows: tablePolygonRows, columns } = useSitePolygonTableData({
    polygonsData: tablePolygonsData,
    polygonValidations,
    t
  });

  const {
    polygonsWithOverlapCount,
    overlapPolygons,
    overlapPolygonUuids,
    overlapPolygonsData,
    overlapValidationsByPolygonUuid,
    fetchOverlapValidations
  } = useSitePolygonOverlap({
    siteUuid: site.uuid,
    scopedPolygonUuids: mapPolygonUuids,
    preferredValidationsByPolygonUuid: polygonValidations,
    t
  });

  const selectionPolygonsData = useMemo(
    () => mergeSelectionPolygons(tablePolygonsData, overlapPolygonsData),
    [tablePolygonsData, overlapPolygonsData]
  );

  const selectionTableRows = useMemo(
    () => mergeSelectionTableRows(tablePolygonRows, overlapPolygonsData, t),
    [tablePolygonRows, overlapPolygonsData, t]
  );

  const { selectedRowIds, setSelectedRowIds, handleRowSelected, onAllItemsSelected } =
    useTableSelection<PolygonTableRow>(true, tablePolygonRows);
  const selectedRows = useMemo(
    () => selectionTableRows.filter(row => selectedRowIds.has(row.id)),
    [selectionTableRows, selectedRowIds]
  );
  const isTablePolygonsLoading = !tablePolygonsLoaded;

  const {
    selectedPolygonUuids,
    editDrawerPolygonUuid,
    selectedTreesPlanted,
    selectedRestorationAreaRounded,
    selectedSitePolygons,
    selectedSitePolygonUuids,
    selectedGeometryPolygonUuids,
    selectedSubmittablePolygons,
    selectedSubmittablePolygonUuids
  } = useSelectedSitePolygons({
    polygonsData: selectionPolygonsData,
    selectedRowIds,
    selectedRows,
    isEditPolygonOpen,
    editPolygonUuid: editPolygon.uuid !== "" ? editPolygon.uuid : null
  });

  const { disturbanceMarkerPoints } = useSitePolygonDisturbanceMarkers({
    siteUuid: site.uuid,
    disturbancePolygonUuids,
    excludePolygonUuid: editDrawerPolygonUuid,
    t
  });

  // Overlaps were selection-gated while disturbances always rendered — keep both always visible.
  const mapAlertPolygons = useMemo(
    () => mergeMapAlertPolygons(overlapPolygons, disturbanceMarkerPoints, editDrawerPolygonUuid),
    [overlapPolygons, disturbanceMarkerPoints, editDrawerPolygonUuid]
  );

  const editDrawerPolygonValidation = useMemo(
    () => (editDrawerPolygonUuid != null ? overlapValidationsByPolygonUuid.get(editDrawerPolygonUuid) : undefined),
    [overlapValidationsByPolygonUuid, editDrawerPolygonUuid]
  );
  const { crossSiteOverlapPolygons } = useCrossSiteOverlapGeometries({
    polygonUuid: editDrawerPolygonUuid,
    validation: editDrawerPolygonValidation,
    currentSiteGeometryUuids: mapPolygonUuids,
    enabled: isEditPolygonOpen && editDrawerPolygonUuid != null
  });

  const selectedOverlapFixSummary = useMemo(
    () => getSelectedOverlapFixSummary(selectedRows, overlapValidationsByPolygonUuid, selectionPolygonsData),
    [selectedRows, overlapValidationsByPolygonUuid, selectionPolygonsData]
  );
  const hasSelectedOverlapFailure = hasOverlapFailureInSelection(selectedOverlapFixSummary);
  const hasFixableSelectedOverlap =
    canAutoFixOverlapSelection(selectedOverlapFixSummary) && pendingValidationPolygonUuids.length === 0;

  const closeOverlapFixModal = useCallback(() => {
    setOverlapFixModal(false);
  }, []);

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

  const {
    setUploadedPolygonUuidToOpen,
    focusPolygonUuid,
    handleFocusPolygonConsumed,
    openPolygonEditDrawerByPolygonId,
    handleViewOverlapFixPolygon,
    handleViewExistingPolygon
  } = useSitePolygonEditNavigation({
    siteUuid: site.uuid,
    isAdminReview,
    isTablePolygonsLoading,
    mapIndexLoaded,
    mapPolygons,
    findTableSitePolygon,
    hasOverlapFilter: polygonFilters.hasOverlap,
    setPolygonFilters,
    onCloseOverlapFixModal: closeOverlapFixModal,
    existingPolygonDuplicate
  });

  useEffect(() => {
    setSiteData(site);
  }, [setSiteData, site]);

  useEffect(() => {
    return () => {
      resetSiteMapInteractionState();
    };
  }, [resetSiteMapInteractionState]);

  useEffect(() => {
    if (!mapIndexLoaded) return;
    const mapPolygonUuidSet = new Set(mapPolygonUuids);
    setSelectedRowIds(prev => {
      const next = new Set(Array.from(prev).filter(id => mapPolygonUuidSet.has(String(id))));
      return next.size === prev.size ? prev : next;
    });
  }, [mapIndexLoaded, mapPolygonUuids, setSelectedRowIds]);

  const clearTableSelection = useCallback(() => {
    setSelectedRowIds(new Set<string>());
  }, [setSelectedRowIds]);

  const clearBulkTableSelection = useCallback(() => {
    clearTableSelection();
    closeMapPopups();
    setPolygonTableHoveredUuid(null);
  }, [clearTableSelection, closeMapPopups]);

  const handleSelectOverlapPolygons = useCallback(() => {
    setSelectedRowIds(new Set(overlapPolygonUuids));
  }, [overlapPolygonUuids, setSelectedRowIds]);

  const handleSelectDisturbancePolygons = useCallback(() => {
    setSelectedRowIds(new Set(disturbancePolygonUuids));
  }, [disturbancePolygonUuids, setSelectedRowIds]);

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
  } = useSitePolygonBulkActions({
    siteUuid: site.uuid,
    siteName: site.name,
    polygonsData: selectionPolygonsData,
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
    fetchAllValidationPages: fetchPageValidations,
    fetchOverlapValidations,
    onOverlapFixResultsOpen: openOverlapFixResultsModal,
    onValidationJobsStarted: handleValidationJobsStarted,
    onValidationPendingClear: clearValidationPending,
    onValidationUiCleared: handleValidationUiCleared
  });

  useSitePolygonValidationPoll({
    siteUuid: site.uuid,
    pendingValidationPolygonUuids,
    setPendingValidationPolygonUuids,
    setSupplementalValidations,
    setValidationZoomPolygonUuids,
    priorValidationStatusRef,
    pendingValidationTrackBulkRef,
    validationRunStartedAtRef,
    validationAfterCriteriaClearRef,
    pendingValidationKeyRef,
    validationPollingGenerationRef,
    clearValidationPending,
    refetchPolygons,
    fetchPageValidations,
    fetchOverlapValidations,
    isEditPolygonOpen,
    showValidationResultsModalIfPending,
    cancelPendingValidationResultsModal,
    t
  });

  useEffect(() => {
    registerSitePolygonAdminReviewMode(isAdminReview);
    registerRunPolygonValidationFromMapPopup(runValidationWithResultsModal);
    registerOpenPolygonEditDrawerByPolygonIdFromMapPopup(openPolygonEditDrawerByPolygonId);
    return () => {
      registerSitePolygonAdminReviewMode(false);
      unregisterRunPolygonValidationFromMapPopup();
      unregisterOpenPolygonEditDrawerByPolygonIdFromMapPopup();
    };
  }, [isAdminReview, openPolygonEditDrawerByPolygonId, runValidationWithResultsModal]);

  const handleViewValidationDetails = useCallback(
    (row: PolygonTableRow) => {
      handleSystemValidationCompleteModalChange(false);
      openPolygonEditDrawerForRow(row);
    },
    [handleSystemValidationCompleteModalChange, openPolygonEditDrawerForRow]
  );

  const isValidationInProgress = isValidatingPolygons || pendingValidationPolygonUuids.length > 0;
  const isMapPolygonsLoading =
    !mapIndexLoaded || isValidationInProgress || isFixingOverlaps || isDeletingPolygons || isSubmittingPolygons;
  const isTableSectionLoading =
    isTablePolygonsLoading || isValidationInProgress || isFixingOverlaps || isDeletingPolygons || isSubmittingPolygons;
  const freezeCameraZoom =
    isMapPolygonsLoading || pendingValidationPolygonUuids.length > 0 || validationZoomPolygonUuids.length > 0;
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

  const handleDownloadAll = useCallback(() => {
    void downloadAll();
  }, [downloadAll]);

  const handleOpenUploadModal = useCallback(() => {
    setShowUploadModal(true);
  }, []);

  const handleUploadSuccess = useCallback<ComponentProps<typeof SitePolygonModals>["onUploadSuccess"]>(
    ({ createdSitePolygonUuid, uploadedFileCount }) => {
      if (createdSitePolygonUuid != null && uploadedFileCount === 1) {
        setUploadedPolygonUuidToOpen(createdSitePolygonUuid);
      }
      void refetchPolygons();
    },
    [refetchPolygons, setUploadedPolygonUuidToOpen]
  );

  const handleDuplicateDetected = useCallback(
    (duplicate: DuplicatePolygonUploadInfo) => {
      onDuplicateDetected(duplicate);
      void refetchPolygons();
    },
    [onDuplicateDetected, refetchPolygons]
  );

  const handleRetryLoadPolygons = useCallback(() => {
    void refetchPolygons();
  }, [refetchPolygons]);

  const handleEditPhotoDetailsClose = useCallback(() => {
    setEditPhotoDetailsMediaUuid(null);
  }, [setEditPhotoDetailsMediaUuid]);

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

  const {
    showApprovePolygonConfirmationModal,
    approvePayload,
    showRequestInformationModal,
    requestInformationPayload,
    handleOpenApprovePolygonModal,
    handleOpenRequestInformationModal,
    handleApprovePolygonConfirmationModalChange,
    handleRequestInformationModalChange,
    handleApprovePolygons,
    handleConfirmRequestInformation,
    handleDrawerRequestApproveModal,
    handleDrawerRequestInformationModal
  } = useSitePolygonReviewActions({
    siteUuid: site.uuid,
    editPolygonUuid: editPolygon.uuid,
    selectedRows,
    findTableSitePolygon,
    approvePolygons,
    requestInformationForPolygons,
    clearBulkTableSelection,
    polygonApproveConfirmation,
    setPolygonApproveConfirmation,
    polygonRequestInformationConfirmation,
    setPolygonRequestInformationConfirmation,
    t
  });

  const hasPolygonSelection = selectedRows.length > 0;
  const shouldShowNoResults = !isTablePolygonsLoading && polygonLoadError == null && tableTotalItems === 0;
  const isDeletedAuditView = polygonFilters.showDeleted;

  const mapPopupSubmitPolygons = useMemo(() => {
    const sitePolygonUuid = polygonSubmitConfirmation;
    if (sitePolygonUuid == null || sitePolygonUuid === "") {
      return [];
    }

    const sitePolygon = findTableSitePolygon(sitePolygonUuid);
    return sitePolygon != null ? [mapSitePolygonToTableRow(sitePolygon, t)] : [];
  }, [findTableSitePolygon, polygonSubmitConfirmation, t]);

  useSyncPolygonTableSelectionStore(selectedRowIds);

  const polygonsTableStyles = usePolygonTableStickyStyles({
    scrollContainerRef: tableScrollContainerRef,
    isLoading: isTablePolygonsLoading,
    isEmpty: shouldShowNoResults,
    rowCount: tablePolygonRows.length
  });
  const bulkToolbarSubmitLabel = useMemo(() => {
    if (hasSelectedOverlapFailure) return t("Fix Overlap");
    return isAdminReview ? t("Approve") : t("Submit");
  }, [hasSelectedOverlapFailure, isAdminReview, t]);
  const isBulkSubmitDisabled =
    !hasSelectedOverlapFailure &&
    (isAdminReview || (hasPolygonSelection && selectedSubmittablePolygonUuids.length === 0));

  const loadingLabel = getPolygonTableLoadingLabel({
    t,
    isFixingOverlaps,
    fixingOverlapsCount,
    isSubmittingPolygons,
    submittingPolygonCount,
    isValidatingPolygons: isValidationInProgress,
    validatingPolygonCount: isValidatingPolygons ? validatingPolygonCount : pendingValidationPolygonUuids.length,
    isDeletingPolygons,
    deletingPolygonCount
  });

  return (
    <>
      {!isAdminReview ? <PolygonSubmissionAnnouncement /> : null}
      <PolygonEditDrawerDataSync
        polygons={tablePolygonsData}
        onRefetchPolygons={refetchPolygons}
        onOverlapFixed={handleDrawerOverlapFixed}
        onRunValidation={runPolygonValidation}
        onRunValidationWithResultsModal={runValidationWithResultsModal}
        onValidationCleared={clearValidationUi}
        onPolygonDeletingChange={handlePolygonDeletingChange}
        onPolygonSubmittingChange={handlePolygonSubmittingChange}
        onRequestApproveModal={isAdminReview ? handleDrawerRequestApproveModal : undefined}
        onRequestInformationModal={isAdminReview ? handleDrawerRequestInformationModal : undefined}
      />
      <PageContent className="bg-theme-neutral-100">
        <SitePolygonsHeader
          isAdmin={isAdmin}
          isDeletedAuditView={isDeletedAuditView}
          isDownloadingAll={isDownloadingAllPolygons}
          isDownloadAllDisabled={site.uuid === ""}
          onDownloadAll={handleDownloadAll}
          onDrawPolygon={startNewPolygonFlow}
          onUpload={handleOpenUploadModal}
        >
          <PolygonToolbar
            siteUuid={site.uuid}
            resultCount={tableTotalItems}
            polygonSearch={polygonSearch}
            polygonFilters={polygonFilters}
            activeFilterLabels={activeFilterLabels}
            isAdminReview={isAdminReview}
            onSearchChange={setPolygonSearch}
            onApplyFilters={setPolygonFilters}
            onClearFilters={handleClearPolygonFilters}
          />
        </SitePolygonsHeader>
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
          siteHasExistingPolygons={mapPolygonTotal > 0}
          bulkEditPayload={bulkEditPayload}
          deletePayload={deletePayload}
          submitPayload={submitPayload}
          overlapFixResults={overlapFixResults}
          editPhotoDetailsMediaUuid={editPhotoDetailsMediaUuid}
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
          onEditPhotoDetailsClose={handleEditPhotoDetailsClose}
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
          onUploadSuccess={handleUploadSuccess}
          onDuplicateDetected={handleDuplicateDetected}
          openExistingPolygonModal={showExistingPolygonModal}
          existingPolygonSiteName={existingPolygonDuplicate?.siteName ?? ""}
          onExistingPolygonModalOpenChange={onExistingPolygonModalOpenChange}
          onViewExistingPolygon={handleViewExistingPolygon}
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
          polygons={mapPolygons}
          isEditPolygonOpen={isEditPolygonOpen}
          isSitePolygonsLoading={isMapPolygonsLoading}
          freezeCameraZoom={freezeCameraZoom}
          skipNextSiteBboxZoomNonce={skipNextSiteBboxZoomNonce}
          polygonTableHighlight={polygonTableHighlight}
          overlapPolygons={mapAlertPolygons}
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
            onActionClick={handleRetryLoadPolygons}
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
                polygonsWithDisturbanceCount={disturbancePolygonUuids.length}
                onSelectOverlapPolygons={handleSelectOverlapPolygons}
                onSelectDisturbancePolygons={handleSelectDisturbancePolygons}
              />
            )}
            <SitePolygonTableSection
              tableContainerRef={tableContainerRef}
              tableScrollContainerRef={tableScrollContainerRef}
              tableStyles={polygonsTableStyles}
              isSitePolygonsLoading={isTableSectionLoading}
              polygonRows={tablePolygonRows}
              columns={columns}
              selectedRows={selectedRows}
              loadingLabel={loadingLabel}
              onAllItemsSelected={onAllItemsSelected}
              onClearHover={handleClearHover}
              onRowSelected={handleRowSelected}
              readOnly={isDeletedAuditView}
              totalItems={tableTotalItems}
              currentPage={tablePageNumber}
              pageSize={tablePageSize}
              onPageChange={setTablePageNumber}
              onPageSizeChange={handleTablePageSizeChange}
              onSortChange={handleTableSortChange}
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
