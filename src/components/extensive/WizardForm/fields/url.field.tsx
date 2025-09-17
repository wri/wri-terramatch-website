import Input from "@/components/elements/Inputs/Input/Input";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { urlValidation } from "@/utils/yup";

export const UrlField: FormFieldFactory = {
  createValidator: ({ validation }, t) => {
    let validator = urlValidation(t);
    if (validation?.required === true) validator = validator.required();
    return validator;
  },

  renderInput: (question, sharedProps) => <Input {...sharedProps} type="url" />
};
