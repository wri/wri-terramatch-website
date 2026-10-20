import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, UIEvent, useCallback, useMemo, useState } from "react";

import { ProjectMapEntryDto } from "@/generated/v3/researchService/researchServiceSchemas";
import Search from "@/redesignComponents/Forms/Actions/Search/Search";
import { SearchProps } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";

const ROW_HEIGHT_REM = 2.25;
const VISIBLE_ROWS = 10;

type ProjectPickerListProps = {
  projects: ProjectMapEntryDto[];
  selectedUuid: string | null;
  onSelect: (uuid: string) => void;
};

const ProjectPickerList: FC<ProjectPickerListProps> = ({ projects, selectedUuid, onSelect }) => {
  const t = useT();
  const [query, setQuery] = useState("");
  const [rowsScrolled, setRowsScrolled] = useState(0);

  const visibleProjects = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return normalized.length === 0
      ? projects
      : projects.filter(({ name }) => name != null && name.toLowerCase().includes(normalized));
  }, [projects, query]);

  const handleScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight } = event.currentTarget;
    const rowHeight = clientHeight / VISIBLE_ROWS;
    setRowsScrolled(Math.round(scrollTop / rowHeight));
  }, []);

  const remainingRows = Math.max(0, visibleProjects.length - VISIBLE_ROWS - rowsScrolled);

  return (
    <Flex direction="column" gap={3} minWidth={0} flex={1}>
      <Flex justify="space-between" align="baseline">
        <Text textStyle="400-bold" color="neutral.900">
          {t("{count} projects", { count: visibleProjects.length })}
        </Text>
        <Text textStyle="200" color="neutral.700">
          {t("Pick one project")}
        </Text>
      </Flex>
      <Search
        {...({
          placeholder: t("Search project name"),
          options: [],
          displayResults: "none",
          size: "small",
          onQueryChange: setQuery
        } as SearchProps)}
      />
      <Flex direction="column" borderWidth="0.0625rem" borderColor="neutral.300" borderRadius="0.25rem">
        <Flex justify="space-between" paddingX={3} paddingY={2} borderBottomWidth="0.0625rem" borderColor="neutral.300">
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
            <Text as="li" textStyle="300" color="neutral.700" paddingX={3} paddingY={2}>
              {t("No projects match these filters")}
            </Text>
          ) : (
            visibleProjects.map(({ uuid, name, polygonCount }) => {
              const isSelected = uuid === selectedUuid;
              return (
                <Flex
                  as="li"
                  key={uuid}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={0}
                  justify="space-between"
                  align="center"
                  gap={2}
                  height={`${ROW_HEIGHT_REM}rem`}
                  paddingX={3}
                  cursor="pointer"
                  bg={isSelected ? "primary.100" : undefined}
                  _hover={{ bg: "primary.100" }}
                  onClick={() => onSelect(uuid)}
                  onKeyDown={event => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelect(uuid);
                    }
                  }}
                >
                  <Text
                    textStyle={isSelected ? "300-bold" : "300"}
                    color="primary.900"
                    textDecoration="underline"
                    truncate
                  >
                    {name ?? t("Unnamed project")}
                  </Text>
                  <Text textStyle="300" color="neutral.900" flexShrink={0}>
                    {polygonCount.toLocaleString()}
                  </Text>
                </Flex>
              );
            })
          )}
        </Box>
      </Flex>
      {remainingRows > 0 && (
        <Text textStyle="200" color="neutral.600" textAlign="center">
          {t("Scroll for {count} more", { count: remainingRows })}
        </Text>
      )}
    </Flex>
  );
};

export default ProjectPickerList;
