import RHFSelect from "@/components/elements/Inputs/Select/RHFSelect";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { stringValidation } from "@/utils/yup";

export const RadioField: FormFieldFactory = {
  createValidator: ({ validation }) => stringValidation(validation),
  renderInput: ({ optionsList }, sharedProps) => <RHFSelect {...sharedProps} optionsList={optionsList} />
};
