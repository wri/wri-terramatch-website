import Input from "@/components/elements/Inputs/Input/Input";
import { Answer, FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { getFormattedAnswer } from "@/components/extensive/WizardForm/utils";
import { stringValidation } from "@/utils/yup";

export const DateField: FormFieldFactory = {
  createValidator: ({ validation }) => stringValidation(validation),
  renderInput: (field, sharedProps) => <Input {...sharedProps} type="date" />,
  getAnswer: ({ name }, formValues) => formValues[name] as Answer,
  appendAnswers: (field, csv, values, fieldsProvider) =>
    csv.pushRow([field.label, getFormattedAnswer(field, values, fieldsProvider)])
};
