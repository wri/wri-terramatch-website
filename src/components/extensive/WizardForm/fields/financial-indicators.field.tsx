import { isEmpty } from "lodash";

import FinancialIndicatorsAdditionalOptions from "@/admin/modules/form/components/FormBuilder/AdditionalOptions/FinancialIndicatorsAdditionalOptions";
import RHFFinancialIndicatorsDataTable from "@/components/elements/Inputs/FinancialTableInput/RHFFinancialIndicatorTable";
import { documentationColumnsMap, formatFinancialData } from "@/components/elements/Inputs/FinancialTableInput/types";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { isNotNull } from "@/utils/array";

export const FinancialIndicatorsField: FormFieldFactory = {
  createValidator: () => undefined,

  renderInput: ({ years, collection }, sharedProps) => (
    <RHFFinancialIndicatorsDataTable {...sharedProps} years={years ?? undefined} collection={collection ?? undefined} />
  ),

  getAnswer: () => undefined,

  appendAnswers: () => undefined,

  getEntryValue: (field, formValues, { t }) => {
    const entries = formValues[field.name];
    if (!Array.isArray(entries) || entries?.length === 0) return undefined;

    const years = field.years;
    const columnMaps: Record<string, string[]> = {
      documentationData: documentationColumnsMap
    };

    const formatted = formatFinancialData(entries, years ?? undefined, "", "");
    const sections = [
      { title: t("Profit Analysis"), key: "profitAnalysisData" },
      { title: t("Budget Analysis"), key: "nonProfitAnalysisData" },
      { title: t("Current Ratio"), key: "currentRatioData" },
      { title: t("Documentation"), key: "documentationData" }
    ];

    const isEmptyValue = (val: any) => {
      if (val === undefined || val === null) return true;
      if (typeof val === "string") {
        return val.trim() === "" || val?.trim() === "-";
      }
      return false;
    };

    const value = sections
      .map(section => {
        const data = formatted[section.key as keyof typeof formatted] as Record<string, any>[];
        const columns = columnMaps[section.key as keyof typeof columnMaps];
        if (!Array.isArray(data) || !data || data?.length === 0) return "";

        const filteredRows = data?.filter((row: Record<string, any>) => {
          if (!columns) return null;
          const valuesToCheck = columns.filter(c => c !== "year").map(col => row[col]);
          return valuesToCheck.some(val => !isEmptyValue(val));
        });

        if (filteredRows.length === 0) return "";

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
                        }" target="_blank" rel="noopener noreferrer" class="text-primary underline">${
                          document.file_name ?? ""
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
      .filter(isNotNull)
      .join("");
    return isEmpty(value) ? t("Answer Not Provided") : value;
  },

  formBuilderAdditionalOptions: ({ selectRef, getSource }) => (
    <FinancialIndicatorsAdditionalOptions {...{ selectRef, getSource }} />
  )
};
