import RHFInputTable from "@/components/elements/Inputs/InputTable/RHFInputTable";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { objectValidation } from "@/utils/yup";

export const TableInputField: FormFieldFactory = {
  createValidator: ({ validation }) => objectValidation(validation),
  renderInput: ({ name, tableHeaders, additionalProps }, sharedProps) => (
    <RHFInputTable {...sharedProps} headers={tableHeaders} questionId={name} hasTotal={additionalProps?.with_numbers} />
  )
};
