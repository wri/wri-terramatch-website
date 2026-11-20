import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC, useCallback, useMemo, useState } from "react";

import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { useGadmOptions } from "@/connections/Gadm";
import { useMyOrg } from "@/connections/Organisation";
import { useIsMobile } from "@/hooks/useIsMobile";
import ProjectCard from "@/redesignComponents/containers/Cards/ProjectCard/ProjectCard";
import { DEFAULT_PAGE_SIZE } from "@/redesignComponents/dataDisplay/Table/tableUtils";
import PaginationTable from "@/redesignComponents/navigation/Pagination/PaginationTable";
import ResponsiveTypography from "@/styles/ResponsiveTypography";

import MyProjectsEmptyState from "./components/MyProjectsEmptyState";
import MyProjectsHeader from "./components/MyProjectsHeader";
import { MOCK_MY_PROJECTS } from "./myProjects.mock";
import {
  EMPTY_MY_PROJECTS_FILTERS,
  filterProjects,
  getCountryOptions,
  getPlantingStatusOptions,
  getProgrammeOptions,
  getProjectStatusOptions,
  MyProjectsFilterOptions,
  MyProjectsFilters
} from "./myProjectsFilters";

const MIN_PROJECTS_FOR_TOOLBAR = 3;
const FIRST_PAGE = 1;

const MyProjectsPage: FC = () => {
  const t = useT();
  const isMobile = useIsMobile();
  const [isOrgLoaded, { organisation }] = useMyOrg();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(EMPTY_MY_PROJECTS_FILTERS);
  const [currentPage, setCurrentPage] = useState(FIRST_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const countryNames = useGadmOptions({ level: 0 });

  const projects = MOCK_MY_PROJECTS;
  const isOrgPending = isOrgLoaded && organisation?.status !== "approved";
  const showToolbar = !isOrgPending && projects.length >= MIN_PROJECTS_FOR_TOOLBAR;

  const filterOptions = useMemo<MyProjectsFilterOptions>(
    () => ({
      statuses: getProjectStatusOptions(t),
      plantingStatuses: getPlantingStatusOptions(t),
      programmes: getProgrammeOptions(projects),
      countries: getCountryOptions(projects, countryNames ?? [])
    }),
    [countryNames, projects, t]
  );

  const filteredProjects = useMemo(() => filterProjects(projects, query, filters), [filters, projects, query]);

  const pageProjects = useMemo(
    () => filteredProjects.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [currentPage, filteredProjects, pageSize]
  );

  const handleQueryChange = useCallback((nextQuery: string) => {
    setQuery(nextQuery);
    setCurrentPage(FIRST_PAGE);
  }, []);

  const handleApplyFilters = useCallback((nextFilters: MyProjectsFilters) => {
    setFilters(nextFilters);
    setCurrentPage(FIRST_PAGE);
  }, []);

  const handlePageSizeChange = useCallback((nextPageSize: number) => {
    setPageSize(nextPageSize);
    setCurrentPage(FIRST_PAGE);
  }, []);

  return (
    <>
      <ResponsiveTypography />
      <title>{t("My Projects")}</title>
      <MyProjectsHeader
        projectCount={filteredProjects.length}
        showToolbar={showToolbar}
        showAddProject={!isOrgPending}
        filters={filters}
        filterOptions={filterOptions}
        onApplyFilters={handleApplyFilters}
        onQueryChange={handleQueryChange}
      />
      <PageContent className={classNames("h-auto flex-1 gap-6", { "pt-0": showToolbar })}>
        {isOrgPending || filteredProjects.length === 0 ? (
          <MyProjectsEmptyState
            isOrgPending={isOrgPending}
            hasProjects={projects.length > 0}
            hasActiveSearch={query.trim() !== ""}
          />
        ) : (
          <>
            <Box className="grid grid-cols-2 gap-6 mobile:grid-cols-1">
              {pageProjects.map(project => (
                <ProjectCard key={project.uuid} project={project} />
              ))}
            </Box>
            {filteredProjects.length > pageSize && (
              <PaginationTable
                pageSize={pageSize}
                currentPage={currentPage}
                totalItems={filteredProjects.length}
                onPageSizeChange={handlePageSizeChange}
                onPageChange={setCurrentPage}
                showItemCountText={!isMobile}
                variant="compact"
              />
            )}
          </>
        )}
      </PageContent>
    </>
  );
};

export default MyProjectsPage;
