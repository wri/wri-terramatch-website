import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC, useCallback, useMemo, useState } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import PageHeader from "@/redesignComponents/content/headers/PageHeaders/PageHeader";
import { PlusIcon, ProjectIcon } from "@/redesignComponents/foundations/Icons";
import type { SelectedFilter } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";
import ToolbarObject from "@/redesignComponents/navigation/Toolbar/ToolbarObject";
import ToolbarTable from "@/redesignComponents/navigation/Toolbar/ToolbarTable/ToolbarTable";

import { getPlantingStatusOptions, getProjectStatusOptions, MyProjectsFilterOption } from "../myProjectsFilters";
import MyProjectsFilterDrawer from "./MyProjectsFilterDrawer";

const CREATE_PROJECT_PATH = "/project/reporting-framework-select";

const toTitles = (values: string[], options: MyProjectsFilterOption[]) =>
  values.map(value => options.find(option => option.value === value)?.title ?? value);

type MyProjectsHeaderProps = {
  projectCount: number;
  showToolbar: boolean;
  showAddProject: boolean;
  statuses: string[];
  plantingStatuses: string[];
  onApplyFilters: (statuses: string[], plantingStatuses: string[]) => void;
  onQueryChange: (query: string) => void;
};

const MyProjectsHeader: FC<MyProjectsHeaderProps> = ({
  projectCount,
  showToolbar,
  showAddProject,
  statuses,
  plantingStatuses,
  onApplyFilters,
  onQueryChange
}) => {
  const t = useT();
  const router = useRouter();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const statusOptions = useMemo(() => getProjectStatusOptions(t), [t]);
  const plantingStatusOptions = useMemo(() => getPlantingStatusOptions(t), [t]);

  const selectedFilters = useMemo<SelectedFilter[]>(
    () => [
      ...(statuses.length === 0
        ? []
        : [
            {
              category: t("Set Up Status"),
              label: toTitles(statuses, statusOptions),
              onRemove: () => onApplyFilters([], plantingStatuses)
            }
          ]),
      ...(plantingStatuses.length === 0
        ? []
        : [
            {
              category: t("Planting Status"),
              label: toTitles(plantingStatuses, plantingStatusOptions),
              onRemove: () => onApplyFilters(statuses, [])
            }
          ])
    ],
    [onApplyFilters, plantingStatusOptions, plantingStatuses, statusOptions, statuses, t]
  );

  const openFilterDrawer = useCallback(() => setIsFilterDrawerOpen(true), []);
  const clearFilters = useCallback(() => onApplyFilters([], []), [onApplyFilters]);
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
            className="!bg-theme-neutral-200 sticky top-11 z-10 !px-6 !pb-6 !pt-5"
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
            statuses={statuses}
            plantingStatuses={plantingStatuses}
            statusOptions={statusOptions}
            plantingStatusOptions={plantingStatusOptions}
            onApplyFilters={onApplyFilters}
            onOpenChange={setIsFilterDrawerOpen}
          />
        </>
      )}
    </>
  );
};

export default MyProjectsHeader;
