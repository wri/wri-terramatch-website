import RHFStrataTable, { getStrataTableColumns } from "@/components/elements/Inputs/DataTable/RHFStrataTable";
import { addEntryWith } from "@/components/extensive/WizardForm/FormSummaryRow";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { appendTableAnswers, dataTableEntryValue } from "@/components/extensive/WizardForm/utils";
import { addValidationWith, arrayValidator } from "@/utils/yup";

export const StratasField: FormFieldFactory = {
  addValidation: addValidationWith(arrayValidator),

  renderInput: (field, sharedProps) => <RHFStrataTable {...sharedProps} />,

  getAnswer: () => undefined,

  appendAnswers: ({ label, name }, csv, formValues) => {
    const headers = getStrataTableColumns();
    appendTableAnswers(csv, label, headers, formValues[name]);
  },

  addFormEntries: addEntryWith((field, formValues, { t }) =>
    dataTableEntryValue(getStrataTableColumns(t), field, formValues)
  )
};
