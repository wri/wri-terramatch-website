import BooleanInput from "@/components/elements/Inputs/BooleanInput/BooleanInput";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { booleanValidation } from "@/utils/yup";

export const BooleanField: FormFieldFactory = {
  createValidator: ({ validation }) => booleanValidation(validation),
  renderInput: ({ name }, sharedProps) => <BooleanInput {...sharedProps} id={name} inputId={name} />
};
