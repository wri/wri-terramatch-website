import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { range } from "lodash";
import { FC, useMemo } from "react";
import {
  CartesianGrid,
  DotProps,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis
} from "recharts";

import ChartCard from "@/redesignComponents/dataDisplay/Charts/ChartCard";
import ChartEmptyState from "@/redesignComponents/dataDisplay/Charts/ChartEmptyState";
import ChartLegend from "@/redesignComponents/dataDisplay/Charts/ChartLegend";
import { CHART_AXIS_PROPS, CHART_COLORS, CHART_PLOT_HEIGHT } from "@/redesignComponents/dataDisplay/Charts/chartTheme";
import ChartTooltip from "@/redesignComponents/dataDisplay/Charts/ChartTooltip";
import { FinancialYearSummary, formatUsdAmount, HEALTHY_CURRENT_RATIO } from "@/utils/financialReport";

const MIN_RATIO_AXIS_MAX = 3;

// Space between the plot edges and the first / last year (36px at the default root font size).
const X_AXIS_EDGE_PADDING_REM = 2.25;

// Recharts only accepts pixel padding, so convert using the (responsive) root font size.
const remToPx = (rem: number) =>
  rem * (typeof document === "undefined" ? 16 : parseFloat(getComputedStyle(document.documentElement).fontSize));

type CurrentRatioDatum = {
  year: number;
  ratio: number | null;
  currentAssets: number | null;
  currentLiabilities: number | null;
} & Record<string, number | null>;

const ratioColor = (ratio: number) => (ratio >= HEALTHY_CURRENT_RATIO ? CHART_COLORS.positive : CHART_COLORS.negative);

const segmentKey = (index: number) => `segment${index}`;

const formatRatio = (ratio: number) => (Math.round(ratio * 100) / 100).toLocaleString();

type RatioDotProps = Pick<DotProps, "cx" | "cy"> & { key?: string; payload?: CurrentRatioDatum };

// Recharts types custom dot renderer props as `unknown`; it passes the dot position plus the row payload.
const renderRatioDot = (props: unknown) => {
  const { key, cx, cy, payload } = props as RatioDotProps;
  return cx == null || cy == null || payload?.ratio == null ? (
    <g key={key} />
  ) : (
    <circle key={key} cx={cx} cy={cy} r={3} fill="white" stroke={ratioColor(payload.ratio)} strokeWidth={2} />
  );
};

const CurrentRatioTooltip: FC<TooltipProps<number, string>> = ({ active, payload }) => {
  const t = useT();
  const datum = payload?.[0]?.payload as CurrentRatioDatum | undefined;
  if (active !== true || datum == null) return null;

  const format = (value: number | null) => (value == null ? t("No data") : formatUsdAmount(value));
  return (
    <ChartTooltip
      title={String(datum.year)}
      rows={[
        {
          label: t("Ratio"),
          value: datum.ratio == null ? t("No data") : formatRatio(datum.ratio),
          color: datum.ratio == null ? undefined : ratioColor(datum.ratio)
        },
        {
          label: t("Assets"),
          value: format(datum.currentAssets),
          color: CHART_COLORS.neutralActive,
          dividerBefore: true
        },
        { label: t("Liabilities"), value: format(datum.currentLiabilities), color: CHART_COLORS.neutralPassive }
      ]}
    />
  );
};

type CurrentRatioChartProps = {
  summaries: FinancialYearSummary[];
};

const CurrentRatioChart: FC<CurrentRatioChartProps> = ({ summaries }) => {
  const t = useT();
  const edgePadding = useMemo(() => remToPx(X_AXIS_EDGE_PADDING_REM), []);

  const { data, segments, ratioAxisMax, hasData } = useMemo(() => {
    const rows: CurrentRatioDatum[] = summaries.map(({ year, currentRatio, currentAssets, currentLiabilities }) => ({
      year,
      ratio: currentRatio,
      currentAssets,
      currentLiabilities
    }));

    // Each segment between two consecutive reported ratios is its own series, so it can be colored by
    // the health of the year it leads into. Years without a ratio break the line instead of plotting zero.
    const lineSegments: { key: string; color: string }[] = [];
    rows.forEach((row, index) => {
      const next = rows[index + 1];
      if (row.ratio == null || next?.ratio == null) return;

      const key = segmentKey(index);
      row[key] = row.ratio;
      next[key] = next.ratio;
      lineSegments.push({ key, color: ratioColor(next.ratio) });
    });

    const ratios = rows.flatMap(({ ratio }) => (ratio == null ? [] : [ratio]));
    return {
      data: rows,
      segments: lineSegments,
      ratioAxisMax: Math.max(MIN_RATIO_AXIS_MAX, Math.ceil(Math.max(0, ...ratios))),
      hasData: rows.some(
        ({ ratio, currentAssets, currentLiabilities }) =>
          ratio != null || currentAssets != null || currentLiabilities != null
      )
    };
  }, [summaries]);
  const gridValues = useMemo(
    () => range(0, ratioAxisMax + 1).filter(value => value !== HEALTHY_CURRENT_RATIO),
    [ratioAxisMax]
  );

  return (
    <ChartCard title={t("Current Ratio")} subtitle={t("Annual current ratio = current assets / current liabilities")}>
      {hasData ? (
        <>
          <Box height={`${CHART_PLOT_HEIGHT}rem`} textStyle="200">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
                {/* The healthy threshold gets its own dotted line, so the solid grid line is skipped there. */}
                <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} horizontalValues={gridValues} />
                <XAxis dataKey="year" {...CHART_AXIS_PROPS} padding={{ left: edgePadding, right: edgePadding }} />
                <YAxis {...CHART_AXIS_PROPS} width={24} domain={[0, ratioAxisMax]} allowDecimals={false} />
                <ReferenceLine y={HEALTHY_CURRENT_RATIO} stroke={CHART_COLORS.neutralPassive} strokeDasharray="2 2" />
                {/* Assets and liabilities are not plotted; they only appear in the tooltip as context for the ratio. */}
                <Tooltip cursor={false} content={<CurrentRatioTooltip />} />
                {segments.map(({ key, color }) => (
                  <Line
                    key={key}
                    dataKey={key}
                    type="linear"
                    stroke={color}
                    strokeWidth={1.5}
                    dot={false}
                    activeDot={false}
                    isAnimationActive={false}
                  />
                ))}
                <Line
                  dataKey="ratio"
                  type="linear"
                  stroke="none"
                  dot={renderRatioDot}
                  activeDot={renderRatioDot}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
          <ChartLegend
            items={[
              { label: t("Healthy"), color: CHART_COLORS.positive },
              { label: t("Unhealthy/Critical"), color: CHART_COLORS.negative }
            ]}
          />
        </>
      ) : (
        <ChartEmptyState message={t("No current assets or liabilities have been reported yet.")} />
      )}
    </ChartCard>
  );
};

export default CurrentRatioChart;
