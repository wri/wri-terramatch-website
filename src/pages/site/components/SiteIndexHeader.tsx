import { Box, Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { FC, useMemo, useState } from "react";

import { useIsMobile } from "@/hooks/useIsMobile";
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
  getSiteIndexStatusOptions,
  getSiteIndexUpdateOptions
} from "./SiteIndexFilterDrawer";

type SiteIndexHeaderProps = {
  siteCount: number;
  selectedProject: string;
  viewProjects: Pick<SiteIndexProject, "id" | "name">[];
  statusFilters: SiteIndexFilterStatus[];
  updateFilters: SiteIndexFilterUpdate[];
  filtering: boolean;
  onApplyFilters: (statusFilters: SiteIndexFilterStatus[], updateFilters: SiteIndexFilterUpdate[]) => void;
  onViewChange: (value: string) => void;
  onAddSite: () => void;
  onQueryChange: (query: string) => void;
  embeddedInProject?: boolean;
  addSiteDisabled?: boolean;
  showViewSelector?: boolean;
};

const SiteIndexHeader: FC<SiteIndexHeaderProps> = ({
  siteCount,
  selectedProject,
  viewProjects,
  statusFilters,
  updateFilters,
  filtering,
  onApplyFilters,
  onViewChange,
  onAddSite,
  onQueryChange,
  embeddedInProject = false,
  addSiteDisabled = false,
  showViewSelector = true
}) => {
  const t = useT();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const selectedFilters = useMemo<SelectedFilter[]>(
    () => [
      ...(statusFilters.length === 0
        ? []
        : [
            {
              category: t("Status"),
              label: statusFilters.map(
                status => getSiteIndexStatusOptions(t).find(option => option.value === status)?.label ?? status
              ),
              onRemove: () => onApplyFilters([], updateFilters)
            }
          ]),
      ...(updateFilters.length === 0
        ? []
        : [
            {
              category: t("Update"),
              label: updateFilters.map(
                update => getSiteIndexUpdateOptions(t).find(option => option.value === update)?.label ?? update
              ),
              onRemove: () => onApplyFilters(statusFilters, [])
            }
          ])
    ],
    [onApplyFilters, statusFilters, t, updateFilters]
  );

  const addSiteButton = {
    children: t("Add Site"),
    leftIcon: <PlusIcon boxSize="0.625rem" />,
    disabled: addSiteDisabled,
    className: "shrink-0 whitespace-nowrap",
    onClick: onAddSite
  };

  const addSitePageButton = (
    <Button
      size="small"
      {...addSiteButton}
      disabled={viewProjects.length === 0 || selectedProject === ALL_PROJECTS_VIEW}
    />
  );

  const viewSelector = showViewSelector ? (
    <Box className="w-[25rem] mobile:w-full">
      <HighLevelSelector
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
  ) : null;

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
            className=" !bg-theme-neutral-100 !pb-0 !pt-1"
            actions={
              isMobile ? (
                addSitePageButton
              ) : (
                <Flex gap="0.5rem" alignItems="center">
                  {viewSelector}
                  {addSitePageButton}
                </Flex>
              )
            }
          />
          {isMobile && viewSelector != null && <Box className="bg-theme-neutral-100 px-6 pt-4">{viewSelector}</Box>}
        </>
      )}
      <ToolbarTable
        className={classNames(
          "sticky z-10 !px-6 !pb-6 !pt-5",
          embeddedInProject
            ? "top-[5.5625rem] border-b border-theme-neutral-300 !bg-theme-neutral-100 mobile:top-[7.8125rem]"
            : "top-11 !bg-theme-neutral-200"
        )}
        classNameContentLeft={embeddedInProject ? "min-w-0 flex-1 !shrink" : "w-full"}
        classNameContentSearch="w-[19rem] max-w-full mobile:w-auto mobile:min-w-0 mobile:flex-1"
        search={{
          label: siteCount === 1 ? t("Site") : t("Sites"),
          placeholder: t("Search"),
          options: [],
          displayResults: "none",
          onQueryChange,
          isLoading: filtering,
          count: siteCount
        }}
        selectedFilters={selectedFilters}
        onClickFilterButton={() => setIsFilterDrawerOpen(true)}
        onClearFilters={() => onApplyFilters([], [])}
        showClearFilters={selectedFilters.length > 0}
        button={embeddedInProject ? addSiteButton : undefined}
      />
      <SiteIndexFilterDrawer
        open={isFilterDrawerOpen}
        filters={statusFilters}
        updateFilters={updateFilters}
        onOpenChange={setIsFilterDrawerOpen}
        onApplyFilters={onApplyFilters}
      />
    </>
  );
};

export default SiteIndexHeader;
