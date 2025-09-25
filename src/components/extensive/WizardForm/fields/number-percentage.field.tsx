import * as yup from "yup";

import Input from "@/components/elements/Inputs/Input/Input";
import { Answer, FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { getFormattedAnswer } from "@/components/extensive/WizardForm/utils";

export const NumberPercentageField: FormFieldFactory = {
  createValidator: ({ validation, linkedFieldKey }) => {
    let validator = yup.number().min(0).max(100);
    if (validation?.required === true) validator = validator.required();
    return validator;
  },

  renderInput: (question, sharedProps) => {
    return <Input {...sharedProps} type="number" min={0} max={100} />;
  },

  getAnswer: ({ name }, formValues) => formValues[name] as Answer,

  appendAnswers: (question, csv, values, fieldsProvider) =>
    csv.pushRow([question.label, getFormattedAnswer(question, values, fieldsProvider)])
};
