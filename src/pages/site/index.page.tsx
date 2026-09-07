import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";

import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import PageHeader from "@/redesignComponents/content/headers/PageHeaders/PageHeader";
import HighLevelSelector from "@/redesignComponents/Forms/Inputs/HighLevelSelector/HighLevelSelector";
import { PlusIcon, SiteIcon } from "@/redesignComponents/foundations/Icons";
import { SelectedFilter } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";
import ToolbarObject from "@/redesignComponents/navigation/Toolbar/ToolbarObject";
import ToolbarTable from "@/redesignComponents/navigation/Toolbar/ToolbarTable/ToolbarTable";

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
import { useSiteIndexData } from "./components/useSiteIndexData";

const SiteIndexPageContent = () => {
  const t = useT();
  const router = useRouter();
  const { clearSelection } = useSiteIndexSelectionActions();
  const [reloadNonce, setReloadNonce] = useState(0);
  const { loading, projects } = useSiteIndexData(reloadNonce);
  const [selectedProject, setSelectedProject] = useState(ALL_PROJECTS_VIEW);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilters, setStatusFilters] = useState<SiteIndexFilterStatus[]>([]);
  const [updateFilter, setUpdateFilter] = useState<SiteIndexFilterUpdate | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const visibleProjects = useMemo(() => {
    const normalisedQuery = searchQuery.trim().toLowerCase();

    return projects
      .filter(project => selectedProject === ALL_PROJECTS_VIEW || project.id === selectedProject)
      .map(project => ({
        ...project,
        totalSiteCount: project.sites.length,
        sites: project.sites.filter(site => {
          const matchesSearch = normalisedQuery.length === 0 || site.name.toLowerCase().includes(normalisedQuery);
          const matchesStatus =
            statusFilters.length === 0 ||
            statusFilters.some(filter =>
              filter === "not-started" ? site.plantingStatus === "not-started" : site.status === filter
            );
          const matchesUpdate = updateFilter == null || site.update === updateFilter;

          return matchesSearch && matchesStatus && matchesUpdate;
        })
      }))
      .filter(
        project =>
          project.sites.length > 0 ||
          (normalisedQuery.length === 0 && statusFilters.length === 0 && updateFilter == null)
      );
  }, [projects, searchQuery, selectedProject, statusFilters, updateFilter]);

  const visibleSiteCount = visibleProjects.reduce((total, project) => total + project.sites.length, 0);
  const hasActiveSearch = searchQuery.trim().length > 0;
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
  const hasActiveFilters = hasActiveSearch || selectedFilters.length > 0;

  const handleSitesChanged = useCallback(() => setReloadNonce(current => current + 1), []);

  const handleViewChange = useCallback(
    (nextView: string) => {
      clearSelection();
      setSelectedProject(nextView);
    },
    [clearSelection]
  );

  const handleAddSite = useCallback(() => {
    const targetProject = projects.find(project => project.id === selectedProject);
    if (targetProject == null) {
      return;
    }

    void router.push(getSiteCreateUrl(targetProject));
  }, [projects, router, selectedProject]);

  const canAddSite = selectedProject !== ALL_PROJECTS_VIEW;

  const clearFilters = useCallback(() => {
    setStatusFilters([]);
    setUpdateFilter(null);
  }, []);

  return (
    <>
      <Head>
        <title>{t("Sites")}</title>
      </Head>

      <Box className="flex min-h-full flex-1 flex-col bg-white">
        <ToolbarObject
          className="shadow-sm sticky top-0 z-10 h-10 bg-theme-neutral-100 "
          breadcrumbs={{
            links: [{ label: t("Sites"), link: "/site", icon: <SiteIcon /> }],
            linkRouter: router
          }}
        />

        <Box className="sticky top-10 z-10 flex min-h-[60px] flex-wrap items-stretch bg-theme-neutral-100">
          <Box className="min-w-[240px] flex-1">
            <PageHeader title={t("Sites")} className="!bg-theme-neutral-100" />
          </Box>
          <Box className="flex min-w-[320px] items-stretch mobile:order-3 mobile:w-full">
            <HighLevelSelector
              className="w-full"
              width="100%"
              label={t("View:")}
              items={[
                { label: t("All"), value: ALL_PROJECTS_VIEW },
                ...projects.map(project => ({ label: project.name, value: project.id }))
              ]}
              value={selectedProject}
              onChange={handleViewChange}
            />
          </Box>
          <Box className="flex items-center px-6 mobile:px-3">
            <Button size="small" leftIcon={<PlusIcon />} disabled={!canAddSite} onClick={handleAddSite}>
              {t("Add Site")}
            </Button>
          </Box>
        </Box>

        <ToolbarTable
          className="border-b border-theme-neutral-200 !px-6 py-5"
          classNameContentLeft="w-full"
          search={{
            label: visibleSiteCount === 1 ? t("Site") : t("Sites"),
            placeholder: t("Search sites"),
            options: [],
            displayResults: "none",
            onQueryChange: setSearchQuery,
            count: visibleSiteCount
          }}
          selectedFilters={selectedFilters}
          onClickFilterButton={() => setIsFilterDrawerOpen(true)}
          onClearFilters={clearFilters}
          showClearFilters={selectedFilters.length > 0}
        />

        <Box as="main" className="flex-1 px-2 pb-8 pt-1">
          <LoadingContainer loading={loading}>
            {visibleProjects.map((project, index) => (
              <SiteProjectSection
                key={project.id}
                project={project}
                sites={project.sites}
                totalSiteCount={project.totalSiteCount}
                isFiltered={hasActiveFilters}
                defaultOpen={index === 0}
                onSitesChanged={handleSitesChanged}
              />
            ))}

            {!loading && visibleProjects.length === 0 ? (
              <Box className="mx-4 my-12 rounded-lg border border-dashed border-theme-neutral-400 p-8 text-center text-theme-neutral-700">
                {hasActiveFilters
                  ? t("No sites match the current search and filters.")
                  : t("No sites have been added yet.")}
              </Box>
            ) : null}
          </LoadingContainer>
          <SiteIndexBulkBar onSitesChanged={handleSitesChanged} />
        </Box>

        <PageFooter />
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
      </Box>
    </>
  );
};

const SiteIndexPage = () => (
  <SiteIndexSelectionProvider>
    <SiteIndexPageContent />
  </SiteIndexSelectionProvider>
);

export default SiteIndexPage;
