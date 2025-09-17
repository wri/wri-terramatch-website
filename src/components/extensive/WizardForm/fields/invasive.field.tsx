import RHFInvasiveTable from "@/components/elements/Inputs/DataTable/RHFInvasiveTable";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { arrayValidation } from "@/utils/yup";

export const InvasiveField: FormFieldFactory = {
  createValidator: ({ validation }) => arrayValidation(validation),
  renderInput: (question, sharedProps) => <RHFInvasiveTable {...sharedProps} />
};
