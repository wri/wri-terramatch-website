import * as yup from "yup";

import Input from "@/components/elements/Inputs/Input/Input";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";

export const NumberPercentageField: FormFieldFactory = {
  createValidator: ({ validation, linkedFieldKey }) => {
    let validator = yup.number().min(0).max(100);
    if (validation?.required === true) validator = validator.required();
    return validator;
  },

  renderInput: ({ linkedFieldKey }, sharedProps) => {
    return <Input {...sharedProps} type="number" min={0} max={100} />;
  }
};
