import { ColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { useShowContext } from "react-admin";

import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_FINANCIAL_METRICS } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import { getMonthOptions } from "@/constants/options/months";

import { V2FinancialIndicatorsRead } from "../../../../../generated/apiSchemas";

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

const currencyInput = {
  USD: "$",
  EUR: "€",
  GBP: "£"
} as any;

const FinancialMetrics = ({ data, years }: { data: V2FinancialIndicatorsRead; years?: number[] }) => {
  const ctx = useShowContext();
  const t = useT();
  const fincialReportData = ctx.record;
  const financialMetrics = Object?.values(
    data?.reduce((acc, financial) => {
      if (financial?.collection === "description-documents") {
        return acc;
      }

      const collectionLabel = COLLECTION_LABELS[financial.collection] ?? financial.collection;
      const year = financial.year;
      const amount = financial.amount;

      if (!acc[collectionLabel]) {
        acc[collectionLabel] = { financialMetrics: collectionLabel };
      }

      acc[collectionLabel][year] = `${currencyInput[fincialReportData?.currency] ?? ""}${Number(
        amount
      ).toLocaleString()}`;

      return acc;
    }, {} as Record<string, Record<string, string>>) ?? []
  );

  const ColumnsTableFinancialMetrics: ColumnDef<any>[] = [
    {
      id: "financialMetrics",
      accessorKey: "financialMetrics",
      header: "Financial Metrics",
      enableSorting: false,
      meta: {
        width: "12.75rem",
        sticky: true,
        align: "left",
        style: {
          width: "11.75rem",
          minWidth: "11.75rem",
          maxWidth: "11.75rem",
          position: "sticky",
          left: "0",
          zIndex: "10"
        }
      }
    },
    ...(Array.isArray(years)
      ? years.map(year => ({
          id: String(year),
          header: String(year),
          accessorKey: String(year)
        }))
      : [])
  ];

  return (
    <div className="rounded-lg bg-white px-6 py-6 shadow-all">
      <div className="mb-5 grid w-[70%] grid-cols-2 gap-6">
        <div className="flex flex-col gap-0">
          <Text variant="text-14-light" className="text-darkCustom-300">
            Start of financial year (month)
          </Text>
          <Text variant="text-14">
            {fincialReportData?.fin_start_month
              ? getMonthOptions(t).find(opt => opt.value == fincialReportData?.fin_start_month)?.title
              : "Not Provided"}
          </Text>
        </div>
        <div className="flex flex-col gap-0">
          <Text variant="text-14-light" className="text-darkCustom-300">
            Currency
          </Text>
          <Text variant="text-14">{fincialReportData?.currency ?? "Not Provided"}</Text>
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
