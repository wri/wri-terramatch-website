import { Dictionary } from "lodash";

import { FormFieldFactories } from "@/components/extensive/WizardForm/fields";
import { FieldDefinition } from "@/components/extensive/WizardForm/types";
import { FormFieldsProvider } from "@/context/wizardForm.provider";
import { isNotNull } from "@/utils/array";

// If a select field with the key's linked field shows up, use the value's linked field question
// to filter the options.
export const SELECT_FILTER_QUESTION: Dictionary<string> = {
  "org-hq-state": "org-hq-country",
  "org-states": "org-countries",
  "org-level-1-past-restoration": "org-level-0-past-restoration",
  "org-level-2-past-restoration": "org-level-1-past-restoration",
  "pro-pit-states": "pro-pit-country",
  "pro-pit-level-1-proposed": "pro-pit-level-0-proposed",
  "pro-pit-level-2-proposed": "pro-pit-level-1-proposed",
  "pro-states": "pro-country"
};

export function normalizedFormData(values: Dictionary<any>, fieldsProvider: FormFieldsProvider): Dictionary<any> {
  for (const stepId of fieldsProvider.stepIds()) {
    for (const field of fieldsProvider.fieldNames(stepId).map(fieldsProvider.fieldByName).filter(isNotNull)) {
      values = normalizedFormFieldData(values, field, fieldsProvider);
    }
  }
  return values;
}

export const normalizedFormFieldData = (
  values: Dictionary<any>,
  field: FieldDefinition,
  fieldsProvider: FormFieldsProvider
) => FormFieldFactories[field.inputType].normalizeValue?.(field, values, fieldsProvider) ?? values;

/**
 * Returns default values for mounting WizardForm based on the values given from the current answers
 * on the entity.
 */
export function formDefaultValues(values: Dictionary<any>, fieldsProvider: FormFieldsProvider) {
  for (const stepId of fieldsProvider.stepIds()) {
    for (const field of fieldsProvider.fieldNames(stepId).map(fieldsProvider.fieldByName).filter(isNotNull)) {
      values = applyFieldDefault(field, values, fieldsProvider);
    }
  }
  return values;
}

export const applyFieldDefault = (
  field: FieldDefinition,
  values: Dictionary<any>,
  fieldsProvider: FormFieldsProvider
): Dictionary<any> => FormFieldFactories[field.inputType].defaultValue?.(field, values, fieldsProvider) ?? values;
