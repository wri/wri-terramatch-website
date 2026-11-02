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
import { FinancialYearSummary, formatCompactUsd } from "@/utils/financialReport";

type OperatingBudgetDatum = {
  year: number;
  budget: number | null;
  yearOverYearChange: number | null;
};

const CHANGE_DOT = { r: 3, fill: "white", stroke: CHART_COLORS.neutralActive, strokeWidth: 1.5 };

const formatPercentChange = (change: number) => `${change > 0 ? "+" : ""}${Math.round(change).toLocaleString()}%`;

const OperatingBudgetTooltip: FC<TooltipProps<number, string>> = ({ active, payload }) => {
  const t = useT();
  const datum = payload?.[0]?.payload as OperatingBudgetDatum | undefined;
  if (active !== true || datum == null) return null;

  return (
    <ChartTooltip
      title={String(datum.year)}
      rows={[
        {
          label: t("Operating Budget"),
          value: datum.budget == null ? t("No data") : formatCompactUsd(datum.budget),
          color: CHART_COLORS.positive
        },
        {
          label: t("Year-over-year Change"),
          value: datum.yearOverYearChange == null ? t("No data") : formatPercentChange(datum.yearOverYearChange),
          color: CHART_COLORS.neutralActive
        }
      ]}
    />
  );
};

type OperatingBudgetChartProps = {
  summaries: FinancialYearSummary[];
};

const OperatingBudgetChart: FC<OperatingBudgetChartProps> = ({ summaries }) => {
  const t = useT();

  const data = useMemo(
    () =>
      summaries.map<OperatingBudgetDatum>(({ year, budget }, index) => {
        const previous = summaries[index - 1]?.budget;
        return {
          year,
          budget,
          yearOverYearChange:
            budget == null || previous == null || previous === 0 ? null : ((budget - previous) / previous) * 100
        };
      }),
    [summaries]
  );

  return (
    <ChartCard title={t("Operating Budget")} subtitle={t("Annual operating budget (USD)")}>
      {data.some(({ budget }) => budget != null) ? (
        <>
          <Box height={`${CHART_PLOT_HEIGHT}rem`} textStyle="200">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} barCategoryGap="12%" margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
                <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} />
                <XAxis dataKey="year" {...CHART_AXIS_PROPS} />
                <YAxis yAxisId="amount" {...CHART_AXIS_PROPS} width={56} tickFormatter={formatCompactUsd} />
                <YAxis yAxisId="change" orientation="right" hide />
                <Tooltip cursor={{ fill: CHART_COLORS.cursor }} content={<OperatingBudgetTooltip />} />
                <Bar yAxisId="amount" dataKey="budget" fill={CHART_COLORS.positive} />
                <Line
                  yAxisId="change"
                  dataKey="yearOverYearChange"
                  type="linear"
                  stroke={CHART_COLORS.neutralActive}
                  strokeWidth={1.5}
                  dot={CHANGE_DOT}
                  activeDot={CHANGE_DOT}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
          <ChartLegend
            items={[
              { label: t("Operating Budget (USD)"), color: CHART_COLORS.positive },
              { label: t("Year-over-year Change"), color: CHART_COLORS.neutralActive }
            ]}
          />
        </>
      ) : (
        <ChartEmptyState message={t("No operating budget has been reported yet.")} />
      )}
    </ChartCard>
  );
};

export default OperatingBudgetChart;
