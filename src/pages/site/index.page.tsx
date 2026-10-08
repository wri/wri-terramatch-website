import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { InfiniteScrollSentinel } from "@/hooks/useInfiniteScrollSentinel";
import NoResults from "@/redesignComponents/content/NoResults/NoResults";
import { LoadingIcon } from "@/redesignComponents/foundations/Icons";
import ResponsiveTypography from "@/styles/ResponsiveTypography";

import { ALL_PROJECTS_VIEW, filterSiteIndexSites, getSiteCreateUrl } from "./components/siteIndex.utils";
import SiteIndexBulkBar from "./components/SiteIndexBulkBar";
import { type SiteIndexFilterStatus, type SiteIndexFilterUpdate } from "./components/SiteIndexFilterDrawer";
import SiteIndexHeader from "./components/SiteIndexHeader";
import SiteIndexSelectionProvider, { useSiteIndexSelectionActions } from "./components/SiteIndexSelection.provider";
import SiteProjectSection from "./components/SiteProjectSection";
import { SEARCH_DEBOUNCE_MS, useSiteIndexData } from "./components/useSiteIndexData";

const SiteIndexPageContent: FC = () => {
  const t = useT();
  const router = useRouter();
  const { clearSelection } = useSiteIndexSelectionActions();
  const [reloadNonce, setReloadNonce] = useState(0);
  const [childrenReloadNonce, setChildrenReloadNonce] = useState(0);
  const [selectedProject, setSelectedProject] = useState(ALL_PROJECTS_VIEW);
  const [hasHydratedQuery, setHasHydratedQuery] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilters, setStatusFilters] = useState<SiteIndexFilterStatus[]>([]);
  const [updateFilter, setUpdateFilter] = useState<SiteIndexFilterUpdate | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedSearch(searchQuery.trim()), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    if (!router.isReady) return;
    const projectFromQuery = router.query.project;
    if (typeof projectFromQuery === "string" && projectFromQuery !== "") {
      void router.replace(`/project/${projectFromQuery}?tab=sites`);
      return;
    }
    setHasHydratedQuery(true);
  }, [router.isReady, router.query.project, router]);

  const hasActiveSearch = searchQuery.trim().length > 0;
  const hasAppliedFilters = statusFilters.length > 0 || updateFilter != null;
  const hasActiveFilters = hasActiveSearch || hasAppliedFilters;
  const filtering = searchQuery.trim() !== debouncedSearch;
  const { loading, loadingMore, hasMore, loadMore, viewProjects, projects, totalSiteCount, onProjectOpened, error } =
    useSiteIndexData({
      reloadNonce,
      childrenReloadNonce,
      search: debouncedSearch,
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

    if (!hasActiveFilters) return scopedProjects;

    return scopedProjects.filter(
      project =>
        !project.sitesLoaded ||
        filterSiteIndexSites(project.sites, {
          search: debouncedSearch,
          statusFilters,
          updateFilter
        }).length > 0
    );
  }, [debouncedSearch, hasActiveFilters, projects, selectedProject, statusFilters, updateFilter]);

  const visibleSiteCount = useMemo(() => {
    if (!hasAppliedFilters || visibleProjects.some(project => !project.sitesLoaded)) return totalSiteCount;

    return visibleProjects.reduce(
      (total, project) =>
        total +
        filterSiteIndexSites(project.sites, {
          search: debouncedSearch,
          statusFilters,
          updateFilter
        }).length,
      0
    );
  }, [debouncedSearch, hasAppliedFilters, statusFilters, totalSiteCount, updateFilter, visibleProjects]);

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

  const handleApplyFilters = useCallback(
    (nextStatusFilters: SiteIndexFilterStatus[], nextUpdateFilter: SiteIndexFilterUpdate | null) => {
      setStatusFilters(nextStatusFilters);
      setUpdateFilter(nextUpdateFilter);
      if (nextStatusFilters.length > 0 || nextUpdateFilter != null) {
        setChildrenReloadNonce(current => current + 1);
      }
    },
    []
  );

  return (
    <>
      <ResponsiveTypography />
      <SiteIndexHeader
        siteCount={visibleSiteCount}
        selectedProject={selectedProject}
        viewProjects={viewProjects}
        statusFilters={statusFilters}
        updateFilter={updateFilter}
        filtering={filtering}
        onApplyFilters={handleApplyFilters}
        onViewChange={handleViewChange}
        onAddSite={handleAddSite}
        onQueryChange={setSearchQuery}
      />

      <PageContent className="h-auto flex-1 px-2 py-0">
        {loading ? (
          <Flex minHeight="15rem" alignItems="center" justifyContent="center" gap={3}>
            <LoadingIcon boxSize={6} className="animate-spin" color="primary.700" />
            <Text textStyle="400" color="neutral.800">
              {t("Loading sites...")}
            </Text>
          </Flex>
        ) : error ? (
          <NoResults title={t("Sites could not be loaded")} description={t("Please refresh the page and try again.")} />
        ) : visibleProjects.length === 0 ? (
          <NoResults
            className="px-4"
            title={hasActiveFilters ? t("No sites found") : t("No sites found")}
            description={
              hasActiveSearch
                ? t("We couldn’t find any sites matching your search. Try a different keyword.")
                : hasAppliedFilters
                ? t("We couldn’t find any sites matching your filters. Try adjusting or clearing your filters.")
                : t("No sites have been added yet.")
            }
          />
        ) : (
          <>
            <div className="space-y-4">
              {visibleProjects.map((project, index) => (
                <SiteProjectSection
                  key={project.id}
                  project={project}
                  sites={project.sites}
                  totalSiteCount={project.sites.length}
                  isFiltered={hasActiveFilters}
                  searchQuery={debouncedSearch}
                  statusFilters={statusFilters}
                  updateFilter={updateFilter}
                  defaultOpen={index === 0}
                  openResetKey={accordionOpenResetKey}
                  onProjectOpened={onProjectOpened}
                  onSitesChanged={handleSitesChanged}
                />
              ))}
              <InfiniteScrollSentinel
                hasMore={hasMore}
                loading={loading}
                loadingMore={loadingMore}
                label={t("Loading...")}
                resetKey={visibleProjects.length}
                onLoadMore={loadMore}
              />
            </div>
          </>
        )}
        <SiteIndexBulkBar onSitesChanged={handleSitesChanged} />
      </PageContent>
    </>
  );
};

const SiteIndexPage: FC = () => (
  <SiteIndexSelectionProvider>
    <SiteIndexPageContent />
  </SiteIndexSelectionProvider>
);

export default SiteIndexPage;
