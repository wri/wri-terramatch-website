import { Box, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { resolvePolygonTableRowId } from "@/components/elements/Map-mapbox/sitePolygonPopupUtils";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import { pruneBoundingBoxesCache } from "@/connections/BoundingBox";
import { useAllSitePolygons } from "@/connections/SitePolygons";
import { fetchPolygonValidation, useAllProjectValidations } from "@/connections/Validation";
import { useMapAreaContext } from "@/context/mapArea.provider";
import {
  openPolygonPopupFromMapArea,
  registerPolygonGeometryEditable,
  registerPolygonReviewOnly,
  registerRunPolygonValidationFromMapPopup,
  registerSitePolygonAdminReviewMode,
  unregisterRunPolygonValidationFromMapPopup
} from "@/context/mapArea.utils";
import { EMPTY_POLYGONS, PolygonEditDrawerDataSync, usePolygonEditDrawer } from "@/context/polygonEditDrawer.provider";
import {
  consumePendingPolygonFocusUuid,
  setPolygonTableHoveredUuid,
  useSyncPolygonTableSelectionStore
} from "@/context/polygonTableInteraction.store";
import { ProjectFullDto, SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { listDelayedJobs } from "@/generated/v3/jobService/jobServiceComponents";
import { ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { isValidationPollingResolved } from "@/helpers/polygonValidation";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { type OverlapFixPolygon } from "@/pages/site/[uuid]/components/Modals/OverlapFix";
import {
  buildPolygonValidationsMap,
  withResolvedValidationStatusFromCriteria
} from "@/pages/site/[uuid]/components/Modals/validationCriteria";
import PolygonBulkActionToolbar from "@/pages/site/[uuid]/components/PolygonBulkActionToolbar";
import type { PolygonValidationJobsStartedOptions } from "@/pages/site/[uuid]/components/polygonEdit.types";
import { prunePolygonValidationCache } from "@/pages/site/[uuid]/components/polygonEditSave";
import type { PolygonFilterState } from "@/pages/site/[uuid]/components/polygonFilter.constants";
import { PolygonTableRow } from "@/pages/site/[uuid]/components/PolygonTableRow";
import { mapSitePolygonToTableRow } from "@/pages/site/[uuid]/components/polygonTableRow.utils";
import PolygonToolbar from "@/pages/site/[uuid]/components/PolygonToolbar";
import SitePolygonMapSection from "@/pages/site/[uuid]/components/SitePolygonMapSection";
import SitePolygonMetricsSection from "@/pages/site/[uuid]/components/SitePolygonMetricsSection";
import SitePolygonModals from "@/pages/site/[uuid]/components/SitePolygonModals";
import SitePolygonTableSection from "@/pages/site/[uuid]/components/SitePolygonTableSection";
import { SITE_POLYGON_TAB_HEADER_ID } from "@/pages/site/[uuid]/constants/sitePolygonMapSizing";
import {
  canAutoFixOverlapSelection,
  getSelectedOverlapFixSummary,
  hasOverlapFailureInSelection,
  hasOverlapValidationFailure
} from "@/pages/site/[uuid]/hooks/overlapFix.utils";
import { useCrossSiteOverlapGeometries } from "@/pages/site/[uuid]/hooks/useCrossSiteOverlapGeometries";
import { useSelectedSitePolygons } from "@/pages/site/[uuid]/hooks/useSelectedSitePolygons";
import { useSitePolygonBulkActions } from "@/pages/site/[uuid]/hooks/useSitePolygonBulkActions";
import { useSitePolygonFilters } from "@/pages/site/[uuid]/hooks/useSitePolygonFilters";
import { useSitePolygonOverlap } from "@/pages/site/[uuid]/hooks/useSitePolygonOverlap";
import { useSitePolygonTableData } from "@/pages/site/[uuid]/hooks/useSitePolygonTableData";
import { showPolygonErrorToast } from "@/pages/site/[uuid]/utils/polygonOperationToasts";
import { HIDDEN_STICKY_COLUMN_EDGE_STYLES } from "@/redesignComponents/dataDisplay/Table/tableStyles";
import { useTableSelection } from "@/redesignComponents/dataDisplay/Table/useTableSelection";
import { DownloadIcon } from "@/redesignComponents/foundations/Icons";
import InlineMessage from "@/redesignComponents/status/InlineMessage/InlineMessage";
import { OVERLAPPING_CRITERIA_ID } from "@/types/validation";
import Log from "@/utils/log";
import { trackBulkActionCompleted, trackPolygonValidationResults } from "@/utils/polygonAnalytics";
import { isSitePolygonApprovable, toReviewAvailabilityPolygon } from "@/utils/sitePolygonReview";

import PolygonAnomalyStepper from "./PolygonAnomalyStepper";
import { buildProjectOverlapPairs } from "./projectOverlapPairs";
import ProjectPolygonSummaryTiles from "./ProjectPolygonSummaryTiles";
import { useDownloadProjectPolygons } from "./useDownloadProjectPolygons";
import { useProjectAnomalies } from "./useProjectAnomalies";
import { useProjectPolygonStatusCounts } from "./useProjectPolygonStatusCounts";

/**
 * ProjectFlatPolygonsView — the "flat" mode of project polygon review: today's full polygon list +
 * map, unchanged, for projects under PROJECT_SITE_ROLLUP_THRESHOLD active polygons (see
 * projectPolygonViewMode.ts). ProjectPolygonsWorkspace only mounts this once the site rollup has
 * confirmed the project is small enough to load in full — every fetch below is unconditional.
 *
 * Where the site workspace lists one site's polygons, this lists every polygon rolled up across all
 * of a project's sites (`useAllSitePolygons({ entityName: "projects" })`), adds a Site column/facet
 * so reviewers can tell polygons apart, and surfaces cross-site overlaps (a project-only anomaly
 * invisible from any single site's page). It reuses the site sub-components/hooks by handing them a
 * lightweight "virtual site" built from the project (they only need a `{ uuid, name }`); per-polygon
 * editing keys off each polygon's own `siteId`, so attribute edits work correctly across sites.
 *
 * Scope (product decision): view + validate + approve / request-information + bulk edit details +
 * individual polygon editing (geometry reshape + the per-polygon Edit tab). Bulk Delete is disabled,
 * and there are no Add / Draw / Upload entry points — a new polygon has no unambiguous home at
 * project scope; it belongs to a specific site. Reshaping existing polygons is supported; creating
 * new ones is not.
 *
 * variant is currently always "adminReview" (see `AdminProjectPolygonReviewShell`); the prop is kept
 * for a later champion (non-admin) project variant.
 */
export interface ProjectFlatPolygonsViewProps {
  project: ProjectFullDto;
  variant?: "adminReview";
}

const ProjectFlatPolygonsView: FC<ProjectFlatPolygonsViewProps> = ({ project, variant = "adminReview" }) => {
  const t = useT();
  const isAdmin = useIsAdmin();
  const isAdminReview = variant === "adminReview";
  const { isOpen: isEditPolygonOpen, suppressMapSelectionHighlight } = usePolygonEditDrawer();
  const {
    editPolygon,
    setSiteData,
    resetSiteMapInteractionState,
    closeMapPopups,
    polygonApproveConfirmation,
    setPolygonApproveConfirmation,
    polygonRequestInformationConfirmation,
    setPolygonRequestInformationConfirmation
  } = useMapAreaContext();

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const tableScrollContainerRef = useRef<HTMLDivElement>(null);
  const [focusPolygonUuid, setFocusPolygonUuid] = useState<string | null>(null);
  const [isStickyActive, setIsStickyActive] = useState(false);
  const { isDownloading: isDownloadingAll, download: handleDownloadAll } = useDownloadProjectPolygons(project);
  const [showApprovePolygonConfirmationModal, setShowApprovePolygonConfirmationModal] = useState(false);
  const [approvePayload, setApprovePayload] = useState<{ polygons: PolygonTableRow[] } | null>(null);
  const [showRequestInformationModal, setShowRequestInformationModal] = useState(false);
  const [requestInformationPayload, setRequestInformationPayload] = useState<{ polygons: PolygonTableRow[] } | null>(
    null
  );

  // F4: validation-run polling state, copied (not extracted) from SitePolygonsWorkspace to avoid any
  // regression risk to the live site page — see the plan's F4 note. Kept behaviourally identical.
  const [pendingValidationPolygonUuids, setPendingValidationPolygonUuids] = useState<string[]>([]);
  const [validationZoomPolygonUuids, setValidationZoomPolygonUuids] = useState<string[]>([]);
  const [skipNextSiteBboxZoomNonce, setSkipNextSiteBboxZoomNonce] = useState(0);
  // Overlap auto-fix: results modal + deferred "view polygon" navigation (mirrors SitePolygonsWorkspace).
  const [showOverlapFixModal, setOverlapFixModal] = useState(false);
  const [overlapFixResults, setOverlapFixResults] = useState<{
    polygonsFixed: OverlapFixPolygon[];
    polygonsNotFixed: OverlapFixPolygon[];
  }>({ polygonsFixed: [], polygonsNotFixed: [] });
  const pendingOverlapFixPolygonIdRef = useRef<string | null>(null);
  const [supplementalValidations, setSupplementalValidations] = useState<ValidationDto[]>([]);
  const priorValidationStatusRef = useRef<Map<string, string | null | undefined>>(new Map());
  const pendingValidationTrackBulkRef = useRef(true);
  const validationRunStartedAtRef = useRef(0);
  const validationAfterCriteriaClearRef = useRef(false);
  const pendingValidationKeyRef = useRef("");
  const validationPollingGenerationRef = useRef(0);

  // Lightweight stand-in so the site-scoped hooks/components have a `{ uuid, name }` to read.
  const virtualSite = useMemo(
    () =>
      ({
        uuid: project.uuid,
        name: project.name ?? "",
        projectUuid: project.uuid,
        hectaresToRestoreGoal: project.totalHectaresRestoredGoal,
        frameworkKey: project.frameworkKey
      } as unknown as SiteFullDto),
    [project.uuid, project.name, project.totalHectaresRestoredGoal, project.frameworkKey]
  );

  const {
    polygonSearch,
    polygonFilters,
    sitePolygonFilter,
    activeFilterLabels,
    setPolygonSearch,
    setPolygonFilters,
    handleClearPolygonFilters
  } = useSitePolygonFilters({ siteUuid: project.uuid, t, searchSiteName: true, entityType: "project" });

  // Cheap server-side counts (no rows loaded) for the summary tiles. Mode resolution (flat vs.
  // rollup) is decided upstream by useProjectSiteRollup before this view ever mounts, so there is no
  // load gate here any more — flat mode always loads every row.
  const {
    counts: statusCounts,
    isLoading: isLoadingCounts,
    refetch: refetchStatusCounts
  } = useProjectPolygonStatusCounts(project.uuid);

  const applyValidationStatuses = useCallback(
    (statuses: PolygonFilterState["validationStatus"]) => {
      setPolygonFilters(prev => ({ ...prev, validationStatus: statuses }));
    },
    [setPolygonFilters]
  );

  const {
    data: polygonsQueryData,
    isLoading: isLoadingPolygons,
    error: polygonLoadError,
    progress: polygonLoadProgress,
    total: polygonLoadTotal,
    refetch: refetchPolygons
  } = useAllSitePolygons({
    entityName: "projects",
    entityUuid: project.uuid,
    enabled: project.uuid != null && project.uuid !== "",
    filter: sitePolygonFilter
  });

  const polygonsQueryDataOrEmpty = polygonsQueryData ?? EMPTY_POLYGONS;

  // F6: Site facet options are derived from the full (unfiltered) loaded set so choices don't
  // disappear once a site filter is applied.
  const siteOptions = useMemo(() => {
    const bySiteId = new Map<string, string>();
    for (const polygon of polygonsQueryDataOrEmpty) {
      if (polygon.siteId != null && polygon.siteId !== "" && !bySiteId.has(polygon.siteId)) {
        bySiteId.set(polygon.siteId, polygon.siteName ?? polygon.siteId);
      }
    }
    return Array.from(bySiteId, ([uuid, name]) => ({ uuid, name })).sort((a, b) => a.name.localeCompare(b.name));
  }, [polygonsQueryDataOrEmpty]);

  const { allValidations, fetchAllValidationPages } = useAllProjectValidations(project.uuid);
  const polygonValidations = useMemo(
    () => buildPolygonValidationsMap([...allValidations, ...supplementalValidations]),
    [allValidations, supplementalValidations]
  );

  // F6: site facet filtering is client-side against the already-loaded page (the backend index
  // forbids combining siteId[] with projectId[]). Scopes the table, map, totals, overlaps and
  // anomalies uniformly, the same way the other filters do.
  const polygonsData = useMemo(() => {
    const resolved = withResolvedValidationStatusFromCriteria(polygonsQueryDataOrEmpty, polygonValidations);
    if (polygonFilters.siteId.length === 0) {
      return resolved;
    }
    const siteIdSet = new Set(polygonFilters.siteId);
    return resolved.filter(polygon => polygon.siteId != null && siteIdSet.has(polygon.siteId));
  }, [polygonsQueryDataOrEmpty, polygonValidations, polygonFilters.siteId]);

  const { polygonRows, columns, totalTreesPlanted, totalRestorationAreaHa } = useSitePolygonTableData({
    polygonsData,
    polygonValidations,
    t,
    showSiteColumn: true
  });

  const { allValidations: allOverlapValidations, fetchAllValidationPages: fetchAllOverlapValidationPages } =
    useAllProjectValidations(project.uuid, OVERLAPPING_CRITERIA_ID);
  // `useSitePolygonOverlap` depends on `overlapValidationsSource` by reference inside its own
  // effect (to trigger the initial/refresh fetch) — memoize so that reference is stable across
  // renders and only changes when the underlying validations or fetcher actually change, otherwise
  // every render of this workspace would re-trigger the overlap fetch.
  const projectOverlapValidations = useMemo(
    () => ({ allValidations: allOverlapValidations, fetchAllValidationPages: fetchAllOverlapValidationPages }),
    [allOverlapValidations, fetchAllOverlapValidationPages]
  );
  const {
    polygonsWithOverlapCount,
    overlapPolygons,
    overlapValidations,
    overlapValidationsByPolygonUuid,
    fetchOverlapValidations
  } = useSitePolygonOverlap({
    overlapValidationsSource: projectOverlapValidations,
    polygonsData,
    preferredValidationsByPolygonUuid: polygonValidations,
    t,
    crossSiteTooltip: t("This polygon overlaps with a polygon on another site (not in the current filter).")
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

  // F7: deduped cross-site/same-site overlap pairs and the ordered anomaly-stepper list.
  const overlapPairs = useMemo(
    () => buildProjectOverlapPairs(overlapValidationsByPolygonUuid, polygonsData),
    [overlapValidationsByPolygonUuid, polygonsData]
  );
  const crossSiteOverlapCount = useMemo(() => overlapPairs.filter(pair => pair.crossSite).length, [overlapPairs]);
  const anomalyUuids = useProjectAnomalies({ overlapPairs, polygonsData });

  useSyncPolygonTableSelectionStore(selectedRowIds);

  // Overlap auto-fix is enabled at project scope. The clip mutation is polygon-uuid keyed and the
  // post-fix reload is project-scoped (entityScope below), so it is cross-site safe. Feed the real
  // project overlap-validations map so the bulk-actions hook can identify fixable selections.
  const selectedOverlapFixSummary = useMemo(
    () => getSelectedOverlapFixSummary(selectedRows, overlapValidationsByPolygonUuid, polygonsData),
    [selectedRows, overlapValidationsByPolygonUuid, polygonsData]
  );
  const hasSelectedOverlapFailure = hasOverlapFailureInSelection(selectedOverlapFixSummary);
  const hasFixableSelectedOverlap =
    canAutoFixOverlapSelection(selectedOverlapFixSummary) && pendingValidationPolygonUuids.length === 0;

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

  const handleSelectCrossSiteOverlapPolygons = useCallback(() => {
    // Only select polygons that have a loaded row — a cross-site partner filtered out of the current
    // page has no row to act on, and adding its uuid would leave a dangling selection the reviewer
    // can't see (mirrors handleSelectOverlapPolygons' visible-row guard).
    const visiblePolygonIds = new Set(
      polygonsData
        .map(polygon => polygon.polygonUuid ?? polygon.uuid)
        .filter((id): id is string => id != null && id !== "")
    );
    const crossSiteUuids = new Set<string>();
    for (const pair of overlapPairs) {
      if (!pair.crossSite) continue;
      if (visiblePolygonIds.has(pair.aUuid)) crossSiteUuids.add(pair.aUuid);
      if (visiblePolygonIds.has(pair.bUuid)) crossSiteUuids.add(pair.bUuid);
    }
    setSelectedRowIds(crossSiteUuids);
  }, [overlapPairs, polygonsData, setSelectedRowIds]);

  const clearValidationPending = useCallback(() => {
    validationPollingGenerationRef.current += 1;
    setPendingValidationPolygonUuids([]);
    setValidationZoomPolygonUuids([]);
    validationRunStartedAtRef.current = 0;
    validationAfterCriteriaClearRef.current = false;
    pendingValidationKeyRef.current = "";
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
    (polygonUuids: string[], options?: PolygonValidationJobsStartedOptions) => {
      const priorStatuses = new Map<string, string | null | undefined>();
      polygonUuids.forEach(polygonUuid => {
        const sitePolygon = polygonsData.find(item => item.polygonUuid === polygonUuid);
        priorStatuses.set(polygonUuid, sitePolygon?.validationStatus);
      });
      priorValidationStatusRef.current = priorStatuses;
      pendingValidationTrackBulkRef.current = options?.trackBulkCompletion ?? true;
      validationAfterCriteriaClearRef.current = options?.validationAfterCriteriaClear === true;
      validationRunStartedAtRef.current = Date.now();

      const key = [...polygonUuids].sort().join(",");
      prunePolygonValidationCache(...polygonUuids);
      pendingValidationKeyRef.current = key;
      setSupplementalValidations(prev =>
        prev.filter(validation => validation.polygonUuid == null || !polygonUuids.includes(validation.polygonUuid))
      );
      setPendingValidationPolygonUuids(polygonUuids);
      void listDelayedJobs.fetch({});
    },
    [polygonsData]
  );

  const handleOverlapFixModalClose = useCallback(() => {
    setOverlapFixModal(false);
    setOverlapFixResults({ polygonsFixed: [], polygonsNotFixed: [] });
  }, []);

  const openOverlapFixResultsModal = useCallback(
    (results: { polygonsFixed: OverlapFixPolygon[]; polygonsNotFixed: OverlapFixPolygon[] }) => {
      if (results.polygonsFixed.length === 0 && results.polygonsNotFixed.length === 0) return;
      setOverlapFixResults(results);
      setOverlapFixModal(true);
      // Refresh the summary tiles so Failed/Approvable counts reflect the fix (mirrors the validation-
      // run path). The whole-project polygon reload is handled inside the bulk-actions hook.
      void refetchStatusCounts();
    },
    [refetchStatusCounts]
  );

  const {
    bulkEditPayload,
    deletePayload,
    showBulkEditDrawer,
    showDeletePolygonModal,
    showPolygonApprovedModal,
    approvedPolygonNames,
    approvedPolygonComment,
    showInformationRequestedModal,
    requestedInformationPolygonNames,
    requestedInformationComment,
    isBulkUpdatingPolygons,
    isDeletingPolygons,
    isDownloadingSelectedPolygons,
    isValidatingPolygons,
    isFixingOverlaps,
    approvePolygons,
    requestInformationForPolygons,
    handleBulkDelete,
    handleBulkDownloadClick,
    handleBulkEditDetails,
    handleBulkEditDrawerOpenChange,
    handleBulkEditSave,
    handleOpenSubmitPolygonsModal,
    handleDrawerOverlapFixed,
    handleDeletePolygonModalChange,
    handleInformationRequestedModalChange,
    handleOpenDeletePolygonModal,
    handlePolygonApprovedModalChange,
    handlePolygonDeletingChange,
    handleSystemValidationCompleteModalChange,
    isSystemValidationCompleteModalOpen,
    openPolygonEditDrawerForRow,
    runPolygonValidation,
    runValidationWithResultsModal,
    showValidationResultsModalIfPending,
    cancelPendingValidationResultsModal,
    validatedPolygons
  } = useSitePolygonBulkActions({
    site: virtualSite,
    entityScope: { entityName: "projects", entityUuid: project.uuid },
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
    onValidationPendingClear: clearValidationPending,
    onValidationUiCleared: handleValidationUiCleared
  });

  const openOverlapFixPolygonByUuid = useCallback(
    (polygonUuid: string) => {
      const row = polygonRows.find(item => item.id === polygonUuid);
      if (row != null) openPolygonEditDrawerForRow(row);
    },
    [openPolygonEditDrawerForRow, polygonRows]
  );

  const handleViewOverlapFixPolygon = useCallback(
    (polygonUuid: string) => {
      setOverlapFixModal(false);
      // If the Overlaps filter is on, a just-fixed polygon may no longer match it — clear the filter
      // and defer opening until the reload brings its row back (mirrors SitePolygonsWorkspace).
      if (polygonFilters.hasOverlap) {
        pendingOverlapFixPolygonIdRef.current = polygonUuid;
        setPolygonFilters(prev => ({ ...prev, hasOverlap: false }));
        return;
      }
      openOverlapFixPolygonByUuid(polygonUuid);
    },
    [openOverlapFixPolygonByUuid, polygonFilters.hasOverlap, setPolygonFilters]
  );

  useEffect(() => {
    const pendingId = pendingOverlapFixPolygonIdRef.current;
    if (pendingId == null || polygonFilters.hasOverlap || isLoadingPolygons) return;
    const row = polygonRows.find(item => item.id === pendingId);
    if (row == null) return;
    pendingOverlapFixPolygonIdRef.current = null;
    openPolygonEditDrawerForRow(row);
  }, [polygonFilters.hasOverlap, isLoadingPolygons, polygonRows, openPolygonEditDrawerForRow]);

  const pendingValidationResultsModalWhileDrawerOpenRef = useRef(false);

  const openValidationResultsModalIfPending = useCallback(() => {
    if (isEditPolygonOpen) {
      pendingValidationResultsModalWhileDrawerOpenRef.current = true;
      return;
    }
    showValidationResultsModalIfPending();
  }, [isEditPolygonOpen, showValidationResultsModalIfPending]);

  useEffect(() => {
    if (isEditPolygonOpen || !pendingValidationResultsModalWhileDrawerOpenRef.current) {
      return;
    }
    pendingValidationResultsModalWhileDrawerOpenRef.current = false;
    showValidationResultsModalIfPending();
  }, [isEditPolygonOpen, showValidationResultsModalIfPending]);

  useEffect(() => {
    // Flat mode is only ever mounted for a project confirmed small (< PROJECT_SITE_ROLLUP_THRESHOLD
    // active polygons) by the rollup, so validations load unconditionally — no request-storm risk.
    if (project.uuid == null || project.uuid === "") {
      return;
    }
    void fetchAllValidationPages();
  }, [project.uuid, fetchAllValidationPages]);

  useEffect(() => {
    setSiteData(virtualSite);
  }, [setSiteData, virtualSite]);

  useEffect(() => {
    return () => {
      resetSiteMapInteractionState();
    };
  }, [resetSiteMapInteractionState]);

  // Individual polygon editing (geometry reshape + the per-polygon Edit tab: attributes, plant start,
  // versions, plots, photos) is ENABLED at project scope, matching the site drawer. Cross-site editing
  // is correct because geometry save resolves each polygon's own siteId, not the workspace's virtual
  // site (see PolygonEditContent's resolvedSiteUuid). Registered explicitly on mount so the enabled
  // state holds regardless of prior global state, and restored to the (editable) defaults on unmount.
  // See docs/plans/project-polygons-geometry-editing-plan.md. NOTE: post-save refresh currently
  // reloads the whole project — that performance work is tracked/handled separately.
  useEffect(() => {
    registerPolygonGeometryEditable(true);
    registerPolygonReviewOnly(false);
    return () => {
      registerPolygonGeometryEditable(true);
      registerPolygonReviewOnly(false);
    };
  }, []);

  useEffect(() => {
    if (isLoadingPolygons) return;
    const visibleRowIds = new Set(polygonRows.map(row => row.id));
    setSelectedRowIds(prev => {
      const next = new Set(Array.from(prev).filter(id => visibleRowIds.has(String(id))));
      return next.size === prev.size ? prev : next;
    });
  }, [polygonRows, setSelectedRowIds, isLoadingPolygons]);

  // Deep-link / cross-page focus: a pending polygon uuid scrolls the tab into view and highlights it.
  useEffect(() => {
    if (isLoadingPolygons) return;
    const pendingFocusUuid = consumePendingPolygonFocusUuid();
    if (pendingFocusUuid == null || pendingFocusUuid === "") return;

    const rowId = resolvePolygonTableRowId(polygonsData, pendingFocusUuid);
    if (rowId == null) return;

    setPolygonTableHoveredUuid(rowId);
    setFocusPolygonUuid(pendingFocusUuid);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0 });
    });
  }, [isLoadingPolygons, polygonsData]);

  const handleFocusPolygonConsumed = useCallback(() => {
    const focusedUuid = focusPolygonUuid;
    setFocusPolygonUuid(null);
    if (focusedUuid != null && focusedUuid !== "") {
      openPolygonPopupFromMapArea(focusedUuid);
    }
  }, [focusPolygonUuid]);

  // F7: stepping through anomalies zooms/opens the popup (via focusPolygonUuid, same deep-link path
  // as above) and highlights the corresponding table row.
  const handleStepToAnomalyPolygon = useCallback(
    (polygonUuid: string) => {
      const rowId = resolvePolygonTableRowId(polygonsData, polygonUuid);
      if (rowId != null) {
        setPolygonTableHoveredUuid(rowId);
      }
      setFocusPolygonUuid(polygonUuid);
    },
    [polygonsData]
  );

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

          prunePolygonValidationCache(...polygonUuids);
          void listDelayedJobs.fetch({});
          const individualValidations = await Promise.all(polygonUuids.map(uuid => fetchPolygonValidation(uuid)));

          if (cancelled || validationPollingGenerationRef.current !== pollingGeneration) {
            return;
          }

          const allResolved = individualValidations.every(validation =>
            isValidationPollingResolved(validation, {
              startedAtMs: validationRunStartedAtRef.current,
              validationAfterCriteriaClear: validationAfterCriteriaClearRef.current
            })
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
                siteUuid: project.uuid,
                polygonId: polygonUuid,
                validation,
                priorValidationStatus: priorValidationStatusRef.current.get(polygonUuid),
                entityType: "project"
              });
            });

            if (pendingValidationTrackBulkRef.current) {
              trackBulkActionCompleted({
                siteUuid: project.uuid,
                actionType: "run_validation",
                polygonCount: polygonUuids.length,
                entityType: "project"
              });
            }

            await refetchPolygons();
            await Promise.all([fetchAllValidationPages(true), fetchOverlapValidations(true)]);
            // Refresh the summary tiles too — validation results just changed, so the Failed /
            // Not-started / Approvable counts are stale until we re-fetch them.
            void refetchStatusCounts();
            pruneBoundingBoxesCache();
            setPendingValidationPolygonUuids([]);
            validationRunStartedAtRef.current = 0;
            validationAfterCriteriaClearRef.current = false;
            pendingValidationKeyRef.current = "";
            setValidationZoomPolygonUuids(polygonUuids);
            openValidationResultsModalIfPending();
            return;
          }

          await new Promise(resolve => window.setTimeout(resolve, 1500));
        }

        if (!cancelled && validationPollingGenerationRef.current === pollingGeneration) {
          cancelPendingValidationResultsModal();
          clearValidationPending();
          Log.error("Validation results are taking longer than expected for project polygons.");
          showPolygonErrorToast(t("Validation results are taking longer than expected. Please try again."));
        }
      } catch (error) {
        Log.error("Failed while polling project polygon validation results:", error);
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
    refetchStatusCounts,
    openValidationResultsModalIfPending,
    project.uuid,
    t
  ]);

  useEffect(() => {
    registerSitePolygonAdminReviewMode(isAdminReview);
    registerRunPolygonValidationFromMapPopup(runValidationWithResultsModal);
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
  const isSitePolygonsLoading = isLoadingPolygons || isValidationInProgress || isDeletingPolygons || isFixingOverlaps;
  const freezeCameraZoom =
    isSitePolygonsLoading || pendingValidationPolygonUuids.length > 0 || validationZoomPolygonUuids.length > 0;

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

  // Map-popup approve/request-info bridge (mirrors SitePolygonsWorkspace) so the Review actions in
  // the admin-review map popup open the same confirmation modals as the bulk toolbar.
  useEffect(() => {
    if (polygonApproveConfirmation == null) return;
    const polygon = polygonsData.find(p => p.uuid === polygonApproveConfirmation);
    setPolygonApproveConfirmation(null);
    if (polygon != null && isSitePolygonApprovable(polygon)) {
      setApprovePayload({ polygons: [mapSitePolygonToTableRow(polygon, t, { includeSiteName: true })] });
      setShowApprovePolygonConfirmationModal(true);
    }
  }, [polygonApproveConfirmation, polygonsData, setPolygonApproveConfirmation, t]);

  useEffect(() => {
    if (polygonRequestInformationConfirmation == null) return;
    const polygon = polygonsData.find(p => p.uuid === polygonRequestInformationConfirmation);
    setPolygonRequestInformationConfirmation(null);
    if (polygon != null) {
      setRequestInformationPayload({ polygons: [mapSitePolygonToTableRow(polygon, t, { includeSiteName: true })] });
      setShowRequestInformationModal(true);
    }
  }, [polygonRequestInformationConfirmation, polygonsData, setPolygonRequestInformationConfirmation, t]);

  const handleDrawerRequestApproveModal = useCallback(() => {
    const drawerPolygon = polygonsData.find(p => p.polygonUuid === editPolygon.uuid || p.uuid === editPolygon.uuid);
    if (drawerPolygon != null && isSitePolygonApprovable(drawerPolygon)) {
      setApprovePayload({ polygons: [mapSitePolygonToTableRow(drawerPolygon, t, { includeSiteName: true })] });
      setShowApprovePolygonConfirmationModal(true);
    }
  }, [editPolygon.uuid, polygonsData, t]);

  const handleDrawerRequestInformationModal = useCallback(() => {
    const drawerPolygon = polygonsData.find(p => p.polygonUuid === editPolygon.uuid || p.uuid === editPolygon.uuid);
    if (drawerPolygon != null) {
      setRequestInformationPayload({
        polygons: [mapSitePolygonToTableRow(drawerPolygon, t, { includeSiteName: true })]
      });
      setShowRequestInformationModal(true);
    }
  }, [editPolygon.uuid, polygonsData, t]);

  const hasPolygonSelection = selectedRows.length > 0;
  const shouldShowNoResults = !isSitePolygonsLoading && polygonRows.length === 0;
  const isDeletedAuditView = polygonFilters.showDeleted;

  const polygonsTableStyles = isStickyActive ? undefined : HIDDEN_STICKY_COLUMN_EDGE_STYLES;

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

  const loadingLabel =
    polygonLoadTotal > 0 && polygonLoadProgress < polygonLoadTotal
      ? t("Loading {progress} of {total} polygons...", { progress: polygonLoadProgress, total: polygonLoadTotal })
      : t("Loading polygons...");

  return (
    <>
      <PolygonEditDrawerDataSync
        polygons={polygonsData}
        onRefetchPolygons={refetchPolygons}
        onRunValidation={runPolygonValidation}
        onRunValidationWithResultsModal={runValidationWithResultsModal}
        onPolygonDeletingChange={handlePolygonDeletingChange}
        onRequestApproveModal={isAdminReview ? handleDrawerRequestApproveModal : undefined}
        onRequestInformationModal={isAdminReview ? handleDrawerRequestInformationModal : undefined}
        onValidationJobsStarted={handleValidationJobsStarted}
        onOverlapFixed={handleDrawerOverlapFixed}
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
            loading: isDownloadingAll,
            // "Download All" is a server-side full-project export (downloadProjectSitePolygonsGeoJson
            // by project uuid), so it must stay enabled even when no rows are loaded yet.
            disabled: isDownloadingAll || (!isLoadingCounts && statusCounts.total === 0),
            onClick: () => {
              void handleDownloadAll();
            }
          }}
        >
          <PolygonToolbar
            siteUuid={project.uuid}
            entityType="project"
            resultCount={polygonRows.length}
            polygonSearch={polygonSearch}
            polygonFilters={polygonFilters}
            activeFilterLabels={activeFilterLabels}
            isAdminReview={isAdminReview}
            siteOptions={siteOptions}
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
          // The toolbar's primary action becomes "Fix Overlap" (calling onSubmit) when the selection
          // has a fixable overlap failure; otherwise it stays the Review/Approve/Request-info split.
          submitLabel={hasSelectedOverlapFailure ? t("Fix Overlap") : t("Approve")}
          polygons={selectedRows}
          selectedGeometryPolygonUuids={selectedGeometryPolygonUuids}
          isDownloading={isDownloadingSelectedPolygons}
          isValidating={isValidatingPolygons}
          onCancel={clearBulkTableSelection}
          onClearSelection={clearBulkTableSelection}
          onDelete={handleOpenDeletePolygonModal}
          onDownload={handleBulkDownloadClick}
          onEdit={handleBulkEditDetails}
          onReview={() => {
            const [firstSelected] = selectedRows;
            if (firstSelected != null) openPolygonEditDrawerForRow(firstSelected);
          }}
          onRunValidation={runValidationWithResultsModal}
          onSubmit={handleOpenSubmitPolygonsModal}
          onOpenApproveModal={handleOpenApprovePolygonModal}
          onOpenRequestInformationModal={handleOpenRequestInformationModal}
          isOverlapFixAction={hasSelectedOverlapFailure}
          canAutoFixOverlap={hasFixableSelectedOverlap}
          isSubmitDisabled
          enableDelete={false}
          // Bulk attribute editing (e.g. restoration practice) is a core project-scope workflow per
          // product: admins bulk-edit attributes grouped by validation result. Individual geometry
          // editing is enabled separately via the mount effect (registerPolygonGeometryEditable(true)).
          enableEditDetails={true}
        />
        <SitePolygonModals
          siteUuid={project.uuid}
          isEditPolygonOpen={isEditPolygonOpen}
          isAdminReview={isAdminReview}
          siteHasExistingPolygons={polygonsData.length > 0}
          bulkEditPayload={bulkEditPayload}
          deletePayload={deletePayload}
          submitPayload={null}
          overlapFixResults={overlapFixResults}
          editPhotoDetailsMedia={null}
          openBulkEditDrawer={showBulkEditDrawer}
          openDeletePolygonModal={showDeletePolygonModal}
          openOverlapFixModal={showOverlapFixModal}
          openPolygonSubmittedModal={false}
          openSubmitPolygonsModal={false}
          openSubmitPolygonConfirmationModal={false}
          openUploadErrorModal={false}
          uploadErrorMessage={null}
          openUploadModal={false}
          openMapPopupSubmitConfirmationModal={false}
          mapPopupSubmitPolygons={[]}
          submittedPolygonNames={[]}
          submittedPolygonComment={null}
          isBulkUpdatingPolygons={isBulkUpdatingPolygons}
          onBulkEditDrawerOpenChange={handleBulkEditDrawerOpenChange}
          onBulkEditSave={handleBulkEditSave}
          onDelete={handleBulkDelete}
          onDeletePolygonModalOpenChange={handleDeletePolygonModalChange}
          onEditPhotoDetailsClose={() => undefined}
          onMapPopupSubmitConfirmationModalOpenChange={() => undefined}
          onMapPopupSubmit={() => undefined}
          onOverlapFixClose={handleOverlapFixModalClose}
          onPolygonSubmittedModalOpenChange={() => undefined}
          onProceedToBulkSubmitConfirmation={() => undefined}
          onSubmitPolygonConfirmationModalOpenChange={() => undefined}
          onSubmitPolygonsModalOpenChange={() => undefined}
          onSubmitPolygons={() => undefined}
          openSystemValidationCompleteModal={isSystemValidationCompleteModalOpen}
          validatedPolygons={validatedPolygons}
          polygonValidations={polygonValidations}
          pendingValidationPolygonIds={pendingValidationPolygonUuids}
          isAwaitingValidationResults={pendingValidationPolygonUuids.length > 0}
          onSystemValidationCompleteModalOpenChange={handleSystemValidationCompleteModalChange}
          onViewValidationDetails={handleViewValidationDetails}
          onUploadError={() => undefined}
          onUploadErrorModalOpenChange={() => undefined}
          onUploadModalOpenChange={() => undefined}
          onUploadSuccess={() => undefined}
          onDuplicateDetected={() => undefined}
          openExistingPolygonModal={false}
          existingPolygonSiteName=""
          onExistingPolygonModalOpenChange={() => undefined}
          onViewExistingPolygon={() => undefined}
          onViewOverlapPolygon={handleViewOverlapFixPolygon}
          openApprovePolygonConfirmationModal={showApprovePolygonConfirmationModal}
          onApprovePolygonConfirmationModalOpenChange={handleApprovePolygonConfirmationModalChange}
          approvePayload={approvePayload}
          projectUuid={project.uuid}
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
        <ProjectPolygonSummaryTiles
          counts={statusCounts}
          isLoading={isLoadingCounts}
          activeStatuses={polygonFilters.validationStatus}
          onApplyStatuses={applyValidationStatuses}
        />
        <SitePolygonMapSection
          isAdmin={isAdmin}
          site={virtualSite}
          entityType="projects"
          entityModel={project}
          polygons={polygonsData}
          isEditPolygonOpen={isEditPolygonOpen}
          isSitePolygonsLoading={isSitePolygonsLoading}
          freezeCameraZoom={freezeCameraZoom}
          skipNextSiteBboxZoomNonce={skipNextSiteBboxZoomNonce}
          // REVISIT (2026-09-09): restore the overview when the edit drawer closes. The whole-project
          // post-save reload keeps freezeCameraZoom true through close and swallows the natural
          // zoom-out, so the flat view opts in explicitly. Reconcile/remove if the surgical post-save
          // refresh (perf work) lands and the natural zoom-out fires again.
          zoomToBboxOnEditClose={true}
          polygonTableHighlight={polygonTableHighlight}
          overlapPolygons={overlapPolygonsForMap}
          crossSiteOverlapPolygons={crossSiteOverlapPolygons}
          onRefetchPolygons={refetchPolygons}
          showUndoButton={false}
          onUndoDraw={() => undefined}
          isDeletedAuditView={isDeletedAuditView}
          hideGeotaggedMedia
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
              {t("We couldn’t find any polygons matching your search. Try a different keyword.")}
            </Text>
          </Box>
        ) : (
          <>
            {!isDeletedAuditView && (
              <SitePolygonMetricsSection
                totalTreesPlanted={totalTreesPlanted}
                totalRestorationAreaHa={totalRestorationAreaHa}
                restorationAreaGoal={project.totalHectaresRestoredGoal}
                hasPolygonSelection={hasPolygonSelection}
                selectedTreesPlanted={selectedTreesPlanted}
                selectedRestorationAreaRounded={selectedRestorationAreaRounded}
                polygonsWithOverlapCount={polygonsWithOverlapCount}
                onSelectOverlapPolygons={handleSelectOverlapPolygons}
                crossSiteOverlapCount={crossSiteOverlapCount}
                onSelectCrossSiteOverlapPolygons={handleSelectCrossSiteOverlapPolygons}
                anomalyStepper={
                  <PolygonAnomalyStepper anomalyUuids={anomalyUuids} onStepToPolygon={handleStepToAnomalyPolygon} />
                }
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

export default ProjectFlatPolygonsView;
