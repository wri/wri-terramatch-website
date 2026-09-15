import { Box, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import {
  pruneSitePolygonsCache,
  useSitePolygonMapIndex,
  useSitePolygons,
  useSitePolygonSummary
} from "@/connections/SitePolygons";
import { usePolygonValidations } from "@/connections/Validation";
import { AnrMapOverlayProvider } from "@/context/anrMapOverlay.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import {
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
import { setPolygonTableHoveredUuid, useSyncPolygonTableSelectionStore } from "@/context/polygonTableInteraction.store";
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { SITE_POLYGON_TAB_HEADER_ID } from "@/pages/site/[uuid]/constants/sitePolygonMapSizing";
import { HIDDEN_STICKY_COLUMN_EDGE_STYLES } from "@/redesignComponents/dataDisplay/Table/tableStyles";
import type { SortColumn } from "@/redesignComponents/dataDisplay/Table/tableUtils";
import { useTableSelection } from "@/redesignComponents/dataDisplay/Table/useTableSelection";
import { DownloadIcon, PlusIcon, UploadIcon } from "@/redesignComponents/foundations/Icons";
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
import {
  DEFAULT_POLYGON_TABLE_PAGE_SIZE,
  POLYGON_TABLE_SORT_FIELD_BY_COLUMN
} from "../components/polygonTableSort.constants";
import PolygonToolbar from "../components/PolygonToolbar";
import SitePolygonMapSection from "../components/SitePolygonMapSection";
import SitePolygonMetricsSection from "../components/SitePolygonMetricsSection";
import SitePolygonModals from "../components/SitePolygonModals";
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
import { usePolygonUploadErrorModal } from "../hooks/usePolygonUploadErrorModal";
import { useSelectedSitePolygons } from "../hooks/useSelectedSitePolygons";
import { useSitePolygonBulkActions } from "../hooks/useSitePolygonBulkActions";
import { useSitePolygonEditNavigation } from "../hooks/useSitePolygonEditNavigation";
import { useSitePolygonFilters } from "../hooks/useSitePolygonFilters";
import { useSitePolygonOverlap } from "../hooks/useSitePolygonOverlap";
import { useSitePolygonReviewActions } from "../hooks/useSitePolygonReviewActions";
import { useSitePolygonTableData } from "../hooks/useSitePolygonTableData";
import { useSitePolygonValidationPoll, useSitePolygonValidationState } from "../hooks/useSitePolygonValidationPolling";
import { useStartSitePolygonDrawing } from "../hooks/useStartSitePolygonDrawing";
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
    setPolygonData,
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
  const [isStickyActive, setIsStickyActive] = useState(false);

  const {
    polygonSearch,
    polygonFilters,
    sitePolygonFilter,
    activeFilterLabels,
    setPolygonSearch,
    setPolygonFilters,
    handleClearPolygonFilters
  } = useSitePolygonFilters({ siteUuid: site.uuid, t });

  const [tablePageNumber, setTablePageNumber] = useState(1);
  const [tablePageSize, setTablePageSize] = useState(DEFAULT_POLYGON_TABLE_PAGE_SIZE);
  const [tableSortField, setTableSortField] = useState<string | undefined>(undefined);
  const [tableSortDirection, setTableSortDirection] = useState<"ASC" | "DESC" | undefined>(undefined);

  useEffect(() => {
    setTablePageNumber(1);
  }, [sitePolygonFilter]);

  const [
    tablePolygonsLoaded,
    { data: tablePolygonsPageData, indexTotal: tableIndexTotal, loadFailure: polygonLoadError }
  ] = useSitePolygons({
    entityName: "sites",
    entityUuid: site.uuid,
    enabled: site.uuid != null && site.uuid !== "",
    filter: sitePolygonFilter,
    pageNumber: tablePageNumber,
    pageSize: tablePageSize,
    sortField: tableSortField,
    sortDirection: tableSortDirection
  });

  const [mapIndexLoaded, { data: mapIndex }] = useSitePolygonMapIndex({
    entityName: "sites",
    entityUuid: site.uuid,
    enabled: site.uuid != null && site.uuid !== "",
    filter: sitePolygonFilter
  });
  const [, { data: summaryData }] = useSitePolygonSummary({
    entityName: "sites",
    entityUuid: site.uuid,
    enabled: site.uuid != null && site.uuid !== "",
    filter: sitePolygonFilter
  });
  const mapPolygons = useMemo(() => mapIndex?.polygons ?? [], [mapIndex?.polygons]);

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
  const totalTreesPlanted = summaryData?.sumNumTrees ?? 0;
  const totalRestorationAreaHa = Math.round((summaryData?.sumCalcArea ?? 0) * 100) / 100;

  const scopedPolygonUuids = useMemo(
    () => mapPolygons.map(entry => entry.polygonUuid ?? entry.uuid).filter((uuid): uuid is string => uuid != null),
    [mapPolygons]
  );

  const {
    polygonsWithOverlapCount,
    overlapPolygons,
    overlapPolygonUuids,
    overlapPolygonsData,
    overlapValidationsByPolygonUuid,
    fetchOverlapValidations
  } = useSitePolygonOverlap({
    siteUuid: site.uuid,
    scopedPolygonUuids,
    preferredValidationsByPolygonUuid: polygonValidations,
    t
  });

  const selectionPolygonsData = useMemo(() => {
    if (overlapPolygonsData.length === 0) {
      return tablePolygonsData;
    }
    const byId = new Map<string, SitePolygonLightDto>();
    for (const polygon of tablePolygonsData) {
      byId.set(polygon.polygonUuid ?? polygon.uuid, polygon);
    }
    for (const polygon of overlapPolygonsData) {
      const id = polygon.polygonUuid ?? polygon.uuid;
      if (!byId.has(id)) {
        byId.set(id, polygon);
      }
    }
    return Array.from(byId.values());
  }, [tablePolygonsData, overlapPolygonsData]);

  const selectionTableRows = useMemo(() => {
    if (overlapPolygonsData.length === 0) {
      return tablePolygonRows;
    }
    const rowsById = new Map<string, PolygonTableRow>();
    for (const row of tablePolygonRows) {
      rowsById.set(String(row.id), row);
    }
    for (const polygon of overlapPolygonsData) {
      const id = polygon.polygonUuid ?? polygon.uuid;
      if (id == null || id === "" || rowsById.has(id)) {
        continue;
      }
      rowsById.set(id, mapSitePolygonToTableRow(polygon, t));
    }
    return Array.from(rowsById.values());
  }, [tablePolygonRows, overlapPolygonsData, t]);

  const { selectedRowIds, setSelectedRowIds, handleRowSelected, onAllItemsSelected } =
    useTableSelection<PolygonTableRow>(true, tablePolygonRows);
  const selectedRows = useMemo(
    () => selectionTableRows.filter(row => selectedRowIds.has(row.id)),
    [selectionTableRows, selectedRowIds]
  );
  const tableSelectedRows = selectedRows;
  const tableTotalItems = tableIndexTotal ?? 0;
  const isTablePolygonsLoading = !tablePolygonsLoaded;

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
    polygonsData: selectionPolygonsData,
    selectedRowIds,
    selectedRows,
    overlapPolygons,
    isEditPolygonOpen,
    editPolygonUuid: editPolygon.uuid !== "" ? editPolygon.uuid : null
  });

  const currentSiteGeometryUuids = useMemo(
    () =>
      mapPolygons
        .map(polygon => polygon.polygonUuid ?? polygon.uuid)
        .filter((uuid): uuid is string => uuid != null && uuid !== ""),
    [mapPolygons]
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
    () => getSelectedOverlapFixSummary(selectedRows, overlapValidationsByPolygonUuid, selectionPolygonsData),
    [selectedRows, overlapValidationsByPolygonUuid, selectionPolygonsData]
  );
  const hasSelectedOverlapFailure = hasOverlapFailureInSelection(selectedOverlapFixSummary);
  const hasFixableSelectedOverlap =
    canAutoFixOverlapSelection(selectedOverlapFixSummary) && pendingValidationPolygonUuids.length === 0;

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
    onCloseOverlapFixModal: () => setOverlapFixModal(false),
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
    const scopedPolygonUuidSet = new Set(scopedPolygonUuids);
    setSelectedRowIds(prev => {
      const next = new Set(Array.from(prev).filter(id => scopedPolygonUuidSet.has(String(id))));
      return next.size === prev.size ? prev : next;
    });
  }, [mapIndexLoaded, scopedPolygonUuids, setSelectedRowIds]);

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
    site,
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
    return () => {
      registerSitePolygonAdminReviewMode(false);
      unregisterRunPolygonValidationFromMapPopup();
    };
  }, [isAdminReview, runValidationWithResultsModal]);

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
  }, [isTablePolygonsLoading, shouldShowNoResults, tablePolygonRows.length]);

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

  const handleTablePageChange = useCallback((page: number) => {
    setTablePageNumber(page);
  }, []);

  const handleTablePageSizeChange = useCallback((nextPageSize: number) => {
    setTablePageSize(nextPageSize);
    setTablePageNumber(1);
  }, []);

  const handleTableSortChange = useCallback((sortColumn: SortColumn) => {
    const apiField = POLYGON_TABLE_SORT_FIELD_BY_COLUMN[sortColumn.key];
    if (apiField == null || sortColumn.order === "") {
      setTableSortField(undefined);
      setTableSortDirection(undefined);
      setTablePageNumber(1);
      return;
    }
    setTableSortField(apiField);
    setTableSortDirection(sortColumn.order === "desc" ? "DESC" : "ASC");
    setTablePageNumber(1);
  }, []);

  return (
    <>
      {!isAdminReview ? <PolygonSubmissionAnnouncement /> : null}
      <PolygonEditDrawerDataSync
        polygons={tablePolygonsData}
        onRefetchPolygons={refetchPolygons}
        onOverlapFixed={handleDrawerOverlapFixed}
        onRunValidation={runPolygonValidation}
        onRunValidationWithResultsModal={runValidationWithResultsModal}
        onPolygonDeletingChange={handlePolygonDeletingChange}
        onPolygonSubmittingChange={handlePolygonSubmittingChange}
        onRequestApproveModal={isAdminReview ? handleDrawerRequestApproveModal : undefined}
        onRequestInformationModal={isAdminReview ? handleDrawerRequestInformationModal : undefined}
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
            resultCount={tableTotalItems}
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
          siteHasExistingPolygons={(mapIndex?.total ?? 0) > 0}
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
          onDuplicateDetected={duplicate => {
            onDuplicateDetected(duplicate);
            void refetchPolygons();
          }}
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
              isSitePolygonsLoading={isTableSectionLoading}
              polygonRows={tablePolygonRows}
              columns={columns}
              selectedRows={tableSelectedRows}
              loadingLabel={loadingLabel}
              onAllItemsSelected={onAllItemsSelected}
              onClearHover={handleClearHover}
              onRowSelected={handleRowSelected}
              readOnly={isDeletedAuditView}
              totalItems={tableTotalItems}
              currentPage={tablePageNumber}
              pageSize={tablePageSize}
              onPageChange={handleTablePageChange}
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
