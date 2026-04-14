import { debounce, Dictionary } from "lodash";
import { useEffect, useMemo } from "react";
import { UseControllerProps, UseFormReturn } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import { DataTableProps } from "@/components/elements/Inputs/DataTable/DataTable";
import { FinancialIndicatorDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { UploadedFile } from "@/types/common";
import { formatFinancialAmount, getCurrencySymbolPrefix } from "@/utils/financialReport";

export type BaseYearlyData = {
  uuid: string | null;
  year: string | number;
};

export type ForProfitAnalysisData = BaseYearlyData & {
  revenue: number;
  expenses: number;
  profit: string;
  revenueUuid: string | null;
  expensesUuid: string | null;
  profitUuid: string | null;
  [key: string]: string | number | null;
};

export type NonProfitAnalysisData = BaseYearlyData & {
  budget: number;
  budgetUuid: string | null;
  [key: string]: string | number | null;
};

export type CurrentRatioData = BaseYearlyData & {
  currentAssets: number;
  currentLiabilities: number;
  currentRatio: number;
  currentAssetsUuid: string | null;
  currentLiabilitiesUuid: string | null;
  currentRatioUuid: string | null;
  [key: string]: string | number | null;
};

export type UseDebouncedChangeProps<T> = {
  value: T;
  delay?: number;
  onDebouncedChange: (val: T) => void;
};

export type HandleChangePayload = {
  value: string | number | null | File[] | UploadedFile[];
  row: number;
  cell: number;
};

export type FinancialRow = {
  [key: string]: string | number | any;
};

export type DocumentationData = {
  uuid: string | null;
  year: number;
  documentation: UploadedFile[];
  description: string;
  exchangeRate: number | null;
  [key: string]: string | number | null | UploadedFile[];
};

export type FinancialIndicatorTableData = {
  forProfitAnalysisData: ForProfitAnalysisData[];
  nonProfitAnalysisData: NonProfitAnalysisData[];
  currentRatioData: CurrentRatioData[];
  documentationData: DocumentationData[];
};

export const PROFIT_ANALYSIS_COLUMNS = ["year", "revenue", "expenses", "profit"];
export const NON_PROFILE_ANALYSIS_COLUMNS = ["year", "budget"];
export const CURRENT_RATIO_COLUMNS = ["year", "currentAssets", "currentLiabilities", "currentRatio"];
export const DOCUMENTATION_COLUMNS = ["year", "description", "exchangeRate", "documentation"];

export function useDebouncedChange<T>({ value, delay = 700, onDebouncedChange }: UseDebouncedChangeProps<T>) {
  const debouncedFn = useMemo(() => debounce(onDebouncedChange, delay), [onDebouncedChange, delay]);

  useEffect(() => {
    if (value !== undefined) {
      debouncedFn(value);
    }
    return () => {
      debouncedFn.cancel();
    };
  }, [value, debouncedFn]);
}

export interface RHFFinancialIndicatorsDataTableProps
  extends Omit<DataTableProps<any>, "value" | "onChange" | "fieldsProvider" | "addButtonCaption" | "tableColumns">,
    UseControllerProps {
  onChangeCapture?: () => void;
  formHook?: UseFormReturn;
  years?: Array<number>;
  collection?: string;
}

export type FinancialIndicator = Partial<Omit<FinancialIndicatorDto, "entityType" | "entityUuid" | "documentation">> & {
  uuid?: string;
  startMonth?: number | null;
  currency?: string | null;
  documentation?: UploadedFile[];
};

export function formatFinancialData(
  rawData: FinancialIndicator[] | undefined,
  years: number[] | undefined,
  currency: string | number
): FinancialIndicatorTableData {
  const currencyKey = String(currency ?? "");
  const profitCollections = ["revenue", "expenses", "profit"];
  const nonProfitCollections = ["budget"];
  const ratioCollections = ["current-assets", "current-liabilities", "current-ratio"];
  const documentationCollections = ["description-documents"];

  const groupedData: {
    profitAnalysisData: Record<number, Record<string, FinancialIndicator>>;
    nonProfitAnalysisData: Record<number, Record<string, FinancialIndicator>>;
    currentRatioData: Record<number, Record<string, FinancialIndicator>>;
    documentationData: Record<number, FinancialIndicator>;
  } = {
    profitAnalysisData: {},
    nonProfitAnalysisData: {},
    currentRatioData: {},
    documentationData: {}
  };

  if (Array.isArray(rawData)) {
    rawData.forEach(item => {
      const { year, collection } = item;
      if (year == null || collection == null) return;

      if (profitCollections.includes(collection)) {
        if (groupedData.profitAnalysisData[year] == null) groupedData.profitAnalysisData[year] = {};
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
  }

  const formatCurrency = (value: number | null | undefined) => {
    if (value == null || !Number.isFinite(value)) {
      return undefined;
    }
    const sym = getCurrencySymbolPrefix(currencyKey);
    const num = formatFinancialAmount(value, currencyKey);
    return sym ? `${sym} ${num}` : num;
  };

  return {
    forProfitAnalysisData:
      years?.map(year => {
        const row: Dictionary<FinancialIndicator> = groupedData.profitAnalysisData[year] ?? {};
        return {
          uuid: row.revenue?.uuid ?? row.expenses?.uuid ?? row.profit?.uuid ?? uuidv4(),
          year,
          revenue: row.revenue?.amount ?? 0,
          expenses: row.expenses?.amount ?? 0,
          profit: formatCurrency(row.profit?.amount) ?? "0",
          revenueUuid: row.revenue?.uuid ?? null,
          expensesUuid: row.expenses?.uuid ?? null,
          profitUuid: row.profit?.uuid ?? null
        };
      }) ?? [],
    nonProfitAnalysisData:
      years?.map(year => {
        const row = groupedData.nonProfitAnalysisData[year] ?? {};
        return {
          uuid: row.budget?.uuid ?? uuidv4(),
          year,
          budget: row.budget?.amount ?? 0,
          budgetUuid: row.budget?.uuid ?? null
        };
      }) ?? [],
    currentRatioData:
      years?.map(year => {
        const row: Dictionary<FinancialIndicator> = groupedData.currentRatioData[year] ?? {};
        return {
          uuid:
            row["current-assets"]?.uuid ?? row["current-liabilities"]?.uuid ?? row["current-ratio"]?.uuid ?? uuidv4(),
          year,
          currentAssets: row["current-assets"]?.amount ?? 0,
          currentLiabilities: row["current-liabilities"]?.amount ?? 0,
          currentRatio: row["current-ratio"]?.amount ?? 0,
          currentAssetsUuid: row["current-assets"]?.uuid ?? null,
          currentLiabilitiesUuid: row["current-liabilities"]?.uuid ?? null,
          currentRatioUuid: row["current-ratio"]?.uuid ?? null
        };
      }) ?? [],
    documentationData:
      years?.map((year): DocumentationData => {
        const row = groupedData.documentationData[year];
        const emptyDoc: DocumentationData = {
          uuid: uuidv4(),
          year,
          documentation: [],
          description: "",
          exchangeRate: null
        };
        if (row == null) {
          return emptyDoc;
        }
        return {
          uuid: row.uuid ?? uuidv4(),
          year,
          documentation: row.documentation ?? [],
          description: row.description ?? "",
          exchangeRate: row.exchangeRate ?? null
        };
      }) ?? []
  };
}
