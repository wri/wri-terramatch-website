import Input from "@/components/elements/Inputs/Input/Input";
import { Answer, FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { getFormattedAnswer } from "@/components/extensive/WizardForm/utils";
import { stringValidator } from "@/utils/yup";

export const TelephoneField: FormFieldFactory = {
  createValidator: stringValidator,

  renderInput: (field, sharedProps) => <Input {...sharedProps} type="tel" />,

  getAnswer: ({ name }, formValues) => formValues[name] as Answer,

  appendAnswers: (field, csv, values, fieldsProvider) =>
    csv.pushRow([field.label, getFormattedAnswer(field, values, fieldsProvider)])
};
