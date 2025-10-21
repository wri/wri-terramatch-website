import { debounce } from "lodash";
import { useEffect, useMemo } from "react";

import { currencySymbol } from "@/constants/options/localCurrency";
import { UploadedFile } from "@/types/common";

export type OrgFormDetails = {
  uuid?: string;
  currency?: string;
  startMonth?: string | number;
  title?: string;
};

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
  amount: number;
  [key: string]: string | number | null;
};

export type NonProfitAnalysisData = BaseYearlyData & {
  budget: number;
  budgetUuid: string | null;
  amount: number;
  [key: string]: string | number | null;
};

export type CurrentRatioData = BaseYearlyData & {
  currentAssets: number;
  currentLiabilities: number;
  currentRatio: string;
  currentAssetsUuid: string | null;
  currentLiabilitiesUuid: string | null;
  currentRatioUuid: string | null;
  amount: number;
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
  exchange_rate: number | null;
  [key: string]: string | number | null | UploadedFile[];
};

export const PROFIT_ANALYSIS_COLUMNS = ["year", "revenue", "expenses", "profit"];
export const NON_PROFILE_ANALYSIS_COLUMNS = ["year", "budget"];
export const CURRENT_RATIO_COLUMNS = ["year", "currentAssets", "currentLiabilities", "currentRatio"];
export const DOCUMENTATION_COLUMNS = ["year", "description", "exchange_rate", "documentation"];

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

export function formatFinancialData(rawData: any, years: number[] | undefined, currency: any) {
  const profitCollections = ["revenue", "expenses", "profit"];
  const nonProfitCollections = ["budget"];
  const ratioCollections = ["current-assets", "current-liabilities", "current-ratio"];
  const documentationCollections = ["description-documents"];

  const groupedData: {
    profitAnalysisData: Record<number, Record<string, ForProfitAnalysisData>>;
    nonProfitAnalysisData: Record<number, Record<string, NonProfitAnalysisData>>;
    currentRatioData: Record<number, Record<string, CurrentRatioData>>;
    documentationData: Record<number, Record<string, any>>;
  } = {
    profitAnalysisData: {},
    nonProfitAnalysisData: {},
    currentRatioData: {},
    documentationData: {}
  };

  if (Array.isArray(rawData)) {
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
  }

  const formatCurrency = (value: number) =>
    value ? `${currencySymbol(currency)}${Number(value).toLocaleString()}` : undefined;

  return {
    profitAnalysisData: years?.map((year, index) => {
      const row = groupedData.profitAnalysisData[year] ?? {};
      return {
        uuid: row.revenue?.uuid ?? row.expenses?.uuid ?? row.profit?.uuid ?? index,
        year,
        revenue: row.revenue?.amount ?? 0,
        expenses: row.expenses?.amount ?? 0,
        profit: formatCurrency(row.profit?.amount) ?? 0,
        revenueUuid: row.revenue?.uuid,
        expensesUuid: row.expenses?.uuid,
        profitUuid: row.profit?.uuid
      };
    }),
    nonProfitAnalysisData: years?.map((year, index) => {
      const row = groupedData.nonProfitAnalysisData[year] ?? {};
      return {
        uuid: row.budget?.uuid ?? index,
        year,
        budget: row.budget?.amount ?? 0,
        budgetUuid: row.budget?.uuid
      };
    }),
    currentRatioData: years?.map((year, index) => {
      const row = groupedData.currentRatioData[year] ?? {};
      return {
        uuid: row["current-assets"]?.uuid ?? row["current-liabilities"]?.uuid ?? row["current-ratio"]?.uuid ?? index,
        year,
        currentAssets: row["current-assets"]?.amount ?? 0,
        currentLiabilities: row["current-liabilities"]?.amount ?? 0,
        currentRatio: row["current-ratio"]?.amount ?? 0,
        currentAssetsUuid: row["current-assets"]?.uuid,
        currentLiabilitiesUuid: row["current-liabilities"]?.uuid,
        currentRatioUuid: row["current-ratio"]?.uuid
      };
    }),
    documentationData: years?.map((year, index): DocumentationData => {
      const row = groupedData.documentationData[year] ?? {};
      return {
        uuid: row?.uuid ?? index,
        year,
        documentation: row.documentation,
        description: row.description ?? "",
        exchange_rate: row.exchange_rate
      };
    })
  };
}
