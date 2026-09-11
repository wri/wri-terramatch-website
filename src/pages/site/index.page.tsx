import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";

import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import PageHeader from "@/redesignComponents/content/headers/PageHeaders/PageHeader";
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
          const matchesStatus = statusFilters.length === 0 || statusFilters.some(filter => site.status === filter);
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
                autocomplete
                width="100%"
                label={t("View:")}
                items={[
                  { label: t("All"), value: ALL_PROJECTS_VIEW },
                  ...projects.map(project => ({ label: project.name, value: project.id }))
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
              disabled={projects.length === 0}
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
          count: visibleSiteCount
        }}
        selectedFilters={selectedFilters}
        onClickFilterButton={() => setIsFilterDrawerOpen(true)}
        onClearFilters={clearFilters}
        showClearFilters={selectedFilters.length > 0}
      />

      <PageContent heightFull={false} className="bg-theme-neutral-200 !gap-0 px-2 pb-9 pt-1">
        {loading ? (
          <Flex minHeight="15rem" alignItems="center" justifyContent="center" gap={3}>
            <LoadingIcon boxSize={6} className="animate-spin" color="primary.700" />
            <Text textStyle="400" color="neutral.800">
              {t("Loading sites...")}
            </Text>
          </Flex>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {visibleProjects.map((project, index) => (
                <SiteProjectSection
                  key={`${selectedProject}:${project.id}`}
                  project={project}
                  sites={project.sites}
                  totalSiteCount={project.totalSiteCount}
                  isFiltered={hasActiveFilters}
                  defaultOpen={index === 0}
                />
              ))}
            </div>

            {visibleProjects.length === 0 ? (
              <Box background="neutral.100" h="full" p={4}>
                <Text textStyle="400-bold">{t("No sites found")}</Text>
                <Text textStyle="400">
                  {hasActiveFilters
                    ? t("No sites match the current search and filters.")
                    : t("No sites have been added yet.")}
                </Text>
              </Box>
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
