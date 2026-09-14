import { Box, Flex } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

import ProjectPickerSelect from "./ProjectPickerSelect";

export interface PolygonReviewHeaderProps {
  /** Left region: an entity-name heading plus (optionally) a status-buckets slot. */
  children: ReactNode;
}

/**
 * PolygonReviewHeader — the cohesive top panel shared by every polygon-review view (flat list, site
 * rollup, site drill-in). Mirrors PageHeader's left-title / right-cluster layout, but on a neutral/white
 * panel consistent with the surrounding PageContent rather than the green secondary.neutral band. The
 * caller supplies the LEFT content (entity name + buckets / back control); the RIGHT always renders the
 * searchable project picker so a reviewer can switch projects from any view.
 */
const PolygonReviewHeader: FC<PolygonReviewHeaderProps> = ({ children }) => {
  return (
    <Flex
      as="header"
      align="flex-start"
      justify="space-between"
      gap={4}
      bg="white"
      borderBottomWidth="1px"
      borderColor="neutral.200"
      paddingX={6}
      paddingY={4}
    >
      <Box minW={0} flex="1 1 auto">
        {children}
      </Box>
      <Box flexShrink={0}>
        <ProjectPickerSelect />
      </Box>
    </Flex>
  );
};

export default PolygonReviewHeader;
