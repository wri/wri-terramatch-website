import RHFSelectImage from "@/components/elements/Inputs/SelectImage/RHFSelectImage";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { toFormOptions } from "@/components/extensive/WizardForm/utils";
import { isNotNull } from "@/utils/array";
import { selectValidator } from "@/utils/yup";

export const SelectImageField: FormFieldFactory = {
  createValidator: selectValidator,

  renderInput: ({ options, multiChoice }, sharedProps) => (
    <RHFSelectImage {...sharedProps} multiSelect={multiChoice} options={options ?? []} />
  ),

  getAnswer: ({ name, options }, formValues) => {
    const value = formValues[name];
    const formOptions = toFormOptions(options);
    if (Array.isArray(value)) {
      return value.map(v => formOptions.find(o => o.value === v)?.title).filter(isNotNull) ?? value;
    } else {
      return formOptions.find(o => o.value === value)?.title ?? value;
    }
  }
};
