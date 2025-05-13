import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
// import { Tab as HTab } from "@headlessui/react";
// import classNames from "classnames";
// import { VARIANT_TABLE_PRIMARY } from "../../Table/TableVariants";
// import { captureEvent } from "@sentry/nextjs";
import { randomUUID } from "crypto";
import { PropsWithChildren, useEffect, useState } from "react";
import { UseControllerProps, UseFormReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { getCurrencyOptions } from "@/constants/options/localCurrency";
import { getMonthOptions } from "@/constants/options/months";
import { OptionValue } from "@/types/common";

import Text from "../../Text/Text";
// import * as yup from "yup";
// import { FieldType } from "@/components/extensive/WizardForm/types";
// import { useMyOrg } from "@/connections/Organisation";
import { DataTableProps } from "../DataTable/DataTable";
import Dropdown from "../Dropdown/Dropdown";
import FileInput from "../FileInput/FileInput";
import Input from "../Input/Input";
import TextArea from "../textArea/TextArea";
// import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
// import FrameworkProvider from "@/context/framework.provider";
// import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
// import WizardForm from "@/components/extensive/WizardForm";
// import {
//   MOCKED_FINANCIAL_REPORT_TITLE,
//   STEPS_MOCKED_DATA_FINANCIAL_REPORT
// } from "@/pages/entity/[entityName]/financial-report/[uuid]/mockedData";
// import Log from "@/utils/log";
// import router from "next/router";
// import { FormStep } from "@/components/extensive/WizardForm/FormStep";
import FinancialTableInput from "./FinancialTableInput";
// import {
//   useDeleteV2FinancialIndicatorsUUID,
//   useGetV2FinancialIndicatorsUUID,
//   usePatchV2FinancialIndicatorsUUID,
//   usePostV2FileUploadMODELCOLLECTIONUUID,
//   usePostV2FinancialIndicators
// } from "@/generated/apiComponents";

// const currentRadioData = [
//   {
//     uuid: "1",
//     year: 2022,
//     currentAssets: "0",
//     currentLiabilities: "0",
//     currentRatio: "$0"
//   },
//   {
//     uuid: "2",
//     year: 2023,
//     currentAssets: "0",
//     currentLiabilities: "0",
//     currentRatio: "$0"
//   },
//   {
//     uuid: "3",
//     year: 2024,
//     currentAssets: "0",
//     currentLiabilities: "0",
//     currentRatio: "$0"
//   },
//   {
//     uuid: "4",
//     year: 2025,
//     currentAssets: "0",
//     currentLiabilities: "0",
//     currentRatio: "$0"
//   }
// ];
// const documentationData = [
//   {
//     uuid: "1",
//     year: 2022,
//     currentAssets: [],
//     currentLiabilities: "0",
//     currentRatio: "$0",
//     status: "Not Set"
//   },
//   {
//     uuid: "2",
//     year: 2023,
//     currentAssets: [
//       {
//         uuid: "1",
//         file_name: "file.pdf",
//         src: "file.pdf",
//         size: 100,
//         mime_type: "application/pdf",
//         extension: "pdf",
//         is_public: true,
//         is_cover: true,
//         status: true,
//         lat: 0,
//         lng: 0,
//         created_at: "2021-01-01",
//         collection_name: "financial_report",
//         title: "file.pdf",
//         type: "application/pdf",
//         url: "file.pdf",
//         raw_url: "file.pdf",
//         uploadState: {
//           isSuccess: true,
//           isError: false,
//           isLoading: false,
//           isPending: false,
//           isUploading: false
//         }
//       }
//     ],
//     currentLiabilities: "0",
//     currentRatio: "$0",
//     status: "Not Set"
//   },
//   {
//     uuid: "3",
//     year: 2024,
//     currentAssets: [],
//     currentLiabilities: "0",
//     currentRatio: "$0",
//     status: "Not Set"
//   },
//   {
//     uuid: "4",
//     year: 2025,
//     currentAssets: [],
//     currentLiabilities: "0",
//     currentRatio: "$0",
//     status: "Not Set"
//   }
// ];

// const profitAnalysisData = [
//   {
//     uuid: "1",
//     year: 2022,
//     revenue: "0",
//     expenses: "0",
//     netProfit: "$0"
//   },
//   {
//     uuid: "2",
//     year: 2023,
//     revenue: "0",
//     expenses: "0",
//     netProfit: "$0"
//   },
//   {
//     uuid: "3",
//     year: 2024,
//     revenue: "0",
//     expenses: "0",
//     netProfit: "$0"
//   },
//   {
//     uuid: "4",
//     year: 2025,
//     revenue: "0",
//     expenses: "0",
//     netProfit: "$0"
//   }
// ];

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
  columnMap: string[]
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
      currentRow.netProfit = `$${(revenue - expenses).toFixed(2)}`;
    }

    if (lowerKeys.includes("assets") && lowerKeys.includes("liabilities") && lowerKeys.includes("currentratio")) {
      const assets = Number(currentRow.assets ?? 0);
      const liabilities = Number(currentRow.liabilities ?? 0);
      const ratio = liabilities !== 0 ? (assets / liabilities).toFixed(2) : "0";
      currentRow.currentRatio = `$${ratio}`;
    }

    updated[row] = currentRow;
    return updated;
  });
};

const profitColumnMap = ["year", "revenue", "expenses", "netProfit"];
const currentColumnMap = ["year", "currentAssets", "currentLiabilities", "currentRatio"];
const documentationColumnMap = ["year", "currentAssets", "description"];

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
  // const [file, setFile] = useState<File>();
  const [selectCurrency, setSelectCurrency] = useState<OptionValue>("USD");

  const initialProfitAnalysisData = years?.map(item => ({
    uuid: randomUUID,
    year: item,
    revenue: 0,
    expenses: 0,
    netProfit: "$0"
  })) as any[];

  const initialCurrentRadioData = years?.map(item => ({
    uuid: randomUUID,
    year: item,
    currentAssets: 0,
    currentLiabilities: 0,
    currentRatio: "$0"
  })) as any[];

  const initialDocumentationData = years?.map(item => ({
    uuid: randomUUID,
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
    currentLiabilities: "0",
    currentRatio: "$0",
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
      accessorKey: "assets",
      enableSorting: false,
      cell: ({ cell, row }: { cell: any; row: any }) => {
        const visibleCells = row.getVisibleCells();
        const columnOrderIndex = visibleCells.findIndex((c: any) => c.column.id === cell.column.id);
        const columnKey = currentColumnMap[columnOrderIndex];
        return (
          <div className="border-light flex h-fit items-center justify-between rounded-lg border py-2 px-2.5 hover:border-primary hover:shadow-input">
            <div className="flex items-center gap-0">
              $
              <Input
                type="number"
                variant="secondary"
                className="border-none !p-0"
                name={`row-${row.index}-${columnKey}`}
                value={currentRadioData[row.index]?.[columnKey]}
                onChange={e => {
                  // handleChange(
                  //   { value: Number(e.target.value), row: row.index, cell: columnOrderIndex },
                  //   currentRadioData,
                  //   setCurrentRadioData,
                  //   currentColumnMap
                  // );
                  handleChange(
                    { value: Number(e.target.value), row: row.index, cell: columnOrderIndex },
                    setCurrentRadioData,
                    currentColumnMap
                  );
                }}
              />
            </div>
            <span className="text-13">USD</span>
          </div>
        );
      }
    },
    {
      header: "Liabilities",
      accessorKey: "liabilities",
      enableSorting: false,
      cell: ({ cell, row }: { cell: any; row: any }) => {
        const visibleCells = row.getVisibleCells();
        const columnOrderIndex = visibleCells.findIndex((c: any) => c.column.id === cell.column.id);
        const columnKey = currentColumnMap[columnOrderIndex];
        return (
          <div className="border-light flex h-fit items-center justify-between rounded-lg border py-2 px-2.5 hover:border-primary hover:shadow-input">
            <div className="flex items-center gap-0">
              $
              <Input
                type="number"
                variant="secondary"
                className="border-none !p-0"
                name={`row-${row.index}-${columnKey}`}
                value={currentRadioData[row.index]?.[columnKey]}
                onChange={e => {
                  // handleChange(
                  //   { value: Number(e.target.value), row: row.index, cell: columnOrderIndex },
                  //   currentRadioData,
                  //   setCurrentRadioData,
                  //   profitColumnMap
                  // );
                  handleChange(
                    { value: Number(e.target.value), row: row.index, cell: columnOrderIndex },
                    setProfitAnalysisData,
                    currentColumnMap
                  );
                }}
              />
            </div>
            <span className="text-13">USD</span>
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
            name={row.original.name}
            className="h-fit min-h-min hover:border-primary hover:shadow-input"
            placeholder="Add description here"
            rows={2}
            value={row.original[columnKey] ?? ""}
            onChange={e => {
              // handleChange(
              //   { value: e.target.value, row: row.index, cell: columnOrderIndex },
              //   documentationData,
              //   setDocumentationData,
              //   documentationColumnMap
              // );
              handleChange(
                { value: Number(e.target.value), row: row.index, cell: columnOrderIndex },
                setDocumentationData,
                currentColumnMap
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
              $
              <Input
                type="number"
                variant="secondary"
                className="border-none !p-0"
                name={`row-${row.index}-${columnKey}`}
                value={profitAnalysisData[row.index]?.[columnKey]}
                onChange={e => {
                  // handleChange(
                  //   { value: Number(e.target.value), row: row.index, cell: columnOrderIndex },
                  //   profitAnalysisData,
                  //   setProfitAnalysisData,
                  //   profitColumnMap
                  // );
                  handleChange(
                    { value: Number(e.target.value), row: row.index, cell: columnOrderIndex },
                    setCurrentRadioData,
                    profitColumnMap
                  );
                }}
              />
            </div>
            <span className="text-13">USD</span>
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
              $
              <Input
                type="number"
                variant="secondary"
                className="border-none !p-0"
                // name={row.original.name}
                name={`row-${row.index}-${columnKey}`}
                value={profitAnalysisData[row.index]?.[columnKey]}
                onChange={e => {
                  // handleChange(
                  //   { value: Number(e.target.value), row: row.index, cell: columnOrderIndex },
                  //   profitAnalysisData,
                  //   setProfitAnalysisData,
                  //   profitColumnMap
                  // );
                  handleChange(
                    { value: Number(e.target.value), row: row.index, cell: columnOrderIndex },
                    setCurrentRadioData,
                    profitColumnMap
                  );
                }}
              />
            </div>
            <span className="text-13">USD</span>
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
    console.log("value", profitAnalysisData);
    console.log("value", currentRadioData);
  }, [profitAnalysisData, currentRadioData]);

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
          options={getMonthOptions(t)}
          onChange={() => {}}
          label="Local Currency"
          placeholder="USD - US Dollar"
        />
        <Dropdown
          options={getCurrencyOptions(t)}
          onChange={e => setSelectCurrency(e?.[0])}
          value={[selectCurrency]}
          label="Financial Year Start Month"
          placeholder="Select Month"
        />
        <FinancialTableInput
          label="Profit Analysis"
          description="Revenue is defined as the total amount of money the business earns from selling its goods or services during their financial period, before any expenses are deducted.Expenses are defined as the sum of all the costs the business incurs to operate and generate revenue during their financial period, including taxes."
          tableColumns={profitAnalysisColumns}
          value={profitAnalysisData}
          years={years}
        />
        <FinancialTableInput
          label="Current Ratio"
          description="Current assets are defined as: Cash, accounts receivable, inventory, and other assets that are expected to be converted to cash within one year.Current liabilities are defined as: Accounts payable, short-term debt, and other obligations due within one year.Current ratio is defined as: Current assets divided by current liabilities. A ratio above 1.0 indicates the company can pay its short-term obligations."
          tableColumns={currentRadioColumns}
          value={currentRadioData}
          years={years}
        />
        <FinancialTableInput
          label="Documentation"
          description="Please provide supporting documentation for each year's financial data and add any relevant notes or context about your financial position."
          tableColumns={documentationColumns}
          value={documentationData}
          years={years}
        />
      </div>
    </>
  );
};

export default RHFFinancialIndicatorsDataTable;
