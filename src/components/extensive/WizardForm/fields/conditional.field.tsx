import ConditionalInput from "@/components/elements/Inputs/ConditionalInput/ConditionalInput";
import { Answer, FormFieldFactory } from "@/components/extensive/WizardForm/types";
import {
  appendAnswersAsCSVRow,
  getFormattedAnswer,
  questionDtoToDefinition
} from "@/components/extensive/WizardForm/utils";
import { selectChildQuestions } from "@/connections/util/Form";
import { booleanValidation } from "@/utils/yup";

export const ConditionalField: FormFieldFactory = {
  createValidator: ({ validation }) => booleanValidation(validation),
  renderInput: ({ name }, sharedProps) => <ConditionalInput {...sharedProps} fieldId={name} id={name} inputId={name} />,
  getAnswer: ({ name }, formValues) => formValues[name] as Answer,
  appendAnswers: (question, csv, formValues) => {
    csv.pushRow([question.label, getFormattedAnswer(question, formValues)]);
    selectChildQuestions(question.name)
      .filter(child => child.showOnParentCondition === formValues[question.name])
      .forEach(child => {
        appendAnswersAsCSVRow(csv, questionDtoToDefinition(child), formValues);
      });
  }
};
