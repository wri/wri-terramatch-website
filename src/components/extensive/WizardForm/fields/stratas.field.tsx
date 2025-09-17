import RHFStrataTable from "@/components/elements/Inputs/DataTable/RHFStrataTable";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { arrayValidation } from "@/utils/yup";

export const StratasField: FormFieldFactory = {
  createValidator: ({ validation }) => arrayValidation(validation),
  renderInput: (question, sharedProps) => <RHFStrataTable {...sharedProps} />
};
