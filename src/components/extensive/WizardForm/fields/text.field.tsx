import Input from "@/components/elements/Inputs/Input/Input";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { getFormattedAnswer } from "@/components/extensive/WizardForm/utils";
import { stringValidator } from "@/utils/yup";

export const TextField: FormFieldFactory = {
  createValidator: stringValidator,

  renderInput: (field, sharedProps) => <Input {...sharedProps} type="text" />,

  appendAnswers: (field, csv, values, fieldsProvider) =>
    csv.pushRow([field.label, getFormattedAnswer(field, values, fieldsProvider)])
};
