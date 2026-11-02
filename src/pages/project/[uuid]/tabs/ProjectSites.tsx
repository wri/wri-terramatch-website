import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { toFramework } from "@/context/framework.provider";
import type { ProjectFullDto, ProjectSitesMetaDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { INDEX_SEARCH_DEBOUNCE_MS } from "@/hooks/useIndexViewState";
import { getSiteCreateUrl } from "@/pages/site/components/siteIndex.utils";
import SiteIndexBulkBar from "@/pages/site/components/SiteIndexBulkBar";
import { type SiteIndexFilterStatus, type SiteIndexFilterUpdate } from "@/pages/site/components/SiteIndexFilterDrawer";
import SiteIndexHeader from "@/pages/site/components/SiteIndexHeader";
import SiteIndexSelectionProvider, {
  useSiteIndexSelectionActions
} from "@/pages/site/components/SiteIndexSelection.provider";
import { SiteProjectBody } from "@/pages/site/components/SiteProjectSection";
import { useSiteIndexData } from "@/pages/site/components/useSiteIndexData";
import { useSiteProjectRows } from "@/pages/site/components/useSiteProjectRows";
import NoResults from "@/redesignComponents/content/NoResults/NoResults";
import { LoadingIcon } from "@/redesignComponents/foundations/Icons";

type ProjectSitesTabProps = {
  project: ProjectFullDto;
};

const ProjectSitesBody: FC<{
  meta: ProjectSitesMetaDto;
  search: string;
  statusFilters: SiteIndexFilterStatus[];
  updateFilters: SiteIndexFilterUpdate[];
  isFiltered: boolean;
}> = ({ meta, search, statusFilters, updateFilters, isFiltered }) => {
  const filters = useMemo(() => ({ search, statusFilters, updateFilters }), [search, statusFilters, updateFilters]);
  const sites = useSiteProjectRows(meta, filters, true);
  return (
    <SiteProjectBody
      frameworkKey={toFramework(meta.frameworkKey)}
      meta={meta}
      sites={sites}
      isFiltered={isFiltered}
      embeddedInProject
    />
  );
};

const ProjectSitesTabContent: FC<ProjectSitesTabProps> = ({ project }) => {
  const t = useT();
  const router = useRouter();
  const [reloadNonce, setReloadNonce] = useState(0);
  const { clearSelection } = useSiteIndexSelectionActions();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilters, setStatusFilters] = useState<SiteIndexFilterStatus[]>([]);
  const [updateFilters, setUpdateFilters] = useState<SiteIndexFilterUpdate[]>([]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedSearch(searchQuery.trim()), INDEX_SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timeoutId);
  }, [searchQuery]);

  const hasActiveSearch = searchQuery.trim().length > 0;
  const hasAppliedFilters = statusFilters.length > 0 || updateFilters.length > 0;
  const hasActiveFilters = hasActiveSearch || hasAppliedFilters;
  const filtering = searchQuery.trim() !== debouncedSearch;

  const { loading, error, metas, siteTotal } = useSiteIndexData({
    search: debouncedSearch,
    statusFilters,
    updateFilters,
    projectUuid: project.uuid,
    enabled: true,
    reloadNonce
  });
  const meta = metas[0];

  const handleSitesChanged = useCallback(() => setReloadNonce(current => current + 1), []);

  const handleApplyFilters = useCallback(
    (nextStatusFilters: SiteIndexFilterStatus[], nextUpdateFilters: SiteIndexFilterUpdate[]) => {
      clearSelection();
      setStatusFilters(nextStatusFilters);
      setUpdateFilters(nextUpdateFilters);
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

  return (
    <div className="flex w-full min-w-0 flex-1 flex-col">
      <SiteIndexHeader
        embeddedInProject
        addSiteDisabled={project.frameworkKey == null}
        siteCount={siteTotal}
        selectedProject={project.uuid}
        viewProjects={[]}
        statusFilters={statusFilters}
        updateFilters={updateFilters}
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
        ) : meta == null ? (
          <NoResults
            title={t("No sites found")}
            description={
              hasActiveFilters
                ? t("Try changing your search or filters.")
                : t("There are no sites available for this project view.")
            }
          />
        ) : (
          <ProjectSitesBody
            meta={meta}
            search={debouncedSearch}
            statusFilters={statusFilters}
            updateFilters={updateFilters}
            isFiltered={hasActiveFilters}
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
