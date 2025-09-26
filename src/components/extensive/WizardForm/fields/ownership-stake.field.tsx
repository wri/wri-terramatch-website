import RHFOwnershipStakeTable, {
  getOwnershipTableColumns
} from "@/components/elements/Inputs/DataTable/RHFOwnershipStakeTable";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { appendTableAnswers, dataTableEntryValue } from "@/components/extensive/WizardForm/utils";
import { arrayValidation } from "@/utils/yup";

export const OwnershipStakeField: FormFieldFactory = {
  createValidator: ({ validation }) => arrayValidation(validation),

  renderInput: (field, sharedProps) => <RHFOwnershipStakeTable {...sharedProps} />,

  getAnswer: () => undefined,

  appendAnswers: ({ label, name }, csv, formValues) => {
    const headers = getOwnershipTableColumns();
    appendTableAnswers(csv, label, headers, formValues[name]);
  },

  getEntryValue: (field, formValues, { t }) => dataTableEntryValue(getOwnershipTableColumns(t), field, formValues)
};
