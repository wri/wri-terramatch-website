import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { PropsWithChildren, useEffect, useState } from "react";
import { UseControllerProps, UseFormReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { getCurrencyOptions } from "@/constants/options/localCurrency";
import { getMonthOptions } from "@/constants/options/months";
import { OptionValue } from "@/types/common";

import Text from "../../Text/Text";
// import { FieldType } from "@/components/extensive/WizardForm/types";
// import { useMyOrg } from "@/connections/Organisation";
import { DataTableProps } from "../DataTable/DataTable";
import Dropdown from "../Dropdown/Dropdown";
import FileInput from "../FileInput/FileInput";
import Input from "../Input/Input";
import TextArea from "../textArea/TextArea";
import FinancialTableInput from "./FinancialTableInput";
// import {
//   useDeleteV2FinancialIndicatorsUUID,
//   useGetV2FinancialIndicatorsUUID,
//   usePatchV2FinancialIndicatorsUUID,
//   usePostV2FileUploadMODELCOLLECTIONUUID,
//   usePostV2FinancialIndicators
// } from "@/generated/apiComponents";

export interface RHFFinancialIndicatorsDataTableProps
  extends Omit<DataTableProps<any>, "value" | "onChange" | "fields" | "addButtonCaption" | "tableColumns">,
    UseControllerProps {
  onChangeCapture?: () => void;
  formHook?: UseFormReturn;
  collection?: string;
  years?: Array<number>;
  model?: string;
}

export const getFinancialIndicatorsColumns = (
  t: typeof useT | Function = (t: string) => t
): AccessorKeyColumnDef<any>[] => [
  { accessorKey: "amount", header: t("Amount") },
  { accessorKey: "year", header: t("Year") },
  {
    accessorKey: "documentation",
    header: t("Document"),
    cell: props => {
      const doc = props.getValue() as { file_name: string; full_url: string };
      return (
        <a href={doc?.full_url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
          {doc?.file_name}
        </a>
      );
    }
  },
  { accessorKey: "description", header: t("Description") }
];

type HandleChangePayload = {
  value: string | number | null;
  row: number;
  cell: number;
};

const handleChange = (
  payload: HandleChangePayload,
  setData: React.Dispatch<React.SetStateAction<any>>,
  columnMap: string[],
  currencyInput?: string,
  selectCurrency?: any
) => {
  const { value, row, cell } = payload;
  const columnKey = columnMap[cell];

  if (!columnKey || row < 0) return;

  setData((prev: any) => {
    const updated = [...prev];
    const currentRow = { ...updated[row], [columnKey]: value };

    const lowerKeys = Object.keys(currentRow).map(k => k.toLowerCase());

    if (lowerKeys.includes("revenue") && lowerKeys.includes("expenses") && lowerKeys.includes("netprofit")) {
      const revenue = Number(currentRow.revenue ?? 0);
      const expenses = Number(currentRow.expenses ?? 0);
      currentRow.netProfit = `${currencyInput?.[selectCurrency!] ?? ""}${(revenue - expenses).toFixed(2)}`;
    }

    if (lowerKeys.includes("currentassets") && lowerKeys.includes("currentliabilities")) {
      const assets = Number(currentRow.currentAssets ?? 0);
      const liabilities = Number(currentRow.currentLiabilities ?? 0);
      const ratio = liabilities !== 0 ? (assets / liabilities).toFixed(2) : "0";
      currentRow.currentRatio = `${currencyInput?.[selectCurrency!] ?? ""}${ratio}`;
    }

    updated[row] = currentRow;
    return updated;
  });
};

const profitColumnMap = ["year", "revenue", "expenses", "netProfit"];
const currentColumnMap = ["year", "currentAssets", "currentLiabilities", "currentRatio"];
const documentationColumnMap = ["year", "currentAssets", "description"];

const currencyInput = {
  USD: "$",
  EUR: "€",
  GBP: "£"
} as any;

/**
 * @param props PropsWithChildren<RHFSelectProps>
 * @returns React Hook Form Ready Select Component
 */
const RHFFinancialIndicatorsDataTable = ({
  onChangeCapture,
  ...props
}: PropsWithChildren<RHFFinancialIndicatorsDataTableProps>) => {
  const t = useT();
  // const { field } = useController(props);
  // const value = field?.value || [];
  // const [, { organisationId }] = useMyOrg();
  const { years } = props;
  const [selectCurrency, setSelectCurrency] = useState<OptionValue>("USD");
  const [resetTable, setResetTable] = useState(0);

  const initialProfitAnalysisData = years?.map((item, index) => ({
    uuid: index,
    year: item,
    revenue: 0,
    expenses: 0,
    netProfit: `${currencyInput?.[selectCurrency!]}0`
  })) as any[];

  const initialCurrentRadioData = years?.map((item, index) => ({
    uuid: index,
    year: item,
    currentAssets: 0,
    currentLiabilities: 0,
    currentRatio: `${currencyInput?.[selectCurrency!]}0`
  })) as any[];

  const initialDocumentationData = years?.map((item, index) => ({
    uuid: index,
    year: item,
    currentAssets: [
      {
        uuid: "1",
        file_name: "file.pdf",
        src: "file.pdf",
        size: 100,
        mime_type: "application/pdf",
        extension: "pdf",
        is_public: true,
        is_cover: true,
        status: true,
        lat: 0,
        lng: 0,
        created_at: "2021-01-01",
        collection_name: "financial_report",
        title: "file.pdf",
        type: "application/pdf",
        url: "file.pdf",
        raw_url: "file.pdf",
        uploadState: {
          isSuccess: true,
          isError: false,
          isLoading: false,
          isPending: false,
          isUploading: false
        }
      }
    ],
    description: "",
    status: "Not Set"
  })) as any[];

  const [profitAnalysisData, setProfitAnalysisData] = useState(initialProfitAnalysisData);
  const [currentRadioData, setCurrentRadioData] = useState(initialCurrentRadioData);
  const [documentationData, setDocumentationData] = useState(initialDocumentationData);

  const currentRadioColumns = [
    {
      header: "Year",
      accessorKey: "year",
      enableSorting: false,
      meta: {
        width: "15%"
      }
    },
    {
      header: "Assets",
      accessorKey: "currentAssets",
      enableSorting: false,
      cell: ({ cell, row }: { cell: any; row: any }) => {
        const visibleCells = row.getVisibleCells();
        const columnOrderIndex = visibleCells.findIndex((c: any) => c.column.id === cell.column.id);
        const columnKey = currentColumnMap[columnOrderIndex];
        return (
          <div className="border-light flex h-fit items-center justify-between rounded-lg border py-2 px-2.5 hover:border-primary hover:shadow-input">
            <div className="flex items-center gap-0">
              {currencyInput?.[selectCurrency!]}
              <Input
                type="number"
                variant="secondary"
                className="border-none !p-0"
                name={`row-${row.index}-${columnKey}`}
                value={currentRadioData[row.index]?.[columnKey]}
                onChange={e => {
                  handleChange(
                    { value: Number(e.target.value), row: row.index, cell: columnOrderIndex },
                    setCurrentRadioData,
                    currentColumnMap,
                    currencyInput,
                    selectCurrency
                  );
                }}
              />
            </div>
            <span className="text-13">{selectCurrency}</span>
          </div>
        );
      }
    },
    {
      header: "Liabilities",
      accessorKey: "currentLiabilities",
      enableSorting: false,
      cell: ({ cell, row }: { cell: any; row: any }) => {
        const visibleCells = row.getVisibleCells();
        const columnOrderIndex = visibleCells.findIndex((c: any) => c.column.id === cell.column.id);
        const columnKey = currentColumnMap[columnOrderIndex];
        return (
          <div className="border-light flex h-fit items-center justify-between rounded-lg border py-2 px-2.5 hover:border-primary hover:shadow-input">
            <div className="flex items-center gap-0">
              {currencyInput?.[selectCurrency!]}
              <Input
                type="number"
                variant="secondary"
                className="border-none !p-0"
                name={`row-${row.index}-${columnKey}`}
                value={currentRadioData[row.index]?.[columnKey]}
                onChange={e => {
                  handleChange(
                    { value: Number(e.target.value), row: row.index, cell: columnOrderIndex },
                    setCurrentRadioData,
                    currentColumnMap,
                    currencyInput,
                    selectCurrency
                  );
                }}
              />
            </div>
            <span className="text-13">{selectCurrency}</span>
          </div>
        );
      }
    },
    {
      header: "Current Ratio",
      accessorKey: "currentRatio",
      enableSorting: false,
      meta: {
        width: "22.5%"
      },
      cell: ({ row }: { row: any }) => <Text variant="text-14-semibold">{row.original.currentRatio}</Text>
    }
  ];

  const documentationColumns = [
    {
      header: "Year",
      accessorKey: "year",
      enableSorting: false
    },
    {
      header: "Financial Documents",
      accessorKey: "currentAssets",
      enableSorting: false,
      cell: ({ row }: { row: any }) => (
        <div>
          <FileInput files={row.original.currentAssets} />
        </div>
      )
    },
    {
      header: "Description",
      accessorKey: "description",
      enableSorting: false,
      cell: ({ cell, row }: { cell: any; row: any }) => {
        const visibleCells = row.getVisibleCells();
        const columnOrderIndex = visibleCells.findIndex((c: any) => c.column.id === cell.column.id);
        const columnKey = documentationColumnMap[columnOrderIndex];
        return (
          <TextArea
            name={`row-${row.index}-${columnKey}`}
            className="h-fit min-h-min hover:border-primary hover:shadow-input"
            placeholder="Add description here"
            rows={2}
            value={documentationData[row.index]?.[columnKey]}
            onChange={e => {
              handleChange(
                { value: e.target.value, row: row.index, cell: columnOrderIndex },
                setDocumentationData,
                documentationColumnMap,
                currencyInput,
                selectCurrency
              );
            }}
          />
        );
      }
    }
  ];
  const profitAnalysisColumns = [
    {
      header: "Year",
      accessorKey: "year",
      enableSorting: false,
      meta: {
        width: "15%"
      }
    },
    {
      header: "Revenue",
      accessorKey: "revenue",
      enableSorting: false,
      cell: ({ cell, row }: { cell: any; row: any }) => {
        const visibleCells = row.getVisibleCells();
        const columnOrderIndex = visibleCells.findIndex((c: any) => c.column.id === cell.column.id);
        const columnKey = profitColumnMap[columnOrderIndex];
        return (
          <div className="border-light flex h-fit items-center justify-between rounded-lg border py-2 px-2.5 hover:border-primary hover:shadow-input">
            <div className="flex items-center gap-0">
              {currencyInput?.[selectCurrency!]}
              <Input
                type="number"
                variant="secondary"
                className="border-none !p-0"
                name={`row-${row.index}-${columnKey}`}
                value={profitAnalysisData[row.index]?.[columnKey]}
                onChange={e => {
                  handleChange(
                    { value: Number(e.target.value), row: row.index, cell: columnOrderIndex },
                    setProfitAnalysisData,
                    profitColumnMap,
                    currencyInput,
                    selectCurrency
                  );
                }}
              />
            </div>
            <span className="text-13">{selectCurrency}</span>
          </div>
        );
      }
    },
    {
      header: "Expenses",
      accessorKey: "expenses",
      enableSorting: false,
      cell: ({ cell, row }: { cell: any; row: any }) => {
        const visibleCells = row.getVisibleCells();
        const columnOrderIndex = visibleCells.findIndex((c: any) => c.column.id === cell.column.id);
        const columnKey = profitColumnMap[columnOrderIndex];
        return (
          <div className="border-light flex h-fit items-center justify-between rounded-lg border py-2 px-2.5 hover:border-primary hover:shadow-input">
            <div className="flex items-center gap-0">
              {currencyInput?.[selectCurrency!]}
              <Input
                type="number"
                variant="secondary"
                className="border-none !p-0"
                name={`row-${row.index}-${columnKey}`}
                value={profitAnalysisData[row.index]?.[columnKey]}
                onChange={e => {
                  handleChange(
                    { value: Number(e.target.value), row: row.index, cell: columnOrderIndex },
                    setProfitAnalysisData,
                    profitColumnMap,
                    currencyInput,
                    selectCurrency
                  );
                }}
              />
            </div>
            <span className="text-13">{selectCurrency}</span>
          </div>
        );
      }
    },
    {
      header: "Net Profit",
      accessorKey: "netProfit",
      enableSorting: false,
      meta: {
        width: "22.5%"
      },
      cell: ({ row }: { row: any }) => <Text variant="text-14-semibold">{row.original.netProfit}</Text>
    }
  ];

  useEffect(() => {
    setResetTable(prev => prev + 1);
  }, [selectCurrency]);

  console.log(documentationData);

  return (
    <>
      <div className={twMerge("flex-1 bg-white px-16 pt-8 pb-11")}>
        <div className="flex items-center justify-between">
          <Text variant="text-heading-700">Financial Collection</Text>
        </div>
        <Text variant="text-body-600" className="mt-8" containHtml>
          The settings below will affect how your financial data is organized and displayed throughout the dashboard.
        </Text>
        <div className="my-8 h-[2px] w-full bg-neutral-200" />

        <Dropdown
          options={getCurrencyOptions(t)}
          label="Local Currency"
          placeholder="USD - US Dollar"
          value={[selectCurrency]}
          onChange={e => setSelectCurrency(e?.[0])}
        />
        <Dropdown
          options={getMonthOptions(t)}
          onChange={() => {}}
          label="Financial Year Start Month"
          placeholder="Select Month"
        />
        <FinancialTableInput
          resetTable={resetTable}
          label="Profit Analysis"
          description="Revenue is defined as the total amount of money the business earns from selling its goods or services during their financial period, before any expenses are deducted.Expenses are defined as the sum of all the costs the business incurs to operate and generate revenue during their financial period, including taxes."
          tableColumns={profitAnalysisColumns}
          value={profitAnalysisData}
        />
        <FinancialTableInput
          resetTable={resetTable}
          label="Current Ratio"
          description="Current assets are defined as: Cash, accounts receivable, inventory, and other assets that are expected to be converted to cash within one year.Current liabilities are defined as: Accounts payable, short-term debt, and other obligations due within one year.Current ratio is defined as: Current assets divided by current liabilities. A ratio above 1.0 indicates the company can pay its short-term obligations."
          tableColumns={currentRadioColumns}
          value={currentRadioData}
        />
        <FinancialTableInput
          resetTable={resetTable}
          label="Documentation"
          description="Please provide supporting documentation for each year's financial data and add any relevant notes or context about your financial position."
          tableColumns={documentationColumns}
          value={documentationData}
        />
      </div>
    </>
  );
};

export default RHFFinancialIndicatorsDataTable;
