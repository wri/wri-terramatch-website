import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";

import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import PageHeader from "@/redesignComponents/content/headers/PageHeaders/PageHeader";
import HighLevelSelector from "@/redesignComponents/Forms/Inputs/HighLevelSelector/HighLevelSelector";
import { PlusIcon, SiteIcon } from "@/redesignComponents/foundations/Icons";
import ToolbarObject from "@/redesignComponents/navigation/Toolbar/ToolbarObject";
import ToolbarTable from "@/redesignComponents/navigation/Toolbar/ToolbarTable/ToolbarTable";

import SiteIndexBulkActionToolbar from "./components/SiteIndexBulkActionToolbar";
import SiteIndexFilterDrawer, {
  type SiteIndexFilterStatus,
  SITE_INDEX_STATUS_OPTIONS
} from "./components/SiteIndexFilterDrawer";
import { type SiteIndexSite, siteIndexProjects } from "./components/siteIndexMockData";
import SiteProjectSection from "./components/SiteProjectSection";

const ALL_PROJECTS = "all";

const SiteIndexPage = () => {
  const t = useT();
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState(ALL_PROJECTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilters, setStatusFilters] = useState<SiteIndexFilterStatus[]>([]);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [searchResetKey, setSearchResetKey] = useState(0);
  const [selectedSiteIds, setSelectedSiteIds] = useState<Set<string>>(new Set());

  const visibleProjects = useMemo(() => {
    const normalisedQuery = searchQuery.trim().toLowerCase();

    return siteIndexProjects
      .filter(project => selectedProject === ALL_PROJECTS || project.id === selectedProject)
      .map(project => ({
        ...project,
        sites: project.sites.filter(site => {
          const matchesSearch = normalisedQuery.length === 0 || site.name.toLowerCase().includes(normalisedQuery);
          const matchesStatus =
            statusFilters.length === 0 || statusFilters.includes(site.status as SiteIndexFilterStatus);

          return matchesSearch && matchesStatus;
        })
      }))
      .filter(project => project.sites.length > 0 || (normalisedQuery.length === 0 && statusFilters.length === 0));
  }, [searchQuery, selectedProject, statusFilters]);

  const visibleSiteCount = visibleProjects.reduce((total, project) => total + project.sites.length, 0);

  const handleRowSelected = useCallback((site: SiteIndexSite, checked: boolean) => {
    setSelectedSiteIds(current => {
      const next = new Set(current);
      checked ? next.add(site.id) : next.delete(site.id);
      return next;
    });
  }, []);

  const handleAllItemsSelected = useCallback((checked: boolean, visibleSites: SiteIndexSite[]) => {
    setSelectedSiteIds(current => {
      const next = new Set(current);
      visibleSites.forEach(site => (checked ? next.add(site.id) : next.delete(site.id)));
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedSiteIds(new Set()), []);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilters([]);
    setSearchResetKey(current => current + 1);
  };

  return (
    <>
      <Head>
        <title>{t("Sites")}</title>
      </Head>

      <Box className="flex min-h-full flex-1 flex-col bg-white">
        <ToolbarObject
          className="border-b border-theme-neutral-300"
          breadcrumbs={{
            links: [{ label: t("Sites"), link: "/site", icon: <SiteIcon /> }],
            linkRouter: router
          }}
        />

        <Box className="flex min-h-[60px] flex-wrap items-stretch bg-white">
          <Box className="min-w-[240px] flex-1">
            <PageHeader title={t("Sites")} />
          </Box>
          <Box className="flex min-w-[320px] items-stretch mobile:order-3 mobile:w-full">
            <HighLevelSelector
              className="w-full"
              width="100%"
              label={t("View:")}
              items={[
                { label: t("All"), value: ALL_PROJECTS },
                ...siteIndexProjects.map(project => ({ label: project.name, value: project.id }))
              ]}
              value={selectedProject}
              onChange={setSelectedProject}
            />
          </Box>
          <Box className="flex items-center px-6 mobile:px-3">
            <Button size="small" leftIcon={<PlusIcon />} onClick={() => {}}>
              {t("Add Site")}
            </Button>
          </Box>
        </Box>

        <ToolbarTable
          className="border-b border-theme-neutral-200 !px-6 py-5"
          search={{
            label: visibleSiteCount === 1 ? t("Site") : t("Sites"),
            placeholder: t("Search sites"),
            options: [],
            resetKey: searchResetKey,
            displayResults: "none",
            onQueryChange: setSearchQuery,
            count: visibleSiteCount
          }}
          selectedFilters={statusFilters.map(status => ({
            category: t("Status"),
            label: t(SITE_INDEX_STATUS_OPTIONS.find(option => option.value === status)?.label ?? status),
            onRemove: () => setStatusFilters(current => current.filter(currentStatus => currentStatus !== status))
          }))}
          onClickFilterButton={() => setIsFilterDrawerOpen(true)}
          onClearFilters={clearFilters}
          showClearFilters={searchQuery.length > 0 || statusFilters.length > 0}
        />

        <Box as="main" className={`flex-1 overflow-x-hidden px-2 pt-1 ${selectedSiteIds.size > 0 ? "pb-24" : "pb-8"}`}>
          {visibleProjects.map((project, index) => (
            <SiteProjectSection
              key={project.id}
              project={project}
              sites={project.sites}
              selectedSiteIds={selectedSiteIds}
              onRowSelected={handleRowSelected}
              onAllItemsSelected={handleAllItemsSelected}
              defaultOpen={index === 0}
            />
          ))}

          {visibleProjects.length === 0 ? (
            <Box className="mx-4 my-12 rounded-lg border border-dashed border-theme-neutral-400 p-8 text-center text-theme-neutral-700">
              {t("No sites match the current search and filters.")}
            </Box>
          ) : null}
        </Box>

        <PageFooter />
        <SiteIndexBulkActionToolbar selectedCount={selectedSiteIds.size} onCancel={clearSelection} />
        <SiteIndexFilterDrawer
          open={isFilterDrawerOpen}
          filters={statusFilters}
          onOpenChange={setIsFilterDrawerOpen}
          onApplyFilters={setStatusFilters}
          onClearFilters={() => setStatusFilters([])}
        />
      </Box>
    </>
  );
};

export default SiteIndexPage;
