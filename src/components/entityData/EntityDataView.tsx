import { Box, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";

/**
 * The standardized entity-data layout: a map on the left, and a right column stacking the anomaly
 * work-queue over the aggregated indicators.
 *
 * Both the project and the site Overview render this identical shell — only the three slots differ
 * (project centroids vs. site polygon shapes, project- vs. site-scoped actions and KPIs). Keeping
 * the structure in one place is what makes the two pages the same page at different levels, rather
 * than two layouts that have to be kept in sync by hand.
 *
 * The row height is fixed and set with an inline style, not a Tailwind arbitrary class: a bounded
 * height is what keeps the Mapbox canvas from spilling into the section below, and arbitrary heights
 * on the `ws-1100` breakpoint did not survive this project's build. The indicator panel takes the
 * rest of the right column and scrolls internally, so a long child list never stretches the row.
 */
export interface EntityDataViewProps {
  map: ReactNode;
  actions: ReactNode;
  kpis: ReactNode;
  rowHeight?: string;
}

const EntityDataView = ({ map, actions, kpis, rowHeight = "34rem" }: EntityDataViewProps) => (
  <Flex gap={5} className="w-full flex-col ws-1100:flex-row" style={{ minHeight: rowHeight }}>
    <Box className="relative w-full flex-1 overflow-hidden rounded-lg" style={{ height: rowHeight }}>
      {map}
    </Box>
    <Flex className="w-full shrink-0 flex-col ws-1100:w-[26rem]" gap={4} style={{ height: rowHeight }}>
      {/* `[&:empty]:hidden`: when the actions slot renders nothing — a clean polygon whose
          EntityActions returns null — this Box has no DOM children, so `:empty` matches and it is
          removed from the flex flow. A display:none item takes no `gap`, so the indicator panel
          top-aligns with the map instead of sitting a gap's-worth below it. When actions do render
          (the always-present project/site work-queue panel), the Box is non-empty and the gap stays. */}
      <Box className="shrink-0 [&:empty]:hidden">{actions}</Box>
      <Box className="min-h-0 flex-1 overflow-hidden">{kpis}</Box>
    </Flex>
  </Flex>
);

export default EntityDataView;
