import { ColumnDef } from "@tanstack/react-table";
import { useShowContext } from "react-admin";

import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_FINANCIAL_METRICS } from "@/components/elements/Table/TableVariants";
import WizardFormProvider, { FormFieldsProvider, FormModel, OrgFormDetails } from "@/context/wizardForm.provider";
import { FinancialIndicatorDto } from "@/generated/v3/userService/userServiceSchemas";
import { formatFinancialAmount, getCurrencySymbolPrefix, getLocaleForIsoCurrency } from "@/utils/financialReport";

import InformationTabRow from "../../InformationTab/components/InformationTabRow";

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

const FinancialMetrics = ({
  data,
  years,
  fieldsProvider,
  model,
  orgDetails,
  values
}: {
  data: FinancialIndicatorDto[];
  years?: number[];
  fieldsProvider: FormFieldsProvider;
  model: FormModel;
  orgDetails: OrgFormDetails;
  values: Record<string, unknown>;
}) => {
  const ctx = useShowContext();
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

      const iso = fincialReportData?.currency;
      const isRatio = financial.collection === "current-ratio";
      acc[collectionLabel][year] = isRatio
        ? Number(amount).toLocaleString(getLocaleForIsoCurrency(iso))
        : `${getCurrencySymbolPrefix(iso)} ${formatFinancialAmount(Number(amount), iso)}`.trim();

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
          accessorKey: String(year),
          cell: ({ getValue }: any) => getValue() || "",
          meta: {
            align: "center" as const
          }
        }))
      : [])
  ];

  return (
    <div className="rounded-lg bg-white px-6 py-6 shadow-all">
      <div className="grid w-[150%] grid-cols-2">
        <WizardFormProvider fieldsProvider={fieldsProvider} models={model} orgDetails={orgDetails}>
          {fieldsProvider.stepIds().map(stepId => (
            <div key={stepId}>
              <InformationTabRow stepId={stepId} values={values} />
            </div>
          ))}
        </WizardFormProvider>
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
