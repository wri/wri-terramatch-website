//@ts-nocheck Swagger type def is quite wrong!
import { useT } from "@transifex/react";
import { isNumber, omit, sortBy } from "lodash";
import * as yup from "yup";

import { parseDateValues } from "@/admin/apiProvider/utils/entryFormat";
import { calculateTotals } from "@/components/extensive/DemographicsCollapseGrid/hooks";
import { FieldType, FormField, FormStepSchema } from "@/components/extensive/WizardForm/types";
import { getCountriesOptions } from "@/constants/options/countries";
import { getMonthOptions } from "@/constants/options/months";
import { getCountriesStatesOptions } from "@/constants/options/states";
import { Framework } from "@/context/framework.provider";
import { FormQuestionRead, FormRead, FormSectionRead } from "@/generated/apiSchemas";
import { Entity, Option } from "@/types/common";
import { urlValidation } from "@/utils/yup";

export function normalizedFormData<T = any>(values: T, steps: FormStepSchema[]): T {
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
        values[field.name] = Number(values[field.name]);
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

export function normalizedFormDefaultValue<T = any>(values?: T, steps?: FormStepSchema[]): T {
  if (!values || !steps) return {};

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

export function normalizedFieldDefaultValue<T = any>(values?: T, field?: FormField): T {
  switch (field.type) {
    case FieldType.Input: {
      if (field.fieldProps.type === "date") {
        const parsedValue = parseDateValues(values[field.name]);
        if (parsedValue) {
          values[field.name] = parsedValue;
        }
      }
      break;
    }

    case FieldType.InputTable: {
      //Temp solution: This is to handle TableInput, Bed needs to handle this in the future.
      let value: any = {};

      field.fieldProps.rows.forEach(row => {
        value[row.name] = values[row.name];
      });

      values[field.name] = value;
      break;
    }

    case FieldType.Conditional: {
      if (typeof values[field.name] !== "boolean") values[field.name] = true;
      field?.fieldProps.fields.map(f => normalizedFieldDefaultValue(values, f));
      break;
    }

    case FieldType.Map: {
      if (typeof values[field.name] === "string") {
        try {
          values[field.name] = JSON.parse(values[field.name]);
        } catch (e) {
          values[field.name] = undefined;
        }
      }
      break;
    }
  }

  return values;
}

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
      return apiFormQuestionToFormField(question, t, index, array, entity, framework, feedbackRequired);
    })
    .filter(field => !!field) as FormField[];

// If a select field with the key's linked field shows up, use the value's linked field question
// to filter the options.
const SELECT_FILTER_QUESTION = {
  "org-hq-state": "org-hq-country",
  "org-states": "org-countries",
  "pro-pit-states": "pro-pit-country",
  "org-level-1-past-restoration": "org-level-0-past-restoration",
  "pro-pit-level-1-proposed": "pro-pit-level-0-proposed"
};

export const apiFormQuestionToFormField = (
  question: FormQuestionRead,
  t: typeof useT,
  index: number,
  questions: FormQuestionRead[],
  entity?: Entity,
  framework?: Framework,
  feedbackRequired?: boolean
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
    case "number":
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

      return {
        ...sharedProps,
        type: FieldType.Dropdown,

        fieldProps: {
          required,
          multiSelect: question.multichoice,
          options: getOptions(question, t),
          hasOtherOptions: question.options_other,
          optionsFilterFieldName
        }
      };
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
    case "indirectBeneficiaries": {
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
          fields: apiQuestionsToFormFields(question.children, t, entity, framework)
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
    case "countries":
      options = getCountriesOptions(t);
      break;

    case "months":
      options = getMonthOptions(t);
      break;

    case "states":
      options = getCountriesStatesOptions(t);
      break;
  }

  return options;
};

const getFieldValidation = (question: FormQuestionRead, t: typeof useT, framework: Framework): AnySchema | null => {
  let validation;
  const required = question.validation?.required || false;
  const max = question.validation?.max;
  const min = question.validation?.min;
  const limitMin = question.min_character_limit;
  const limitMax = question.max_character_limit;

  switch (question.input_type) {
    case "text":
    case "tel":
    case "time":
    case "week":
    case "search":
    case "month":
    case "password":
    case "color":
    case "date":
    case "datetime-local":
    case "email":
    case "long-text": {
      validation = yup.string();

      if (isNumber(min)) validation = validation.min(min);
      if (max) validation = validation.max(max);
      if (required) validation = validation.required();
      if (limitMin)
        validation = validation.min(
          limitMin,
          t(`Your answer does not meet the minimum required characters ${limitMin} for this field.`)
        );
      if (limitMax)
        validation = validation.max(
          limitMax,
          t(
            `Your answer length exceeds the maximum number of characters ${limitMax} allowed for this field. Please edit your answer to fit within the required number of characters for this field.`
          )
        );

      return validation;
    }

    case "number": {
      validation = yup.number();

      if (isNumber(min)) validation = validation.min(min);
      if (max) validation = validation.max(max);
      if (required) validation = validation.required();

      return validation;
    }

    case "number-percentage": {
      validation = yup.number().min(0).max(100);
      if (required) validation = validation.required();

      return validation;
    }

    case "url":
      return urlValidation(t);

    case "checkboxes":
    case "dataTable":
    case "leaderships":
    case "ownershipStake":
    case "coreTeamLeaders":
    case "stratas":
    case "disturbances":
    case "invasive":
    case "seedings":
    case "fundingType": {
      validation = yup.array();

      if (max) validation = validation.max(max);
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
    case "allBeneficiaries":
    case "trainingBeneficiaries": {
      validation = yup
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
                  type: yup.string(),
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
            const { demographics } = value?.length > 0 ? value[0] : {};
            if (demographics == null) return true;

            return calculateTotals(demographics, framework, question.input_type).complete;
          }
        );

      if (required) validation = validation.required();

      return validation;
    }

    case "radio": {
      validation = yup.string();

      if (required) validation = validation.required();

      return validation;
    }

    case "select":
    case "select-image": {
      if (question.multichoice) {
        validation = yup.array(yup.string().required());
        if (max) validation = validation.max(max);
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
      if (question.multichoice) {
        validation = yup.array();
        if (max) validation = validation.max(max);
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
      const arrayItemShape = question.with_numbers
        ? yup.object({
            name: yup.string().required(),
            amount: yup.number().min(0).required()
          })
        : yup.object({
            name: yup.string().required()
          });

      let validation = yup.array(arrayItemShape);

      if (required) validation = validation.required();

      return validation;
    }

    case "tableInput":
    case "mapInput": {
      validation = yup.object();
      if (required) validation = validation.required();

      return validation;
    }

    case "conditional":
    case "boolean": {
      validation = yup.boolean();
      if (required) validation = validation.required();

      return validation;
    }

    default:
      return null;
  }
};
