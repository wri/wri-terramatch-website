import RHFOwnershipStakeTable from "@/components/elements/Inputs/DataTable/RHFOwnershipStakeTable";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { arrayValidation } from "@/utils/yup";

export const OwnershipStakeField: FormFieldFactory = {
  createValidator: ({ validation }) => arrayValidation(validation),
  renderInput: (question, sharedProps) => <RHFOwnershipStakeTable {...sharedProps} />
};
