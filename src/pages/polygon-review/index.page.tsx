import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { isEmpty } from "lodash";
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
import type { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import PageHeader from "@/redesignComponents/content/headers/PageHeaders/PageHeader";
import Table from "@/redesignComponents/dataDisplay/Table/Table";
import { useTableSelection } from "@/redesignComponents/dataDisplay/Table/useTableSelection";
import { PolygonsIcon } from "@/redesignComponents/foundations/Icons";
import Layout from "@/redesignComponents/Layout/Layout";
import ToolbarObject from "@/redesignComponents/navigation/Toolbar/ToolbarObject";

import { buildPolygonTableColumns } from "../site/[uuid]/components/polygonTableColumns";
import type { PolygonTableRow } from "../site/[uuid]/components/PolygonTableRow";
import { mapSitePolygonToTableRow } from "../site/[uuid]/components/polygonTableRow.utils";
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
import { useProjectPolygonBulkActions } from "./hooks/useProjectPolygonBulkActions";
import { useProjectPolygonIssues } from "./hooks/useProjectPolygonIssues";
import { useProjectPolygonMetrics } from "./hooks/useProjectPolygonMetrics";
import {
  EMPTY_PROJECT_CONTEXT_FILTERS,
  filterProjects,
  ProjectContextFilters,
  sortProjectsByName
} from "./utils/projectContextFilter";

const NO_POLYGONS: SitePolygonLightDto[] = [];

const clearTableHover = () => setPolygonTableHoveredUuid(null);

const toTableRow = (polygon: SitePolygonLightDto, t: (key: string) => string): PolygonTableRow => ({
  ...mapSitePolygonToTableRow(polygon, t),
  entity: {
    siteUuid: polygon.siteId,
    siteName: polygon.siteName,
    projectUuid: polygon.projectId,
    projectName: polygon.projectName
  }
});

/**
 * Polygon Review index. No polygon data loads until a project is picked in the Level 1 project context filter;
 * clearing that filter returns the page to its initial (unscoped) state.
 */
type PolygonReviewIndexContentProps = {
  selectedProjectUuid: string | null;
  setSelectedProjectUuid: (uuid: string | null) => void;
};

const PolygonReviewIndexContent: FC<PolygonReviewIndexContentProps> = ({
  selectedProjectUuid,
  setSelectedProjectUuid
}) => {
  const t = useT();
  const router = useRouter();
  const [isUserLoaded, { isAdmin }] = useMyUser();
  const [, { data: mapIndex }] = useProjectMapIndex({ enabled: isAdmin });

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [filters, setFilters] = useState<ProjectContextFilters>(EMPTY_PROJECT_CONTEXT_FILTERS);

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
  const polygonRows = useMemo(() => pagePolygons.map(polygon => toTableRow(polygon, t)), [pagePolygons, t]);

  const { selectedRows, selectedRowIds, setSelectedRowIds, handleRowSelected, onAllItemsSelected } =
    useTableSelection<PolygonTableRow>(true, polygonRows);
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
  const selectedProject = useMemo(
    () => projects.find(({ uuid }) => uuid === selectedProjectUuid) ?? null,
    [projects, selectedProjectUuid]
  );

  const openPicker = useCallback(() => setIsPickerOpen(true), []);

  const selectProject = useCallback(
    (uuid: string) => {
      setSelectedProjectUuid(uuid);
      setIsPickerOpen(false);
      clearPolygonFilters();
    },
    [clearPolygonFilters, setSelectedProjectUuid]
  );

  const clearProjectContext = useCallback(() => {
    setFilters(EMPTY_PROJECT_CONTEXT_FILTERS);
    setSelectedProjectUuid(null);
    clearPolygonFilters();
  }, [clearPolygonFilters, setSelectedProjectUuid]);

  const { setPolygonData, resetSiteMapInteractionState } = useMapAreaContext();
  useEffect(() => {
    setPolygonData(pagePolygons);
  }, [pagePolygons, setPolygonData]);
  useEffect(() => resetSiteMapInteractionState, [resetSiteMapInteractionState]);

  const polygonBulkActions = useProjectPolygonBulkActions({
    projectUuid: selectedProject?.uuid ?? null,
    projectName: selectedProject?.name ?? null,
    polygons: pagePolygons,
    selectedRows,
    selectedRowIds,
    setSelectedRowIds
  });

  const isAccessDenied = isUserLoaded && !isAdmin;
  useEffect(() => {
    if (isAccessDenied) {
      void router.replace("/");
    }
  }, [isAccessDenied, router]);

  if (!isUserLoaded || isAccessDenied) return null;

  return (
    <Layout>
      <ToolbarObject
        className="sticky top-0 z-20 !px-6"
        breadcrumbs={{
          linkRouter: router,
          links: [{ icon: <PolygonsIcon />, label: t("Polygons"), link: "/polygon-review" }]
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
      <PageContent className="bg-theme-neutral-200">
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
            selectedPolygonUuids={selectedPolygonUuids}
            showDeleted={polygonFilters.showDeleted}
            onViewProjectPolygons={selectProject}
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
          polygons={pagePolygons}
          selectedRows={selectedRows}
          visible={selectedRows.length > 0 && !polygonFilters.showDeleted}
        />
      </PageContent>
    </Layout>
  );
};

const PolygonReviewIndexPage: FC = () => {
  const [selectedProjectUuid, setSelectedProjectUuid] = useState<string | null>(null);
  const [, { isAdmin }] = useMyUser();
  const [, { data: mapIndex }] = useProjectMapIndex({ enabled: isAdmin });
  const frameworkKey = mapIndex?.projects.find(({ uuid }) => uuid === selectedProjectUuid)?.frameworkKey;

  return (
    <MapAreaProvider>
      <FrameworkProvider frameworkKey={frameworkKey}>
        <AnrMapOverlayProvider>
          <PolygonEditDrawerProvider>
            <PolygonReviewIndexContent
              selectedProjectUuid={selectedProjectUuid}
              setSelectedProjectUuid={setSelectedProjectUuid}
            />
          </PolygonEditDrawerProvider>
        </AnrMapOverlayProvider>
      </FrameworkProvider>
    </MapAreaProvider>
  );
};

export default PolygonReviewIndexPage;
