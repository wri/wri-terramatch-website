import * as yup from "yup";

import Input from "@/components/elements/Inputs/Input/Input";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { addValidationWith } from "@/utils/yup";

export const NumberPercentageField: FormFieldFactory = {
  addValidation: addValidationWith(() => yup.number().min(0).max(100)),

  renderInput: (field, sharedProps) => {
    return <Input {...sharedProps} type="number" min={0} max={100} />;
  }
};
