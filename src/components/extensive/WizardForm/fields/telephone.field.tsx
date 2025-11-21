import Input from "@/components/elements/Inputs/Input/Input";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { addValidationWith, stringValidator } from "@/utils/yup";

export const TelephoneField: FormFieldFactory = {
  addValidation: addValidationWith(stringValidator),
  renderInput: (_, sharedProps) => <Input {...sharedProps} type="tel" />
};
