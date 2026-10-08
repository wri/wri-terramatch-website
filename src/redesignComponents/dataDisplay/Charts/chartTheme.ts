import { getThemedColor } from "@/lib/theme";

/** Data-visualisation semantic colors from the WRI design system. */
export const CHART_COLORS = {
  positive: getThemedColor("positive", 1),
  negative: getThemedColor("negative", 1),
  neutralActive: getThemedColor("neutralActive", 1),
  neutralPassive: getThemedColor("neutralPassive", 1),
  grid: getThemedColor("neutral", 300),
  axisText: getThemedColor("neutral", 900),
  cursor: getThemedColor("neutral", 200)
};

export const CHART_PLOT_HEIGHT = 216;

export const CHART_AXIS_TICK = { fontSize: 12, fill: CHART_COLORS.axisText };

/** Shared axis props: no axis lines or tick marks, design-system tick typography. */
export const CHART_AXIS_PROPS = {
  axisLine: false,
  tickLine: false,
  tick: CHART_AXIS_TICK
} as const;
