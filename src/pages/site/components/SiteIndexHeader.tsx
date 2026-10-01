import { Box, Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC, useMemo, useState } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import PageHeader from "@/redesignComponents/content/headers/PageHeaders/PageHeader";
import HighLevelSelector from "@/redesignComponents/Forms/Inputs/HighLevelSelector/HighLevelSelector";
import { PlusIcon, SiteIcon } from "@/redesignComponents/foundations/Icons";
import type { SelectedFilter } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";
import ToolbarObject from "@/redesignComponents/navigation/Toolbar/ToolbarObject";
import ToolbarTable from "@/redesignComponents/navigation/Toolbar/ToolbarTable/ToolbarTable";

import type { SiteIndexProject } from "./siteIndex.types";
import { ALL_PROJECTS_VIEW } from "./siteIndex.utils";
import SiteIndexFilterDrawer, {
  type SiteIndexFilterStatus,
  type SiteIndexFilterUpdate,
  SITE_INDEX_STATUS_OPTIONS,
  SITE_INDEX_UPDATE_OPTIONS
} from "./SiteIndexFilterDrawer";

type SiteIndexHeaderProps = {
  siteCount: number;
  selectedProject: string;
  viewProjects: SiteIndexProject[];
  statusFilters: SiteIndexFilterStatus[];
  updateFilter: SiteIndexFilterUpdate | null;
  filtering: boolean;
  onApplyFilters: (statusFilters: SiteIndexFilterStatus[], updateFilter: SiteIndexFilterUpdate | null) => void;
  onViewChange: (value: string) => void;
  onAddSite: () => void;
  onQueryChange: (query: string) => void;
  embeddedInProject?: boolean;
  addSiteDisabled?: boolean;
};

const SiteIndexHeader: FC<SiteIndexHeaderProps> = ({
  siteCount,
  selectedProject,
  viewProjects,
  statusFilters,
  updateFilter,
  filtering,
  onApplyFilters,
  onViewChange,
  onAddSite,
  onQueryChange,
  embeddedInProject = false,
  addSiteDisabled = false
}) => {
  const t = useT();
  const router = useRouter();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const selectedFilters = useMemo<SelectedFilter[]>(
    () => [
      ...(statusFilters.length === 0
        ? []
        : [
            {
              category: t("Status"),
              label: statusFilters.map(status =>
                t(SITE_INDEX_STATUS_OPTIONS.find(option => option.value === status)?.label ?? status)
              ),
              onRemove: () => onApplyFilters([], updateFilter)
            }
          ]),
      ...(updateFilter == null
        ? []
        : [
            {
              category: t("Update"),
              label: [
                t(SITE_INDEX_UPDATE_OPTIONS.find(option => option.value === updateFilter)?.label ?? updateFilter)
              ],
              onRemove: () => onApplyFilters(statusFilters, null)
            }
          ])
    ],
    [onApplyFilters, statusFilters, t, updateFilter]
  );

  const addSiteButton = {
    children: t("Add Site"),
    leftIcon: <PlusIcon boxSize="0.625rem" />,
    disabled: addSiteDisabled,
    className: embeddedInProject ? "shrink-0 whitespace-nowrap" : "mobile:w-full",
    onClick: onAddSite
  };

  return (
    <>
      {embeddedInProject ? null : (
        <>
          <ToolbarObject
            className="sticky top-0 z-20 !px-6"
            breadcrumbs={{
              linkRouter: router,
              links: [
                {
                  icon: <SiteIcon />,
                  label: t("Sites"),
                  link: "/site"
                }
              ]
            }}
          />
          <PageHeader
            title={t("Sites")}
            className=" !bg-theme-neutral-100 !pb-0 !pt-1 mobile:flex-col mobile:items-start mobile:gap-4"
            classNameActions="mobile:w-full"
            actions={
              <Flex gap="0.5rem" alignItems="center" className="mobile:w-full mobile:flex-col mobile:items-stretch">
                <Box className="w-[25rem] mobile:w-full">
                  <HighLevelSelector
                    key={
                      selectedProject === ALL_PROJECTS_VIEW
                        ? ALL_PROJECTS_VIEW
                        : `${selectedProject}:${
                            viewProjects.find(project => project.id === selectedProject)?.name ?? ""
                          }`
                    }
                    autocomplete
                    width="100%"
                    label={t("View:")}
                    items={[
                      { label: t("All Projects"), value: ALL_PROJECTS_VIEW },
                      ...viewProjects.map(project => ({ label: project.name, value: project.id }))
                    ]}
                    value={selectedProject}
                    emptyMessage={t("No results found")}
                    onChange={onViewChange}
                  />
                </Box>
                <Button
                  size="small"
                  {...addSiteButton}
                  disabled={viewProjects.length === 0 || selectedProject == ALL_PROJECTS_VIEW}
                />
              </Flex>
            }
          />
        </>
      )}
      <ToolbarTable
        className="!bg-theme-neutral-200 !px-6 !pb-6 !pt-5"
        classNameContentLeft={embeddedInProject ? "min-w-0 flex-1 !shrink" : "w-full"}
        classNameContentSearch="w-[19rem] max-w-full"
        search={{
          label: siteCount === 1 ? t("Site") : t("Sites"),
          placeholder: t("Search sites"),
          options: [],
          displayResults: "none",
          onQueryChange,
          isLoading: filtering,
          count: siteCount
        }}
        selectedFilters={selectedFilters}
        onClickFilterButton={() => setIsFilterDrawerOpen(true)}
        onClearFilters={() => onApplyFilters([], null)}
        showClearFilters={selectedFilters.length > 0}
        button={embeddedInProject ? addSiteButton : undefined}
      />
      <SiteIndexFilterDrawer
        open={isFilterDrawerOpen}
        filters={statusFilters}
        updateFilter={updateFilter}
        onOpenChange={setIsFilterDrawerOpen}
        onApplyFilters={onApplyFilters}
      />
    </>
  );
};

export default SiteIndexHeader;
