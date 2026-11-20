import { ProjectMapEntryDto } from "@/generated/v3/researchService/researchServiceSchemas";

export const PROJECT_CONTEXT_FACETS = ["frameworkKey", "country", "organisation", "cohort"] as const;

export type ProjectContextEntry = ProjectMapEntryDto & {
  organisationUuid?: string | null;
  organisationName?: string | null;
};

export type ProjectContextFacet = (typeof PROJECT_CONTEXT_FACETS)[number];

export type ProjectContextFilters = Record<ProjectContextFacet, string[]>;

export type FacetOption = { value: string; count: number };

type ProjectFrameworkKey = NonNullable<ProjectMapEntryDto["frameworkKey"]>;

const PROJECT_FRAMEWORK_KEYS: readonly ProjectFrameworkKey[] = [
  "terrafund-non-profits",
  "terrafund-enterprises",
  "epa-ghana-pilot",
  "ppc",
  "hbf",
  "fundo-flora",
  "wcb",
  "barka-fund",
  "polygon-monitoring"
];

const isProjectFrameworkKey = (value: string): value is ProjectFrameworkKey =>
  (PROJECT_FRAMEWORK_KEYS as readonly string[]).includes(value);

export const EMPTY_PROJECT_CONTEXT_FILTERS: ProjectContextFilters = {
  frameworkKey: [],
  country: [],
  organisation: [],
  cohort: []
};

export const getFacetValue = (project: ProjectContextEntry, facet: ProjectContextFacet): string | null => {
  if (facet === "country") return project.level0Project?.[0] ?? null;
  if (facet === "organisation") return project.organisationUuid ?? null;
  return project[facet];
};

export const sortProjectsByName = (projects: ProjectMapEntryDto[]) =>
  [...projects].sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));

/**
 * Query params shared by `projectsMapIndex` and `projectsFilterOptions`. The server narrows both, and the filter
 * options exclude their own facet, so facet counts stay correct when a facet is selected.
 */
export const toProjectFilterQuery = (filters: ProjectContextFilters) => {
  const frameworkKeys = filters.frameworkKey.filter(isProjectFrameworkKey);
  return {
    "frameworkKey[]": frameworkKeys.length === 0 ? undefined : frameworkKeys,
    "country[]": filters.country.length === 0 ? undefined : filters.country,
    "organisationUuid[]": filters.organisation.length === 0 ? undefined : filters.organisation
  };
};

/**
 * Selected values stay visible as checked options even when the server no longer lists them (for example an
 * organisation that has no project under the other filters), with a count of 0.
 */
export const getFacetOptions = (options: FacetOption[], selected: string[]): FacetOption[] => {
  const present = new Set(options.map(({ value }) => value));
  const missing = selected.filter(value => !present.has(value)).map(value => ({ value, count: 0 }));
  return [...options, ...missing];
};

const toFilterValues = (value: string | null) => (value == null ? [] : [value]);

/** Once a project is picked, its own facet values become the (locked) filter context. */
export const getProjectFacetFilters = (project: ProjectContextEntry): ProjectContextFilters => ({
  frameworkKey: toFilterValues(getFacetValue(project, "frameworkKey")),
  country: toFilterValues(getFacetValue(project, "country")),
  organisation: toFilterValues(getFacetValue(project, "organisation")),
  cohort: toFilterValues(getFacetValue(project, "cohort"))
});
