import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { useProjectMapIndex } from "@/connections/ProjectMapIndex";
import { useSitePolygons } from "@/connections/SitePolygons";
import { useMyUser } from "@/connections/User";
import { MapAreaProvider } from "@/context/mapArea.provider";
import { setPolygonTableHoveredUuid, useSyncPolygonTableSelectionStore } from "@/context/polygonTableInteraction.store";
import type { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import PageHeader from "@/redesignComponents/content/headers/PageHeaders/PageHeader";
import Table from "@/redesignComponents/dataDisplay/Table/Table";
import { useTableSelection } from "@/redesignComponents/dataDisplay/Table/useTableSelection";
import Layout from "@/redesignComponents/Layout/Layout";

import { buildPolygonTableColumns } from "../site/[uuid]/components/polygonTableColumns";
import type { PolygonTableRow } from "../site/[uuid]/components/PolygonTableRow";
import { mapSitePolygonToTableRow } from "../site/[uuid]/components/polygonTableRow.utils";
import SitePolygonTableSection from "../site/[uuid]/components/SitePolygonTableSection";
import { usePolygonTablePaging } from "../site/[uuid]/hooks/usePolygonTablePaging";
import { useSitePolygonFilters } from "../site/[uuid]/hooks/useSitePolygonFilters";
import PolygonReviewEmptyState from "./components/PolygonReviewEmptyState";
import PolygonReviewMap from "./components/PolygonReviewMap";
import PolygonReviewMetrics from "./components/PolygonReviewMetrics";
import PolygonReviewToolbar from "./components/PolygonReviewToolbar";
import ProjectContextPicker from "./components/ProjectContextPicker";
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
const PolygonReviewIndexPage: FC = () => {
  const t = useT();
  const router = useRouter();
  const [isUserLoaded, { isAdmin }] = useMyUser();
  const [, { data: mapIndex, loadFailure }] = useProjectMapIndex({ enabled: isAdmin });

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
      <PageHeader
        title={t("Polygon Review")}
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
      <MapAreaProvider>
        <PageContent className="bg-theme-neutral-100">
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
              hasLoadFailure={loadFailure != null}
              onViewProjectPolygons={selectProject}
            />
            {selectedProject == null ? (
              <Flex
                direction="column"
                borderWidth="1px"
                borderColor="neutral.300"
                borderRadius="0.25rem"
                bg="neutral.100"
              >
                <Table data={[]} columns={columns} selectable showPagination={false} />
                <PolygonReviewEmptyState onSelectProject={openPicker} />
              </Flex>
            ) : (
              <>
                <PolygonReviewMetrics
                  project={metrics.project}
                  filtered={metrics.filtered}
                  selected={metrics.selected}
                />
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
              </>
            )}
          </Flex>
        </PageContent>
      </MapAreaProvider>
    </Layout>
  );
};

export default PolygonReviewIndexPage;
