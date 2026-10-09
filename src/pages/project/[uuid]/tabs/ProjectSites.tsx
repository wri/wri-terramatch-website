import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { toFramework } from "@/context/framework.provider";
import type { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { filterSiteIndexSites, getSiteCreateUrl } from "@/pages/site/components/siteIndex.utils";
import SiteIndexBulkBar from "@/pages/site/components/SiteIndexBulkBar";
import { type SiteIndexFilterStatus, type SiteIndexFilterUpdate } from "@/pages/site/components/SiteIndexFilterDrawer";
import SiteIndexHeader from "@/pages/site/components/SiteIndexHeader";
import SiteIndexSelectionProvider, {
  useSiteIndexSelectionActions
} from "@/pages/site/components/SiteIndexSelection.provider";
import SiteProjectSection from "@/pages/site/components/SiteProjectSection";
import { SEARCH_DEBOUNCE_MS, useSiteIndexData } from "@/pages/site/components/useSiteIndexData";
import NoResults from "@/redesignComponents/content/NoResults/NoResults";
import { LoadingIcon } from "@/redesignComponents/foundations/Icons";

type ProjectSitesTabProps = {
  project: ProjectFullDto;
};

const ProjectSitesTabContent: FC<ProjectSitesTabProps> = ({ project }) => {
  const t = useT();
  const router = useRouter();
  const [reloadNonce, setReloadNonce] = useState(0);
  const [childrenReloadNonce, setChildrenReloadNonce] = useState(0);
  const { clearSelection } = useSiteIndexSelectionActions();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilters, setStatusFilters] = useState<SiteIndexFilterStatus[]>([]);
  const [updateFilter, setUpdateFilter] = useState<SiteIndexFilterUpdate | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedSearch(searchQuery.trim()), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timeoutId);
  }, [searchQuery]);

  const hasActiveSearch = searchQuery.trim().length > 0;
  const hasAppliedFilters = statusFilters.length > 0 || updateFilter != null;
  const hasActiveFilters = hasActiveSearch || hasAppliedFilters;
  const filtering = searchQuery.trim() !== debouncedSearch;

  const { loading, projects, totalSiteCount, onProjectOpened, error } = useSiteIndexData({
    reloadNonce,
    childrenReloadNonce,
    search: debouncedSearch,
    projectUuid: project.uuid,
    enabled: true
  });

  const siteProject = projects[0];

  const visibleSites = useMemo(() => {
    if (siteProject == null) return [];
    return filterSiteIndexSites(siteProject.sites, {
      search: debouncedSearch,
      statusFilters,
      updateFilter
    });
  }, [debouncedSearch, siteProject, statusFilters, updateFilter]);

  const siteCount = useMemo(() => {
    if (!hasActiveFilters) return totalSiteCount;
    if (siteProject != null && !siteProject.sitesLoaded) return totalSiteCount;
    return visibleSites.length;
  }, [hasActiveFilters, siteProject, totalSiteCount, visibleSites.length]);

  const handleSitesChanged = useCallback(() => setReloadNonce(current => current + 1), []);

  const handleApplyFilters = useCallback(
    (nextStatusFilters: SiteIndexFilterStatus[], nextUpdateFilter: SiteIndexFilterUpdate | null) => {
      clearSelection();
      setStatusFilters(nextStatusFilters);
      setUpdateFilter(nextUpdateFilter);
      if (nextStatusFilters.length > 0 || nextUpdateFilter != null) {
        setChildrenReloadNonce(current => current + 1);
      }
    },
    [clearSelection]
  );

  const handleAddSite = useCallback(() => {
    if (project.frameworkKey == null) return;
    void router.push(
      getSiteCreateUrl({
        id: project.uuid,
        frameworkKey: toFramework(project.frameworkKey)
      })
    );
  }, [project.frameworkKey, project.uuid, router]);

  const showEmptyProject =
    siteProject != null && siteProject.sitesLoaded && visibleSites.length === 0 && !hasActiveFilters;

  const showEmptyFiltered =
    siteProject != null && siteProject.sitesLoaded && visibleSites.length === 0 && hasActiveFilters;

  return (
    <div className="flex w-full min-w-0 flex-1 flex-col">
      <SiteIndexHeader
        embeddedInProject
        addSiteDisabled={project.frameworkKey == null}
        siteCount={siteCount}
        selectedProject={project.uuid}
        viewProjects={[]}
        statusFilters={statusFilters}
        updateFilter={updateFilter}
        filtering={filtering}
        onApplyFilters={handleApplyFilters}
        onViewChange={() => undefined}
        onAddSite={handleAddSite}
        onQueryChange={setSearchQuery}
      />
      <PageContent className={twMerge("h-auto flex-1 bg-theme-neutral-100 px-2 pt-0 pb-8")}>
        {loading ? (
          <Flex minHeight="15rem" alignItems="center" justifyContent="center" gap={3}>
            <LoadingIcon boxSize={6} className="animate-spin" color="primary.700" />
            <Text textStyle="400" color="neutral.800">
              {t("Loading sites...")}
            </Text>
          </Flex>
        ) : error ? (
          <NoResults title={t("Sites could not be loaded")} description={t("Please refresh the page and try again.")} />
        ) : siteProject == null || showEmptyProject ? (
          <NoResults
            title={t("No sites found")}
            description={
              hasActiveFilters
                ? t("Try changing your search or filters.")
                : t("There are no sites available for this project view.")
            }
          />
        ) : showEmptyFiltered ? (
          <NoResults
            title={t("No sites found")}
            description={
              hasActiveSearch
                ? t("We couldn’t find any sites matching your search. Try a different keyword.")
                : t("We couldn’t find any sites matching your filters. Try adjusting or clearing your filters.")
            }
          />
        ) : (
          <SiteProjectSection
            embeddedInProject
            project={siteProject}
            sites={siteProject.sites}
            totalSiteCount={siteProject.sites.length}
            isFiltered={hasActiveFilters}
            searchQuery={debouncedSearch}
            statusFilters={statusFilters}
            updateFilter={updateFilter}
            defaultOpen
            openResetKey={`${project.uuid}:${debouncedSearch}:${statusFilters.join(",")}:${updateFilter ?? ""}`}
            onProjectOpened={onProjectOpened}
          />
        )}
        <SiteIndexBulkBar onSitesChanged={handleSitesChanged} />
      </PageContent>
    </div>
  );
};

const ProjectSitesTab: FC<ProjectSitesTabProps> = ({ project }) => (
  <SiteIndexSelectionProvider>
    <ProjectSitesTabContent project={project} />
  </SiteIndexSelectionProvider>
);

export default ProjectSitesTab;
