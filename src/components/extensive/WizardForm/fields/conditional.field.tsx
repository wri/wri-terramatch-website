import { isBoolean } from "lodash";

import ConditionalInput from "@/components/elements/Inputs/ConditionalInput/ConditionalInput";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { appendAnswersAsCSVRow, getFormattedAnswer } from "@/components/extensive/WizardForm/utils";
import { applyFieldDefault, normalizedFormFieldData } from "@/helpers/customForms";
import { isNotNull } from "@/utils/array";
import { booleanValidator } from "@/utils/yup";

export const ConditionalField: FormFieldFactory = {
  createValidator: booleanValidator,

  renderInput: ({ name }, sharedProps) => <ConditionalInput {...sharedProps} fieldId={name} id={name} inputId={name} />,

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
  },

  defaultValue: ({ name }, formValues, fieldsProvider) =>
    fieldsProvider
      .childIds(name)
      .map(fieldsProvider.fieldById)
      .filter(isNotNull)
      .reduce((values, child) => applyFieldDefault(child, values, fieldsProvider), {
        ...formValues,
        [name]: isBoolean(formValues[name]) ? formValues[name] : true
      }),

  normalizeValue: ({ name }, formValues, fieldsProvider) =>
    fieldsProvider
      .childIds(name)
      .map(fieldsProvider.fieldById)
      .filter(isNotNull)
      .reduce((values, child) => normalizedFormFieldData(values, child, fieldsProvider), formValues)
};
