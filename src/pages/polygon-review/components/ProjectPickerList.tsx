import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, UIEvent, useCallback, useMemo, useState } from "react";

import Search from "@/redesignComponents/Forms/Actions/Search/Search";
import { SELECTOR_BORDER_WIDTH, SELECTOR_RADIUS } from "@/redesignComponents/Forms/Inputs/HighLevelSelector";
import type { ProjectSelectionMethod } from "@/utils/polygonAnalytics";

import { ProjectContextEntry } from "../utils/projectContextFilter";
import ProjectPickerRow from "./ProjectPickerRow";

const ROW_HEIGHT_REM = 3;
const VISIBLE_ROWS = 7;
const ROW_HEIGHT = `${ROW_HEIGHT_REM}rem`;

type ProjectPickerListProps = {
  projects: ProjectContextEntry[];
  filtersSummary: string;
  selectedProject: ProjectContextEntry | null;
  getSubtitle: (project: ProjectContextEntry) => string | undefined;
  onSelect: (uuid: string, method: ProjectSelectionMethod) => void;
};

const ProjectPickerList: FC<ProjectPickerListProps> = ({
  projects,
  filtersSummary,
  selectedProject,
  getSubtitle,
  onSelect
}) => {
  const t = useT();
  const [query, setQuery] = useState("");
  const [rowsScrolled, setRowsScrolled] = useState(0);
  const trimmedQuery = query.trim();
  const isSearching = trimmedQuery.length > 0;

  const visibleProjects = useMemo(() => {
    const normalized = trimmedQuery.toLowerCase();
    return normalized.length === 0
      ? projects
      : projects.filter(({ name }) => name != null && name.toLowerCase().includes(normalized));
  }, [projects, trimmedQuery]);

  const handleSelect = useCallback(
    (uuid: string) => onSelect(uuid, isSearching ? "search" : "list"),
    [isSearching, onSelect]
  );

  const handleScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight } = event.currentTarget;
    const rowHeight = clientHeight / VISIBLE_ROWS;
    setRowsScrolled(Math.round(scrollTop / rowHeight));
  }, []);

  const heading = useMemo(() => {
    if (selectedProject != null) return selectedProject.name ?? t("Unnamed project");

    const hasFilters = filtersSummary.length > 0;
    if (isSearching) {
      const counts = { shown: visibleProjects.length, total: projects.length };
      return hasFilters
        ? t("{shown} of {total} projects in {filters}", { ...counts, filters: filtersSummary })
        : t("{shown} of {total} projects", counts);
    }

    return hasFilters
      ? t("{count} projects in {filters}", { count: visibleProjects.length, filters: filtersSummary })
      : t("{count} projects", { count: visibleProjects.length });
  }, [filtersSummary, isSearching, projects.length, selectedProject, t, visibleProjects.length]);

  const remainingRows = Math.max(0, visibleProjects.length - VISIBLE_ROWS - rowsScrolled);

  return (
    <Flex direction="column" gap={2} minWidth={0} flex={1}>
      <Flex justify="space-between" align="center" gap={2}>
        <Text textStyle="500-bold" color="neutral.900">
          {heading}
        </Text>
        <Text textStyle="300" color="neutral.600" whiteSpace="nowrap">
          {t("Pick one project")}
        </Text>
      </Flex>
      <Search placeholder={t("Search project name")} options={[]} displayResults="none" onQueryChange={setQuery} />
      {isSearching && visibleProjects.length === 0 ? (
        <Flex
          direction="column"
          align="center"
          gap={1}
          paddingX={5}
          paddingY={10}
          textAlign="center"
          borderWidth={SELECTOR_BORDER_WIDTH}
          borderColor="neutral.300"
          borderRadius={SELECTOR_RADIUS}
        >
          <Text textStyle="400-bold" color="neutral.900">
            {t('No projects match "{query}"', { query: trimmedQuery })}
          </Text>
          <Text textStyle="300" color="neutral.700">
            {t("Clear the search or change the filters.")}
          </Text>
        </Flex>
      ) : (
        <Flex
          direction="column"
          overflow="hidden"
          borderWidth={SELECTOR_BORDER_WIDTH}
          borderColor="neutral.300"
          borderRadius={SELECTOR_RADIUS}
        >
          <Flex justify="space-between" paddingX={3} paddingY={2} bg="neutral.200">
            <Text textStyle="200-bold" color="neutral.900">
              {t("Project name")}
            </Text>
            <Text textStyle="200-bold" color="neutral.900">
              {t("Polygons")}
            </Text>
          </Flex>
          <Box
            as="ul"
            role="listbox"
            maxHeight={`${ROW_HEIGHT_REM * VISIBLE_ROWS}rem`}
            overflowY="auto"
            onScroll={handleScroll}
          >
            {visibleProjects.length === 0 ? (
              <Text
                as="li"
                textStyle="300"
                color="neutral.700"
                paddingX={3}
                paddingY={2}
                borderTopWidth={SELECTOR_BORDER_WIDTH}
                borderColor="neutral.300"
              >
                {t("No projects match these filters")}
              </Text>
            ) : (
              visibleProjects.map(project => (
                <ProjectPickerRow
                  key={project.uuid}
                  uuid={project.uuid}
                  name={project.name}
                  subtitle={getSubtitle(project)}
                  polygonCount={project.polygonCount}
                  height={ROW_HEIGHT}
                  isSelected={project.uuid === selectedProject?.uuid}
                  onSelect={handleSelect}
                />
              ))
            )}
          </Box>
        </Flex>
      )}
      {remainingRows > 0 && (
        <Text textStyle="200" color="neutral.600" textAlign="center">
          {t("Scroll for {count} more", { count: remainingRows })}
        </Text>
      )}
    </Flex>
  );
};

export default ProjectPickerList;
