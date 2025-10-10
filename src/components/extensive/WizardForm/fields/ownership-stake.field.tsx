import RHFOwnershipStakeTable, {
  getOwnershipTableColumns
} from "@/components/elements/Inputs/DataTable/RHFOwnershipStakeTable";
import { addEntryWith } from "@/components/extensive/WizardForm/FormSummaryRow";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { appendTableAnswers, dataTableEntryValue } from "@/components/extensive/WizardForm/utils";
import { addValidationWith, arrayValidator } from "@/utils/yup";

export const OwnershipStakeField: FormFieldFactory = {
  addValidation: addValidationWith(arrayValidator),

  renderInput: (field, sharedProps) => <RHFOwnershipStakeTable {...sharedProps} />,

  getAnswer: () => undefined,

  appendAnswers: ({ label, name }, csv, formValues) => {
    const headers = getOwnershipTableColumns();
    appendTableAnswers(csv, label, headers, formValues[name]);
  },

  addFormEntries: addEntryWith((field, formValues, { t }) =>
    dataTableEntryValue(getOwnershipTableColumns(t), field, formValues)
  )
};
