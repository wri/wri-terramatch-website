import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { isEmpty, isEqual } from "lodash";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { useProjectMapIndex } from "@/connections/ProjectMapIndex";
import { useSitePolygons } from "@/connections/SitePolygons";
import { useMyUser } from "@/connections/User";
import { AnrMapOverlayProvider } from "@/context/anrMapOverlay.provider";
import FrameworkProvider from "@/context/framework.provider";
import { MapAreaProvider, useMapAreaContext } from "@/context/mapArea.provider";
import { PolygonEditDrawerProvider } from "@/context/polygonEditDrawer.provider";
import { setPolygonTableHoveredUuid, useSyncPolygonTableSelectionStore } from "@/context/polygonTableInteraction.store";
import type { ProjectMapEntryDto, SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import PageHeader from "@/redesignComponents/content/headers/PageHeaders/PageHeader";
import Table from "@/redesignComponents/dataDisplay/Table/Table";
import { useTableSelection } from "@/redesignComponents/dataDisplay/Table/useTableSelection";
import { PolygonsIcon } from "@/redesignComponents/foundations/Icons";
import Layout from "@/redesignComponents/Layout/Layout";
import ToolbarObject from "@/redesignComponents/navigation/Toolbar/ToolbarObject";
import ResponsiveTypography from "@/styles/ResponsiveTypography";

import MapEditPhotoDetails from "../site/[uuid]/components/Modals/GeotaggedPhotos/MapEditPhotoDetails";
import { buildPolygonTableColumns } from "../site/[uuid]/components/polygonTableColumns";
import type { PolygonTableRow } from "../site/[uuid]/components/PolygonTableRow";
import SitePolygonIssuesPanel from "../site/[uuid]/components/SitePolygonIssuesPanel";
import SitePolygonTableSection from "../site/[uuid]/components/SitePolygonTableSection";
import { usePolygonTablePaging } from "../site/[uuid]/hooks/usePolygonTablePaging";
import { useSitePolygonFilters } from "../site/[uuid]/hooks/useSitePolygonFilters";
import PolygonReviewBulkActions from "./components/PolygonReviewBulkActions";
import PolygonReviewEmptyState from "./components/PolygonReviewEmptyState";
import PolygonReviewMap from "./components/PolygonReviewMap";
import PolygonReviewMetrics from "./components/PolygonReviewMetrics";
import PolygonReviewTableActions from "./components/PolygonReviewTableActions";
import PolygonReviewToolbar from "./components/PolygonReviewToolbar";
import ProjectContextPicker from "./components/ProjectContextPicker";
import { useInitialPolygonReviewState } from "./hooks/useInitialPolygonReviewState";
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
  const clearPolygonFilters = useCallback(() => {
    handleClearPolygonFilters();
    setSearchResetKey(current => current + 1);
  }, [handleClearPolygonFilters]);
  const siteUuids = useMemo(() => polygonFilters.sites.map(({ value }) => value), [polygonFilters.sites]);
  const hasLevel2Filters = !isEmpty(sitePolygonFilter) || siteUuids.length > 0;

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

  // A selection only makes sense within the polygons currently in scope.
  useEffect(() => {
    setSelectedRowIds(new Set());
  }, [selectedProjectUuid, sitePolygonFilter, siteUuids, setSelectedRowIds]);

  const metrics = useProjectPolygonMetrics({
    projectUuid: selectedProjectUuid,
    siteUuids,
    polygonFilter: sitePolygonFilter,
    hasLevel2Filters,
    selectedPolygonUuids
  });
  const { overlapPolygonUuids, disturbancePolygonUuids } = useProjectPolygonIssues({
    projectUuid: selectedProjectUuid,
    siteUuids,
    polygonFilter: sitePolygonFilter
  });
  const selectOverlapPolygons = useCallback(
    () => setSelectedRowIds(new Set(overlapPolygonUuids)),
    [overlapPolygonUuids, setSelectedRowIds]
  );
  const selectDisturbancePolygons = useCallback(
    () => setSelectedRowIds(new Set(disturbancePolygonUuids)),
    [disturbancePolygonUuids, setSelectedRowIds]
  );
  const tableContainerRef = useRef<HTMLDivElement>(null);

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
    setPolygonFilters(initialState.polygonFilters);
  }, [hasAppliedInitialState, initialState, projects, setPolygonFilters, setSelectedProject]);

  useEffect(() => {
    if (initialState == null || !hasAppliedInitialState) return;

    const initialSiteUuids = initialState.polygonFilters.sites.map(({ value }) => value);
    if (selectedProjectUuid !== initialState.projectUuid || !isEqual(siteUuids, initialSiteUuids)) {
      clearInitialStateQuery();
    }
  }, [clearInitialStateQuery, hasAppliedInitialState, initialState, selectedProjectUuid, siteUuids]);

  const openPicker = useCallback(() => setIsPickerOpen(true), []);

  const selectProject = useCallback(
    (uuid: string) => {
      setSelectedProject(projects.find(project => project.uuid === uuid) ?? null);
      setIsPickerOpen(false);
      clearPolygonFilters();
    },
    [clearPolygonFilters, projects, setSelectedProject]
  );

  const clearProjectContext = useCallback(() => {
    setFilters(EMPTY_PROJECT_CONTEXT_FILTERS);
    setSelectedProject(null);
    clearPolygonFilters();
  }, [clearPolygonFilters, setSelectedProject]);

  const { setPolygonData, resetSiteMapInteractionState, editPhotoDetailsMediaUuid, setEditPhotoDetailsMediaUuid } =
    useMapAreaContext();
  const closeEditPhotoDetails = useCallback(() => setEditPhotoDetailsMediaUuid(null), [setEditPhotoDetailsMediaUuid]);
  useEffect(() => {
    setPolygonData(pagePolygons);
  }, [pagePolygons, setPolygonData]);
  useEffect(() => resetSiteMapInteractionState, [resetSiteMapInteractionState]);

  const polygonBulkActions = useProjectPolygonBulkActions({
    projectUuid: selectedProjectUuid,
    projectName: selectedProject?.name ?? null,
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
            onViewProjectPolygons={selectProject}
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
              <PolygonReviewTableActions />
              {selectedProject == null ? (
                <Flex
                  direction="column"
                  overflow="hidden"
                  borderWidth="0.125rem"
                  borderColor="neutral.300"
                  borderRadius="0.25rem"
                  bg="neutral.100"
                >
                  <Table data={[]} columns={columns} selectable showPagination={false} />
                  <PolygonReviewEmptyState onSelectProject={openPicker} />
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
                  onAllItemsSelected={onAllItemsSelected}
                  onClearHover={clearTableHover}
                  onRowSelected={handleRowSelected}
                  totalItems={indexTotal ?? 0}
                  currentPage={pageNumber}
                  pageSize={pageSize}
                  onPageChange={setPageNumber}
                  onPageSizeChange={handlePageSizeChange}
                  onSortChange={handleSortChange}
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
