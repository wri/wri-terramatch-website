import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import { PolygonValidationStatus } from "@/pages/site/[uuid]/components/polygonFilter.constants";

import { ProjectPolygonStatusCounts } from "./useProjectPolygonStatusCounts";

// Each tile maps to a validationStatus[] filter selection. "All" clears the status filter. Clicking a
// tile applies its filter (or clears, if it's already the active one) — so the tiles double as the
// primary review entry point for large projects (see project-polygons-scale-options.md §0).
type Tile = {
  key: string;
  label: string;
  value: number;
  statuses: PolygonValidationStatus[]; // empty = "All" (clear filter)
  tone: "neutral" | "good" | "warning" | "muted";
};

const TONE_STYLES: Record<Tile["tone"], { fg: string; activeBg: string; activeBorder: string }> = {
  neutral: { fg: "neutral.800", activeBg: "neutral.150", activeBorder: "neutral.400" },
  good: { fg: "green.500", activeBg: "green.50", activeBorder: "green.300" },
  warning: { fg: "red.500", activeBg: "red.50", activeBorder: "red.300" },
  muted: { fg: "neutral.600", activeBg: "neutral.150", activeBorder: "neutral.400" }
};

const sameStatuses = (a: PolygonValidationStatus[], b: PolygonValidationStatus[]) =>
  a.length === b.length && [...a].sort().join(",") === [...b].sort().join(",");

interface ProjectPolygonSummaryTilesProps {
  counts: ProjectPolygonStatusCounts;
  isLoading: boolean;
  activeStatuses: PolygonValidationStatus[];
  onApplyStatuses: (statuses: PolygonValidationStatus[]) => void;
}

const ProjectPolygonSummaryTiles: FC<ProjectPolygonSummaryTilesProps> = ({
  counts,
  isLoading,
  activeStatuses,
  onApplyStatuses
}) => {
  const t = useT();

  const tiles: Tile[] = [
    { key: "all", label: t("All polygons"), value: counts.total, statuses: [], tone: "neutral" },
    {
      key: "approvable",
      label: t("Approvable (passed / partial)"),
      value: counts.approvable,
      statuses: ["passed", "partial"],
      tone: "good"
    },
    { key: "failed", label: t("Failed"), value: counts.failed, statuses: ["failed"], tone: "warning" },
    {
      key: "not_checked",
      label: t("Not started"),
      value: counts.notChecked,
      statuses: ["not_checked"],
      tone: "muted"
    }
  ];

  return (
    <Flex gap={3} wrap="wrap" mb={4}>
      {tiles.map(tile => {
        const isActive = sameStatuses(activeStatuses, tile.statuses);
        const tone = TONE_STYLES[tile.tone];
        const toggle = () => onApplyStatuses(isActive && tile.statuses.length > 0 ? [] : tile.statuses);
        return (
          <Box
            key={tile.key}
            role="button"
            tabIndex={0}
            onClick={toggle}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle();
              }
            }}
            textAlign="left"
            flex="1 1 0"
            minW="150px"
            px={4}
            py={3}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={isActive ? tone.activeBorder : "neutral.200"}
            bg={isActive ? tone.activeBg : "white"}
            cursor="pointer"
            transition="border-color .1s, background .1s"
            _hover={{ borderColor: tone.activeBorder }}
            aria-pressed={isActive}
          >
            <Text textStyle="500-bold" color={tone.fg} fontSize="24px" lineHeight="1.1">
              {isLoading ? "—" : tile.value.toLocaleString()}
            </Text>
            <Text textStyle="300" color="neutral.700" mt={1}>
              {tile.label}
            </Text>
          </Box>
        );
      })}
    </Flex>
  );
};

export default ProjectPolygonSummaryTiles;
