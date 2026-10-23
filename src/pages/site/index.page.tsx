import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC, useCallback, useMemo, useState } from "react";

import IndexLoadingRow from "@/components/extensive/EntityIndex/IndexLoadingRow";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { useIndexViewState } from "@/hooks/useIndexViewState";
import { InfiniteScrollSentinel } from "@/hooks/useInfiniteScrollSentinel";
import NoResults from "@/redesignComponents/content/NoResults/NoResults";
import { showToast } from "@/redesignComponents/status/Toast/showToast";
import ResponsiveTypography from "@/styles/ResponsiveTypography";

import { ALL_PROJECTS_VIEW, getSiteCreateUrl } from "./components/siteIndex.utils";
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
  const [viewMenuOpened, setViewMenuOpened] = useState(false);
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
  const { loading, error, metas, projects, siteTotal, hasMore, loadingMore, loadMore } = useSiteIndexData({
    search: debouncedSearch,
    statusFilters,
    updateFilter,
    projectUuid: selectedProject === ALL_PROJECTS_VIEW ? undefined : selectedProject,
    enabled: hasHydratedQuery,
    catalogRequested: viewMenuOpened,
    reloadNonce
  });
  const accordionOpenResetKey = `${selectedProject}:${debouncedSearch}:${statusFilters.join(",")}:${
    updateFilter ?? ""
  }`;
  const sectionFilters = useMemo(
    () => ({ search: debouncedSearch, statusFilters, updateFilter }),
    [debouncedSearch, statusFilters, updateFilter]
  );

  const handleSitesChanged = useCallback(() => setReloadNonce(current => current + 1), []);

  const handleAddSite = useCallback(() => {
    const targetProject = projects.find(project => project.id === selectedProject);
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
  }, [projects, router, selectedProject, t]);

  const handleApplyFilters = useCallback(
    (nextStatusFilters: SiteIndexFilterStatus[], nextUpdateFilter: SiteIndexFilterUpdate | null) => {
      setStatusFilters(nextStatusFilters);
      setUpdateFilter(nextUpdateFilter);
    },
    []
  );

  return (
    <>
      <ResponsiveTypography />
      <SiteIndexHeader
        siteCount={siteTotal}
        selectedProject={selectedProject}
        viewProjects={projects}
        statusFilters={statusFilters}
        updateFilter={updateFilter}
        filtering={filtering}
        onApplyFilters={handleApplyFilters}
        onViewChange={handleViewChange}
        onViewOpenChange={open => open && setViewMenuOpened(true)}
        onAddSite={handleAddSite}
        onQueryChange={setSearchQuery}
      />

      <PageContent className="h-auto flex-1 px-2 py-0">
        {loading ? (
          <IndexLoadingRow label={t("Loading sites...")} minHeight="15rem" />
        ) : error ? (
          <NoResults title={t("Sites could not be loaded")} description={t("Please refresh the page and try again.")} />
        ) : metas.length === 0 && !hasMore ? (
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
            {metas.map((meta, index) => (
              <SiteProjectSection
                key={`${selectedProject}-${meta.uuid}`}
                meta={meta}
                filters={sectionFilters}
                isFiltered={hasActiveFilters}
                defaultOpen={index === 0}
                openResetKey={accordionOpenResetKey}
              />
            ))}
            <InfiniteScrollSentinel
              hasMore={hasMore}
              loading={loading}
              loadingMore={loadingMore}
              label={t("Loading...")}
              resetKey={metas.length}
              onLoadMore={loadMore}
            />
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
