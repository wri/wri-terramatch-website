import BooleanInput from "@/components/elements/Inputs/BooleanInput/BooleanInput";
import { Answer, FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { getFormattedAnswer } from "@/components/extensive/WizardForm/utils";
import { booleanValidation } from "@/utils/yup";

export const BooleanField: FormFieldFactory = {
  createValidator: ({ validation }) => booleanValidation(validation),
  renderInput: ({ name }, sharedProps) => <BooleanInput {...sharedProps} id={name} inputId={name} />,
  getAnswer: ({ name }, formValues) => formValues[name] as Answer,
  appendAnswers: (question, csv, values, fieldsProvider) =>
    csv.pushRow([question.label, getFormattedAnswer(question, values, fieldsProvider)])
};
