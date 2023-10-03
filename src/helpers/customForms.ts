//@ts-nocheck Swagger type def is quite wrong!
import { useT } from "@transifex/react";
import { format } from "date-fns";
import { isNumber, omit, sortBy } from "lodash";
import * as yup from "yup";

import { FieldType, FormField, FormStepSchema } from "@/components/extensive/WizardForm/types";
import { getCountriesOptions } from "@/constants/options/countries";
import { getMonthOptions } from "@/constants/options/months";
import { getCountriesStatesOptions } from "@/constants/options/states";
import { FormQuestionRead, FormRead, FormSectionRead } from "@/generated/apiSchemas";
import { Option } from "@/types/common";
import { urlValidation } from "@/utils/yup";

export function normalizedFormData<T = any>(values: T, steps: FormStepSchema[]): T {
  for (const step of steps) {
    for (const field of step.fields) {
      switch (field.type) {
        case FieldType.Input: {
          if (field.fieldProps.type === "number") {
            values[field.name] = Number(values[field.name]);
          }
          break;
        }
        case FieldType.InputTable: {
          values = { ...values, ...values[field.name] };
          values = omit(values, [field.name]);
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
    }
  }

  return values;
}

export function normalizedFormDefaultValue<T = any>(values?: T, steps?: FormStepSchema[]): T {
  if (!values || !steps) return {};

  delete values.uuid;
  delete values.updated_at;
  delete values.deleted_at;
  delete values.created_at;

  for (const step of steps) {
    for (const field of step.fields) {
      switch (field.type) {
        case FieldType.Input: {
          if (field.fieldProps.type === "date" && !!values[field.name]) {
            values[field.name] = format(new Date(values[field.name]), "yyyy-MM-dd");
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
    }
  }

  return values;
}

export const getCustomFormSteps = (schema: FormRead, t: typeof useT): FormStepSchema[] => {
  return sortBy(schema.form_sections, ["order"]).map(section => apiFormSectionToFormStep(section, t));
};

export const apiFormSectionToFormStep = (section: FormSectionRead, t: typeof useT): FormStepSchema => {
  return {
    title: section.title,
    subtitle: section.description,
    fields: sortBy(section.form_questions, "order")
      .map((question, index, array) => apiFormQuestionToFormField(question, t, index, array))
      .filter(field => !!field) as FormField[]
  };
};

//TODO: add tree species input_type when endpoint is updated
export const apiFormQuestionToFormField = (
  question: FormQuestionRead,
  t: typeof useT,
  index: number,
  questions: FormQuestionRead[]
): FormField | null => {
  const validation = getFieldValidation(question, t);
  const required = question.validation?.required || false;

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
        name: question.uuid,
        type: FieldType.Input,
        label: question.label,
        description: question.description,
        placeholder: question.placeholder,
        validation,
        fieldProps: {
          required,
          type: question.input_type,
          max: question.validation?.max,
          maxLength: question.validation?.max,
          min: question.validation?.min,
          minLength: question.validation?.min
        }
      };
    case "long-text":
      return {
        name: question.uuid,
        type: FieldType.TextArea,
        label: question.label,
        description: question.description,
        placeholder: question.placeholder,
        validation,
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
      if (question.linked_field_key === "org-hq-state") {
        optionsFilterFieldName = questions.find(q => q.linked_field_key === "org-hq-country")?.uuid;
      } else if (question.linked_field_key === "org-states") {
        optionsFilterFieldName = questions.find(q => q.linked_field_key === "org-countries")?.uuid;
      } else if (question.linked_field_key === "pro-pit-states") {
        optionsFilterFieldName = questions.find(q => q.linked_field_key === "pro-pit-country")?.uuid;
      }

      return {
        name: question.uuid,
        type: FieldType.Dropdown,
        label: question.label,
        description: question.description,
        placeholder: question.placeholder,
        validation,
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
        name: question.uuid,
        type: FieldType.Select,
        label: question.label,
        description: question.description,
        placeholder: question.placeholder,
        validation,
        fieldProps: {
          required,
          multiSelect: question.input_type === "checkboxes",
          options: getOptions(question, t)
        }
      };
    case "file":
      return {
        name: question.uuid,
        type: FieldType.FileUpload,
        label: question.label,
        description: question.description,
        placeholder: question.placeholder,
        validation,
        fieldProps: {
          required,
          allowMultiple: question.multichoice,
          model: question.reference?.model!,
          uuid: question.reference?.uuid!,
          collection: question.reference?.collection!,
          accept: question.accept,
          maxFileSize: question.max
        }
      };

    case "treeSpecies": {
      return {
        name: question.uuid,
        type: FieldType.TreeSpecies,
        label: question.label,
        description: question.description,
        placeholder: question.placeholder,
        validation,
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
        name: question.uuid,
        type: FieldType.InputTable,
        label: question.label,
        description: question.description,
        placeholder: question.placeholder,
        validation,
        fieldProps: {
          required,
          headers: sortBy(question.table_headers, "order")?.map(h => h.label),
          rows: sortBy(question.children, "order").map(q => apiFormQuestionToFormField(q, t))
        }
      };
    }

    case "dataTable": {
      return {
        name: question.uuid,
        type: FieldType.DataTable,
        label: question.label,
        description: question.description,
        placeholder: question.placeholder,
        validation,
        fieldProps: {
          required,
          addButtonCaption: question.add_button_text,
          fields: sortBy(question.children, "order").map(q => apiFormQuestionToFormField(q, t)),
          tableHeaders: sortBy(question.children, "order").map(q => ({ title: q.header_label, key: q.uuid }))
        }
      };
    }

    case "leadershipTeam": {
      return {
        name: question.uuid,
        type: FieldType.LeadershipTeamDataTable,
        label: question.label,
        description: question.description,
        placeholder: question.placeholder,
        validation,
        fieldProps: {
          required,
          addButtonCaption: question.add_button_text
        }
      };
    }

    case "coreTeamLeaders": {
      return {
        name: question.uuid,
        type: FieldType.CoreTeamLeadersDataTable,
        label: question.label,
        description: question.description,
        placeholder: question.placeholder,
        validation,
        fieldProps: {
          required,
          addButtonCaption: question.add_button_text
        }
      };
    }

    case "fundingType": {
      return {
        name: question.uuid,
        type: FieldType.FundingTypeDataTable,
        label: question.label,
        description: question.description,
        placeholder: question.placeholder,
        validation,
        fieldProps: {
          required,
          addButtonCaption: question.add_button_text
        }
      };
    }

    case "select-image":
      return {
        name: question.uuid,
        type: FieldType.SelectImage,
        label: question.label,
        description: question.description,
        placeholder: question.placeholder,
        validation,
        fieldProps: {
          required,
          multiSelect: question.multichoice,
          options: getOptions(question, t)
        }
      };

    case "mapInput":
      return {
        name: question.uuid,
        type: FieldType.Map,
        label: question.label,
        description: question.description,
        placeholder: question.placeholder,
        validation,
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
    return (options = question.options
      ? (sortBy(question.options, "order").map(option => ({
          title: option.label,
          value: option.slug,
          meta: omit(option, ["label", "slug"])
        })) as Option[])
      : []);
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

const getFieldValidation = (question: FormQuestionRead, t: typeof useT): AnySchema | null => {
  let validation;
  const required = question.validation?.required || false;
  const max = question.validation?.max;
  const min = question.validation?.min;

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

      return validation;
    }

    case "number": {
      validation = yup.number();

      if (isNumber(min)) validation = validation.min(min);
      if (max) validation = validation.max(max);
      if (required) validation = validation.required();

      return validation;
    }

    case "url":
      return urlValidation(t);

    case "checkboxes":
    case "dataTable":
    case "leadershipTeam":
    case "coreTeamLeaders":
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
            amount: yup.number().min(1).required()
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

    default:
      return null;
  }
};
