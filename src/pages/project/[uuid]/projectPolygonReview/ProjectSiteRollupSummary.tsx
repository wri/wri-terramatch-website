import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useMemo } from "react";

import { SiteReviewRollupRow } from "./useProjectSiteRollup";

// Read-only, site-focused summary for the rollup landing view. The rollup lists SITES, so the tiles
// count sites (not polygons); the project-wide polygon total is a subtitle for context. Non-interactive
// (the site table below is where a reviewer acts).
type Tile = { key: string; label: string; value: number; tone: "neutral" | "good" | "warning" | "muted" };

const TONE_FG: Record<Tile["tone"], string> = {
  neutral: "neutral.800",
  good: "green.500",
  warning: "red.500",
  muted: "neutral.600"
};

interface ProjectSiteRollupSummaryProps {
  rows: SiteReviewRollupRow[];
  isLoading: boolean;
}

const ProjectSiteRollupSummary: FC<ProjectSiteRollupSummaryProps> = ({ rows, isLoading }) => {
  const t = useT();

  const { tiles, totalPolygons } = useMemo(() => {
    const withPolygons = rows.filter(row => row.activeTotal > 0);
    const sites = rows.length;
    // A site "needs review" if any polygon failed validation or is still awaiting a decision.
    const withFailures = withPolygons.filter(row => row.failed > 0).length;
    // Every active polygon is approvable (passed/partial): nothing failed, nothing unchecked.
    const fullyApprovable = withPolygons.filter(row => row.failed === 0 && row.notChecked === 0).length;
    // No validation has run yet — every polygon is still not-checked.
    const notStarted = withPolygons.filter(row => row.notChecked === row.activeTotal).length;
    const total = rows.reduce((sum, row) => sum + row.activeTotal, 0);

    return {
      totalPolygons: total,
      tiles: [
        { key: "sites", label: t("Sites"), value: sites, tone: "neutral" as const },
        { key: "failures", label: t("With failures"), value: withFailures, tone: "warning" as const },
        { key: "approvable", label: t("Fully approvable"), value: fullyApprovable, tone: "good" as const },
        { key: "notStarted", label: t("Not started"), value: notStarted, tone: "muted" as const }
      ]
    };
  }, [rows, t]);

  return (
    <Box mb={4}>
      <Flex gap={3} wrap="wrap">
        {tiles.map(tile => (
          <Box
            key={tile.key}
            flex="1 1 0"
            minW="150px"
            px={4}
            py={3}
            borderRadius="lg"
            borderWidth="1px"
            borderColor="neutral.200"
            bg="white"
          >
            <Text textStyle="500-bold" color={TONE_FG[tile.tone]} fontSize="24px" lineHeight="1.1">
              {isLoading ? "—" : tile.value.toLocaleString()}
            </Text>
            <Text textStyle="300" color="neutral.700" mt={1}>
              {tile.label}
            </Text>
          </Box>
        ))}
      </Flex>
      <Text textStyle="300" color="neutral.600" mt={2}>
        {isLoading
          ? t("Loading site summary…")
          : t("{count} polygons across the project", { count: totalPolygons.toLocaleString() })}
      </Text>
    </Box>
  );
};

export default ProjectSiteRollupSummary;
