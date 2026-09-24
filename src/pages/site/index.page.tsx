import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import PageHeader from "@/redesignComponents/content/headers/PageHeaders/PageHeader";
import NoResults from "@/redesignComponents/content/NoResults/NoResults";
import HighLevelSelector from "@/redesignComponents/Forms/Inputs/HighLevelSelector/HighLevelSelector";
import { LoadingIcon, PlusIcon, SiteIcon } from "@/redesignComponents/foundations/Icons";
import { SelectedFilter } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";
import ToolbarObject from "@/redesignComponents/navigation/Toolbar/ToolbarObject";
import ToolbarTable from "@/redesignComponents/navigation/Toolbar/ToolbarTable/ToolbarTable";
import ResponsiveTypography from "@/styles/ResponsiveTypography";

import { ALL_PROJECTS_VIEW, getSiteCreateUrl } from "./components/siteIndex.utils";
import SiteIndexBulkBar from "./components/SiteIndexBulkBar";
import SiteIndexFilterDrawer, {
  type SiteIndexFilterStatus,
  type SiteIndexFilterUpdate,
  SITE_INDEX_STATUS_OPTIONS,
  SITE_INDEX_UPDATE_OPTIONS
} from "./components/SiteIndexFilterDrawer";
import SiteIndexSelectionProvider, { useSiteIndexSelectionActions } from "./components/SiteIndexSelection.provider";
import SiteProjectSection from "./components/SiteProjectSection";
import { SEARCH_DEBOUNCE_MS, useSiteIndexData } from "./components/useSiteIndexData";

const SiteIndexPageContent = () => {
  const t = useT();
  const router = useRouter();
  const { clearSelection } = useSiteIndexSelectionActions();
  const [reloadNonce, setReloadNonce] = useState(0);
  const [selectedProject, setSelectedProject] = useState(ALL_PROJECTS_VIEW);
  const [hasHydratedQuery, setHasHydratedQuery] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilters, setStatusFilters] = useState<SiteIndexFilterStatus[]>([]);
  const [updateFilter, setUpdateFilter] = useState<SiteIndexFilterUpdate | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedSearch(searchQuery.trim()), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    if (!router.isReady) return;
    const projectFromQuery = router.query.project;
    if (typeof projectFromQuery === "string" && projectFromQuery !== "") {
      setSelectedProject(projectFromQuery);
    }
    setHasHydratedQuery(true);
  }, [router.isReady, router.query.project]);

  const hasActiveSearch = searchQuery.trim().length > 0;
  const hasAppliedFilters = statusFilters.length > 0 || updateFilter != null;
  const hasActiveFilters = hasActiveSearch || hasAppliedFilters;
  const shouldAutoOpenFolders = selectedProject !== ALL_PROJECTS_VIEW || hasActiveFilters;
  const filtering = searchQuery.trim() !== debouncedSearch;
  const { loading, loadingMore, hasMore, loadMore, viewProjects, projects, totalSiteCount, onProjectOpened } =
    useSiteIndexData({
      reloadNonce,
      search: debouncedSearch,
      statusFilters,
      updateFilter,
      projectUuid: selectedProject === ALL_PROJECTS_VIEW ? undefined : selectedProject,
      enabled: hasHydratedQuery
    });
  const accordionOpenResetKey = `${selectedProject}:${debouncedSearch}:${statusFilters.join(",")}:${
    updateFilter ?? ""
  }`;

  const visibleProjects = useMemo(() => {
    const scopedProjects = projects.filter(
      project => selectedProject === ALL_PROJECTS_VIEW || project.id === selectedProject
    );

    if (!hasActiveFilters) {
      return scopedProjects;
    }

    return scopedProjects.filter(project => project.sites.length > 0);
  }, [hasActiveFilters, projects, selectedProject]);

  const visibleSiteCount = totalSiteCount;
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (node == null || !hasMore || loading || loadingMore) return;

    const observer = new IntersectionObserver(
      entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        void loadMore();
      },
      { rootMargin: "200px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore, loading, loadingMore, visibleProjects.length]);

  const selectedFilters = useMemo<SelectedFilter[]>(() => {
    const labels: SelectedFilter[] = [];

    if (statusFilters.length > 0) {
      labels.push({
        category: t("Status"),
        label: statusFilters.map(
          status => SITE_INDEX_STATUS_OPTIONS.find(option => option.value === status)?.label ?? status
        ),
        onRemove: () => setStatusFilters([])
      });
    }

    if (updateFilter != null) {
      labels.push({
        category: t("Update"),
        label: [SITE_INDEX_UPDATE_OPTIONS.find(option => option.value === updateFilter)?.label ?? updateFilter],
        onRemove: () => setUpdateFilter(null)
      });
    }

    return labels;
  }, [statusFilters, t, updateFilter]);

  const handleSitesChanged = useCallback(() => setReloadNonce(current => current + 1), []);

  const handleViewChange = useCallback(
    (nextView: string) => {
      clearSelection();
      setSelectedProject(nextView);
      if (nextView === ALL_PROJECTS_VIEW) {
        void router.replace("/site", undefined, { shallow: true });
        return;
      }
      void router.replace(`/site?project=${nextView}`, undefined, { shallow: true });
    },
    [clearSelection, router]
  );

  const handleAddSite = useCallback(() => {
    const targetProject = viewProjects.find(project => project.id === selectedProject);
    if (targetProject == null) {
      showToast({
        label: t("Select a project from View to add a site."),
        type: "warning",
        placement: "bottom",
        duration: 5000
      });
      return;
    }

    void router.push(getSiteCreateUrl(targetProject));
  }, [router, selectedProject, t, viewProjects]);

  const clearFilters = useCallback(() => {
    setStatusFilters([]);
    setUpdateFilter(null);
  }, []);

  return (
    <>
      <ResponsiveTypography />
      <Head>
        <title>{t("Sites")}</title>
      </Head>
      <ToolbarObject
        className="sticky top-0 z-20 !px-6"
        breadcrumbs={{
          linkRouter: router,
          links: [
            {
              icon: <SiteIcon />,
              label: t("Sites"),
              link: "#"
            }
          ]
        }}
      />

      <PageHeader
        title={t("Sites")}
        className="!bg-theme-neutral-100 !px-6 !pb-0 !pt-1 mobile:flex-col mobile:items-start mobile:gap-4"
        classNameActions="mobile:w-full"
        actions={
          <Flex gap="0.5rem" alignItems="center" className="mobile:w-full mobile:flex-col mobile:items-stretch">
            <Box className="w-[25rem] mobile:w-full">
              <HighLevelSelector
                key={
                  selectedProject === ALL_PROJECTS_VIEW
                    ? ALL_PROJECTS_VIEW
                    : `${selectedProject}:${viewProjects.find(project => project.id === selectedProject)?.name ?? ""}`
                }
                autocomplete
                width="100%"
                label={t("View:")}
                items={[
                  { label: t("All"), value: ALL_PROJECTS_VIEW },
                  ...viewProjects.map(project => ({ label: project.name, value: project.id }))
                ]}
                value={selectedProject}
                emptyMessage={t("No results found")}
                onChange={handleViewChange}
              />
            </Box>
            <Button
              size="small"
              leftIcon={<PlusIcon boxSize="0.625rem" />}
              className="mobile:w-full"
              disabled={viewProjects.length === 0 || selectedProject == ALL_PROJECTS_VIEW}
              onClick={handleAddSite}
            >
              {t("Add Site")}
            </Button>
          </Flex>
        }
      />

      <ToolbarTable
        className="!bg-theme-neutral-200 !px-5 !pb-6 !pt-5"
        classNameContentLeft="w-full"
        classNameContentSearch="w-[19rem]"
        search={{
          label: visibleSiteCount === 1 ? t("Site") : t("Sites"),
          placeholder: t("Search sites"),
          options: [],
          displayResults: "none",
          onQueryChange: setSearchQuery,
          isLoading: filtering,
          count: visibleSiteCount
        }}
        selectedFilters={selectedFilters}
        onClickFilterButton={() => setIsFilterDrawerOpen(true)}
        onClearFilters={clearFilters}
        showClearFilters={selectedFilters.length > 0}
      />

      <PageContent heightFull={false} className="flex-1 !gap-0 bg-theme-neutral-200 px-2 pb-9 pt-1">
        {loading ? (
          <Flex minHeight="15rem" alignItems="center" justifyContent="center" gap={3}>
            <LoadingIcon boxSize={6} className="animate-spin" color="primary.700" />
            <Text textStyle="400" color="neutral.800">
              {t("Loading sites...")}
            </Text>
          </Flex>
        ) : (
          <>
            <div className="space-y-4">
              {visibleProjects.map(project => (
                <SiteProjectSection
                  key={project.id}
                  project={project}
                  sites={project.sites}
                  totalSiteCount={project.sites.length}
                  isFiltered={hasActiveFilters}
                  searchQuery={debouncedSearch}
                  statusFilters={statusFilters}
                  updateFilter={updateFilter}
                  defaultOpen={shouldAutoOpenFolders}
                  openResetKey={accordionOpenResetKey}
                  onProjectOpened={onProjectOpened}
                  onSitesChanged={handleSitesChanged}
                />
              ))}
              {hasMore ? (
                <Flex ref={sentinelRef} minHeight="4rem" alignItems="center" justifyContent="center" gap={3}>
                  {loadingMore ? (
                    <>
                      <LoadingIcon boxSize={6} className="animate-spin" color="primary.700" />
                      <Text textStyle="400" color="neutral.800">
                        {t("Loading...")}
                      </Text>
                    </>
                  ) : null}
                </Flex>
              ) : null}
            </div>

            {visibleProjects.length === 0 ? (
              <NoResults
                className="px-4"
                title={hasActiveFilters ? t("No results found") : t("No sites found")}
                description={
                  hasActiveSearch
                    ? t("We couldn’t find any sites matching your search. Try a different keyword.")
                    : hasAppliedFilters
                    ? t("We couldn’t find any sites matching your filters. Try adjusting or clearing your filters.")
                    : t("No sites have been added yet.")
                }
              />
            ) : null}
          </>
        )}
        <SiteIndexBulkBar onSitesChanged={handleSitesChanged} />
      </PageContent>

      <SiteIndexFilterDrawer
        open={isFilterDrawerOpen}
        filters={statusFilters}
        updateFilter={updateFilter}
        onOpenChange={setIsFilterDrawerOpen}
        onApplyFilters={(nextStatusFilters, nextUpdateFilter) => {
          setStatusFilters(nextStatusFilters);
          setUpdateFilter(nextUpdateFilter);
        }}
      />
    </>
  );
};

const SiteIndexPage = () => (
  <SiteIndexSelectionProvider>
    <SiteIndexPageContent />
  </SiteIndexSelectionProvider>
);

export default SiteIndexPage;
