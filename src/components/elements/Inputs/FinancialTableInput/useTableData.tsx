import { isEqual } from "lodash";
import { useCallback, useMemo, useRef, useState } from "react";
import { useController } from "react-hook-form";

import { useCurrencyContext } from "@/context/currency.provider";
import { useOrgFormDetails } from "@/context/wizardForm.provider";
import { useValueChanged } from "@/hooks/useValueChanged";
import { OptionValue } from "@/types/common";

import {
  FinancialIndicator,
  FinancialIndicatorTableData,
  formatFinancialData,
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

const indicatorsEqual = (aIndicators: FinancialIndicator[], bIndicators: FinancialIndicator[]) => {
  if (aIndicators.length !== bIndicators.length) return false;

  for (const aIndicator of aIndicators) {
    const { uuid, collection, year } = aIndicator;
    const bIndicator =
      (uuid == null ? undefined : bIndicators.find(b => b.uuid === uuid)) ??
      bIndicators.find(b => b.collection === collection && b.year === year);
    if (bIndicator == null) return false;

    if (!isEqual(aIndicator, bIndicator)) return false;
  }

  return true;
};

export type DataMutationCallback = (current: FinancialIndicatorTableData) => FinancialIndicatorTableData;

export const useTableData = (props: RHFFinancialIndicatorsDataTableProps) => {
  const { collection, years, formHook, name, onChangeCapture } = props;
  const { field } = useController(props);

  const orgDetails = useOrgFormDetails();
  const { setCurrency } = useCurrencyContext();

  const [selectCurrency, setSelectCurrency] = useState<OptionValue>(() =>
    getValueFromData(field?.value ?? [], "currency", orgDetails?.currency ?? "")
  );
  const [selectFinancialMonth, setSelectFinancialMonth] = useState<OptionValue>(() =>
    getValueFromData(field?.value ?? [], "startMonth", orgDetails?.startMonth ?? "")
  );

  useValueChanged(selectCurrency, () => {
    setCurrency(selectCurrency);
  });

  const data = useMemo(
    () => formatFinancialData(field?.value ?? [], years, selectCurrency),
    [field?.value, selectCurrency, years]
  );
  const dataRef = useRef(data);
  dataRef.current = data;
  const valueRef = useRef(field.value);
  valueRef.current = field.value;

  const updateData = useCallback(
    (mutator: DataMutationCallback) => {
      const { forProfitAnalysisData, nonProfitAnalysisData, currentRatioData, documentationData } = mutator(
        dataRef.current
      );

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

      if (!indicatorsEqual(valueRef.current, payload)) {
        field.onChange(payload);
        onChangeCapture?.();
        formHook?.clearErrors(name);
      }
    },
    [collection, field, formHook, name, onChangeCapture, selectCurrency, selectFinancialMonth]
  );

  return {
    data,
    updateData,
    selectCurrency,
    setSelectCurrency,
    selectFinancialMonth,
    setSelectFinancialMonth
  };
};
