import { ProjectMapEntryDto } from "@/generated/v3/researchService/researchServiceSchemas";

export const PROJECT_CONTEXT_FACETS = ["frameworkKey", "country", "cohort"] as const;

export type ProjectContextFacet = (typeof PROJECT_CONTEXT_FACETS)[number];

export type ProjectContextFilters = Record<ProjectContextFacet, string[]>;

export type FacetOption = { value: string; count: number };

export const EMPTY_PROJECT_CONTEXT_FILTERS: ProjectContextFilters = { frameworkKey: [], country: [], cohort: [] };

const getFacetValue = (project: ProjectMapEntryDto, facet: ProjectContextFacet): string | null =>
  facet === "country" ? project.level0Project?.[0] ?? null : project[facet];

const matchesFacet = (project: ProjectMapEntryDto, filters: ProjectContextFilters, facet: ProjectContextFacet) => {
  const selected = filters[facet];
  if (selected.length === 0) return true;

  const value = getFacetValue(project, facet);
  return value != null && selected.includes(value);
};

const matchesFilters = (
  project: ProjectMapEntryDto,
  filters: ProjectContextFilters,
  ignoredFacet?: ProjectContextFacet
) => PROJECT_CONTEXT_FACETS.every(facet => facet === ignoredFacet || matchesFacet(project, filters, facet));

export const sortProjectsByName = (projects: ProjectMapEntryDto[]) =>
  [...projects].sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));

export const filterProjects = (projects: ProjectMapEntryDto[], filters: ProjectContextFilters) =>
  projects.filter(project => matchesFilters(project, filters));

export const getFacetOptions = (
  projects: ProjectMapEntryDto[],
  filters: ProjectContextFilters,
  facet: ProjectContextFacet
): FacetOption[] => {
  const counts = new Map<string, number>(filters[facet].map(value => [value, 0]));
  for (const project of projects) {
    const value = getFacetValue(project, facet);
    if (value != null && matchesFilters(project, filters, facet)) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }

  return Array.from(counts, ([value, count]) => ({ value, count })).sort(
    (a, b) => b.count - a.count || a.value.localeCompare(b.value)
  );
};

const toFilterValues = (value: string | null) => (value == null ? [] : [value]);

/** Once a project is picked, its own facet values become the (locked) filter context. */
export const getProjectFacetFilters = (project: ProjectMapEntryDto): ProjectContextFilters => ({
  frameworkKey: toFilterValues(getFacetValue(project, "frameworkKey")),
  country: toFilterValues(getFacetValue(project, "country")),
  cohort: toFilterValues(getFacetValue(project, "cohort"))
});

export const toggleFacetValue = (
  filters: ProjectContextFilters,
  facet: ProjectContextFacet,
  value: string,
  checked: boolean
): ProjectContextFilters => {
  const values = filters[facet].filter(selected => selected !== value);
  return { ...filters, [facet]: checked ? [...values, value] : values };
};
