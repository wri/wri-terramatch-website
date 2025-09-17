import Input from "@/components/elements/Inputs/Input/Input";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { stringValidation } from "@/utils/yup";

export const TextField: FormFieldFactory = {
  createValidator: ({ validation }) => stringValidation(validation),
  renderInput: (question, sharedProps) => <Input {...sharedProps} type="text" />
};
