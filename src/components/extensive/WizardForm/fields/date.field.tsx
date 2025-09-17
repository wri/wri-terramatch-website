import Input from "@/components/elements/Inputs/Input/Input";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { stringValidation } from "@/utils/yup";

export const DateField: FormFieldFactory = {
  createValidator: ({ validation }) => stringValidation(validation),
  renderInput: (question, sharedProps) => <Input {...sharedProps} type="date" />
};
