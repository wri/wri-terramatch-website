import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from "recharts";

import ChartCard from "@/redesignComponents/dataDisplay/Charts/ChartCard";
import ChartEmptyState from "@/redesignComponents/dataDisplay/Charts/ChartEmptyState";
import ChartLegend from "@/redesignComponents/dataDisplay/Charts/ChartLegend";
import { CHART_AXIS_PROPS, CHART_COLORS, CHART_PLOT_HEIGHT } from "@/redesignComponents/dataDisplay/Charts/chartTheme";
import ChartTooltip from "@/redesignComponents/dataDisplay/Charts/ChartTooltip";
import { formatCompactUsd, formatUsdAmount } from "@/utils/financialReport";

export type ExternalFinanceDatum = {
  year: number;
  amount: number | null;
};

const ExternalFinanceTooltip: FC<TooltipProps<number, string>> = ({ active, payload }) => {
  const t = useT();
  const datum = payload?.[0]?.payload as ExternalFinanceDatum | undefined;
  if (active !== true || datum == null) return null;

  return (
    <ChartTooltip
      variant="highlight"
      title={String(datum.year)}
      rows={[
        { label: t("Capital Raised"), value: datum.amount == null ? t("No data") : formatUsdAmount(datum.amount) }
      ]}
    />
  );
};

type ExternalFinanceChartProps = {
  data: ExternalFinanceDatum[];
};

const ExternalFinanceChart: FC<ExternalFinanceChartProps> = ({ data }) => {
  const t = useT();

  return (
    <ChartCard
      title={t("External Finance Catalyzed")}
      subtitle={t("Annual total capital raised from external funders (USD)")}
    >
      {data.some(({ amount }) => amount != null) ? (
        <>
          <Box height={`${CHART_PLOT_HEIGHT}rem`} textStyle="200">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barCategoryGap="8%" margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} />
                <XAxis dataKey="year" {...CHART_AXIS_PROPS} />
                <YAxis {...CHART_AXIS_PROPS} width={48} tickFormatter={formatCompactUsd} />
                <Tooltip cursor={{ fill: CHART_COLORS.cursor }} content={<ExternalFinanceTooltip />} />
                <Bar dataKey="amount" fill={CHART_COLORS.neutralActive} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
          <ChartLegend items={[{ label: t("Capital Raised (USD)"), color: CHART_COLORS.neutralActive }]} />
        </>
      ) : (
        <ChartEmptyState message={t("No external funding has been reported yet.")} />
      )}
    </ChartCard>
  );
};

export default ExternalFinanceChart;
