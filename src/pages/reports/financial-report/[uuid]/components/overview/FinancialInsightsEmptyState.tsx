import { useT } from "@transifex/react";
import { FC } from "react";

import ChartCard from "@/redesignComponents/dataDisplay/Charts/ChartCard";
import ChartEmptyState from "@/redesignComponents/dataDisplay/Charts/ChartEmptyState";

type FinancialInsightsEmptyStateProps = {
  isReportDue: boolean;
};

/** Shown instead of the chart grid when the report is due or none of the financial insight charts has data. */
const FinancialInsightsEmptyState: FC<FinancialInsightsEmptyStateProps> = ({ isReportDue }) => {
  const t = useT();

  return isReportDue ? (
    <ChartCard title={t("Report not started yet")} className="!h-[9.75rem]">
      <ChartEmptyState
        message={t(
          "Financial insights for this reporting period will appear once you start the report and add its financial data."
        )}
      />
    </ChartCard>
  ) : (
    <ChartCard title={t("Financial Insights unavailable")} className="!h-[9.75rem]">
      <ChartEmptyState message={t("Charts will appear after financial data is added for this reporting year.")} />
    </ChartCard>
  );
};

export default FinancialInsightsEmptyState;
