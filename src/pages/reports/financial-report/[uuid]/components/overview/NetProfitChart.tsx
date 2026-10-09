import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from "recharts";

import ChartCard from "@/redesignComponents/dataDisplay/Charts/ChartCard";
import ChartEmptyState from "@/redesignComponents/dataDisplay/Charts/ChartEmptyState";
import ChartLegend from "@/redesignComponents/dataDisplay/Charts/ChartLegend";
import { CHART_AXIS_PROPS, CHART_COLORS, CHART_PLOT_HEIGHT } from "@/redesignComponents/dataDisplay/Charts/chartTheme";
import ChartTooltip from "@/redesignComponents/dataDisplay/Charts/ChartTooltip";
import { FinancialYearSummary, formatCompactUsd, formatUsdAmount } from "@/utils/financialReport";

type NetProfitDatum = {
  year: number;
  revenue: number | null;
  expenses: number | null;
  profit: number | null;
  // Expenses are reported as positive amounts but plotted below the zero line.
  expensesSegment: number | null;
};

/** Rounds up to two significant digits so the half-way ticks stay readable (e.g. 742K -> 750K). */
const niceExtent = (value: number) => {
  if (value <= 0) return 1;
  const magnitude = 10 ** (Math.floor(Math.log10(value)) - 1);
  return Math.ceil(value / magnitude) * magnitude;
};

const NetProfitTooltip: FC<TooltipProps<number, string>> = ({ active, payload }) => {
  const t = useT();
  const datum = payload?.[0]?.payload as NetProfitDatum | undefined;
  if (active !== true || datum == null) return null;

  const format = (value: number | null) => (value == null ? t("No data") : formatUsdAmount(value));
  return (
    <ChartTooltip
      title={String(datum.year)}
      rows={[
        { label: t("Revenue"), value: format(datum.revenue), color: CHART_COLORS.positive },
        { label: t("Expenses"), value: format(datum.expenses), color: CHART_COLORS.neutralPassive },
        { label: t("Net Profit"), value: format(datum.profit), color: CHART_COLORS.neutralActive }
      ]}
    />
  );
};

type NetProfitChartProps = {
  summaries: FinancialYearSummary[];
};

const NetProfitChart: FC<NetProfitChartProps> = ({ summaries }) => {
  const t = useT();

  const data = useMemo<NetProfitDatum[]>(
    () =>
      summaries.map(({ year, revenue, expenses, profit }) => ({
        year,
        revenue,
        expenses: expenses == null ? null : Math.abs(expenses),
        profit,
        expensesSegment: expenses == null ? null : -Math.abs(expenses)
      })),
    [summaries]
  );
  const hasData = data.some(({ revenue, expenses, profit }) => revenue != null || expenses != null || profit != null);

  // Zero sits in the middle of the plot: the axis spans the tallest stack in either direction.
  const yTicks = useMemo(() => {
    const extent = niceExtent(
      Math.max(
        ...data.flatMap(({ revenue, expenses, profit }) => {
          const above = Math.max(revenue ?? 0, 0) + Math.max(profit ?? 0, 0);
          const below = (expenses ?? 0) - Math.min(profit ?? 0, 0);
          return [above, below];
        })
      )
    );
    return [-extent, -extent / 2, 0, extent / 2, extent];
  }, [data]);

  return (
    <ChartCard title={t("Net Profit")} subtitle={t("Annual revenue, expenses, and net profit (USD)")}>
      {hasData ? (
        <>
          <Box height={`${CHART_PLOT_HEIGHT}rem`} textStyle="200">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                stackOffset="sign"
                barCategoryGap="12%"
                margin={{ top: 8, right: 0, bottom: 0, left: 0 }}
              >
                <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} />
                <XAxis dataKey="year" {...CHART_AXIS_PROPS} />
                <YAxis
                  {...CHART_AXIS_PROPS}
                  width={56}
                  domain={[yTicks[0], yTicks[yTicks.length - 1]]}
                  ticks={yTicks}
                  tickFormatter={formatCompactUsd}
                />
                <Tooltip cursor={{ fill: CHART_COLORS.cursor }} content={<NetProfitTooltip />} />
                {/* Net profit sits on the zero line, revenue stacks above it and expenses grow below zero. */}
                <Bar dataKey="profit" stackId="totals" fill={CHART_COLORS.neutralActive} />
                <Bar dataKey="revenue" stackId="totals" fill={CHART_COLORS.positive} />
                <Bar dataKey="expensesSegment" stackId="totals" fill={CHART_COLORS.neutralPassive} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
          <ChartLegend
            items={[
              { label: t("Revenue"), color: CHART_COLORS.positive },
              { label: t("Expenses"), color: CHART_COLORS.neutralPassive },
              { label: t("Net Profit"), color: CHART_COLORS.neutralActive }
            ]}
          />
        </>
      ) : (
        <ChartEmptyState message={t("No revenue, expenses or profit have been reported yet.")} />
      )}
    </ChartCard>
  );
};

export default NetProfitChart;
