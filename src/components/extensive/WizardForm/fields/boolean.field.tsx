import BooleanInput from "@/components/elements/Inputs/BooleanInput/BooleanInput";
import { Answer, FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { getFormattedAnswer } from "@/components/extensive/WizardForm/utils";
import { booleanValidator } from "@/utils/yup";

export const BooleanField: FormFieldFactory = {
  createValidator: booleanValidator,

  renderInput: ({ name }, sharedProps) => <BooleanInput {...sharedProps} id={name} inputId={name} />,

  getAnswer: ({ name }, formValues) => formValues[name] as Answer,

  appendAnswers: (field, csv, values, fieldsProvider) =>
    csv.pushRow([field.label, getFormattedAnswer(field, values, fieldsProvider)])
};
