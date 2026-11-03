import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useMemo } from "react";

import { ProjectMapEntryDto } from "@/generated/v3/researchService/researchServiceSchemas";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { HighLevelPopoverSelector, SELECTOR_BORDER_WIDTH } from "@/redesignComponents/Forms/Inputs/HighLevelSelector";
import { isNotNull } from "@/utils/array";

import { useProjectFacetLabels } from "../hooks/useProjectFacetLabels";
import {
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

const SelectedProjectSubtitle: FC<{ project: ProjectMapEntryDto }> = ({ project }) => {
  const getLabel = useProjectFacetLabels();
  const frameworkKey = getFacetValue(project, "frameworkKey");
  const country = getFacetValue(project, "country");

  return (
    <>
      {[
        frameworkKey == null ? null : getLabel("frameworkKey", frameworkKey),
        country == null ? null : getLabel("country", country)
      ]
        .filter(isNotNull)
        .join(" · ")}
    </>
  );
};

/**
 * Popover body. It only mounts while the popover is open, so the project rows, facet counts and the label
 * lookups (frameworks / countries) cost nothing until an admin opens the picker.
 */
const ProjectContextPickerContent: FC<ProjectContextPickerContentProps> = ({
  projects,
  filteredProjects,
  filters,
  selectedProject,
  onFiltersChange,
  onSelectProject,
  onClear
}) => {
  const t = useT();
  const getLabel = useProjectFacetLabels();
  const isLocked = selectedProject != null;
  const canClear = isLocked || PROJECT_CONTEXT_FACETS.some(facet => filters[facet].length > 0);

  const facetFilters = useMemo(
    () => (selectedProject != null ? getProjectFacetFilters(selectedProject) : filters),
    [filters, selectedProject]
  );

  const facetGroups = useMemo(() => {
    const countrySearch: FacetSearch = {
      placeholder: t("Type to search countries"),
      getCaption: count => t("{count} countries available", { count })
    };

    return (
      [
        { facet: "frameworkKey", label: t("Framework") },
        { facet: "country", label: t("Country"), search: countrySearch },
        { facet: "cohort", label: t("Cohort") }
      ] as const
    ).map(group => ({ ...group, options: getFacetOptions(projects, facetFilters, group.facet) }));
  }, [facetFilters, projects, t]);

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
  const { selectedProject } = contentProps;

  return (
    <HighLevelPopoverSelector
      open={open}
      placeholder={t("Select a project")}
      value={selectedProject?.name}
      subtitle={selectedProject == null ? undefined : <SelectedProjectSubtitle project={selectedProject} />}
      width="25rem"
      contentWidth="45rem"
      onOpenChange={onOpenChange}
    >
      <ProjectContextPickerContent {...contentProps} />
    </HighLevelPopoverSelector>
  );
};

export default ProjectContextPicker;
