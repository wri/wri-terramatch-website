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

  renderInput: (field, sharedProps) => <Input {...sharedProps} type="url" />,

  getAnswer: ({ name }, formValues) => formValues[name] as Answer,

  appendAnswers: (field, csv, values, fieldsProvider) =>
    csv.pushRow([field.label, getFormattedAnswer(field, values, fieldsProvider)])
};
