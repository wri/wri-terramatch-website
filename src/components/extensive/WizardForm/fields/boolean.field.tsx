import BooleanInput from "@/components/elements/Inputs/BooleanInput/BooleanInput";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { booleanValidator } from "@/utils/yup";

export const BooleanField: FormFieldFactory = {
  createValidator: booleanValidator,
  renderInput: ({ name }, sharedProps) => <BooleanInput {...sharedProps} id={name} inputId={name} />
};
