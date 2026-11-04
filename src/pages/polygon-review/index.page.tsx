import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { buildSitePolygonEditUrl } from "@/components/elements/Map-mapbox/sitePolygonNavigation";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { useFullSite } from "@/connections/Entity";
import { useProjectMapIndex } from "@/connections/ProjectMapIndex";
import { pruneSitePolygonsCache, useSitePolygons } from "@/connections/SitePolygons";
import { useMyUser } from "@/connections/User";
import { AnrMapOverlayProvider } from "@/context/anrMapOverlay.provider";
import FrameworkProvider from "@/context/framework.provider";
import { MapAreaProvider } from "@/context/mapArea.provider";
import { PolygonEditDrawerDataSync, PolygonEditDrawerProvider } from "@/context/polygonEditDrawer.provider";
import {
  openPolygonEditDrawerForPolygonId,
  openPolygonEditDrawerForSitePolygon
} from "@/context/polygonEditDrawer.utils";
import { setPolygonTableHoveredUuid, useSyncPolygonTableSelectionStore } from "@/context/polygonTableInteraction.store";
import type { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import PageHeader from "@/redesignComponents/content/headers/PageHeaders/PageHeader";
import Table from "@/redesignComponents/dataDisplay/Table/Table";
import { useTableSelection } from "@/redesignComponents/dataDisplay/Table/useTableSelection";
import { PolygonsIcon } from "@/redesignComponents/foundations/Icons";
import Layout from "@/redesignComponents/Layout/Layout";
import ToolbarObject from "@/redesignComponents/navigation/Toolbar/ToolbarObject";
import Log from "@/utils/log";

import ExistingPolygon from "../site/[uuid]/components/Modals/ExistingPolygon";
import UploadError from "../site/[uuid]/components/Modals/UploadError";
import UploadPolygons from "../site/[uuid]/components/Modals/UploadPolygons";
import { buildPolygonTableColumns } from "../site/[uuid]/components/polygonTableColumns";
import type { PolygonTableRow } from "../site/[uuid]/components/PolygonTableRow";
import { mapSitePolygonToTableRow } from "../site/[uuid]/components/polygonTableRow.utils";
import SitePolygonIssuesPanel from "../site/[uuid]/components/SitePolygonIssuesPanel";
import SitePolygonTableSection from "../site/[uuid]/components/SitePolygonTableSection";
import { useExistingPolygonModal } from "../site/[uuid]/hooks/useExistingPolygonModal";
import { usePolygonTablePaging } from "../site/[uuid]/hooks/usePolygonTablePaging";
import { usePolygonUploadErrorModal } from "../site/[uuid]/hooks/usePolygonUploadErrorModal";
import { useSitePolygonFilters } from "../site/[uuid]/hooks/useSitePolygonFilters";
import { useStartSitePolygonDrawing } from "../site/[uuid]/hooks/useStartSitePolygonDrawing";
import type { UploadPolygonsSuccessResult } from "../site/[uuid]/hooks/useUploadPolygons";
import PolygonReviewEmptyState from "./components/PolygonReviewEmptyState";
import PolygonReviewMap from "./components/PolygonReviewMap";
import PolygonReviewMetrics from "./components/PolygonReviewMetrics";
import PolygonReviewSiteSync from "./components/PolygonReviewSiteSync";
import PolygonReviewTableActions from "./components/PolygonReviewTableActions";
import PolygonReviewToolbar from "./components/PolygonReviewToolbar";
import ProjectContextPicker from "./components/ProjectContextPicker";
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
const PolygonReviewIndexContent: FC = () => {
  const t = useT();
  const router = useRouter();
  const [isUserLoaded, { isAdmin }] = useMyUser();
  const [, { data: mapIndex }] = useProjectMapIndex({ enabled: isAdmin });

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [filters, setFilters] = useState<ProjectContextFilters>(EMPTY_PROJECT_CONTEXT_FILTERS);
  const [selectedProjectUuid, setSelectedProjectUuid] = useState<string | null>(null);

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
  const polygonRows = useMemo(() => (polygons ?? NO_POLYGONS).map(polygon => toTableRow(polygon, t)), [polygons, t]);

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

  const clearTableSelection = useCallback(() => setSelectedRowIds(new Set()), [setSelectedRowIds]);
  const startDrawing = useStartSitePolygonDrawing({ onClearTableSelection: clearTableSelection });
  const startNewPolygonFlow = useCallback(() => {
    openPolygonEditDrawerForSitePolygon();
    startDrawing();
  }, [startDrawing]);

  const findTablePolygon = useCallback(
    (polygonId: string) => polygons?.find(polygon => polygon.polygonUuid === polygonId || polygon.uuid === polygonId),
    [polygons]
  );
  const openPolygonInDrawer = useCallback(
    (polygonId: string) => {
      if (singleSiteUuid == null) return;
      void openPolygonEditDrawerForPolygonId({
        polygonId,
        siteUuid: singleSiteUuid,
        findCachedSitePolygon: findTablePolygon
      }).catch(error => {
        Log.error("Failed to open polygon in edit drawer:", error);
      });
    },
    [findTablePolygon, singleSiteUuid]
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
  // Same behaviour as the site page: a single uploaded polygon opens in the edit drawer.
  const handleUploadSuccess = useCallback(
    ({ createdSitePolygonUuid, uploadedFileCount }: UploadPolygonsSuccessResult) => {
      pruneSitePolygonsCache();
      if (createdSitePolygonUuid != null && uploadedFileCount === 1) {
        openPolygonInDrawer(createdSitePolygonUuid);
      }
    },
    [openPolygonInDrawer]
  );
  // Same behaviour as the site page: a duplicate in the scoped site opens in the drawer, others in a new tab.
  const viewExistingPolygon = useCallback(() => {
    if (existingPolygonDuplicate == null) return;
    const { siteUuid, sitePolygonUuid, polygonUuid } = existingPolygonDuplicate;
    if (siteUuid === "" || siteUuid === singleSiteUuid) {
      const existingInTable = findTablePolygon(sitePolygonUuid) ?? findTablePolygon(polygonUuid);
      if (existingInTable != null) {
        openPolygonEditDrawerForSitePolygon(existingInTable, existingInTable.name ?? undefined);
        return;
      }
      openPolygonInDrawer(sitePolygonUuid);
      return;
    }
    window.open(
      buildSitePolygonEditUrl(siteUuid, sitePolygonUuid, { adminReview: true }),
      "_blank",
      "noopener,noreferrer"
    );
  }, [existingPolygonDuplicate, findTablePolygon, openPolygonInDrawer, singleSiteUuid]);

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
    [clearPolygonFilters]
  );

  const clearProjectContext = useCallback(() => {
    setFilters(EMPTY_PROJECT_CONTEXT_FILTERS);
    setSelectedProjectUuid(null);
    clearPolygonFilters();
  }, [clearPolygonFilters]);

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
      <FrameworkProvider frameworkKey={scopedSite?.frameworkKey}>
        <PolygonEditDrawerProvider>
          <PolygonReviewSiteSync site={scopedSite} />
          <PolygonEditDrawerDataSync polygons={polygons} onRefetchPolygons={pruneSitePolygonsCache} />
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
                  <PolygonReviewTableActions
                    isProjectSelected={selectedProject != null}
                    isSingleSiteSelected={scopedSite != null}
                    onDrawPolygon={startNewPolygonFlow}
                    onUpload={openUploadModal}
                  />
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
                      isSitePolygonsLoading={!polygonsLoaded}
                      polygonRows={polygonRows}
                      columns={columns}
                      selectedRows={selectedRows}
                      loadingLabel={t("Loading polygons...")}
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
          </PageContent>
          {singleSiteUuid != null && (
            <UploadPolygons
              open={isUploadModalOpen}
              siteUuid={singleSiteUuid}
              siteHasExistingPolygons={(indexTotal ?? 0) > 0}
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
            onView={viewExistingPolygon}
          />
          <UploadError
            open={isUploadErrorModalOpen}
            backendErrorMessage={uploadErrorMessage}
            onOpenChange={onUploadErrorModalOpenChange}
          />
        </PolygonEditDrawerProvider>
      </FrameworkProvider>
    </Layout>
  );
};

const PolygonReviewIndexPage: FC = () => (
  <MapAreaProvider>
    <AnrMapOverlayProvider>
      <PolygonReviewIndexContent />
    </AnrMapOverlayProvider>
  </MapAreaProvider>
);

export default PolygonReviewIndexPage;
