import Input from "@/components/elements/Inputs/Input/Input";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { stringValidator } from "@/utils/yup";

export const TelephoneField: FormFieldFactory = {
  createValidator: stringValidator,
  renderInput: (field, sharedProps) => <Input {...sharedProps} type="tel" />
};
