import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useMemo } from "react";

import { SITE_STATUS_PREDICATES } from "./siteRollupFilter.constants";
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
    const sites = rows.length;
    // These three buckets share their exact predicates with the filter drawer
    // (SITE_STATUS_PREDICATES), so the summary counts and the filter selections can never disagree.
    // Each predicate already guards on activeTotal > 0 (the former `withPolygons` pre-filter).
    const withFailures = rows.filter(SITE_STATUS_PREDICATES.withFailures).length;
    const fullyApprovable = rows.filter(SITE_STATUS_PREDICATES.fullyApprovable).length;
    const notStarted = rows.filter(SITE_STATUS_PREDICATES.notStarted).length;
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
