import ConditionalInput from "@/components/elements/Inputs/ConditionalInput/ConditionalInput";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { booleanValidation } from "@/utils/yup";

export const ConditionalField: FormFieldFactory = {
  createValidator: ({ validation }) => booleanValidation(validation),
  renderInput: ({ name }, sharedProps) => (
    <ConditionalInput {...sharedProps} questionId={name} id={name} inputId={name} />
  )
};
