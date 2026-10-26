import { Box, Flex, Text } from "@chakra-ui/react";
import { FC } from "react";

// Decorative placeholder bar heights, matching the design's empty-chart silhouette.
const PLACEHOLDER_BAR_HEIGHTS = ["74%", "100%", "54%", "84%", "30%"];

export type ChartEmptyStateProps = {
  message?: string;
};

/** Placeholder shown in place of a chart that has no data to plot. */
export const ChartEmptyState: FC<ChartEmptyStateProps> = ({ message }) => (
  <Flex direction="column" gap={3} height="100%">
    {message != null && (
      <Text textStyle="400" color="neutral.900">
        {message}
      </Text>
    )}
    <Flex alignItems="flex-end" gap={4} height="100%" aria-hidden="true">
      {PLACEHOLDER_BAR_HEIGHTS.map(height => (
        <Box key={height} flex={1} height={height} backgroundColor="neutral.200" />
      ))}
    </Flex>
  </Flex>
);

export default ChartEmptyState;
