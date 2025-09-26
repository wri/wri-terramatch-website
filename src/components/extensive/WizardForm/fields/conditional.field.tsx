import ConditionalInput from "@/components/elements/Inputs/ConditionalInput/ConditionalInput";
import { Answer, FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { appendAnswersAsCSVRow, getFormattedAnswer } from "@/components/extensive/WizardForm/utils";
import { isNotNull } from "@/utils/array";
import { booleanValidation } from "@/utils/yup";

export const ConditionalField: FormFieldFactory = {
  createValidator: ({ validation }) => booleanValidation(validation),
  renderInput: ({ name }, sharedProps) => <ConditionalInput {...sharedProps} fieldId={name} id={name} inputId={name} />,
  getAnswer: ({ name }, formValues) => formValues[name] as Answer,
  appendAnswers: (field, csv, formValues, fieldsProvider) => {
    csv.pushRow([field.label, getFormattedAnswer(field, formValues, fieldsProvider)]);
    fieldsProvider
      .childIds(field.name)
      .map(fieldsProvider.fieldById)
      .filter(isNotNull)
      .filter(({ showOnParentCondition }) => showOnParentCondition === formValues[field.name])
      .forEach(child => {
        appendAnswersAsCSVRow(csv, child, formValues, fieldsProvider);
      });
  }
};
