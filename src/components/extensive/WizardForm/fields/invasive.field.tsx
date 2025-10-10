import RHFInvasiveTable, { getInvasiveTableColumns } from "@/components/elements/Inputs/DataTable/RHFInvasiveTable";
import { addEntryWith } from "@/components/extensive/WizardForm/FormSummaryRow";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { appendTableAnswers, dataTableEntryValue } from "@/components/extensive/WizardForm/utils";
import { addValidationWith, arrayValidator } from "@/utils/yup";

export const InvasiveField: FormFieldFactory = {
  addValidation: addValidationWith(arrayValidator),

  renderInput: (field, sharedProps) => <RHFInvasiveTable {...sharedProps} />,

  getAnswer: () => undefined,

  appendAnswers: ({ label, name }, csv, formValues) => {
    const headers = getInvasiveTableColumns();
    appendTableAnswers(csv, label, headers, formValues[name]);
  },

  addFormEntries: addEntryWith((field, formValues, { t }) =>
    dataTableEntryValue(getInvasiveTableColumns(t), field, formValues)
  )
};
