import { Flex, Text } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

interface CompactKpiProps {
  /** A small leading icon (e.g. TreeIcon / AreaHectaresIcon from the redesign Icons). */
  icon: ReactNode;
  /** Short descriptor shown above the value (e.g. "Trees Planted"). */
  label: string;
  /** Pre-formatted value string (e.g. `123` or `45 ha`). */
  value: string;
}

/**
 * CompactKpi — a slim "icon + label + value" box (no progress bar), the toolbar-scale counterpart to
 * the site page's MetricCard. Used right-aligned in the project polygon-review toolbars to surface the
 * Trees Planted / Restoration Area totals beside the search + filter controls. Two instances are
 * composed in a `Flex gap` by each view (see ProjectFlatPolygonsView / ProjectSiteRollupView).
 */
const CompactKpi: FC<CompactKpiProps> = ({ icon, label, value }) => (
  <Flex
    align="center"
    gap={2}
    bg="white"
    borderWidth="1px"
    borderColor="neutral.200"
    borderRadius="8px"
    paddingX={3}
    paddingY={2}
  >
    <Flex align="center" color="secondary.600" flexShrink={0}>
      {icon}
    </Flex>
    <Flex direction="column">
      <Text textStyle="300" color="neutral.700" whiteSpace="nowrap">
        {label}
      </Text>
      <Text textStyle="400-bold" color="neutral.900" whiteSpace="nowrap">
        {value}
      </Text>
    </Flex>
  </Flex>
);

export default CompactKpi;
