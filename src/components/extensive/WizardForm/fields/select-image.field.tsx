import RHFSelectImage from "@/components/elements/Inputs/SelectImage/RHFSelectImage";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { selectValidation } from "@/utils/yup";

export const SelectImageField: FormFieldFactory = {
  createValidator: ({ validation, multiChoice }) => selectValidation(multiChoice, validation),
  renderInput: ({ optionsList, multiChoice }, sharedProps) => (
    <RHFSelectImage {...sharedProps} multiSelect={multiChoice} optionsList={optionsList} />
  )
};
