import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { isEmpty } from "lodash";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";
import { When } from "react-if";
import { twMerge } from "tailwind-merge";

import { getCurrencyOptions } from "@/constants/options/localCurrency";
import { getMonthOptions } from "@/constants/options/months";
import { usePatchV2FinancialIndicators } from "@/generated/apiComponents";
import { OptionValue } from "@/types/common";

import Text from "../../Text/Text";
import { DataTableProps } from "../DataTable/DataTable";
import Dropdown from "../Dropdown/Dropdown";
import FileInput from "../FileInput/FileInput";
import Input from "../Input/Input";
import TextArea from "../textArea/TextArea";
import FinancialTableInput from "./FinancialTableInput";

export interface RHFFinancialIndicatorsDataTableProps
  extends Omit<DataTableProps<any>, "value" | "onChange" | "fields" | "addButtonCaption" | "tableColumns">,
    UseControllerProps {
  onChangeCapture?: () => void;
  formHook?: UseFormReturn;
  years?: Array<number>;
  formSubmissionOrg?: any;
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
  value: string | number | null | File[];
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

    if (lowerKeys.includes("revenue") && lowerKeys.includes("expenses") && lowerKeys.includes("profit")) {
      const revenue = Number(currentRow.revenue ?? 0);
      const expenses = Number(currentRow.expenses ?? 0);
      currentRow.profit = `${currencyInput?.[selectCurrency] ?? ""}${(revenue - expenses).toFixed(2)}`;
    }

    if (lowerKeys.includes("currentassets") && lowerKeys.includes("currentliabilities")) {
      const assets = Number(currentRow.currentAssets ?? 0);
      const liabilities = Number(currentRow.currentLiabilities ?? 0);
      const ratio = liabilities !== 0 ? (assets / liabilities).toFixed(2) : "0";
      currentRow.currentRatio = `${currencyInput?.[selectCurrency] ?? ""}${ratio}`;
    }

    updated[row] = currentRow;
    return updated;
  });
};

function formatFinancialData(
  rawData: any,
  years: number[] | undefined,
  selectCurrency: OptionValue | any,
  currencyInput: string
) {
  const profitCollections = ["revenue", "expenses", "profit"];
  const nonProfitCollections = ["budget"];
  const ratioCollections = ["current-assets", "current-liabilities", "current-ratio"];
  const documentationCollections = ["description-documents"];

  const groupedData: {
    profitAnalysisData: Record<number, any>;
    nonProfitAnalysisData: Record<number, any>;
    currentRatioData: Record<number, any>;
    documentationData: Record<number, any>;
  } = {
    profitAnalysisData: {},
    nonProfitAnalysisData: {},
    currentRatioData: {},
    documentationData: {}
  };

  rawData.forEach((item: any) => {
    const { year, collection } = item;

    if (profitCollections.includes(collection)) {
      if (!groupedData.profitAnalysisData[year]) groupedData.profitAnalysisData[year] = {};
      groupedData.profitAnalysisData[year][collection] = item;
    } else if (nonProfitCollections.includes(collection)) {
      if (!groupedData.nonProfitAnalysisData[year]) groupedData.nonProfitAnalysisData[year] = {};
      groupedData.nonProfitAnalysisData[year][collection] = item;
    } else if (ratioCollections.includes(collection)) {
      if (!groupedData.currentRatioData[year]) groupedData.currentRatioData[year] = {};
      groupedData.currentRatioData[year][collection] = item;
    } else if (documentationCollections.includes(collection)) {
      groupedData.documentationData[year] = { ...item };
    }
  });

  const formatCurrency = (value: number) => `${currencyInput?.[selectCurrency] ?? "$"} ${value.toFixed(2) ?? 0}`;

  const finalData = {
    profitAnalysisData: years?.map((year, index) => {
      const row = groupedData.profitAnalysisData[year] ?? {};
      return {
        uuid: row.revenue?.uuid || row.expenses?.uuid || row.profit?.uuid || index,
        year,
        revenue: row.revenue?.amount ?? 0,
        expenses: row.expenses?.amount ?? 0,
        profit: formatCurrency(row.profit?.amount ?? 0),
        revenueUuid: row.revenue?.uuid,
        expensesUuid: row.expenses?.uuid,
        profitUuid: row.profit?.uuid
      };
    }),
    nonProfitAnalysisData: years?.map((year, index) => {
      const row = groupedData.nonProfitAnalysisData[year] ?? {};
      return {
        uuid: row.budget?.uuid || index,
        year,
        budget: row.budget?.amount ?? 0,
        budgetUuid: row.budget?.uuid
      };
    }),
    currentRatioData: years?.map((year, index) => {
      const row = groupedData.currentRatioData[year] ?? {};
      return {
        uuid: row["current-assets"]?.uuid || row["current-liabilities"]?.uuid || row["current-ratio"]?.uuid || index,
        year,
        currentAssets: row["current-assets"]?.amount ?? 0,
        currentLiabilities: row["current-liabilities"]?.amount ?? 0,
        currentRatio: formatCurrency(row["current-ratio"]?.amount ?? 0),
        currentAssetsUuid: row["current-assets"]?.uuid,
        currentLiabilitiesUuid: row["current-liabilities"]?.uuid,
        currentRatioUuid: row["current-ratio"]?.uuid
      };
    }),
    documentationData: years?.map((year, index) => {
      const row = groupedData.documentationData[year] ?? {};
      return {
        uuid: row.uuid ?? index,
        year,
        currentAssets: [],
        description: row.description ?? ""
      };
    })
  };

  return finalData;
}

const forProfitColumnMap = ["year", "revenue", "expenses", "profit"];
const nonProfitColumnMap = ["year", "budget"];
const currentColumnMap = ["year", "currentAssets", "currentLiabilities", "currentRatio"];
const documentationColumnMap = ["year", "currentAssets", "description"];

const currencyInput = {
  USD: "$",
  EUR: "€",
  GBP: "£"
} as any;

/**
 * @param props PropsWithChildren<RHFFinancialIndicatorsDataTableProps>
 * @returns React Hook Form Ready FinancialIndicator Component
 */
const RHFFinancialIndicatorsDataTable = ({
  onChangeCapture,
  ...props
}: PropsWithChildren<RHFFinancialIndicatorsDataTableProps>) => {
  const t = useT();
  const { field } = useController(props);
  const value = field?.value || [];
  // const [file, setFile] = useState<File>();
  const { years, formSubmissionOrg } = props;
  const [selectCurrency, setSelectCurrency] = useState<OptionValue>(formSubmissionOrg?.currency);
  const [selectFinancialMonth, setSelectFinancialMonth] = useState<OptionValue>("");
  const [resetTable, setResetTable] = useState(0);
  const initialForProfitAnalysisData = years?.map((item, index) => ({
    uuid: null,
    year: item,
    revenue: 0,
    expenses: 0,
    profit: `${currencyInput?.[selectCurrency]} 0`,
    revenueUuid: null,
    expensesUuid: null,
    profitUuid: null
  })) as any[];

  const initialNonProfitAnalysisData = years?.map((item, index) => ({
    uuid: null,
    year: item,
    budget: 0,
    budgetUuid: null
  })) as any[];

  const initialCurrentRadioData = years?.map((item, index) => ({
    uuid: null,
    year: item,
    currentAssets: 0,
    currentLiabilities: 0,
    currentRatio: `${currencyInput?.[selectCurrency]} 0`,
    currentAssetsUuid: null,
    currentLiabilitiesUuid: null,
    currentRatioUuid: null
  })) as any[];

  const initialDocumentationData = years?.map((item, index) => ({
    uuid: null,
    year: item,
    currentAssets: [
      // {
      //   uuid: "1",
      //   file_name: "file.pdf",
      //   src: "file.pdf",
      //   size: 100,
      //   mime_type: "application/pdf",
      //   extension: "pdf",
      //   is_public: true,
      //   is_cover: true,
      //   status: true,
      //   lat: 0,
      //   lng: 0,
      //   created_at: "2021-01-01",
      //   collection_name: "financial_report",
      //   title: "file.pdf",
      //   type: "application/pdf",
      //   url: "file.pdf",
      //   raw_url: "file.pdf",
      //   uploadState: {
      //     isSuccess: true,
      //     isError: false,
      //     isLoading: false,
      //     isPending: false,
      //     isUploading: false
      //   }
      // }
    ],
    description: ""
  })) as any[];

  const formatted = formatFinancialData(value, years, selectCurrency, currencyInput);
  const [forProfitAnalysisData, setForProfitAnalysisData] = useState(
    !isEmpty(formatted?.profitAnalysisData) ? formatted?.profitAnalysisData : initialForProfitAnalysisData
  );
  const [nonProfitAnalysisData, setNonProfitAnalysisData] = useState(
    !isEmpty(formatted?.nonProfitAnalysisData) ? formatted?.nonProfitAnalysisData : initialNonProfitAnalysisData
  );
  const [currentRadioData, setCurrentRadioData] = useState(
    !isEmpty(formatted?.currentRatioData) ? formatted?.currentRatioData : initialCurrentRadioData
  );
  const [documentationData, setDocumentationData] = useState(
    !isEmpty(formatted?.documentationData) ? formatted?.documentationData : initialDocumentationData
  );
  console.log(formatted);
  const { mutate: createFinanciaData } = usePatchV2FinancialIndicators({
    onSuccess(data: any) {
      // @ts-ignore
      const _tmp = data ?? [];
      field.onChange(_tmp);
    }
    // onSuccess: async data => {
    //   const body = new FormData();
    //   if (file) {
    //     body.append("upload_file", file);
    //     upload?.({
    //       //@ts-ignore
    //       pathParams: { model: "financial-indicators", collection: "documentation", uuid: data?.data?.uuid },
    //       file,
    //       //@ts-ignore swagger issue
    //       body
    //     });
    //   } else {
    //     const _tmp = [...value];
    //     //@ts-ignore
    //     _tmp.push(data.data);
    //     field.onChange(_tmp);
    //   }
    //   onChangeCapture?.();
    //   formHook?.reset(formHook.getValues());
    //   clearErrors();
    // }
  });

  const currencyInputValue = currencyInput?.[selectCurrency] ? currencyInput?.[selectCurrency] : "";

  const forProfitAnalysisColumns = [
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
        const columnKey = forProfitColumnMap[columnOrderIndex];
        return (
          <div className="border-light flex h-fit items-center justify-between rounded-lg border py-2 px-2.5 hover:border-primary hover:shadow-input">
            <div className="flex items-center gap-2">
              {currencyInputValue}
              <Input
                type="number"
                variant="secondary"
                className="border-none !p-0"
                name={`row-${row.index}-${columnKey}`}
                value={forProfitAnalysisData?.[row.index]?.[columnKey]}
                onChange={e => {
                  handleChange(
                    { value: Number(e.target.value), row: row.index, cell: columnOrderIndex },
                    setForProfitAnalysisData,
                    forProfitColumnMap,
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
        const columnKey = forProfitColumnMap[columnOrderIndex];
        return (
          <div className="border-light flex h-fit items-center justify-between rounded-lg border py-2 px-2.5 hover:border-primary hover:shadow-input">
            <div className="flex items-center gap-2">
              {currencyInputValue}
              <Input
                type="number"
                variant="secondary"
                className="border-none !p-0"
                name={`row-${row.index}-${columnKey}`}
                value={forProfitAnalysisData?.[row.index]?.[columnKey]}
                onChange={e => {
                  handleChange(
                    { value: Number(e.target.value), row: row.index, cell: columnOrderIndex },
                    setForProfitAnalysisData,
                    forProfitColumnMap,
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
      accessorKey: "profit",
      enableSorting: false,
      meta: {
        width: "22.5%"
      },
      cell: ({ row }: { row: any }) => <Text variant="text-14-semibold">{row.original.profit}</Text>
    }
  ];
  const nonProfitAnalysisColumns = [
    {
      header: "Year",
      accessorKey: "year",
      enableSorting: false,
      meta: {
        width: "15%"
      }
    },
    {
      header: "Budget",
      accessorKey: "budget",
      enableSorting: false,
      cell: ({ cell, row }: { cell: any; row: any }) => {
        const visibleCells = row.getVisibleCells();
        const columnOrderIndex = visibleCells.findIndex((c: any) => c.column.id === cell.column.id);
        const columnKey = nonProfitColumnMap[columnOrderIndex];
        return (
          <div className="border-light flex h-fit items-center justify-between rounded-lg border py-2 px-2.5 hover:border-primary hover:shadow-input">
            <div className="flex items-center gap-2">
              {currencyInputValue}
              <Input
                type="number"
                variant="secondary"
                className="border-none !p-0"
                name={`row-${row.index}-${columnKey}`}
                value={nonProfitAnalysisData?.[row.index]?.[columnKey]}
                onChange={e => {
                  handleChange(
                    { value: Number(e.target.value), row: row.index, cell: columnOrderIndex },
                    setNonProfitAnalysisData,
                    nonProfitColumnMap,
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
    }
  ];
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
            <div className="flex items-center gap-2">
              {currencyInputValue}
              <Input
                type="number"
                variant="secondary"
                className="border-none !p-0"
                name={`row-${row.index}-${columnKey}`}
                value={currentRadioData?.[row.index]?.[columnKey]}
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
            <div className="flex items-center gap-2">
              {currencyInputValue}
              <Input
                type="number"
                variant="secondary"
                className="border-none !p-0"
                name={`row-${row.index}-${columnKey}`}
                value={currentRadioData?.[row.index]?.[columnKey]}
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
            value={documentationData?.[row.index]?.[columnKey]}
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

  useEffect(() => {
    setResetTable(prev => prev + 1);
  }, [selectCurrency]);

  const isRequestInProgress = useRef(false);

  useEffect(() => {
    const sendRequest = async () => {
      if (isRequestInProgress.current) return;

      isRequestInProgress.current = true;
      try {
        await createFinanciaData({
          body: {
            organisation_id: formSubmissionOrg?.uuid,
            profit_analysis_data: formSubmissionOrg?.type?.includes("for-profit")
              ? forProfitAnalysisData
              : nonProfitAnalysisData,
            current_radio_data: currentRadioData,
            documentation_data: documentationData,
            local_currency: selectCurrency as string,
            financial_year_start_month: selectFinancialMonth as number
          }
        });
      } catch (error) {
        console.error("Error in financial data request", error);
      } finally {
        isRequestInProgress.current = false;
      }
    };

    sendRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    forProfitAnalysisData,
    nonProfitAnalysisData,
    currentRadioData,
    documentationData,
    selectCurrency,
    selectFinancialMonth,
    formSubmissionOrg?.uuid,
    formSubmissionOrg?.type
  ]);

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
        <div className="mb-10 space-y-6">
          <Dropdown
            options={getCurrencyOptions(t)}
            label="Local Currency"
            placeholder="USD - US Dollar"
            value={formSubmissionOrg?.currency ? [formSubmissionOrg?.currency] : [selectCurrency]}
            onChange={e => setSelectCurrency(e?.[0])}
          />
          <Dropdown
            options={getMonthOptions(t)}
            label="Financial Year Start Month"
            placeholder="Select Month"
            value={formSubmissionOrg?.start_month ? [formSubmissionOrg?.start_month] : [selectFinancialMonth]}
            onChange={e => setSelectFinancialMonth(e?.[0])}
          />
        </div>
        <When condition={formSubmissionOrg?.type?.includes("for-profit")}>
          <div className="mb-10">
            <FinancialTableInput
              resetTable={resetTable}
              label="Profit Analysis"
              description="Revenue is defined as the total amount of money the business earns from selling its goods or services during their financial period, before any expenses are deducted.Expenses are defined as the sum of all the costs the business incurs to operate and generate revenue during their financial period, including taxes."
              tableColumns={forProfitAnalysisColumns}
              value={forProfitAnalysisData ?? []}
            />
          </div>
        </When>
        <When condition={formSubmissionOrg.type?.includes("non-profit")}>
          <div className="mb-10">
            <FinancialTableInput
              resetTable={resetTable}
              label="Budget Analysis"
              description="The budget represents the total amount of money allocated for the organization's operations and activities during the financial period. It includes all planned expenses for program services, administrative costs, and other operational needs."
              tableColumns={nonProfitAnalysisColumns}
              value={nonProfitAnalysisData ?? []}
            />
          </div>
        </When>
        <div className="mb-10">
          <FinancialTableInput
            resetTable={resetTable}
            label="Current Ratio"
            description="Current assets are defined as: Cash, accounts receivable, inventory, and other assets that are expected to be converted to cash within one year.Current liabilities are defined as: Accounts payable, short-term debt, and other obligations due within one year.Current ratio is defined as: Current assets divided by current liabilities. A ratio above 1.0 indicates the company can pay its short-term obligations."
            tableColumns={currentRadioColumns}
            value={currentRadioData ?? []}
          />
        </div>
        <div className="mb-10">
          <FinancialTableInput
            resetTable={resetTable}
            label="Documentation"
            description="Please provide supporting documentation for each year's financial data and add any relevant notes or context about your financial position."
            tableColumns={documentationColumns}
            value={documentationData ?? []}
          />
        </div>
      </div>
    </>
  );
};

export default RHFFinancialIndicatorsDataTable;
