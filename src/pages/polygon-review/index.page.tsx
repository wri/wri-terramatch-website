import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { isEmpty, isEqual } from "lodash";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { useFullSite } from "@/connections/Entity";
import { useProjectMapIndex } from "@/connections/ProjectMapIndex";
import { pruneSitePolygonsCache, useSitePolygons } from "@/connections/SitePolygons";
import { useMyUser } from "@/connections/User";
import { AnrMapOverlayProvider } from "@/context/anrMapOverlay.provider";
import FrameworkProvider from "@/context/framework.provider";
import { MapAreaProvider, useMapAreaContext } from "@/context/mapArea.provider";
import { PolygonEditDrawerProvider } from "@/context/polygonEditDrawer.provider";
import { openPolygonEditDrawerForSitePolygon } from "@/context/polygonEditDrawer.utils";
import { setPolygonTableHoveredUuid, useSyncPolygonTableSelectionStore } from "@/context/polygonTableInteraction.store";
import type { ProjectMapEntryDto, SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import PageHeader from "@/redesignComponents/content/headers/PageHeaders/PageHeader";
import Table from "@/redesignComponents/dataDisplay/Table/Table";
import { useTableSelection } from "@/redesignComponents/dataDisplay/Table/useTableSelection";
import { PolygonsIcon } from "@/redesignComponents/foundations/Icons";
import Layout from "@/redesignComponents/Layout/Layout";
import ToolbarObject from "@/redesignComponents/navigation/Toolbar/ToolbarObject";
import ResponsiveTypography from "@/styles/ResponsiveTypography";
import { ProjectSelectionMethod, trackPolygonProjectSelected } from "@/utils/polygonAnalytics";

import ExistingPolygon from "../site/[uuid]/components/Modals/ExistingPolygon";
import MapEditPhotoDetails from "../site/[uuid]/components/Modals/GeotaggedPhotos/MapEditPhotoDetails";
import UploadError from "../site/[uuid]/components/Modals/UploadError";
import UploadPolygons from "../site/[uuid]/components/Modals/UploadPolygons";
import { EMPTY_POLYGON_FILTERS } from "../site/[uuid]/components/polygonFilter.constants";
import PolygonNoResults from "../site/[uuid]/components/PolygonNoResults";
import { buildPolygonTableColumns } from "../site/[uuid]/components/polygonTableColumns";
import type { PolygonTableRow } from "../site/[uuid]/components/PolygonTableRow";
import SitePolygonIssuesPanel from "../site/[uuid]/components/SitePolygonIssuesPanel";
import SitePolygonTableSection from "../site/[uuid]/components/SitePolygonTableSection";
import { useExistingPolygonModal } from "../site/[uuid]/hooks/useExistingPolygonModal";
import { useOpenSitePolygonInDrawer } from "../site/[uuid]/hooks/useOpenSitePolygonInDrawer";
import { usePolygonTablePaging } from "../site/[uuid]/hooks/usePolygonTablePaging";
import { usePolygonUploadErrorModal } from "../site/[uuid]/hooks/usePolygonUploadErrorModal";
import { useSitePolygonFilters } from "../site/[uuid]/hooks/useSitePolygonFilters";
import { useStartSitePolygonDrawing } from "../site/[uuid]/hooks/useStartSitePolygonDrawing";
import type { UploadPolygonsSuccessResult } from "../site/[uuid]/hooks/useUploadPolygons";
import PolygonReviewBulkActions from "./components/PolygonReviewBulkActions";
import PolygonReviewEmptyState from "./components/PolygonReviewEmptyState";
import PolygonReviewMap from "./components/PolygonReviewMap";
import PolygonReviewMetrics from "./components/PolygonReviewMetrics";
import PolygonReviewSiteSync from "./components/PolygonReviewSiteSync";
import PolygonReviewTableActions from "./components/PolygonReviewTableActions";
import PolygonReviewToolbar from "./components/PolygonReviewToolbar";
import ProjectContextPicker from "./components/ProjectContextPicker";
import { useInitialPolygonReviewState } from "./hooks/useInitialPolygonReviewState";
import { usePolygonReviewAnalytics } from "./hooks/usePolygonReviewAnalytics";
import { useProjectPolygonBulkActions } from "./hooks/useProjectPolygonBulkActions";
import { useProjectPolygonIssues } from "./hooks/useProjectPolygonIssues";
import { useProjectPolygonMetrics } from "./hooks/useProjectPolygonMetrics";
import { useSelectedProjectPolygons } from "./hooks/useSelectedProjectPolygons";
import { toPolygonReviewTableRow } from "./utils/polygonReviewTableRow";
import { POLYGON_REVIEW_PATH } from "./utils/polygonReviewUrl";
import {
  EMPTY_PROJECT_CONTEXT_FILTERS,
  filterProjects,
  ProjectContextFilters,
  sortProjectsByName
} from "./utils/projectContextFilter";

const NO_POLYGONS: SitePolygonLightDto[] = [];

const clearTableHover = () => setPolygonTableHoveredUuid(null);

/**
 * Polygon Review index. No polygon data loads until a project is picked in the Level 1 project context filter;
 * clearing that filter returns the page to its initial (unscoped) state.
 */
type PolygonReviewIndexContentProps = {
  selectedProject: ProjectMapEntryDto | null;
  setSelectedProject: (project: ProjectMapEntryDto | null) => void;
};

const PolygonReviewIndexContent: FC<PolygonReviewIndexContentProps> = ({ selectedProject, setSelectedProject }) => {
  const t = useT();
  const router = useRouter();
  const [isUserLoaded, { isAdmin }] = useMyUser();
  const [, { data: mapIndex }] = useProjectMapIndex({ enabled: isAdmin });

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [filters, setFilters] = useState<ProjectContextFilters>(EMPTY_PROJECT_CONTEXT_FILTERS);
  const selectedProjectUuid = selectedProject?.uuid ?? null;

  const columns = useMemo(() => buildPolygonTableColumns(t, { showEntityColumns: true }), [t]);

  const {
    polygonFilters,
    sitePolygonFilter,
    activeFilterLabels,
    setPolygonSearch,
    setPolygonFilters,
    handleClearPolygonFilters
  } = useSitePolygonFilters({ t });
  const [searchResetKey, setSearchResetKey] = useState(0);
  const siteUuids = useMemo(() => polygonFilters.sites.map(({ value }) => value), [polygonFilters.sites]);
  const hasLevel2Filters = !isEmpty(sitePolygonFilter) || siteUuids.length > 0;
  const singleSiteUuid = siteUuids.length === 1 ? siteUuids[0] : undefined;
  const [, { data: singleSite }] = useFullSite({ id: singleSiteUuid ?? "", enabled: singleSiteUuid != null });
  const scopedSite = singleSiteUuid != null && singleSite?.uuid === singleSiteUuid ? singleSite : undefined;

  const { pageNumber, pageSize, sortField, sortDirection, setPageNumber, handlePageSizeChange, handleSortChange } =
    usePolygonTablePaging({ filter: sitePolygonFilter });
  const [polygonsLoaded, { data: polygons, indexTotal }] = useSitePolygons({
    entityName: "projects",
    entityUuid: selectedProjectUuid ?? undefined,
    siteUuids,
    filter: sitePolygonFilter,
    enabled: selectedProjectUuid != null,
    pageNumber,
    pageSize,
    sortField,
    sortDirection
  });
  const hasNoMatchingPolygons = polygonsLoaded && hasLevel2Filters && indexTotal === 0;
  const pagePolygons = polygons ?? NO_POLYGONS;
  const polygonRows = useMemo(
    () => pagePolygons.map(polygon => toPolygonReviewTableRow(polygon, t)),
    [pagePolygons, t]
  );

  const { selectedRowIds, setSelectedRowIds, handleRowSelected, onAllItemsSelected } =
    useTableSelection<PolygonTableRow>(true, polygonRows);
  const { selectionPolygons, selectedRows, isSelectionLoading } = useSelectedProjectPolygons({
    projectUuid: selectedProjectUuid,
    pagePolygons,
    selectedRowIds
  });
  useSyncPolygonTableSelectionStore(selectedRowIds);
  const selectedPolygonUuids = useMemo(() => Array.from(selectedRowIds, String), [selectedRowIds]);

  const { markNextFilterChange, markUserSelection, trackSortChange } = usePolygonReviewAnalytics({
    polygonFilters,
    search: sitePolygonFilter.search,
    isResultsLoaded: polygonsLoaded,
    resultCount: indexTotal ?? 0,
    selectedRows
  });
  const resetPolygonFilters = useCallback(
    (source: "cleared_all" | "silent") => {
      if (polygonFilters !== EMPTY_POLYGON_FILTERS) markNextFilterChange(source);
      handleClearPolygonFilters();
      setSearchResetKey(current => current + 1);
    },
    [handleClearPolygonFilters, markNextFilterChange, polygonFilters]
  );
  const clearPolygonFilters = useCallback(() => resetPolygonFilters("cleared_all"), [resetPolygonFilters]);
  const handleTrackedRowSelected = useCallback<typeof handleRowSelected>(
    (row, checked) => {
      markUserSelection();
      handleRowSelected(row, checked);
    },
    [handleRowSelected, markUserSelection]
  );
  const handleTrackedAllItemsSelected = useCallback<typeof onAllItemsSelected>(
    (checked, dataByPage) => {
      markUserSelection();
      onAllItemsSelected(checked, dataByPage);
    },
    [markUserSelection, onAllItemsSelected]
  );
  const handleTrackedSortChange = useCallback<typeof handleSortChange>(
    sortColumn => {
      trackSortChange(sortColumn);
      handleSortChange(sortColumn);
    },
    [handleSortChange, trackSortChange]
  );

  const pendingIssueSelectionRef = useRef<Set<string> | null>(null);
  // A selection only makes sense within the polygons currently in scope.
  useEffect(() => {
    setSelectedRowIds(pendingIssueSelectionRef.current ?? new Set());
    pendingIssueSelectionRef.current = null;
  }, [selectedProjectUuid, sitePolygonFilter, siteUuids, setSelectedRowIds]);

  const metrics = useProjectPolygonMetrics({
    projectUuid: selectedProjectUuid,
    siteUuids,
    polygonFilter: sitePolygonFilter,
    selectedPolygonUuids
  });
  const { overlapPolygonUuids, disturbancePolygonUuids } = useProjectPolygonIssues({
    projectUuid: selectedProjectUuid,
    siteUuids,
    polygonFilter: sitePolygonFilter,
    showDeleted: polygonFilters.showDeleted
  });
  const filterToIssuePolygons = useCallback(
    (issueFilter: "hasOverlap" | "hasDisturbance", polygonUuids: string[]) => {
      markUserSelection();
      if (polygonFilters[issueFilter]) {
        setSelectedRowIds(new Set(polygonUuids));
        return;
      }
      pendingIssueSelectionRef.current = new Set(polygonUuids);
      setPolygonFilters(current => ({ ...current, [issueFilter]: true }));
    },
    [markUserSelection, polygonFilters, setPolygonFilters, setSelectedRowIds]
  );
  const selectOverlapPolygons = useCallback(
    () => filterToIssuePolygons("hasOverlap", overlapPolygonUuids),
    [filterToIssuePolygons, overlapPolygonUuids]
  );
  const selectDisturbancePolygons = useCallback(
    () => filterToIssuePolygons("hasDisturbance", disturbancePolygonUuids),
    [filterToIssuePolygons, disturbancePolygonUuids]
  );
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const clearTableSelection = useCallback(() => setSelectedRowIds(new Set()), [setSelectedRowIds]);
  const startDrawing = useStartSitePolygonDrawing({ onClearTableSelection: clearTableSelection });
  const startNewPolygonFlow = useCallback(() => {
    openPolygonEditDrawerForSitePolygon();
    startDrawing();
  }, [startDrawing]);

  const findTablePolygon = useCallback(
    (polygonId: string) =>
      pagePolygons.find(polygon => polygon.polygonUuid === polygonId || polygon.uuid === polygonId),
    [pagePolygons]
  );
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const openUploadModal = useCallback(() => setIsUploadModalOpen(true), []);
  const {
    openUploadErrorModal: isUploadErrorModalOpen,
    uploadErrorMessage,
    onUploadError,
    onUploadErrorModalOpenChange
  } = usePolygonUploadErrorModal();
  const {
    openExistingPolygonModal: isExistingPolygonModalOpen,
    existingPolygonDuplicate,
    onDuplicateDetected,
    onExistingPolygonModalOpenChange
  } = useExistingPolygonModal();
  const handleDuplicateDetected = useCallback<typeof onDuplicateDetected>(
    duplicate => {
      onDuplicateDetected(duplicate);
      pruneSitePolygonsCache();
    },
    [onDuplicateDetected]
  );
  const { setUploadedPolygonUuidToOpen, handleViewExistingPolygon } = useOpenSitePolygonInDrawer({
    siteUuid: singleSiteUuid ?? "",
    isAdminReview: true,
    isTablePolygonsLoading: !polygonsLoaded,
    findTableSitePolygon: findTablePolygon,
    existingPolygonDuplicate
  });
  // Same behaviour as the site page: a single uploaded polygon opens in the edit drawer.
  const handleUploadSuccess = useCallback(
    ({ createdSitePolygonUuid, uploadedFileCount }: UploadPolygonsSuccessResult) => {
      pruneSitePolygonsCache();
      if (createdSitePolygonUuid != null && uploadedFileCount === 1) {
        setUploadedPolygonUuidToOpen(createdSitePolygonUuid);
      }
    },
    [setUploadedPolygonUuidToOpen]
  );

  const projects = useMemo(() => sortProjectsByName(mapIndex?.projects ?? []), [mapIndex]);
  const filteredProjects = useMemo(() => filterProjects(projects, filters), [filters, projects]);

  const { initialState, clearInitialStateQuery } = useInitialPolygonReviewState(isAdmin);
  // Not a ref: it must change in the same render as the scope, or the effect below clears the query params at once.
  const [hasAppliedInitialState, setHasAppliedInitialState] = useState(false);
  useEffect(() => {
    if (initialState == null || hasAppliedInitialState) return;
    const initialProject = projects.find(({ uuid }) => uuid === initialState.projectUuid);
    if (initialProject == null) return;

    setHasAppliedInitialState(true);
    setSelectedProject(initialProject);
    markNextFilterChange("silent");
    setPolygonFilters(initialState.polygonFilters);
  }, [hasAppliedInitialState, initialState, markNextFilterChange, projects, setPolygonFilters, setSelectedProject]);

  useEffect(() => {
    if (initialState == null || !hasAppliedInitialState) return;

    const initialSiteUuids = initialState.polygonFilters.sites.map(({ value }) => value);
    if (selectedProjectUuid !== initialState.projectUuid || !isEqual(siteUuids, initialSiteUuids)) {
      clearInitialStateQuery();
    }
  }, [clearInitialStateQuery, hasAppliedInitialState, initialState, selectedProjectUuid, siteUuids]);

  const openPicker = useCallback(() => setIsPickerOpen(true), []);

  const selectProject = useCallback(
    (uuid: string, method: ProjectSelectionMethod) => {
      setSelectedProject(projects.find(project => project.uuid === uuid) ?? null);
      setIsPickerOpen(false);
      resetPolygonFilters("silent");
      trackPolygonProjectSelected({
        projectUuid: uuid,
        selectionMethod: method,
        frameworkFacetUsed: filters.frameworkKey.length > 0,
        countryFacetUsed: filters.country.length > 0
      });
    },
    [filters.country.length, filters.frameworkKey.length, projects, resetPolygonFilters, setSelectedProject]
  );
  const selectProjectFromMap = useCallback((uuid: string) => selectProject(uuid, "map"), [selectProject]);

  const clearProjectContext = useCallback(() => {
    setFilters(EMPTY_PROJECT_CONTEXT_FILTERS);
    setSelectedProject(null);
    resetPolygonFilters("silent");
  }, [resetPolygonFilters, setSelectedProject]);

  const { setPolygonData, resetSiteMapInteractionState, editPhotoDetailsMediaUuid, setEditPhotoDetailsMediaUuid } =
    useMapAreaContext();
  const closeEditPhotoDetails = useCallback(() => setEditPhotoDetailsMediaUuid(null), [setEditPhotoDetailsMediaUuid]);
  useEffect(() => {
    setPolygonData(pagePolygons);
  }, [pagePolygons, setPolygonData]);
  useEffect(() => resetSiteMapInteractionState, [resetSiteMapInteractionState]);

  const polygonBulkActions = useProjectPolygonBulkActions({
    projectUuid: selectedProjectUuid,
    polygons: selectionPolygons,
    selectedRows,
    selectedRowIds,
    setSelectedRowIds
  });
  const { validationZoomPolygonUuids, handleValidationZoomConsumed } = polygonBulkActions;
  const polygonTableHighlight = useMemo(
    () => ({
      selectedPolygonUuids,
      validationZoomPolygonUuids,
      onValidationZoomConsumed: handleValidationZoomConsumed
    }),
    [handleValidationZoomConsumed, selectedPolygonUuids, validationZoomPolygonUuids]
  );

  const isAccessDenied = isUserLoaded && !isAdmin;
  useEffect(() => {
    if (isAccessDenied) {
      void router.replace("/");
    }
  }, [isAccessDenied, router]);

  if (!isUserLoaded || isAccessDenied) return null;

  return (
    <Layout>
      <ResponsiveTypography />
      <ToolbarObject
        className="sticky top-0 z-20 !px-6"
        breadcrumbs={{
          linkRouter: router,
          links: [{ icon: <PolygonsIcon />, label: t("Polygons"), link: POLYGON_REVIEW_PATH }]
        }}
      />
      <PageHeader
        title={t("Polygon Review")}
        className="!bg-theme-neutral-100 !pb-0 !pt-1 mobile:flex-col mobile:items-start mobile:gap-4"
        classNameActions="mobile:w-full"
        actions={
          <ProjectContextPicker
            open={isPickerOpen}
            projects={projects}
            filteredProjects={filteredProjects}
            filters={filters}
            selectedProject={selectedProject}
            onOpenChange={setIsPickerOpen}
            onFiltersChange={setFilters}
            onSelectProject={selectProject}
            onClear={clearProjectContext}
          />
        }
      />
      <PolygonReviewSiteSync siteUuid={singleSiteUuid} site={scopedSite} />
      <PageContent className="h-auto bg-theme-neutral-200">
        <Flex direction="column" gap={4}>
          <PolygonReviewToolbar
            projectUuid={selectedProject?.uuid}
            matchingPolygonCount={selectedProject != null ? indexTotal : undefined}
            projectPolygonCount={hasLevel2Filters ? metrics.project?.polygonCount : undefined}
            polygonFilters={polygonFilters}
            activeFilterLabels={activeFilterLabels}
            searchResetKey={searchResetKey}
            onSearchChange={setPolygonSearch}
            onApplyFilters={setPolygonFilters}
            onClearFilters={clearPolygonFilters}
          />
          <PolygonReviewMap
            projects={filteredProjects}
            selectedProject={selectedProject}
            siteUuids={siteUuids}
            polygonFilter={sitePolygonFilter}
            polygonTableHighlight={polygonTableHighlight}
            showDeleted={polygonFilters.showDeleted}
            overlapPolygonUuids={overlapPolygonUuids}
            disturbancePolygonUuids={disturbancePolygonUuids}
            onViewProjectPolygons={selectProjectFromMap}
            onRefetchPolygons={polygonBulkActions.refetchPolygons}
          />
          <Flex
            direction="column"
            gap={5}
            bg="neutral.100"
            borderRadius="0.25rem"
            paddingX={4}
            paddingTop={4}
            paddingBottom={7}
          >
            {selectedProject != null && (
              <Flex className="items-center justify-between gap-4 mobile:flex-col">
                <PolygonReviewMetrics
                  project={metrics.project}
                  filtered={metrics.filtered}
                  selected={metrics.selected}
                />
                <SitePolygonIssuesPanel
                  overlapCount={overlapPolygonUuids.length}
                  disturbanceCount={disturbancePolygonUuids.length}
                  onSelectOverlapPolygons={selectOverlapPolygons}
                  onSelectDisturbancePolygons={selectDisturbancePolygons}
                />
              </Flex>
            )}
            <Flex direction="column" gap={3}>
              <PolygonReviewTableActions
                projectUuid={selectedProject?.uuid}
                projectPolygonCount={metrics.project?.polygonCount}
                sitePolygonCount={metrics.sites?.polygonCount}
                sites={polygonFilters.sites}
                isSingleSiteSelected={scopedSite != null}
                isDeletedAuditView={polygonFilters.showDeleted}
                onDrawPolygon={startNewPolygonFlow}
                onUpload={openUploadModal}
              />
              {selectedProject == null || (hasNoMatchingPolygons && !polygonBulkActions.isTableLocked) ? (
                <Flex
                  direction="column"
                  overflow="hidden"
                  borderWidth="0.125rem"
                  borderColor="neutral.300"
                  borderRadius="0.25rem"
                  bg="neutral.100"
                >
                  <Table data={[]} columns={columns} selectable showPagination={false} />
                  {selectedProject == null ? (
                    <PolygonReviewEmptyState onSelectProject={openPicker} />
                  ) : (
                    <PolygonNoResults className="items-center text-center" />
                  )}
                </Flex>
              ) : (
                <SitePolygonTableSection
                  tableContainerRef={tableContainerRef}
                  isSitePolygonsLoading={!polygonsLoaded || polygonBulkActions.isTableLocked}
                  polygonRows={polygonRows}
                  columns={columns}
                  selectedRows={selectedRows}
                  loadingLabel={
                    polygonBulkActions.isTableLocked ? polygonBulkActions.tableLoadingLabel : t("Loading polygons...")
                  }
                  readOnly={polygonFilters.showDeleted}
                  onAllItemsSelected={handleTrackedAllItemsSelected}
                  onClearHover={clearTableHover}
                  onRowSelected={handleTrackedRowSelected}
                  totalItems={indexTotal ?? 0}
                  currentPage={pageNumber}
                  pageSize={pageSize}
                  onPageChange={setPageNumber}
                  onPageSizeChange={handlePageSizeChange}
                  onSortChange={handleTrackedSortChange}
                />
              )}
            </Flex>
          </Flex>
        </Flex>
        <PolygonReviewBulkActions
          actions={polygonBulkActions}
          projectUuid={selectedProject?.uuid ?? null}
          polygons={selectionPolygons}
          selectedRows={selectedRows}
          visible={selectedRowIds.size > 0 && !isSelectionLoading && !polygonFilters.showDeleted}
        />
        {editPhotoDetailsMediaUuid != null && (
          <MapEditPhotoDetails
            key={editPhotoDetailsMediaUuid}
            uuid={editPhotoDetailsMediaUuid}
            onClose={closeEditPhotoDetails}
          />
        )}
      </PageContent>
      {singleSiteUuid != null && (
        <UploadPolygons
          open={isUploadModalOpen}
          siteUuid={singleSiteUuid}
          siteHasExistingPolygons={(metrics.sites?.polygonCount ?? 0) > 0}
          onOpenChange={setIsUploadModalOpen}
          onUploadSuccess={handleUploadSuccess}
          onDuplicateDetected={handleDuplicateDetected}
          onUploadError={onUploadError}
        />
      )}
      <ExistingPolygon
        open={isExistingPolygonModalOpen}
        siteName={existingPolygonDuplicate?.siteName ?? ""}
        onOpenChange={onExistingPolygonModalOpenChange}
        onView={handleViewExistingPolygon}
      />
      <UploadError
        open={isUploadErrorModalOpen}
        backendErrorMessage={uploadErrorMessage}
        onOpenChange={onUploadErrorModalOpenChange}
      />
    </Layout>
  );
};

const PolygonReviewIndexPage: FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectMapEntryDto | null>(null);

  return (
    <MapAreaProvider>
      <FrameworkProvider frameworkKey={selectedProject?.frameworkKey}>
        <AnrMapOverlayProvider>
          <PolygonEditDrawerProvider>
            <PolygonReviewIndexContent selectedProject={selectedProject} setSelectedProject={setSelectedProject} />
          </PolygonEditDrawerProvider>
        </AnrMapOverlayProvider>
      </FrameworkProvider>
    </MapAreaProvider>
  );
};

export default PolygonReviewIndexPage;
