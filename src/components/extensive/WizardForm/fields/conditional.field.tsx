import { isBoolean } from "lodash";
import * as yup from "yup";

import ConditionalAdditionalOptions from "@/admin/modules/form/components/FormBuilder/AdditionalOptions/ConditionalAdditionalOptions";
import ConditionalInput from "@/components/elements/Inputs/ConditionalInput/ConditionalInput";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { addFieldValidation, appendAnswersAsCSVRow, getFormattedAnswer } from "@/components/extensive/WizardForm/utils";
import { applyFieldDefault, normalizedFormFieldData } from "@/helpers/customForms";
import { isNotNull } from "@/utils/array";
import { booleanValidator } from "@/utils/yup";

export const ConditionalField: FormFieldFactory = {
  addValidation: (validations, field, t, framework, fieldsProvider) => {
    validations[field.name] = booleanValidator(field);
    for (const childId of fieldsProvider.childNames(field.name)) {
      const child = fieldsProvider.fieldByName(childId);
      if (child == null) continue;

      addFieldValidation(validations, fieldsProvider, child.name, t, framework);
      validations[child.name] = validations[child.name].when(field.name, {
        is: child.showOnParentCondition === true,
        then: schema => schema,
        otherwise: () => yup.mixed().nullable()
      });
    }
  },

  renderInput: ({ name }, sharedProps) => <ConditionalInput {...sharedProps} fieldId={name} id={name} inputId={name} />,

  appendAnswers: (field, csv, formValues, fieldsProvider) => {
    csv.pushRow([field.label, getFormattedAnswer(field, formValues, fieldsProvider)]);
    fieldsProvider
      .childNames(field.name)
      .map(fieldsProvider.fieldByName)
      .filter(isNotNull)
      .filter(({ showOnParentCondition }) => showOnParentCondition === formValues[field.name])
      .forEach(child => {
        appendAnswersAsCSVRow(csv, child, formValues, fieldsProvider);
      });
  },

  defaultValue: ({ name }, formValues, fieldsProvider) =>
    fieldsProvider
      .childNames(name)
      .map(fieldsProvider.fieldByName)
      .filter(isNotNull)
      .reduce((values, child) => applyFieldDefault(child, values, fieldsProvider), {
        ...formValues,
        [name]: isBoolean(formValues[name]) ? formValues[name] : true
      }),

  normalizeValue: ({ name }, formValues, fieldsProvider) =>
    fieldsProvider
      .childNames(name)
      .map(fieldsProvider.fieldByName)
      .filter(isNotNull)
      .reduce((values, child) => normalizedFormFieldData(values, child, fieldsProvider), formValues),

  formBuilderAdditionalOptions: ({ linkedFieldsData, getSource, onDeleteQuestion }) => (
    <ConditionalAdditionalOptions {...{ linkedFieldsData, getSource, onDeleteQuestion }} />
  )
};
