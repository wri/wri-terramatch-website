import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC, useCallback, useMemo, useState } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import PageHeader from "@/redesignComponents/content/headers/PageHeaders/PageHeader";
import { PlusIcon, ProjectIcon } from "@/redesignComponents/foundations/Icons";
import type { SelectedFilter } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";
import ToolbarObject from "@/redesignComponents/navigation/Toolbar/ToolbarObject";
import ToolbarTable from "@/redesignComponents/navigation/Toolbar/ToolbarTable/ToolbarTable";

import {
  EMPTY_MY_PROJECTS_FILTERS,
  getFilterCategoryLabels,
  MY_PROJECTS_FILTER_KEYS,
  MyProjectsFilterOptions,
  MyProjectsFilters
} from "../myProjectsFilters";
import MyProjectsFilterDrawer from "./MyProjectsFilterDrawer";

const CREATE_PROJECT_PATH = "/project/reporting-framework-select";

type MyProjectsHeaderProps = {
  projectCount: number;
  showToolbar: boolean;
  showAddProject: boolean;
  filters: MyProjectsFilters;
  filterOptions: MyProjectsFilterOptions;
  onApplyFilters: (filters: MyProjectsFilters) => void;
  onQueryChange: (query: string) => void;
};

const MyProjectsHeader: FC<MyProjectsHeaderProps> = ({
  projectCount,
  showToolbar,
  showAddProject,
  filters,
  filterOptions,
  onApplyFilters,
  onQueryChange
}) => {
  const t = useT();
  const router = useRouter();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const selectedFilters = useMemo<SelectedFilter[]>(() => {
    const labels = getFilterCategoryLabels(t);
    return MY_PROJECTS_FILTER_KEYS.filter(key => filters[key].length > 0).map(key => ({
      category: labels[key],
      label: filters[key].map(value => filterOptions[key].find(option => option.value === value)?.title ?? value),
      onRemove: () => onApplyFilters({ ...filters, [key]: [] })
    }));
  }, [filterOptions, filters, onApplyFilters, t]);

  const openFilterDrawer = useCallback(() => setIsFilterDrawerOpen(true), []);
  const clearFilters = useCallback(() => onApplyFilters(EMPTY_MY_PROJECTS_FILTERS), [onApplyFilters]);
  const handleAddProject = useCallback(() => void router.push(CREATE_PROJECT_PATH), [router]);

  return (
    <>
      <ToolbarObject
        className="sticky top-0 z-20 !px-6"
        breadcrumbs={{
          linkRouter: router,
          links: [{ icon: <ProjectIcon />, label: t("Projects"), link: "/my-projects" }]
        }}
      />
      <PageHeader
        className="!bg-theme-neutral-100 !py-3"
        title={t("My Projects")}
        actions={
          showAddProject ? (
            <Button
              size="small"
              leftIcon={<PlusIcon boxSize="0.625rem" />}
              className="shrink-0 whitespace-nowrap"
              onClick={handleAddProject}
            >
              {t("Add New Project")}
            </Button>
          ) : undefined
        }
      />
      {showToolbar && (
        <>
          <ToolbarTable
            className="sticky top-11 z-10 !bg-theme-neutral-200 !px-6 !pb-6 !pt-5"
            classNameContentLeft="w-full"
            classNameContentSearch="w-[15.25rem] max-w-full mobile:w-auto mobile:min-w-0 mobile:flex-1"
            search={{
              placeholder: t("Search"),
              options: [],
              displayResults: "none",
              count: projectCount,
              label: projectCount === 1 ? t("Project") : t("Projects"),
              onQueryChange
            }}
            selectedFilters={selectedFilters}
            showClearFilters={selectedFilters.length > 0}
            onClickFilterButton={openFilterDrawer}
            onClearFilters={clearFilters}
          />
          <MyProjectsFilterDrawer
            open={isFilterDrawerOpen}
            filters={filters}
            options={filterOptions}
            onApplyFilters={onApplyFilters}
            onOpenChange={setIsFilterDrawerOpen}
          />
        </>
      )}
    </>
  );
};

export default MyProjectsHeader;
