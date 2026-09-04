import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";
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
  type SiteIndexFilterUpdate,
  SITE_INDEX_STATUS_OPTIONS,
  SITE_INDEX_UPDATE_OPTIONS
} from "./components/SiteIndexFilterDrawer";
import { type SiteIndexProject, type SiteIndexSite, siteIndexProjects } from "./components/siteIndexMockData";
import SiteIndexModals from "./components/SiteIndexModals";
import SiteProjectSection from "./components/SiteProjectSection";

const ALL_PROJECTS = "all";

const cloneSiteIndexProjects = (): SiteIndexProject[] =>
  siteIndexProjects.map(project => ({
    ...project,
    sites: project.sites.map(site => ({ ...site }))
  }));

const SiteIndexPage = () => {
  const t = useT();
  const router = useRouter();
  const [projects, setProjects] = useState<SiteIndexProject[]>(cloneSiteIndexProjects);
  const [selectedProject, setSelectedProject] = useState(ALL_PROJECTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilters, setStatusFilters] = useState<SiteIndexFilterStatus[]>([]);
  const [updateFilter, setUpdateFilter] = useState<SiteIndexFilterUpdate | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [searchResetKey, setSearchResetKey] = useState(0);
  const [selectedSiteIds, setSelectedSiteIds] = useState<Set<string>>(new Set());
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openSubmitModal, setOpenSubmitModal] = useState(false);
  const [openSubmittedModal, setOpenSubmittedModal] = useState(false);
  const [submittedSiteNames, setSubmittedSiteNames] = useState<string[]>([]);

  const selectedSites = useMemo(
    () => projects.flatMap(project => project.sites).filter(site => selectedSiteIds.has(site.id)),
    [projects, selectedSiteIds]
  );

  const visibleProjects = useMemo(() => {
    const normalisedQuery = searchQuery.trim().toLowerCase();

    return projects
      .filter(project => selectedProject === ALL_PROJECTS || project.id === selectedProject)
      .map(project => ({
        ...project,
        totalSiteCount: project.sites.length,
        sites: project.sites.filter(site => {
          const matchesSearch = normalisedQuery.length === 0 || site.name.toLowerCase().includes(normalisedQuery);
          const matchesStatus =
            statusFilters.length === 0 || statusFilters.includes(site.status as SiteIndexFilterStatus);
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
  const hasActiveFilters = searchQuery.trim().length > 0 || statusFilters.length > 0 || updateFilter != null;

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

  const handleDeleteSites = useCallback(() => {
    setProjects(current =>
      current.map(project => ({
        ...project,
        sites: project.sites.filter(site => !selectedSiteIds.has(site.id))
      }))
    );
    clearSelection();
    showToast({
      label: t("Site Profile(s) deleted"),
      type: "success",
      placement: "bottom",
      duration: 5000
    });
  }, [clearSelection, selectedSiteIds, t]);

  const handleSubmitSites = useCallback(() => {
    const names = selectedSites.map(site => site.name);
    setProjects(current =>
      current.map(project => ({
        ...project,
        sites: project.sites.map(site =>
          selectedSiteIds.has(site.id) ? { ...site, status: "pending-approval", update: "pending-approval" } : site
        )
      }))
    );
    setSubmittedSiteNames(names);
    setOpenSubmittedModal(true);
    clearSelection();
  }, [clearSelection, selectedSiteIds, selectedSites]);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilters([]);
    setUpdateFilter(null);
    setSearchResetKey(current => current + 1);
  };

  return (
    <>
      <Head>
        <title>{t("Sites")}</title>
      </Head>

      <Box className="flex min-h-full flex-1 flex-col bg-white">
        <ToolbarObject
          className="shadow-sm bg-theme-neutral-100 sticky top-0 z-10 h-10 "
          breadcrumbs={{
            links: [{ label: t("Sites"), link: "/site", icon: <SiteIcon /> }],
            linkRouter: router
          }}
        />

        <Box className="bg-theme-neutral-100 sticky top-10 z-10 flex min-h-[60px] flex-wrap items-stretch">
          <Box className="min-w-[240px] flex-1">
            <PageHeader title={t("Sites")} className="!bg-theme-neutral-100" />
          </Box>
          <Box className="flex min-w-[320px] items-stretch mobile:order-3 mobile:w-full">
            <HighLevelSelector
              className="w-full"
              width="100%"
              label={t("View:")}
              items={[
                { label: t("All"), value: ALL_PROJECTS },
                ...projects.map(project => ({ label: project.name, value: project.id }))
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
          className="border-theme-neutral-200 border-b !px-6 py-5"
          classNameContentLeft="w-full"
          search={{
            label: visibleSiteCount === 1 ? t("Site") : t("Sites"),
            placeholder: t("Search sites"),
            options: [],
            resetKey: searchResetKey,
            displayResults: "none",
            onQueryChange: setSearchQuery,
            count: visibleSiteCount
          }}
          selectedFilters={[
            ...statusFilters.map(status => ({
              category: t("Status"),
              label: t(SITE_INDEX_STATUS_OPTIONS.find(option => option.value === status)?.label ?? status),
              onRemove: () => setStatusFilters(current => current.filter(currentStatus => currentStatus !== status))
            })),
            ...(updateFilter == null
              ? []
              : [
                  {
                    category: t("Updates"),
                    label: t(
                      SITE_INDEX_UPDATE_OPTIONS.find(option => option.value === updateFilter)?.label ?? updateFilter
                    ),
                    onRemove: () => setUpdateFilter(null)
                  }
                ])
          ]}
          onClickFilterButton={() => setIsFilterDrawerOpen(true)}
          onClearFilters={clearFilters}
          showClearFilters={hasActiveFilters}
        />

        <Box as="main" className={`flex-1 px-2 pt-1 ${selectedSiteIds.size > 0 ? "pb-24" : "pb-8"}`}>
          {visibleProjects.map((project, index) => (
            <SiteProjectSection
              key={project.id}
              project={project}
              sites={project.sites}
              totalSiteCount={project.totalSiteCount}
              selectedSiteIds={selectedSiteIds}
              onRowSelected={handleRowSelected}
              onAllItemsSelected={handleAllItemsSelected}
              isFiltered={hasActiveFilters}
              defaultOpen={index === 0}
            />
          ))}

          {visibleProjects.length === 0 ? (
            <Box className="border-theme-neutral-400 text-theme-neutral-700 mx-4 my-12 rounded-lg border border-dashed p-8 text-center">
              {t("No sites match the current search and filters.")}
            </Box>
          ) : null}
        </Box>

        <PageFooter />
        <SiteIndexBulkActionToolbar
          selectedSites={selectedSites}
          onCancel={clearSelection}
          onDelete={() => setOpenDeleteModal(true)}
          onSubmit={() => setOpenSubmitModal(true)}
        />
        <SiteIndexModals
          selectedSites={selectedSites}
          submittedSiteNames={submittedSiteNames}
          openDeleteModal={openDeleteModal}
          openSubmitModal={openSubmitModal}
          openSubmittedModal={openSubmittedModal}
          onDeleteModalOpenChange={setOpenDeleteModal}
          onSubmitModalOpenChange={setOpenSubmitModal}
          onSubmittedModalOpenChange={setOpenSubmittedModal}
          onDelete={handleDeleteSites}
          onSubmit={handleSubmitSites}
        />
        <SiteIndexFilterDrawer
          open={isFilterDrawerOpen}
          filters={statusFilters}
          updateFilter={updateFilter}
          onOpenChange={setIsFilterDrawerOpen}
          onApplyFilters={(nextStatusFilters, nextUpdateFilter) => {
            setStatusFilters(nextStatusFilters);
            setUpdateFilter(nextUpdateFilter);
          }}
          onClearFilters={() => {
            setStatusFilters([]);
            setUpdateFilter(null);
          }}
        />
      </Box>
    </>
  );
};

export default SiteIndexPage;
