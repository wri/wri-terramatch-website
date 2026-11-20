import { useT } from "@transifex/react";
import { sortBy, uniq } from "lodash";

import { Frameworks } from "@/generated/v3/userService/userServiceConstants";
import { ProjectCardProject } from "@/redesignComponents/containers/Cards/ProjectCard/ProjectCard";
import { getPlantingProgressState } from "@/redesignComponents/content/headers/PageHeaders/ProjectHeader/projectHeader.utils";
import { isNotNull } from "@/utils/array";

export type MyProjectsFilterOption = { value: string; title: string };

export const MY_PROJECTS_FILTER_KEYS = ["statuses", "plantingStatuses", "programmes", "countries"] as const;

export type MyProjectsFilterKey = (typeof MY_PROJECTS_FILTER_KEYS)[number];

export type MyProjectsFilters = Record<MyProjectsFilterKey, string[]>;

export type MyProjectsFilterOptions = Record<MyProjectsFilterKey, MyProjectsFilterOption[]>;

export const EMPTY_MY_PROJECTS_FILTERS: MyProjectsFilters = {
  statuses: [],
  plantingStatuses: [],
  programmes: [],
  countries: []
};

type Translate = ReturnType<typeof useT>;

const FRAMEWORK_NAMES: Record<string, string> = Frameworks.FRAMEWORK_NAMES;

export const getFilterCategoryLabels = (t: Translate): Record<MyProjectsFilterKey, string> => ({
  statuses: t("Set Up Status"),
  plantingStatuses: t("Planting Status"),
  programmes: t("Programme"),
  countries: t("Country")
});

export const getProjectStatusOptions = (t: Translate): MyProjectsFilterOption[] => [
  { value: "draft", title: t("Draft") },
  { value: "pending-approval", title: t("Pending Approval") },
  { value: "information-required", title: t("Information Required") },
  { value: "approved", title: t("Approved") }
];

export const getPlantingStatusOptions = (t: Translate): MyProjectsFilterOption[] => [
  { value: "not-started", title: t("Not Started") },
  { value: "in-progress", title: t("In Progress") },
  { value: "completed", title: t("Complete") },
  { value: "not-available", title: t("Not Available") }
];

export const getProgrammeOptions = (projects: ProjectCardProject[]): MyProjectsFilterOption[] =>
  sortBy(
    uniq(projects.map(({ frameworkKey }) => frameworkKey).filter(isNotNull)).map(key => ({
      value: key,
      title: FRAMEWORK_NAMES[key] ?? key
    })),
    "title"
  );

export const getCountryOptions = (
  projects: ProjectCardProject[],
  countryNames: MyProjectsFilterOption[]
): MyProjectsFilterOption[] =>
  sortBy(
    uniq(projects.flatMap(({ level0Project }) => level0Project ?? [])).map(code => ({
      value: code,
      title: countryNames.find(({ value }) => value === code)?.title ?? code
    })),
    "title"
  );

const matches = (selected: string[], values: string[]) =>
  selected.length === 0 || values.some(value => selected.includes(value));

export const filterProjects = (projects: ProjectCardProject[], query: string, filters: MyProjectsFilters) => {
  const search = query.trim().toLowerCase();
  return projects.filter(
    project =>
      (search === "" || (project.name ?? "").toLowerCase().includes(search)) &&
      matches(filters.statuses, [project.status]) &&
      matches(filters.plantingStatuses, [getPlantingProgressState(project.plantingStatus)]) &&
      matches(filters.programmes, project.frameworkKey == null ? [] : [project.frameworkKey]) &&
      matches(filters.countries, project.level0Project ?? [])
  );
};
