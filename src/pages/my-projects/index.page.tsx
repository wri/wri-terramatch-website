import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC, useCallback, useMemo, useState } from "react";

import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import ProjectCard from "@/redesignComponents/content/ContentCard/ProjectCard/ProjectCard";
import { mapPlantingStatusToProgressState } from "@/redesignComponents/content/headers/PageHeaders/ProjectHeader/projectHeader.utils";
import NoResults from "@/redesignComponents/content/NoResults/NoResults";
import { DEFAULT_PAGE_SIZE } from "@/redesignComponents/dataDisplay/Table/tableUtils";
import PaginationTable from "@/redesignComponents/navigation/Pagination/PaginationTable";
import ResponsiveTypography from "@/styles/ResponsiveTypography";

import MyProjectsHeader from "./components/MyProjectsHeader";
import { MOCK_MY_PROJECTS } from "./myProjects.mock";

const MIN_PROJECTS_FOR_TOOLBAR = 3;
const FIRST_PAGE = 1;

const MyProjectsPage: FC = () => {
  const t = useT();
  const [query, setQuery] = useState("");
  const [statuses, setStatuses] = useState<string[]>([]);
  const [plantingStatuses, setPlantingStatuses] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(FIRST_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const projects = MOCK_MY_PROJECTS;
  const showToolbar = projects.length >= MIN_PROJECTS_FOR_TOOLBAR;

  const filteredProjects = useMemo(() => {
    const search = query.trim().toLowerCase();
    return projects.filter(
      project =>
        (search === "" || (project.name ?? "").toLowerCase().includes(search)) &&
        (statuses.length === 0 || statuses.includes(project.status)) &&
        (plantingStatuses.length === 0 ||
          plantingStatuses.includes(mapPlantingStatusToProgressState(project.plantingStatus) ?? "not-available"))
    );
  }, [plantingStatuses, projects, query, statuses]);

  const pageProjects = useMemo(
    () => filteredProjects.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [currentPage, filteredProjects, pageSize]
  );

  const handleQueryChange = useCallback((nextQuery: string) => {
    setQuery(nextQuery);
    setCurrentPage(FIRST_PAGE);
  }, []);

  const handleApplyFilters = useCallback((nextStatuses: string[], nextPlantingStatuses: string[]) => {
    setStatuses(nextStatuses);
    setPlantingStatuses(nextPlantingStatuses);
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
        statuses={statuses}
        plantingStatuses={plantingStatuses}
        onApplyFilters={handleApplyFilters}
        onQueryChange={handleQueryChange}
      />
      <PageContent className={classNames("h-auto flex-1 gap-6", { "pt-0": showToolbar })}>
        {filteredProjects.length === 0 ? (
          <NoResults title={t("No projects found")} description={t("Try changing your search or filters.")} />
        ) : (
          <Box className="grid grid-cols-2 gap-6 mobile:grid-cols-1">
            {pageProjects.map(project => (
              <ProjectCard key={project.uuid} project={project} />
            ))}
          </Box>
        )}
        {filteredProjects.length > pageSize && (
          <PaginationTable
            pageSize={pageSize}
            currentPage={currentPage}
            totalItems={filteredProjects.length}
            onPageSizeChange={handlePageSizeChange}
            onPageChange={setCurrentPage}
            showItemCountText
            variant="compact"
          />
        )}
      </PageContent>
    </>
  );
};

export default MyProjectsPage;
