import RHFSelect from "@/components/elements/Inputs/Select/RHFSelect";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { toFormOptions } from "@/components/extensive/WizardForm/utils";
import { isNotNull } from "@/utils/array";
import { stringValidator } from "@/utils/yup";

export const RadioField: FormFieldFactory = {
  createValidator: stringValidator,

  renderInput: ({ options, linkedFieldKey }, sharedProps) => (
    <RHFSelect {...sharedProps} options={options ?? []} linkedFieldKey={linkedFieldKey ?? undefined} />
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
