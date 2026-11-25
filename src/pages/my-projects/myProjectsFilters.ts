import { useT } from "@transifex/react";
import { sortBy } from "lodash";

import { EntityProjectsMetaIndexQueryParams } from "@/generated/v3/entityService/entityServiceComponents";
import { UserFramework } from "@/generated/v3/userService/userServiceSchemas";
import { Filter } from "@/types/connection";

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

type PlantingStatusFilter = NonNullable<EntityProjectsMetaIndexQueryParams["plantingStatus"]>[number];

type ProjectStatusFilter = NonNullable<EntityProjectsMetaIndexQueryParams["status"]>[number];

type Translate = ReturnType<typeof useT>;

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

export const getProgrammeOptions = (frameworks: UserFramework[]): MyProjectsFilterOption[] =>
  sortBy(
    frameworks.map(({ slug, name }) => ({ value: slug, title: name })),
    "title"
  );

const NOT_AVAILABLE_STATUSES: PlantingStatusFilter[] = [
  "not-available",
  "no-restoration-expected",
  "replacement-planting"
];

const toPlantingStatusFilter = (statuses: string[]) =>
  statuses.flatMap(status => (status === "not-available" ? NOT_AVAILABLE_STATUSES : [status as PlantingStatusFilter]));

const valuesOrUndefined = <T>(values: T[]) => (values.length === 0 ? undefined : values);

export const toProjectMetaFilter = (
  query: string,
  { statuses, plantingStatuses, programmes, countries }: MyProjectsFilters
): Filter<EntityProjectsMetaIndexQueryParams> => ({
  search: query === "" ? undefined : query,
  status: valuesOrUndefined(statuses as ProjectStatusFilter[]),
  plantingStatus: valuesOrUndefined(toPlantingStatusFilter(plantingStatuses)),
  frameworkKey: valuesOrUndefined(programmes),
  country: valuesOrUndefined(countries)
});
