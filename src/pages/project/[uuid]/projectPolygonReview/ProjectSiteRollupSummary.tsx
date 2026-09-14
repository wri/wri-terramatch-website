import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { Dispatch, FC, SetStateAction, useMemo } from "react";

import {
  EMPTY_SITE_ROLLUP_FILTERS,
  SITE_STATUS_PREDICATES,
  SiteRollupFilterState,
  SiteStatusBucket
} from "./siteRollupFilter.constants";
import SummaryTile from "./SummaryTile";
import { SiteReviewRollupRow } from "./useProjectSiteRollup";

// Site-focused summary for the rollup landing view. The rollup lists SITES, so the tiles count sites
// (not polygons); the project-wide polygon total is a subtitle for context. The tiles double as the
// primary status filter: clicking a bucket sets the site filter to that status (mirroring
// ProjectPolygonSummaryTiles), the "Sites" tile clears it, and the active tile reflects
// `siteFilters.status`. Buckets share their predicates with the filter drawer (SITE_STATUS_PREDICATES),
// so the tiles and the drawer can never disagree.
type Tone = "neutral" | "good" | "warning" | "muted";

type Tile = {
  key: string;
  label: string;
  value: number;
  tone: Tone;
  // The status bucket this tile filters to; undefined for the "Sites" tile, which clears the filter.
  bucket?: SiteStatusBucket;
};

const TONE_STYLES: Record<Tone, { fg: string; activeBg: string; activeBorder: string }> = {
  neutral: { fg: "neutral.800", activeBg: "neutral.200", activeBorder: "neutral.400" },
  good: { fg: "success.500", activeBg: "success.100", activeBorder: "success.300" },
  warning: { fg: "error.500", activeBg: "error.100", activeBorder: "error.300" },
  muted: { fg: "neutral.600", activeBg: "neutral.200", activeBorder: "neutral.400" }
};

interface ProjectSiteRollupSummaryProps {
  rows: SiteReviewRollupRow[];
  isLoading: boolean;
  siteFilters: SiteRollupFilterState;
  setSiteFilters: Dispatch<SetStateAction<SiteRollupFilterState>>;
}

const ProjectSiteRollupSummary: FC<ProjectSiteRollupSummaryProps> = ({
  rows,
  isLoading,
  siteFilters,
  setSiteFilters
}) => {
  const t = useT();

  const { tiles, totalPolygons } = useMemo(() => {
    const sites = rows.length;
    // These three buckets share their exact predicates with the filter drawer (SITE_STATUS_PREDICATES),
    // so the summary counts and the filter selections can never disagree. Each predicate already guards
    // on activeTotal > 0 (the former `withPolygons` pre-filter).
    const withFailures = rows.filter(SITE_STATUS_PREDICATES.withFailures).length;
    const fullyApprovable = rows.filter(SITE_STATUS_PREDICATES.fullyApprovable).length;
    const notStarted = rows.filter(SITE_STATUS_PREDICATES.notStarted).length;
    const total = rows.reduce((sum, row) => sum + row.activeTotal, 0);

    return {
      totalPolygons: total,
      tiles: [
        { key: "sites", label: t("Sites"), value: sites, tone: "neutral" as const },
        {
          key: "failures",
          label: t("With failures"),
          value: withFailures,
          tone: "warning" as const,
          bucket: "withFailures" as const
        },
        {
          key: "approvable",
          label: t("Fully approvable"),
          value: fullyApprovable,
          tone: "good" as const,
          bucket: "fullyApprovable" as const
        },
        {
          key: "notStarted",
          label: t("Not started"),
          value: notStarted,
          tone: "muted" as const,
          bucket: "notStarted" as const
        }
      ] satisfies Tile[]
    };
  }, [rows, t]);

  // A status tile is active when the filter's status is exactly that single bucket; the "Sites" tile is
  // active when no status is selected.
  const isTileActive = (tile: Tile) =>
    tile.bucket == null
      ? siteFilters.status.length === 0
      : siteFilters.status.length === 1 && siteFilters.status[0] === tile.bucket;

  return (
    <Box mb={4}>
      <Flex gap={3} wrap="wrap">
        {tiles.map(tile => {
          const tone = TONE_STYLES[tile.tone];
          const active = isTileActive(tile);
          const toggle = () =>
            setSiteFilters(
              tile.bucket == null || active
                ? EMPTY_SITE_ROLLUP_FILTERS
                : { ...EMPTY_SITE_ROLLUP_FILTERS, status: [tile.bucket] }
            );
          return (
            <SummaryTile
              key={tile.key}
              value={isLoading ? "—" : tile.value.toLocaleString()}
              label={tile.label}
              valueColor={tone.fg}
              onToggle={toggle}
              isActive={active}
              activeBg={tone.activeBg}
              activeBorder={tone.activeBorder}
            />
          );
        })}
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
