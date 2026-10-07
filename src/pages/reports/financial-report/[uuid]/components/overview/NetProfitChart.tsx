import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useMemo } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
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
import { FinancialYearSummary, formatCompactUsd, formatUsdAmount } from "@/utils/financialReport";

type NetProfitDatum = {
  year: number;
  revenue: number | null;
  expenses: number | null;
  profit: number | null;
};

const NET_PROFIT_DOT = { r: 4, fill: "white", stroke: CHART_COLORS.neutralActive, strokeWidth: 1.5 };

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
        // Expenses are plotted below zero; show the reported (positive) amount.
        {
          label: t("Expenses"),
          value: format(datum.expenses == null ? null : Math.abs(datum.expenses)),
          color: CHART_COLORS.neutralPassive
        },
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
        // Expenses are reported as positive amounts but plotted below the zero line.
        expenses: expenses == null ? null : -Math.abs(expenses),
        profit
      })),
    [summaries]
  );
  const hasData = data.some(({ revenue, expenses, profit }) => revenue != null || expenses != null || profit != null);

  return (
    <ChartCard title={t("Net Profit")} subtitle={t("Annual revenue, expenses, and net profit (USD)")}>
      {hasData ? (
        <>
          <Box height={`${CHART_PLOT_HEIGHT}px`}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={data}
                stackOffset="sign"
                barCategoryGap="12%"
                margin={{ top: 8, right: 0, bottom: 0, left: 0 }}
              >
                <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} />
                <XAxis dataKey="year" {...CHART_AXIS_PROPS} />
                <YAxis {...CHART_AXIS_PROPS} width={48} tickFormatter={formatCompactUsd} />
                <Tooltip cursor={{ fill: CHART_COLORS.cursor }} content={<NetProfitTooltip />} />
                <Bar dataKey="revenue" stackId="totals" fill={CHART_COLORS.positive} />
                <Bar dataKey="expenses" stackId="totals" fill={CHART_COLORS.neutralPassive} />
                <Line
                  dataKey="profit"
                  type="linear"
                  stroke={CHART_COLORS.neutralActive}
                  strokeWidth={1.5}
                  dot={NET_PROFIT_DOT}
                  activeDot={NET_PROFIT_DOT}
                />
              </ComposedChart>
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
