import Input from "@/components/elements/Inputs/Input/Input";
import { Answer, FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { getFormattedAnswer } from "@/components/extensive/WizardForm/utils";
import { urlValidation } from "@/utils/yup";

export const UrlField: FormFieldFactory = {
  createValidator: ({ validation }, t) => {
    let validator = urlValidation(t);
    if (validation?.required === true) validator = validator.required();
    return validator;
  },

  renderInput: (question, sharedProps) => <Input {...sharedProps} type="url" />,

  getAnswer: ({ name }, formValues) => formValues[name] as Answer,

  appendAnswers: (question, csv, values, fieldsProvider) =>
    csv.pushRow([question.label, getFormattedAnswer(question, values, fieldsProvider)])
};
