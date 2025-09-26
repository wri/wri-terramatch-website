import { Dictionary, flatten } from "lodash";

import { parseDateValues } from "@/admin/apiProvider/utils/entryFormat";
import { FormFieldFactories } from "@/components/extensive/WizardForm/fields";
import { FieldDefinition, FormStepSchema } from "@/components/extensive/WizardForm/types";
import { selectChildQuestions, selectQuestions, selectSections } from "@/connections/util/Form";
import { FormFieldsProvider } from "@/context/wizardForm.provider";
import { FormQuestionDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { isNotNull } from "@/utils/array";

export function normalizedFormData(values: Dictionary<any>, fieldsProvider: FormFieldsProvider): Dictionary<any> {
  for (const stepId of fieldsProvider.stepIds()) {
    for (const field of fieldsProvider.fieldIds(stepId).map(fieldsProvider.fieldById).filter(isNotNull)) {
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
 * Returns default values mounting WizardForm based on the values given from the current answers
 * on the entity, and the formUUID.
 *
 * IMPORTANT: The form must already be cached in the Connection store via useForm for this function
 * to return valid values.
 */
export function formDefaultValues(values: Dictionary<any> | undefined, formUuid: string) {
  const sections = selectSections(formUuid);
  const questions = flatten(sections.map(({ uuid }) => selectQuestions(uuid)));
  return questions.reduce(
    (results, question) => ({
      ...results,
      [question.uuid]: formDefaultValue(question, values)
    }),
    {} as Dictionary<any>
  );
}

const formDefaultValue = (question: FormQuestionDto, values: Dictionary<any> = {}) => {
  switch (question.inputType) {
    case "date":
      return parseDateValues(values[question.uuid]);

    case "tableInput":
      return selectChildQuestions(question.uuid).reduce(
        (acc, child) => ({
          ...acc,
          [child.uuid]: values[child.uuid]
        }),
        {} as Dictionary<any>
      );

    case "conditional":
      return typeof values[question.uuid] === "boolean" ? values[question.uuid] : true;

    case "mapInput": {
      if (typeof values[question.uuid] === "string") {
        try {
          return JSON.parse(values[question.uuid]);
        } catch (e) {
          /* fall through to undefined return below */
        }
      }
      return undefined;
    }

    default:
      return values[question.uuid];
  }
};

export function normalizedFormDefaultValue<T = any>(values?: T, steps?: FormStepSchema[]): T {
  if (!values || !steps) return {};
  if (typeof values === "string") {
    try {
      values = JSON.parse(values);
    } catch (e) {
      console.warn("Failed to parse values as JSON:", e);
      return {};
    }
  }

  delete values.uuid;
  delete values.updated_at;
  delete values.deleted_at;
  delete values.created_at;

  for (const step of steps) {
    for (const field of step.fields) {
      normalizedFieldDefaultValue(values, field);
    }
  }

  return values;
}

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
