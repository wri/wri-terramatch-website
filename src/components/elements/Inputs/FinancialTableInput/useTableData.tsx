import { useEffect, useRef, useState } from "react";
import { useController } from "react-hook-form";

import { useCurrencyContext } from "@/context/currency.provider";
import { useOrgFormDetails } from "@/context/wizardForm.provider";
import { useValueChanged } from "@/hooks/useValueChanged";
import { OptionValue } from "@/types/common";

import {
  CurrentRatioData,
  DocumentationData,
  FinancialIndicator,
  FinancialIndicatorTableData,
  formatFinancialData,
  ForProfitAnalysisData,
  NonProfitAnalysisData,
  RHFFinancialIndicatorsDataTableProps
} from "./types";

const getValueFromData = (value: any, fieldName: string, fallbackValue: OptionValue): OptionValue => {
  if (value && Array.isArray(value) && value.length > 0) {
    const firstItem = value[0];
    if (firstItem[fieldName] !== null && firstItem[fieldName] !== undefined) {
      return firstItem[fieldName];
    }
  }
  return fallbackValue;
};

export const useTableData = (props: RHFFinancialIndicatorsDataTableProps) => {
  const { collection, years, formHook, name } = props;
  const { field } = useController(props);
  const value: FinancialIndicator[] = field?.value ?? [];

  const orgDetails = useOrgFormDetails();
  const { setCurrency } = useCurrencyContext();

  const [selectCurrency, setSelectCurrency] = useState<OptionValue>(() =>
    getValueFromData(value, "currency", orgDetails?.currency ?? "")
  );
  const [selectFinancialMonth, setSelectFinancialMonth] = useState<OptionValue>(() =>
    getValueFromData(value, "startMonth", orgDetails?.startMonth ?? "")
  );

  const initialData = useRef<FinancialIndicatorTableData | undefined>();
  const getInitialData = () => {
    if (initialData.current) return initialData.current;
    const data = formatFinancialData(value, years, selectCurrency);
    initialData.current = data;
    return data;
  };

  const [forProfitAnalysisData, setForProfitAnalysisData] = useState<ForProfitAnalysisData[]>(
    () => getInitialData().forProfitAnalysisData
  );
  const [nonProfitAnalysisData, setNonProfitAnalysisData] = useState<NonProfitAnalysisData[]>(
    () => getInitialData().nonProfitAnalysisData
  );
  const [currentRatioData, setCurrentRatioData] = useState<CurrentRatioData[]>(() => getInitialData().currentRatioData);
  const [documentationData, setDocumentationData] = useState<DocumentationData[]>(
    () => getInitialData().documentationData
  );

  useValueChanged(selectCurrency, () => {
    setCurrency(selectCurrency);
  });

  useEffect(() => {
    const payload: FinancialIndicator[] = [];

    if (collection?.includes("profit") && forProfitAnalysisData?.length > 0) {
      forProfitAnalysisData.forEach(item => {
        const year = Number(item.year);

        payload.push({
          collection: "revenue",
          amount: item.revenue,
          year: year,
          startMonth: selectFinancialMonth as number,
          currency: selectCurrency as string,
          uuid: item.revenueUuid ?? undefined,
          description: null,
          documentation: [],
          exchangeRate: null
        });

        payload.push({
          collection: "expenses",
          amount: item.expenses,
          year: year,
          startMonth: selectFinancialMonth as number,
          currency: selectCurrency as string,
          uuid: item.expensesUuid ?? undefined,
          description: null,
          documentation: [],
          exchangeRate: null
        });

        payload.push({
          collection: "profit",
          amount: item.revenue - item.expenses,
          year: year,
          startMonth: selectFinancialMonth as number,
          currency: selectCurrency as string,
          uuid: item.profitUuid ?? undefined,
          description: null,
          documentation: [],
          exchangeRate: null
        });
      });
    }

    if (collection?.includes("budget") && nonProfitAnalysisData?.length > 0) {
      nonProfitAnalysisData.forEach(item => {
        const year = Number(item.year);

        payload.push({
          collection: "budget",
          amount: item.budget,
          year: year,
          startMonth: selectFinancialMonth as number,
          currency: selectCurrency as string,
          uuid: item.budgetUuid ?? undefined,
          description: null,
          documentation: [],
          exchangeRate: null
        });
      });
    }

    if (collection?.includes("current-ratio") && currentRatioData?.length > 0) {
      currentRatioData.forEach(item => {
        const year = Number(item.year);
        if (isNaN(year)) return;

        payload.push({
          collection: "current-assets",
          amount: item.currentAssets,
          year: year,
          startMonth: selectFinancialMonth as number,
          currency: selectCurrency as string,
          uuid: item.currentAssetsUuid ?? undefined,
          description: null,
          documentation: [],
          exchangeRate: null
        });

        payload.push({
          collection: "current-liabilities",
          amount: item.currentLiabilities,
          year: year,
          startMonth: selectFinancialMonth as number,
          currency: selectCurrency as string,
          uuid: item.currentLiabilitiesUuid ?? undefined,
          description: null,
          documentation: [],
          exchangeRate: null
        });

        payload.push({
          collection: "current-ratio",
          amount: Number((item.currentAssets / item.currentLiabilities).toFixed(2)),
          year: year,
          startMonth: selectFinancialMonth as number,
          currency: selectCurrency as string,
          uuid: item.currentRatioUuid ?? undefined,
          description: null,
          documentation: [],
          exchangeRate: null
        });
      });
    }

    if (documentationData?.length > 0) {
      documentationData.forEach(item => {
        const year = Number(item.year);

        payload.push({
          collection: "description-documents",
          amount: null,
          year: year,
          startMonth: selectFinancialMonth as number,
          currency: selectCurrency as string,
          uuid: item.uuid ?? undefined,
          description: item.description ?? null,
          documentation: item.documentation ?? [],
          exchangeRate: item.exchangeRate
        });
      });
    }

    field.onChange(payload);

    formHook?.clearErrors(name);
  }, [
    collection,
    currentRatioData,
    documentationData,
    field,
    forProfitAnalysisData,
    formHook,
    name,
    nonProfitAnalysisData,
    selectCurrency,
    selectFinancialMonth
  ]);

  return {
    forProfitAnalysisData,
    setForProfitAnalysisData,
    nonProfitAnalysisData,
    setNonProfitAnalysisData,
    currentRatioData,
    setCurrentRatioData,
    documentationData,
    setDocumentationData,
    selectCurrency,
    setSelectCurrency,
    selectFinancialMonth,
    setSelectFinancialMonth
  };
};
