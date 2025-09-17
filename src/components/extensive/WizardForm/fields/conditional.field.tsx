import ConditionalInput from "@/components/elements/Inputs/ConditionalInput/ConditionalInput";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { booleanValidation } from "@/utils/yup";

export const ConditionalField: FormFieldFactory = {
  createValidator: ({ validation }) => booleanValidation(validation),
  renderInput: ({ uuid }, sharedProps) => (
    <ConditionalInput {...sharedProps} questionId={uuid} id={uuid} inputId={uuid} />
  )
};
