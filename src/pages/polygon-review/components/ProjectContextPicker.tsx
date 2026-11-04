import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useMemo } from "react";

import { ProjectMapEntryDto } from "@/generated/v3/researchService/researchServiceSchemas";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { HighLevelPopoverSelector, SELECTOR_BORDER_WIDTH } from "@/redesignComponents/Forms/Inputs/HighLevelSelector";
import { isNotNull } from "@/utils/array";

import { useProjectFacetLabels } from "../hooks/useProjectFacetLabels";
import {
  EMPTY_PROJECT_CONTEXT_FILTERS,
  getFacetOptions,
  getFacetValue,
  getProjectFacetFilters,
  PROJECT_CONTEXT_FACETS,
  ProjectContextFacet,
  ProjectContextFilters
} from "../utils/projectContextFilter";
import ProjectFacetGroup, { FacetSearch } from "./ProjectFacetGroup";
import ProjectPickerList from "./ProjectPickerList";

type ProjectContextPickerContentProps = {
  projects: ProjectMapEntryDto[];
  filteredProjects: ProjectMapEntryDto[];
  filters: ProjectContextFilters;
  selectedProject: ProjectMapEntryDto | null;
  onFiltersChange: (filters: ProjectContextFilters) => void;
  onSelectProject: (uuid: string) => void;
  onClear: () => void;
};

type ProjectContextPickerProps = ProjectContextPickerContentProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type FacetLabelGetter = ReturnType<typeof useProjectFacetLabels>;

const MAX_CHECKBOX_OPTIONS = 7;

const SUBTITLE_FACETS = ["frameworkKey", "country"] as const;

const getProjectSubtitle = (project: ProjectMapEntryDto, getLabel: FacetLabelGetter) => {
  const parts = SUBTITLE_FACETS.map(facet => {
    const value = getFacetValue(project, facet);
    return value == null ? null : getLabel(facet, value);
  }).filter(isNotNull);
  return parts.length === 0 ? undefined : parts.join(" · ");
};

/**
 * Popover body. It only mounts while the popover is open, so the project rows and facet counts cost nothing
 * until an admin opens the picker.
 */
const ProjectContextPickerContent: FC<ProjectContextPickerContentProps & { getLabel: FacetLabelGetter }> = ({
  projects,
  filteredProjects,
  filters,
  selectedProject,
  getLabel,
  onFiltersChange,
  onSelectProject,
  onClear
}) => {
  const t = useT();
  const isLocked = selectedProject != null;
  const canClear = isLocked || PROJECT_CONTEXT_FACETS.some(facet => filters[facet].length > 0);

  const facetFilters = useMemo(
    () => (selectedProject != null ? getProjectFacetFilters(selectedProject) : filters),
    [filters, selectedProject]
  );

  // Counted over all projects so the country control doesn't switch type as other facets narrow it.
  const countryCount = useMemo(
    () => getFacetOptions(projects, EMPTY_PROJECT_CONTEXT_FILTERS, "country").length,
    [projects]
  );

  const facetGroups = useMemo(() => {
    const countrySearch: FacetSearch = {
      placeholder: t("Type to search countries"),
      getCaption: count => t("{count} countries available", { count })
    };

    return (
      [
        { facet: "frameworkKey", label: t("Framework") },
        {
          facet: "country",
          label: t("Country"),
          search: countryCount > MAX_CHECKBOX_OPTIONS ? countrySearch : undefined
        },
        { facet: "cohort", label: t("Cohort") }
      ] as const
    ).map(group => ({ ...group, options: getFacetOptions(projects, facetFilters, group.facet) }));
  }, [countryCount, facetFilters, projects, t]);

  const setFacetValues = useCallback(
    (facet: ProjectContextFacet, values: string[]) => onFiltersChange({ ...filters, [facet]: values }),
    [filters, onFiltersChange]
  );

  return (
    <>
      <Flex alignItems="stretch">
        <Flex
          direction="column"
          gap={3}
          padding={3}
          width="17.5rem"
          flexShrink={0}
          maxHeight="37.5rem"
          overflowY="auto"
          bg="neutral.200"
        >
          {facetGroups.map(({ facet, label, options, ...group }) => (
            <ProjectFacetGroup
              key={facet}
              label={label}
              options={options}
              selected={facetFilters[facet]}
              disabled={isLocked}
              search={"search" in group ? group.search : undefined}
              getLabel={value => getLabel(facet, value)}
              onChange={values => setFacetValues(facet, values)}
            />
          ))}
        </Flex>
        <Flex flex={1} minWidth={0} padding={4}>
          <ProjectPickerList
            projects={filteredProjects}
            selectedUuid={selectedProject?.uuid ?? null}
            onSelect={onSelectProject}
          />
        </Flex>
      </Flex>
      <Flex
        justify="space-between"
        align="center"
        gap={3}
        paddingX={4}
        paddingY={2}
        borderTopWidth={SELECTOR_BORDER_WIDTH}
        borderColor="neutral.300"
      >
        <Text textStyle="300" color="neutral.700">
          {isLocked
            ? t("Clear filters to pick a project with a different framework, country or cohort.")
            : t("Choose a framework, country or cohort to narrow your list of projects.")}
        </Text>
        <Button variant="borderless" size="small" disabled={!canClear} onClick={onClear}>
          {t("Clear filters")}
        </Button>
      </Flex>
    </>
  );
};

const ProjectContextPicker: FC<ProjectContextPickerProps> = ({ open, onOpenChange, ...contentProps }) => {
  const t = useT();
  const getLabel = useProjectFacetLabels();
  const { selectedProject } = contentProps;
  const subtitle = useMemo(
    () => (selectedProject == null ? undefined : getProjectSubtitle(selectedProject, getLabel)),
    [getLabel, selectedProject]
  );

  return (
    <HighLevelPopoverSelector
      open={open}
      placeholder={t("Select a project")}
      value={selectedProject?.name}
      subtitle={subtitle}
      width="25rem"
      contentWidth="45rem"
      onOpenChange={onOpenChange}
    >
      <ProjectContextPickerContent {...contentProps} getLabel={getLabel} />
    </HighLevelPopoverSelector>
  );
};

export default ProjectContextPicker;
