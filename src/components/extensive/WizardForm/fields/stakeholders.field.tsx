import RHFStakeholdersTable, {
  getStakeholdersTableColumns
} from "@/components/elements/Inputs/DataTable/RHFStakeholdersTable";
import { addEntryWith } from "@/components/extensive/WizardForm/FormSummaryRow/types";
import StakeholdersEntryValue from "@/components/extensive/WizardForm/StakeholdersEntryValue";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { appendTableAnswers } from "@/components/extensive/WizardForm/utils";
import { addValidationWith, arrayValidator } from "@/utils/yup";

export const StakeholdersField: FormFieldFactory = {
  addValidation: addValidationWith(arrayValidator),

  renderInput: (_, sharedProps) => <RHFStakeholdersTable {...sharedProps} />,

  getAnswer: () => undefined,

  appendAnswers: ({ label, name }, csv, formValues) => {
    appendTableAnswers(csv, label, getStakeholdersTableColumns(), formValues[name]);
  },

  addFormEntries: addEntryWith((field, formValues) => <StakeholdersEntryValue field={field} values={formValues} />)
};
