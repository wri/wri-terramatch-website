import { useT } from "@transifex/react";
import { FC } from "react";

import ChartCard from "@/redesignComponents/dataDisplay/Charts/ChartCard";
import ChartEmptyState from "@/redesignComponents/dataDisplay/Charts/ChartEmptyState";

/** Shown instead of the chart grid when none of the financial insight charts has data. */
const FinancialInsightsEmptyState: FC = () => {
  const t = useT();

  return (
    <ChartCard title={t("Financial Insights unavailable")}>
      <ChartEmptyState message={t("Charts will appear after financial data is added for this reporting year.")} />
    </ChartCard>
  );
};

export default FinancialInsightsEmptyState;
