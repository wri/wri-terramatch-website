import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC, useCallback, useMemo, useState } from "react";

import IndexLoadingRow from "@/components/extensive/EntityIndex/IndexLoadingRow";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { useIndexViewState } from "@/hooks/useIndexViewState";
import NoResults from "@/redesignComponents/content/NoResults/NoResults";
import { showToast } from "@/redesignComponents/status/Toast/showToast";
import ResponsiveTypography from "@/styles/ResponsiveTypography";

import { ALL_PROJECTS_VIEW, filterSiteIndexSites, getSiteCreateUrl } from "./components/siteIndex.utils";
import SiteIndexBulkBar from "./components/SiteIndexBulkBar";
import { type SiteIndexFilterStatus, type SiteIndexFilterUpdate } from "./components/SiteIndexFilterDrawer";
import SiteIndexHeader from "./components/SiteIndexHeader";
import SiteIndexSelectionProvider, { useSiteIndexSelectionActions } from "./components/SiteIndexSelection.provider";
import SiteProjectSection from "./components/SiteProjectSection";
import { useSiteIndexData } from "./components/useSiteIndexData";

const SiteIndexPageContent: FC = () => {
  const t = useT();
  const router = useRouter();
  const { clearSelection } = useSiteIndexSelectionActions();
  const [reloadNonce, setReloadNonce] = useState(0);
  const [childrenReloadNonce, setChildrenReloadNonce] = useState(0);
  const [statusFilters, setStatusFilters] = useState<SiteIndexFilterStatus[]>([]);
  const [updateFilter, setUpdateFilter] = useState<SiteIndexFilterUpdate | null>(null);
  const {
    view: selectedProject,
    query: searchQuery,
    setQuery: setSearchQuery,
    debouncedQuery: debouncedSearch,
    hasHydratedQuery,
    handleViewChange
  } = useIndexViewState({ basePath: "/site", allProjectsValue: ALL_PROJECTS_VIEW, onViewChange: clearSelection });

  const hasActiveSearch = searchQuery.trim() !== "";
  const hasAppliedFilters = statusFilters.length > 0 || updateFilter != null;
  const hasActiveFilters = hasActiveSearch || hasAppliedFilters;
  const filtering = searchQuery.trim() !== debouncedSearch;
  const { loading, hasMore, viewProjects, projects, totalSiteCount, onProjectOpened, error, childrenPending } =
    useSiteIndexData({
      reloadNonce,
      childrenReloadNonce,
      search: debouncedSearch,
      projectUuid: selectedProject === ALL_PROJECTS_VIEW ? undefined : selectedProject,
      enabled: hasHydratedQuery,
      loadAllChildren: debouncedSearch !== "" || hasAppliedFilters
    });
  const accordionOpenResetKey = `${selectedProject}:${debouncedSearch}:${statusFilters.join(",")}:${
    updateFilter ?? ""
  }`;

  const visibleProjects = useMemo(() => {
    const scopedProjects = projects.filter(
      project => selectedProject === ALL_PROJECTS_VIEW || project.id === selectedProject
    );

    if (!hasActiveFilters) return scopedProjects;

    // A project only appears once its sites have loaded and been matched, so it doesn't vanish later.
    return scopedProjects.filter(
      project =>
        project.sitesLoaded &&
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
          <IndexLoadingRow label={t("Loading sites...")} minHeight="15rem" />
        ) : error ? (
          <NoResults title={t("Sites could not be loaded")} description={t("Please refresh the page and try again.")} />
        ) : visibleProjects.length === 0 && !hasMore && !childrenPending ? (
          <NoResults
            title={t("No sites found")}
            description={
              hasActiveSearch
                ? t("We couldn’t find any sites matching your search. Try a different keyword.")
                : hasAppliedFilters
                ? t("We couldn’t find any sites matching your filters. Try adjusting or clearing your filters.")
                : t("No sites have been added yet.")
            }
          />
        ) : (
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
              />
            ))}
            {hasMore || childrenPending ? <IndexLoadingRow label={t("Loading...")} /> : null}
          </div>
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
