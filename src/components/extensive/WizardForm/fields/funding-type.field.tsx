import RHFFundingTypeDataTable, {
  getFundingTypeTableColumns
} from "@/components/elements/Inputs/DataTable/RHFFundingTypeDataTable";
import { addEntryWith } from "@/components/extensive/WizardForm/FormSummaryRow/types";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { appendTableAnswers, dataTableEntryValue } from "@/components/extensive/WizardForm/utils";
import { addValidationWith, arrayValidator } from "@/utils/yup";

export const FundingTypeField: FormFieldFactory = {
  addValidation: addValidationWith(arrayValidator),

  renderInput: (field, sharedProps) => <RHFFundingTypeDataTable {...sharedProps} />,

  getAnswer: () => undefined,

  appendAnswers: ({ label, name }, csv, formValues) => {
    const headers = getFundingTypeTableColumns();
    appendTableAnswers(csv, label, headers, formValues[name]);
  },

  addFormEntries: addEntryWith((field, formValues, { t }) =>
    dataTableEntryValue(getFundingTypeTableColumns(t), field, formValues)
  )
};
