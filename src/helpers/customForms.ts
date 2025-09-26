import { Dictionary, flatten, isEmpty, isObject } from "lodash";

import { parseDateValues } from "@/admin/apiProvider/utils/entryFormat";
import { FormStepSchema } from "@/components/extensive/WizardForm/types";
import { selectChildQuestions, selectQuestions, selectSections } from "@/connections/util/Form";
import { FormQuestionDto } from "@/generated/v3/entityService/entityServiceSchemas";

export const formDataNormalizer = (formUuid: string) => {
  const sections = selectSections(formUuid);
  const questions = flatten(sections.map(({ uuid }) => selectQuestions(uuid)));

  return (values: Dictionary<any>) => {
    const results: Dictionary<any> = {};

    for (const question of questions) {
      switch (question.inputType) {
        case "number": {
          const value = values[question.uuid];
          results[question.uuid] = isEmpty(value) ? value : Number(value);
          break;
        }

        case "tableInput":
          Object.assign(results, values[question.uuid]);
          break;

        case "mapInput":
          results[question.uuid] = isObject(values[question.uuid]) ? JSON.stringify(values[question.uuid]) : "";
          break;

        default:
          results[question.uuid] = values[question.uuid];
      }
    }

    return results;
  };
};

// export function normalizedFormData(values: Dictionary<any>, steps: FormStepSchema[]): Dictionary<any> {
//   for (const step of steps) {
//     for (const field of step.fields) {
//       values = normalizedFormFieldData(values, field);
//     }
//   }
//   return values;
// }
//
// export const normalizedFormFieldData = <T = any>(values: T, field: FormField): T => {
//   switch (field.type) {
//     case FieldType.Input: {
//       if (field.fieldProps.type === "number") {
//         const fieldValue = values[field.name];
//         const isEmpty = fieldValue === undefined || fieldValue === null;
//         if (isEmpty && field.fieldProps.min < 0) {
//           values[field.name] = fieldValue;
//         } else {
//           values[field.name] = Number(fieldValue);
//         }
//       }
//       break;
//     }
//     case FieldType.InputTable: {
//       const inputValues = values[field.name];
//       values = { ...values, ...inputValues };
//       values = omit(values, [field.name]);
//       break;
//     }
//
//     case FieldType.Conditional: {
//       field?.fieldProps.fields.map(f => {
//         values = normalizedFormFieldData(values, f);
//       });
//       break;
//     }
//
//     case FieldType.Map: {
//       if (typeof values[field.name] === "object") {
//         try {
//           values[field.name] = JSON.stringify(values[field.name]);
//         } catch (e) {
//           values[field.name] = "";
//         }
//       }
//       break;
//     }
//   }
//
//   return values;
// };

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
