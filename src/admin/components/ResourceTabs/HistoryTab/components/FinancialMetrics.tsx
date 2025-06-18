import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_FINANCIAL_METRICS } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";

import { ColumnsTableFinancialMetrics } from "./ColumnsTableFinancialMetrics";

const FinancialMetrics = () => {
  return (
    <div className="rounded-lg bg-white px-6 py-6 shadow-all">
      <div className="mb-5 grid w-[70%] grid-cols-2 gap-6">
        <div className="flex flex-col gap-0">
          <Text variant="text-14-light" className="text-darkCustom-300">
            Start of financial year (month)
          </Text>
          <Text variant="text-14">Not Provided</Text>
        </div>
        <div className="flex flex-col gap-0">
          <Text variant="text-14-light" className="text-darkCustom-300">
            Currency
          </Text>
          <Text variant="text-14">USD</Text>
        </div>
      </div>
      <div className="w-full max-w-[47.8vw] overflow-hidden lg:max-w-[57vw] wide:max-w-[65vw]">
        <Table
          columns={ColumnsTableFinancialMetrics}
          data={[
            {
              financialMetrics: "Revenue & Expenses",
              isHeader: true
            },
            {
              financialMetrics: "Revenue",
              2020: "$2,450,000",
              2021: "$2,450,000",
              2022: "$2,450,000",
              2023: "$2,450,000",
              2024: "$2,450,000",
              2025: "$2,450,000",
              2026: "$2,450,000",
              2027: "$2,450,000",
              2028: "$2,450,000",
              2029: "$2,450,000",
              2030: "$2,450,000"
            },
            {
              financialMetrics: "Expenses",
              2020: "$2,450,000",
              2021: "$2,450,000",
              2022: "$2,450,000",
              2023: "$2,450,000",
              2024: "$2,450,000",
              2025: "$2,450,000",
              2026: "$2,450,000"
            },
            {
              financialMetrics: "Net Profit",
              2020: "$2,450,000",
              2021: "$2,450,000",
              2022: "$2,450,000",
              2023: "$2,450,000",
              2024: "$2,450,000",
              2025: "$2,450,000",
              2026: "$2,450,000"
            },
            {
              financialMetrics: "Revenue & Expenses",
              isHeader: true
            },
            {
              financialMetrics: "Current Assets",
              2020: "$2,450,000",
              2021: "$2,450,000",
              2022: "$2,450,000",
              2023: "$2,450,000",
              2024: "$2,450,000",
              2025: "$2,450,000",
              2026: "$2,450,000"
            },
            {
              financialMetrics: "Current Liabilities",
              2020: "$2,450,000",
              2021: "$2,450,000",
              2022: "$2,450,000",
              2023: "$2,450,000",
              2024: "$2,450,000",
              2025: "$2,450,000",
              2026: "$2,450,000"
            }
          ]}
          getRowClassName={row => (row.isHeader ? "table-financial-metrics-header" : " table-financial-metrics")}
          variant={VARIANT_TABLE_FINANCIAL_METRICS}
        />
      </div>
    </div>
  );
};

export default FinancialMetrics;
