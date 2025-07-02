import { useT } from "@transifex/react";
import { useShowContext } from "react-admin";

import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_FINANCIAL_METRICS } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import { getMonthOptions } from "@/constants/options/months";

import { ColumnsTableFinancialMetrics } from "./ColumnsTableFinancialMetrics";

const COLLECTION_LABELS: Record<string, string> = {
  revenue: "Revenue",
  budget: "Budget",
  expenses: "Expenses",
  "current-assets": "Current Assets",
  "current-liabilities": "Current Liabilities",
  profit: "Profit",
  "current-ratio": "Current Ratio",
  "description-documents": "Description Documents"
};

const FinancialMetrics = () => {
  const ctx = useShowContext();
  const t = useT();
  const organisationData = ctx.record?.organisation;
  const financialMetrics = Object.values(
    ctx.record?.financialCollection?.reduce((acc: any, financial: any) => {
      if (financial?.collection === "description-documents") {
        return acc;
      }

      const collectionLabel = COLLECTION_LABELS[financial.collection] ?? financial.collection;
      const year = financial.year;
      const amount = financial.amount;

      if (!acc[collectionLabel]) {
        acc[collectionLabel] = { financialMetrics: collectionLabel };
      }

      acc[collectionLabel][year] = `$${Number(amount).toLocaleString()}`;

      return acc;
    }, {} as Record<string, Record<string, string>>)
  );

  return (
    <div className="rounded-lg bg-white px-6 py-6 shadow-all">
      <div className="mb-5 grid w-[70%] grid-cols-2 gap-6">
        <div className="flex flex-col gap-0">
          <Text variant="text-14-light" className="text-darkCustom-300">
            Start of financial year (month)
          </Text>
          <Text variant="text-14">
            {organisationData?.fin_start_month
              ? getMonthOptions(t).find(opt => opt.value == organisationData?.fin_start_month)?.title
              : "Not Provided"}
          </Text>
        </div>
        <div className="flex flex-col gap-0">
          <Text variant="text-14-light" className="text-darkCustom-300">
            Currency
          </Text>
          <Text variant="text-14">{organisationData?.currency ?? "Not Provided"}</Text>
        </div>
      </div>
      <div className="w-full max-w-[47.8vw] overflow-hidden lg:max-w-[57vw] wide:max-w-[65vw]">
        <Table
          columns={ColumnsTableFinancialMetrics}
          data={financialMetrics}
          getRowClassName={row => (row.isHeader ? "table-financial-metrics-header" : " table-financial-metrics")}
          variant={VARIANT_TABLE_FINANCIAL_METRICS}
        />
      </div>
    </div>
  );
};

export default FinancialMetrics;
