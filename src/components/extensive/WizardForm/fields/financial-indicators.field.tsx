import { useT } from "@transifex/react";
import { isEmpty } from "lodash";
import * as yup from "yup";

import FinancialIndicatorsAdditionalOptions from "@/admin/modules/form/components/FormBuilder/AdditionalOptions/FinancialIndicatorsAdditionalOptions";
import RHFFinancialIndicatorsDataTable from "@/components/elements/Inputs/FinancialTableInput/RHFFinancialIndicatorTable";
import {
  CURRENT_RATIO_COLUMNS,
  DOCUMENTATION_COLUMNS,
  formatFinancialData,
  NON_PROFILE_ANALYSIS_COLUMNS,
  PROFIT_ANALYSIS_COLUMNS
} from "@/components/elements/Inputs/FinancialTableInput/types";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { getCurrencyOptions } from "@/constants/options/localCurrency";
import { addValidationWith } from "@/utils/yup";

const getTableHtml = (body: string, t: typeof useT) => {
  return (
    `<table class="w-full"><thead><tr>` +
    `<th class="py-2.5 text-sm font-medium uppercase border-b border-black text-neutral-600 text-center">${t(
      "Year"
    )}</th>` +
    `<th class="py-2.5 text-sm font-medium uppercase border-b border-black text-neutral-600 text-center">${t(
      "Revenue"
    )}</th>` +
    `<th class="py-2.5 text-sm font-medium uppercase border-b border-black text-neutral-600 text-center">${t(
      "Expenses"
    )}</th>` +
    `<th class="py-2.5 text-sm font-medium uppercase border-b border-black text-neutral-600 text-center">${t(
      "Profit"
    )}</th>` +
    `</tr></thead><tbody>${body}</tbody></table>`
  );
};

export const FinancialIndicatorsField: FormFieldFactory = {
  addValidation: addValidationWith(({ validation }) =>
    yup.array().test("required-documentation", function (value) {
      if (!Array.isArray(value)) return true;

      const documentationEntries = value.filter(
        (item: { collection?: string; year?: number | string; documentation?: unknown }) =>
          item.collection === "description-documents"
      );

      if (validation?.required === true && documentationEntries.length === 0) {
        return this.createError({
          message: "At least one document upload is required. Please upload at least one supporting document."
        });
      }

      if (documentationEntries.length === 0) {
        return true;
      }

      const missingYears = documentationEntries
        .filter(entry => !Array.isArray((entry as any).documentation) || (entry as any).documentation.length === 0)
        .map(entry => entry.year as number | string);

      if (missingYears.length > 0) {
        return this.createError({
          message: `Document upload is required for years ${missingYears.join(
            ", "
          )}. Please upload at least one supporting document for each year.`
        });
      }

      return true;
    })
  ),

  renderInput: ({ years, collection }, sharedProps) => (
    <RHFFinancialIndicatorsDataTable {...sharedProps} years={years ?? undefined} collection={collection ?? undefined} />
  ),

  getAnswer: () => undefined,

  appendAnswers: () => undefined,

  addFormEntries: (entries, field, formValues, { t, record, type }) => {
    const values = formValues[field.name];

    const currencyCode = type === "financial-reports" ? record?.currency : record?.organisation?.currency;
    const currencyDisplayName = currencyCode
      ? getCurrencyOptions(t).find(opt => opt.value === currencyCode)?.title
      : undefined;

    entries.push({
      title: t("Local Currency"),
      inputType: "select",
      value: currencyDisplayName ?? t("Answer Not Provided")
    });

    if (!Array.isArray(values) || values?.length === 0) return;

    const years = field.years;
    const columnMaps: Record<string, string[]> = {
      profitAnalysisData: PROFIT_ANALYSIS_COLUMNS,
      nonProfitAnalysisData: NON_PROFILE_ANALYSIS_COLUMNS,
      currentRatioData: CURRENT_RATIO_COLUMNS,
      documentationData: DOCUMENTATION_COLUMNS
    };

    const profitCollections = ["revenue", "expenses", "profit"];
    const nonProfitCollections = ["budget"];
    const ratioCollections = ["current-assets", "current-liabilities", "current-ratio"];

    const presentCollections = new Set(values.map(({ collection }) => collection));
    const selectedCollections = new Set(JSON.parse(field.collection ?? "[]"));

    const isGroupPresent = (collections: string[]) => collections.some(col => presentCollections.has(col));
    const isCollectionPresent = (collections: string[]) => collections.some(col => selectedCollections.has(col));

    if (!isGroupPresent(profitCollections) || !isCollectionPresent(profitCollections)) {
      delete columnMaps.profitAnalysisData;
    }

    if (!isGroupPresent(nonProfitCollections) || !isCollectionPresent(nonProfitCollections)) {
      delete columnMaps.nonProfitAnalysisData;
    }

    if (!isGroupPresent(ratioCollections) || !isCollectionPresent(ratioCollections)) {
      delete columnMaps.currentRatioData;
    }

    const formatted = formatFinancialData(values, years ?? undefined, currencyCode ?? "");
    const sections = [
      { title: t("Profit Analysis (Revenue, Expenses, and Profit)"), key: "profitAnalysisData" },
      { title: t("Budget Analysis"), key: "nonProfitAnalysisData" },
      { title: t("Current Ratio"), key: "currentRatioData" },
      { title: t("Documentation"), key: "documentationData" }
    ];

    const isEmptyValue = (val: any): boolean => {
      if (typeof val === "string") {
        const trimmed = val.trim();
        return trimmed === "" || trimmed === "-";
      }
      return val == null;
    };

    const value = sections
      .map(section => {
        const data = formatted[section.key as keyof typeof formatted] as Record<string, any>[];
        const columns = columnMaps[section.key as keyof typeof columnMaps];
        if (!Array.isArray(data) || data.length === 0) return "";

        const filteredRows = data?.filter((row: Record<string, any>) => {
          if (columns == null) return null;
          const valuesToCheck = columns.filter(c => c !== "year").map(col => row[col]);
          return valuesToCheck.some(val => !isEmptyValue(val));
        });

        if (filteredRows.length === 0) return "";

        const shouldShowAsTable = section.key === "profitAnalysisData" && columns?.includes("profit");

        if (shouldShowAsTable) {
          const tableHtml = filteredRows
            .map((row: Record<string, any>) => {
              const cellValues = columns.map(col => {
                let displayValue;
                if (col === "year") {
                  displayValue = isEmptyValue(row[col]) ? "-" : String(row[col]);
                } else if (col === "revenue" || col === "expenses") {
                  const numericValue = typeof row[col] === "number" ? row[col] : Number(row[col]) ?? 0;
                  displayValue = isEmptyValue(row[col]) ? "-" : numericValue.toLocaleString();
                } else {
                  displayValue = isEmptyValue(row[col]) ? "-" : row[col].toLocaleString();
                }

                return `<td class="py-2.5 border-b border-neutral-300 text-sm text-black font-medium text-center">${displayValue}</td>`;
              });
              return `<tr>${cellValues.join("")}</tr>`;
            })
            .join("");

          return `<strong>${section.title}</strong><br/>${getTableHtml(tableHtml, t)}<br/><br/>`;
        }

        const rowsHtml = filteredRows
          .map((row: Record<string, any>) => {
            const cellValues = columns.map(col => {
              if (col === "documentation") {
                if (Array.isArray(row[col]) && row[col].length > 0) {
                  return row[col]
                    .map((document: any) => {
                      if (document.url) {
                        return `<a href="${
                          document.url
                        }" target="_blank" rel="noopener noreferrer" class="underline text-primary">${
                          document.fileName ?? ""
                        }</a>`;
                      }
                      return "";
                    })
                    .filter((link: any) => link !== "")
                    .join(", ");
                }
                return "";
              }

              if (col === "year") {
                return isEmptyValue(row[col]) ? "-" : String(row[col]);
              }
              return isEmptyValue(row[col]) ? "-" : row[col].toLocaleString();
            });
            return cellValues.join(", ");
          })
          .join("<br/>");

        return `<strong>${section.title}</strong><br/>${rowsHtml}<br/><br/>`;
      })
      .filter(Boolean)
      .join("");

    entries.push({
      title: field.label,
      inputType: field.inputType,
      value: isEmpty(value) ? t("Answer Not Provided") : value
    });
  },

  formBuilderAdditionalOptions: ({ selectRef, getSource }) => (
    <FinancialIndicatorsAdditionalOptions {...{ selectRef, getSource }} />
  )
};
