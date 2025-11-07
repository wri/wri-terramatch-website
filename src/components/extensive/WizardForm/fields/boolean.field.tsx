import BooleanInput from "@/components/elements/Inputs/BooleanInput/BooleanInput";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { addValidationWith, booleanValidator } from "@/utils/yup";

export const BooleanField: FormFieldFactory = {
  addValidation: addValidationWith(booleanValidator),
  renderInput: ({ name }, sharedProps) => <BooleanInput {...sharedProps} id={name} inputId={name} />
};
