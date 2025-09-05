import { useT } from "@transifex/react";
import { Dictionary, flatten, isEmpty, isNumber, isObject, omit, sortBy } from "lodash";
import * as yup from "yup";
import { AnySchema } from "yup";

import { parseDateValues } from "@/admin/apiProvider/utils/entryFormat";
import { calculateTotals } from "@/components/extensive/DemographicsCollapseGrid/hooks";
import { FieldType, FormField, FormStepSchema } from "@/components/extensive/WizardForm/types";
import { selectChildQuestions, selectQuestions, selectSections } from "@/connections/util/Form";
import { getMonthOptions } from "@/constants/options/months";
import { Framework } from "@/context/framework.provider";
import { FormQuestionRead, FormRead, FormSectionRead } from "@/generated/apiSchemas";
import { DemographicEntryDto, FormQuestionDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { Entity, Option } from "@/types/common";
import { urlValidation } from "@/utils/yup";

export const formDataNormalizer = (formUuid: string) => {
  const sections = selectSections(formUuid);
  const questions = flatten(sections.map(({ uuid }) => selectQuestions(uuid)));

  return (values: Dictionary<any>) => {
    const results: Dictionary<any> = {};

    for (const question of questions) {
      switch (question.inputType) {
        case "number": {
          const value = values[question.uuid];
          results[question.uuid] = isEmpty(value) && (question.minNumberLimit ?? 0) < 0 ? value : Number(value);
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

export function normalizedFormData(values: Dictionary<any>, steps: FormStepSchema[]): Dictionary<any> {
  for (const step of steps) {
    for (const field of step.fields) {
      values = normalizedFormFieldData(values, field);
    }
  }
  return values;
}

export const normalizedFormFieldData = <T = any>(values: T, field: FormField): T => {
  switch (field.type) {
    case FieldType.Input: {
      if (field.fieldProps.type === "number") {
        const fieldValue = values[field.name];
        const isEmpty = fieldValue === undefined || fieldValue === null;
        if (isEmpty && field.fieldProps.min < 0) {
          values[field.name] = fieldValue;
        } else {
          values[field.name] = Number(fieldValue);
        }
      }
      break;
    }
    case FieldType.InputTable: {
      const inputValues = values[field.name];
      values = { ...values, ...inputValues };
      values = omit(values, [field.name]);
      break;
    }

    case FieldType.Conditional: {
      field?.fieldProps.fields.map(f => {
        values = normalizedFormFieldData(values, f);
      });
      break;
    }

    case FieldType.Map: {
      if (typeof values[field.name] === "object") {
        try {
          values[field.name] = JSON.stringify(values[field.name]);
        } catch (e) {
          values[field.name] = "";
        }
      }
      break;
    }
  }

  return values;
};

/**
 * Returns default values mounting WizardForm based on the values given from the current answers
 * on the entity, and the formUUID.
 *
 * IMPORTANT: The form must already be cached in the Connection store via useForm for this function
 * to return valid values.
 */
export function formDefaultValues(values: Dictionary<any>, formUuid: string) {
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

const formDefaultValue = (question: FormQuestionDto, values: Dictionary<any>) => {
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

// export function normalizedFieldDefaultValue<T = any>(values?: T, field?: FormField): T {
//   switch (field.type) {
//     case FieldType.Input: {
//       if (field.fieldProps.type === "date") {
//         const parsedValue = parseDateValues(values[field.name]);
//         if (parsedValue) {
//           values[field.name] = parsedValue;
//         }
//       }
//       break;
//     }
//
//     case FieldType.InputTable: {
//       //Temp solution: This is to handle TableInput, Bed needs to handle this in the future.
//       let value: any = {};
//
//       field.fieldProps.rows.forEach(row => {
//         value[row.name] = values[row.name];
//       });
//
//       values[field.name] = value;
//       break;
//     }
//
//     case FieldType.Conditional: {
//       if (typeof values[field.name] !== "boolean") values[field.name] = true;
//       field?.fieldProps.fields.map(f => normalizedFieldDefaultValue(values, f));
//       break;
//     }
//
//     case FieldType.Map: {
//       if (typeof values[field.name] === "string") {
//         try {
//           values[field.name] = JSON.parse(values[field.name]);
//         } catch (e) {
//           values[field.name] = undefined;
//         }
//       }
//       break;
//     }
//   }
//
//   return values;
// }

export const getCustomFormSteps = (
  schema: FormRead,
  t: typeof useT,
  entity?: Entity,
  framework?: Framework,
  feedback_fields?: string[]
): FormStepSchema[] => {
  return sortBy(schema?.form_sections, ["order"]).map(section =>
    apiFormSectionToFormStep(section, t, entity, framework, feedback_fields)
  );
};

export const apiFormSectionToFormStep = (
  section: FormSectionRead,
  t: typeof useT,
  entity?: Entity,
  framework?: Framework,
  feedback_fields?: string[]
): FormStepSchema => {
  return {
    title: section.title,
    subtitle: section.description,
    fields: apiQuestionsToFormFields(section.form_questions, t, entity, framework, feedback_fields)
  };
};

export const apiQuestionsToFormFields = (
  questions: any,
  t: typeof useT,
  entity?: Entity,
  framework?: Framework,
  feedback_fields?: string[]
) =>
  sortBy(questions, "order")
    .map((question, index, array) => {
      const feedbackRequired = feedback_fields?.includes(question.uuid);
      return apiFormQuestionToFormField(
        question,
        t,
        index,
        array,
        entity,
        framework,
        feedbackRequired,
        feedback_fields
      );
    })
    .filter(field => !!field) as FormField[];

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

export const apiFormQuestionToFormField = (
  question: FormQuestionRead,
  t: typeof useT,
  index: number,
  questions: FormQuestionRead[],
  entity?: Entity,
  framework?: Framework,
  feedbackRequired?: boolean,
  feedback_fields?: string[]
): FormField | null => {
  const validation = getFieldValidation(question, t, framework ?? Framework.UNDEFINED);
  const required = question.validation?.required || false;
  const sharedProps = {
    name: question.uuid,
    label: question.label,
    description: question.description,
    placeholder: question.placeholder,
    validation,
    condition: question.show_on_parent_condition,
    is_parent_conditional_default: question.is_parent_conditional_default,
    parent_id: question.parent_id,
    min_character_limit: question.min_character_limit,
    max_character_limit: question.max_character_limit,
    min_number_limit: question.min_number_limit,
    max_number_limit: question.max_number_limit,
    feedbackRequired
  };

  switch (question.input_type) {
    case "text":
    case "tel":
    case "time":
    case "url":
    case "week":
    case "search":
    case "month":
    case "number": {
      if (
        question.linked_field_key === "pro-pit-lat-proposed" ||
        question.linked_field_key === "pro-pit-long-proposed"
      ) {
        return {
          ...sharedProps,
          type: FieldType.Input,

          fieldProps: {
            required,
            max: question.max_number_limit,
            min: question.min_number_limit,
            type: question.input_type,
            allowNegative: true
          }
        };
      } else {
        return {
          ...sharedProps,
          type: FieldType.Input,

          fieldProps: {
            required,
            type: question.input_type
          }
        };
      }
    }
    case "password":
    case "color":
    case "date":
    case "datetime-local":
    case "email":
      return {
        ...sharedProps,
        type: FieldType.Input,

        fieldProps: {
          required,
          type: question.input_type,
          max: question.validation?.max,
          maxLength: question.validation?.max,
          min: question.validation?.min,
          minLength: question.validation?.min
        }
      };

    case "number-percentage":
      return {
        ...sharedProps,
        type: FieldType.Input,

        fieldProps: {
          required,
          type: "number",
          max: 100,
          min: 0
        }
      };

    case "long-text":
      return {
        ...sharedProps,
        type: FieldType.TextArea,

        fieldProps: {
          required,
          maxLength: question.validation?.max,
          minLength: question.validation?.min
        }
      };
    case "select": {
      /*
       * To find reference field to filter options, ex: find country input for states
       * We need a more robust solution than hardcoded linked_field_key
       */
      let optionsFilterFieldName: string | undefined;
      const filterQuestion = SELECT_FILTER_QUESTION[question.linked_field_key];
      if (filterQuestion != null) {
        optionsFilterFieldName = questions.find(({ linked_field_key }) => linked_field_key === filterQuestion)?.uuid;
      }

      const fieldProps = {
        required,
        multiSelect: question.multichoice,
        hasOtherOptions: question.options_other,
        optionsFilterFieldName
      };

      if (question.options_list?.startsWith("gadm-level-")) {
        fieldProps.apiOptionsSource = question.options_list;
      } else {
        fieldProps.options = getOptions(question, t);
      }

      return { ...sharedProps, type: FieldType.Dropdown, fieldProps };
    }
    case "checkboxes":
    case "radio":
      return {
        ...sharedProps,
        type: FieldType.Select,

        fieldProps: {
          required,
          multiSelect: question.input_type === "checkboxes",
          options: getOptions(question, t)
        }
      };
    case "file":
      return {
        ...sharedProps,
        type: FieldType.FileUpload,

        fieldProps: {
          required,
          allowMultiple: question.multichoice,
          model: question.reference?.model!,
          uuid: question.reference?.uuid!,
          collection: question.reference?.collection!,
          accept: question.accept,
          maxFileSize: question.max,
          showPrivateCheckbox: question.with_private_checkbox
        }
      };

    case "treeSpecies": {
      return {
        ...sharedProps,
        type: FieldType.TreeSpecies,

        fieldProps: {
          required,
          model: question.reference?.model!,
          uuid: question.reference?.uuid!,
          withNumbers: question.with_numbers,
          collection: question?.collection
        }
      };
    }

    case "tableInput": {
      return {
        ...sharedProps,
        type: FieldType.InputTable,

        fieldProps: {
          required,
          headers: sortBy(question.table_headers, "order")?.map(h => h.label),
          rows: sortBy(question.children, "order").map(q => apiFormQuestionToFormField(q, t, entity, framework)),
          hasTotal: question.with_numbers
        }
      };
    }

    case "dataTable": {
      return {
        ...sharedProps,
        type: FieldType.DataTable,

        fieldProps: {
          required,
          addButtonCaption: question.add_button_text,
          fields: sortBy(question.children, "order").map(q => apiFormQuestionToFormField(q, t, entity, framework)),
          tableColumns: sortBy(question.children, "order").map(q => ({ title: q.header_label, key: q.uuid }))
        }
      };
    }

    case "leaderships": {
      return {
        ...sharedProps,
        type: FieldType.LeadershipsDataTable,

        fieldProps: {
          required,
          addButtonCaption: question.add_button_text,
          collection: question.collection
        }
      };
    }

    case "ownershipStake": {
      return {
        ...sharedProps,
        type: FieldType.OwnershipStakeDataTable,

        fieldProps: {
          required,
          addButtonCaption: question.add_button_text
        }
      };
    }

    case "financialIndicators": {
      return {
        ...sharedProps,
        type: FieldType.FinancialTableInput,

        fieldProps: {
          required,
          addButtonCaption: question.add_button_text,
          years: question?.years,
          model: question?.collection!
        }
      };
    }

    case "stratas": {
      return {
        ...sharedProps,
        type: FieldType.StrataDataTable,

        fieldProps: {
          required,
          addButtonCaption: question.add_button_text,
          entity
        }
      };
    }

    case "disturbances": {
      return {
        ...sharedProps,
        type: FieldType.DisturbanceDataTable,

        fieldProps: {
          required,
          addButtonCaption: question.add_button_text,
          entity,
          hasExtent: question.with_extent,
          hasIntensity: question.with_intensity
        }
      };
    }

    case "invasive": {
      return {
        ...sharedProps,
        type: FieldType.InvasiveDataTable,

        fieldProps: {
          required,
          addButtonCaption: question.add_button_text,
          entity
        }
      };
    }

    case "seedings": {
      if (question.capture_count) {
        return {
          ...sharedProps,
          type: FieldType.SeedingsTableInput,

          fieldProps: {
            required,
            entity,
            withNumbers: true,
            collection: question?.collection
          }
        };
      } else {
        return {
          ...sharedProps,
          type: FieldType.SeedingsDataTable,

          fieldProps: {
            required,
            addButtonCaption: question.add_button_text,
            entity,
            captureCount: false
          }
        };
      }
    }

    case "fundingType": {
      return {
        ...sharedProps,
        type: FieldType.FundingTypeDataTable,

        fieldProps: {
          required,
          addButtonCaption: question.add_button_text
        }
      };
    }

    case "workdays":
    case "restorationPartners":
    case "jobs":
    case "employees":
    case "volunteers":
    case "allBeneficiaries":
    case "trainingBeneficiaries":
    case "indirectBeneficiaries":
    case "associates": {
      return {
        ...sharedProps,
        type: question.input_type,

        fieldProps: {
          required,
          entity,
          collection: question.collection
        }
      };
    }

    case "select-image":
      return {
        ...sharedProps,
        type: FieldType.SelectImage,

        fieldProps: {
          required,
          multiSelect: question.multichoice,
          options: getOptions(question, t)
        }
      };

    case "mapInput":
      return {
        ...sharedProps,
        type: FieldType.Map,

        fieldProps: {
          required,
          id: question.uuid,
          inputId: question.uuid,
          entity,
          model: entity?.entityName,
          uuid: entity?.entityUUID
        }
      };

    case "conditional":
      return {
        ...sharedProps,
        type: FieldType.Conditional,

        fieldProps: {
          required,
          id: question.uuid,
          inputId: question.uuid,
          fields: apiQuestionsToFormFields(question.children, t, entity, framework, feedback_fields)
        }
      };

    case "boolean":
      return {
        ...sharedProps,
        type: FieldType.Boolean,

        fieldProps: {
          required,
          id: question.uuid,
          inputId: question.uuid
        }
      };

    case "strategy-area": {
      let optionsFilterFieldName: string | undefined;
      const filterQuestion = SELECT_FILTER_QUESTION[question.linked_field_key];
      if (filterQuestion != null) {
        optionsFilterFieldName = questions.find(({ linked_field_key }) => linked_field_key === filterQuestion)?.uuid;
      }

      return {
        ...sharedProps,
        type: FieldType.StrategyAreaInput,

        fieldProps: {
          required,
          options: getOptions(question, t),
          hasOtherOptions: question.options_other,
          optionsFilterFieldName,
          collection: question.linked_field_key
        }
      };
    }

    default:
      return null;
  }
};

const getOptions = (question: FormQuestionRead, t: typeof useT) => {
  let options: Option[] = [];

  if (question.options?.length > 0) {
    return question.options
      ? (sortBy(question.options, "order").map(option => ({
          title: option.label,
          value: option.slug,
          meta: omit(option, ["label", "slug"])
        })) as Option[])
      : [];
  }

  switch (question.options_list) {
    case "months":
      options = getMonthOptions(t);
      break;
  }

  return options;
};

export const getFieldValidation = (
  question: FormQuestionDto,
  t: typeof useT,
  framework: Framework
): AnySchema | null => {
  const required = question.validation?.required === true;
  const max = question.validation?.max;
  const min = question.validation?.min;
  const limitMin = question.minCharacterLimit;
  const limitMax = question.maxCharacterLimit;
  const limitMinNumber = question.minNumberLimit;
  const limitMaxNumber = question.maxNumberLimit;
  const { inputType, linkedFieldKey, multiChoice, additionalProps } = question;

  switch (inputType) {
    case "text":
    case "date":
    case "long-text": {
      let validation = yup.string();

      if (isNumber(min)) validation = validation.min(min);
      if (isNumber(max)) validation = validation.max(max);
      if (required) validation = validation.required();
      if (limitMin != null && inputType == "long-text")
        validation = validation.min(
          limitMin,
          t(`Your answer does not meet the minimum required characters ${limitMin} for this field.`)
        );
      if (limitMax != null && inputType == "long-text")
        validation = validation.max(
          limitMax,
          t(
            `Your answer length exceeds the maximum number of characters ${limitMax} allowed for this field. Please edit your answer to fit within the required number of characters for this field.`
          )
        );

      return validation;
    }

    case "number": {
      let validation = yup.number();

      if (isNumber(min)) validation = validation.min(min);
      if (isNumber(max)) validation = validation.max(max);
      if (required) validation = validation.required();
      if (["pro-pit-lat-proposed", "pro-pit-long-proposed"].includes(linkedFieldKey ?? "")) {
        validation = yup
          .number()
          .transform((value, originalValue) => {
            return originalValue === "" || originalValue == null ? undefined : value;
          })
          .test("coordinates-validation", function (value) {
            if (value == null) return true;

            if (limitMinNumber != null && value < limitMinNumber) {
              return this.createError({
                message: `Must be greater than or equal to ${limitMinNumber}`
              });
            }

            if (limitMaxNumber != null && value > limitMaxNumber) {
              return this.createError({
                message: `Must be less than or equal to ${limitMaxNumber}`
              });
            }

            if (linkedFieldKey === "pro-pit-lat-proposed" && (value < -90 || value > 90)) {
              return this.createError({
                message: "Latitude must be between -90 and 90 degrees"
              });
            }

            if (linkedFieldKey === "pro-pit-long-proposed" && (value < -180 || value > 180)) {
              return this.createError({
                message: "Longitude must be between -180 and 180 degrees"
              });
            }

            if (!/^-?\d+(\.\d{1,2})?$/.test(Number(value).toString())) {
              return this.createError({
                message: "Maximum 2 decimal places are allowed"
              });
            }

            return true;
          });
      }

      return validation;
    }

    case "number-percentage": {
      let validation = yup.number().min(0).max(100);
      return required ? validation.required() : validation;
    }

    case "url":
      return urlValidation(t);

    case "leaderships":
    case "ownershipStake":
    case "stratas":
    case "disturbances":
    case "invasive":
    case "seedings":
    case "fundingType": {
      let validation = yup.array();

      if (isNumber(max)) validation = validation.max(max);
      if (isNumber(min)) validation = validation.min(min);

      if (required) {
        if (isNumber(min)) {
          validation = validation.required();
        } else {
          validation = validation.min(1).required();
        }
      }

      return validation;
    }

    case "workdays":
    case "restorationPartners":
    case "jobs":
    case "volunteers":
    case "employees":
    case "allBeneficiaries":
    case "trainingBeneficiaries":
    case "indirectBeneficiaries":
    case "associates": {
      let validation = yup
        .array()
        .min(0)
        .max(1)
        .of(
          yup.object({
            collection: yup.string().required(),
            demographics: yup
              .array()
              .of(
                yup.object({
                  type: yup.string().required(),
                  subtype: yup.string().nullable(),
                  name: yup.string().nullable(),
                  amount: yup.number()
                })
              )
              .required()
          })
        )
        .test(
          "totals-match",
          () =>
            framework === Framework.HBF
              ? "At least one entry in gender is required"
              : "The totals for each demographic type do not match",
          value => {
            const { demographics } =
              value != null && value.length > 0 ? value[0] : ({} as NonNullable<typeof value>[number]);
            if (demographics == null) return true;

            return calculateTotals(demographics as DemographicEntryDto[], framework, inputType).complete;
          }
        );

      return required ? validation.required() : validation;
    }

    case "radio": {
      let validation = yup.string();
      return required ? validation.required() : validation;
    }

    case "select":
    case "select-image": {
      let validation;
      if (multiChoice) {
        validation = yup.array(yup.string().required());
        if (isNumber(max)) validation = validation.max(max);
        if (isNumber(min)) validation = validation.min(min);
        if (required) {
          if (isNumber(min)) {
            validation = validation.required();
          } else {
            validation = validation.min(1).required();
          }
        }
      } else {
        validation = yup.string();
        if (required) validation = validation.required();
      }

      return validation;
    }

    case "file": {
      let validation;
      if (multiChoice) {
        validation = yup.array();
        if (isNumber(max)) validation = validation.max(max);
        if (isNumber(min)) validation = validation.min(min);
        if (required) {
          if (isNumber(min)) {
            validation = validation.required();
          } else {
            validation = validation.min(1).required();
          }
        }
      } else {
        validation = yup.object();
        if (required) validation = validation.required();
      }

      return validation;
    }

    case "treeSpecies": {
      const arrayItemShape =
        additionalProps?.with_numbers === true
          ? yup.object({
              name: yup.string().required(),
              amount: yup.number().min(0).required()
            })
          : yup.object({
              name: yup.string().required()
            });

      let validation = yup.array(arrayItemShape);
      return required ? validation.required() : validation;
    }

    case "tableInput":
    case "mapInput": {
      if (linkedFieldKey == "pro-pit-proj-boundary") return null;

      let validation = yup.object();
      return required ? validation.required() : validation;
    }

    case "conditional":
    case "boolean": {
      let validation = yup.boolean();
      return required ? validation.required() : validation;
    }

    case "strategy-area": {
      let validation = yup.string().test("total-percentage", function (value) {
        try {
          const parsed = JSON.parse(value ?? "[]");
          if (!Array.isArray(parsed)) return true;

          const hasValues = parsed.some((item: { [key: string]: number }) => Object.values(item)[0] > 0);
          if (!hasValues) return true;

          const total = parsed.reduce(
            (sum: number, item: { [key: string]: number }) => sum + Object.values(item)[0],
            0
          );

          if (total > 100) {
            return this.createError({
              message: "Your total exceeds 100%. Please adjust your percentages to equal 100 and then save & continue."
            });
          }

          if (total < 100) {
            return this.createError({
              message: "Your total is under 100%. Please adjust your percentages to equal 100 and then save & continue."
            });
          }

          return true;
        } catch {
          return this.createError({ message: "There was a problem validating this field." });
        }
      });

      return required ? validation.required() : validation;
    }

    default:
      return null;
  }
};
