import RHFFundingTypeDataTable, {
  getFundingTypeTableColumns
} from "@/components/elements/Inputs/DataTable/RHFFundingTypeDataTable";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { appendTableAnswers } from "@/components/extensive/WizardForm/utils";
import { getFundingTypesOptions } from "@/constants/options/fundingTypes";
import { formatFinancialAmount, getCurrencySymbolPrefix } from "@/utils/financialReport";
import { formatOptionsList } from "@/utils/options";
import { addValidationWith, arrayValidator } from "@/utils/yup";

export const FundingTypeField: FormFieldFactory = {
  addValidation: addValidationWith(arrayValidator),

  renderInput: (field, sharedProps) => <RHFFundingTypeDataTable {...sharedProps} />,

  getAnswer: () => undefined,

  appendAnswers: ({ label, name }, csv, formValues) => {
    const headers = getFundingTypeTableColumns();
    appendTableAnswers(csv, label, headers, formValues[name]);
  },

  addFormEntries: (entries, field, formValues, additional) => {
    const t = additional.t;
    const currency = additional.orgDetails?.currency;
    const empty = additional.nullText ?? additional.t("Answer Not Provided");
    const rows = formValues[field.name];

    if (!Array.isArray(rows) || rows.length === 0) {
      entries.push({
        title: field.label ?? "",
        inputType: field.inputType,
        value: empty
      });
      return;
    }

    const lines = rows.map((row: { year: number; type: string; source: string; amount: number | null }) => {
      const typeLabel = formatOptionsList(getFundingTypesOptions(t), row.type);
      const amountLabel =
        row.amount == null || !Number.isFinite(Number(row.amount))
          ? "-"
          : `${getCurrencySymbolPrefix(currency)} ${formatFinancialAmount(Number(row.amount), currency)}`.trim();
      return `${row.year}, ${typeLabel}, ${row.source}, ${amountLabel}`;
    });

    entries.push({
      title: field.label ?? "",
      inputType: field.inputType,
      value: lines.join("<br/>")
    });
  }
};
