import { Box, Text } from "@chakra-ui/react";
import { FC, KeyboardEvent } from "react";

/**
 * The shared summary-tile card used by both ProjectPolygonSummaryTiles (interactive filter toggles)
 * and ProjectSiteRollupSummary (read-only counts). One card layout, one type scale — pass `onToggle`
 * to make a tile behave as a filter button (keyboard-activatable, with an active bg/border and a
 * visible focus ring).
 *
 * There is no design-system primitive for a toggleable count tile (MetricCard is a metric-vs-goal card,
 * ItemCount is a pagination widget, Badge/Tag are labels), so this stays a custom component — but it is
 * built entirely on DS tokens (type scale, semantic colors, spacing/radius).
 *
 * Lives under src/pages/**, where Next's pageExtensions ("tsx") collects every .tsx as a route and
 * requires a default-exported React component — this component satisfies that; it is never routed to.
 */
export interface SummaryTileProps {
  /** Pre-formatted value string (e.g. a localized count, or "—" while loading). */
  value: string;
  label: string;
  /** Color token for the large value figure. */
  valueColor: string;
  /** When provided, the tile becomes a toggle button. */
  onToggle?: () => void;
  isActive?: boolean;
  activeBg?: string;
  activeBorder?: string;
}

const SummaryTile: FC<SummaryTileProps> = ({
  value,
  label,
  valueColor,
  onToggle,
  isActive = false,
  activeBg,
  activeBorder
}) => {
  const interactive = onToggle != null;

  return (
    <Box
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? onToggle : undefined}
      onKeyDown={
        interactive
          ? (event: KeyboardEvent<HTMLDivElement>) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onToggle?.();
              }
            }
          : undefined
      }
      aria-pressed={interactive ? isActive : undefined}
      cursor={interactive ? "pointer" : undefined}
      transition={interactive ? "border-color .1s, background .1s" : undefined}
      _hover={interactive ? { borderColor: activeBorder } : undefined}
      // The theme defines no global focus ring, so give the toggle its own visible focus state.
      _focusVisible={
        interactive ? { outline: "2px solid", outlineColor: "primary.500", outlineOffset: "2px" } : undefined
      }
      textAlign="left"
      flex="1 1 0"
      minW="9.375rem"
      px={4}
      py={3}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={interactive && isActive ? activeBorder : "neutral.200"}
      bg={interactive && isActive ? activeBg : "white"}
    >
      <Text textStyle="700-bold" color={valueColor}>
        {value}
      </Text>
      <Text textStyle="300" color="neutral.700" mt={1}>
        {label}
      </Text>
    </Box>
  );
};

export default SummaryTile;
