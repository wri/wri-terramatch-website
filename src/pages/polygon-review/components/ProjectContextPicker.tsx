import { Box, Flex, Popover, Portal, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useMemo } from "react";

import { ProjectMapEntryDto } from "@/generated/v3/researchService/researchServiceSchemas";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import {
  ChakraSlot,
  SelectorChevron,
  SelectorFolderIcon
} from "@/redesignComponents/Forms/Inputs/HighLevelSelector/HighLevelSelector.shared";
import { getControlStyles } from "@/redesignComponents/Forms/Inputs/HighLevelSelector/HighLevelSelector.styles";

import { useProjectFacetLabels } from "../hooks/useProjectFacetLabels";
import {
  getFacetOptions,
  getProjectFacetFilters,
  ProjectContextFacet,
  ProjectContextFilters,
  toggleFacetValue
} from "../utils/projectContextFilter";
import ProjectFacetGroup from "./ProjectFacetGroup";
import ProjectPickerList from "./ProjectPickerList";

const PopoverTrigger = Popover.Trigger as ChakraSlot;
const PopoverPositioner = Popover.Positioner as ChakraSlot;
const PopoverContent = Popover.Content as ChakraSlot;

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

  const facetFilters = useMemo(
    () => (selectedProject != null ? getProjectFacetFilters(selectedProject) : filters),
    [filters, selectedProject]
  );

  const facetGroups = useMemo(
    () =>
      (
        [
          { facet: "frameworkKey", label: t("Framework (optional)") },
          { facet: "country", label: t("Country (optional)") },
          { facet: "cohort", label: t("Cohort (optional)") }
        ] as const
      ).map(({ facet, label }) => ({ facet, label, options: getFacetOptions(projects, facetFilters, facet) })),
    [facetFilters, projects, t]
  );

  const toggleFacet = useCallback(
    (facet: ProjectContextFacet, value: string, checked: boolean) =>
      onFiltersChange(toggleFacetValue(filters, facet, value, checked)),
    [filters, onFiltersChange]
  );

  return (
    <>
      <Flex gap={4} padding={4} bg="neutral.200" alignItems="flex-start">
        <Flex direction="column" gap={3} width="16rem" flexShrink={0} maxHeight="30rem" overflowY="auto">
          {facetGroups.map(({ facet, label, options }) => (
            <ProjectFacetGroup
              key={facet}
              label={label}
              options={options}
              selected={facetFilters[facet]}
              disabled={isLocked}
              getLabel={value => getLabel(facet, value)}
              onToggle={(value, checked) => toggleFacet(facet, value, checked)}
            />
          ))}
        </Flex>
        <Flex flex={1} minWidth={0} padding={3} bg="neutral.100" borderRadius="0.25rem">
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
        gap={4}
        paddingX={4}
        paddingY={2}
        borderTopWidth="0.0625rem"
        borderColor="neutral.300"
      >
        <Text textStyle="200" color="neutral.700">
          {isLocked
            ? t("Clear filters to pick a project with a different framework, country or cohort.")
            : t("Choose a framework, country or cohort to narrow your list of projects.")}
        </Text>
        <Button variant="borderless" size="small" onClick={onClear}>
          {t("Clear filters")}
        </Button>
      </Flex>
    </>
  );
};

const ProjectContextPicker: FC<ProjectContextPickerProps> = ({ open, onOpenChange, ...contentProps }) => {
  const t = useT();
  const handleOpenChange = useCallback(({ open }: { open: boolean }) => onOpenChange(open), [onOpenChange]);

  return (
    <Popover.Root
      open={open}
      onOpenChange={handleOpenChange}
      positioning={{ placement: "bottom-end", gutter: 4 }}
      lazyMount
      unmountOnExit
    >
      <PopoverTrigger
        {...getControlStyles(false)}
        display="flex"
        alignItems="center"
        gap={2}
        height="2.5rem"
        width="18rem"
        paddingX={2}
        cursor="pointer"
      >
        <SelectorFolderIcon disabled={false} />
        <Text as="span" textStyle="400-bold" color="neutral.900" truncate flex={1} textAlign="left">
          {contentProps.selectedProject?.name ?? t("Select a project")}
        </Text>
        <Box as="span" color="primary.900">
          <SelectorChevron open={open} />
        </Box>
      </PopoverTrigger>
      <Portal>
        <PopoverPositioner>
          <PopoverContent
            width="50rem"
            maxWidth="calc(100vw - 2rem)"
            bg="neutral.100"
            borderWidth="0.0625rem"
            borderColor="neutral.400"
            borderRadius="0.25rem"
            boxShadow="lg"
          >
            <ProjectContextPickerContent {...contentProps} />
          </PopoverContent>
        </PopoverPositioner>
      </Portal>
    </Popover.Root>
  );
};

export default ProjectContextPicker;
