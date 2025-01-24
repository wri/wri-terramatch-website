// eslint-disable-next-line no-unused-vars
import { get, memoize, uniqBy } from "lodash";
import { AnyObjectSchema } from "yup";

import { FieldType, FormStepSchema } from "@/components/extensive/WizardForm/types";

export const validateForm = (schema: AnyObjectSchema) => (values: any) => {
  let errors: { [index: string]: string } = {};

  try {
    schema.validateSync(values, { abortEarly: false });
    //@ts-ignore
  } catch (e: any) {
    e.inner.forEach((item: any) => {
      errors[item.path] = item.message;
    });
  }

  return errors;
};

/**
 * react-admin file size validator
 * @param maxSize in Mb
 * @returns
 */
export const maxFileSize = memoize((maxSize: number) =>
  Object.assign((value: any, values: any, props: any) => {
    if (value?.rawFile?.size > maxSize * 1024 * 1024) return `Maximum allowed file size is ${maxSize}Mb`;
  })
);

/**
 * react-admin duplication validator
 * @param maxSize in Mb
 * @returns
 */
export const noDuplication = memoize((key: string) =>
  Object.assign((value: any, values: any, props: any) => {
    if (uniqBy(value, v => get(v, key)).length !== value.length) {
      return "Duplicated options are not allowed.";
    }
    return null;
  })
);

/**
 * react-admin duplication validator
 * @param maxSize in Mb
 * @returns
 */
export const noEmptyElement = memoize((key: string) =>
  Object.assign((value: any, values: any, props: any) => {
    if (value.filter((v: any) => get(v, key) === "").length > 0) {
      return "Empty options are not allowed.";
    }
    return null;
  })
);

/**
 * set conditional fields answer to true if it's a migrated record
 * @param answers
 * @param steps
 * @param migrated
 * @returns
 */
export const setDefaultConditionalFieldsAnswers = (answers: any, steps: FormStepSchema[]) => {
  const output = { ...answers };

  steps.forEach(step => {
    step.fields.forEach(fieldStep => {
      if (fieldStep.type === FieldType.Conditional && typeof output[fieldStep.name] !== "boolean") {
        output[fieldStep.name] = false;
      }
      if (fieldStep?.fieldProps && "fields" in fieldStep.fieldProps) {
        let hasChildrenValues = false;
        fieldStep.fieldProps?.fields.forEach((fieldProps: any) => {
          if (
            (fieldProps.is_parent_conditional_default && output[fieldProps.name]) ||
            (Array.isArray(output[fieldProps.name]) &&
              output[fieldProps.name]?.length > 0 &&
              output[fieldStep.name] == null) ||
            output[fieldStep.name] == true
          ) {
            hasChildrenValues = true;
          }
        });
        output[fieldStep.name] = hasChildrenValues;
      }
    });
  });

  return output;
};
