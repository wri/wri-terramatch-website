import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { isEqual } from "lodash";
import { FC, useCallback, useMemo, useState } from "react";

import IndexLoadingRow from "@/components/extensive/EntityIndex/IndexLoadingRow";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { useProjectMetaIndex } from "@/connections/Entity";
import { useGadmOptions } from "@/connections/Gadm";
import { useMyOrg } from "@/connections/Organisation";
import { useMyUser } from "@/connections/User";
import { useDebounce } from "@/hooks/useDebounce";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useOnUnmount } from "@/hooks/useOnMount";
import { useValueChanged } from "@/hooks/useValueChanged";
import ProjectCard from "@/redesignComponents/containers/Cards/ProjectCard/ProjectCard";
import NoResults from "@/redesignComponents/content/NoResults/NoResults";
import { DEFAULT_PAGE_SIZE, MIN_PAGE_SIZE_OPTION } from "@/redesignComponents/dataDisplay/Table/tableUtils";
import PaginationTable from "@/redesignComponents/navigation/Pagination/PaginationTable";
import ApiSlice from "@/store/apiSlice";
import ResponsiveTypography from "@/styles/ResponsiveTypography";

import MyProjectsEmptyState from "./components/MyProjectsEmptyState";
import MyProjectsHeader from "./components/MyProjectsHeader";
import {
  EMPTY_MY_PROJECTS_FILTERS,
  getPlantingStatusOptions,
  getProgrammeOptions,
  getProjectStatusOptions,
  MyProjectsFilterOptions,
  MyProjectsFilters,
  toProjectMetaFilter
} from "./myProjectsFilters";

const MIN_PROJECTS_FOR_TOOLBAR = 3;
const FIRST_PAGE = 1;

const MyProjectsPage: FC = () => {
  const t = useT();
  const isMobile = useIsMobile();
  const [isOrgLoaded, { organisation }] = useMyOrg();
  const [, { user }] = useMyUser();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(EMPTY_MY_PROJECTS_FILTERS);
  const [currentPage, setCurrentPage] = useState(FIRST_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [total, setTotal] = useState(0);
  const countryOptions = useGadmOptions({ level: 0 });

  const isOrgPending = isOrgLoaded && organisation?.status !== "approved";
  const isFiltered = query !== "" || !isEqual(filters, EMPTY_MY_PROJECTS_FILTERS);
  const showToolbar = !isOrgPending && (isFiltered || total >= MIN_PROJECTS_FOR_TOOLBAR);

  const [isLoaded, { data: projects, indexTotal, loadFailure }] = useProjectMetaIndex({
    enabled: isOrgLoaded && !isOrgPending,
    filter: useMemo(() => toProjectMetaFilter(query, filters), [filters, query]),
    pageNumber: currentPage,
    pageSize
  });

  useOnUnmount(() => {
    ApiSlice.pruneIndex("projectMetas", "");
    ApiSlice.pruneCache("projectMetas");
  });

  useValueChanged(indexTotal, () => {
    if (indexTotal != null) setTotal(indexTotal);
  });

  const filterOptions = useMemo<MyProjectsFilterOptions>(
    () => ({
      statuses: getProjectStatusOptions(t),
      plantingStatuses: getPlantingStatusOptions(t),
      programmes: getProgrammeOptions(user?.frameworks ?? []),
      countries: countryOptions ?? []
    }),
    [countryOptions, t, user?.frameworks]
  );

  const handleQueryChange = useDebounce(
    useCallback((nextQuery: string) => {
      setQuery(nextQuery.trim());
      setCurrentPage(FIRST_PAGE);
    }, [])
  );

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
        projectCount={total}
        showToolbar={showToolbar}
        showAddProject={!isOrgPending}
        filters={filters}
        filterOptions={filterOptions}
        onApplyFilters={handleApplyFilters}
        onQueryChange={handleQueryChange}
      />
      <PageContent className={classNames("h-auto flex-1 gap-6", { "pt-0": showToolbar })}>
        {isOrgPending ? (
          <MyProjectsEmptyState isOrgPending isFiltered={false} hasActiveSearch={false} />
        ) : loadFailure != null ? (
          <NoResults
            className="!px-0"
            title={t("Projects could not be loaded")}
            description={t("Please refresh the page and try again.")}
          />
        ) : !isOrgLoaded || !isLoaded || projects == null ? (
          <IndexLoadingRow label={t("Loading projects...")} minHeight="15rem" />
        ) : projects.length === 0 ? (
          <MyProjectsEmptyState isOrgPending={false} isFiltered={isFiltered} hasActiveSearch={query !== ""} />
        ) : (
          <Box className="grid grid-cols-2 gap-6 mobile:grid-cols-1">
            {projects.map(project => (
              <ProjectCard key={project.uuid} project={project} />
            ))}
          </Box>
        )}
        {!isOrgPending && total > MIN_PAGE_SIZE_OPTION && (
          <PaginationTable
            pageSize={pageSize}
            currentPage={currentPage}
            totalItems={total}
            onPageSizeChange={handlePageSizeChange}
            onPageChange={setCurrentPage}
            showItemCountText={!isMobile}
            variant="compact"
          />
        )}
      </PageContent>
    </>
  );
};

export default MyProjectsPage;
