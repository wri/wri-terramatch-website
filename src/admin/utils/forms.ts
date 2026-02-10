import c from "case";
import { get, memoize, uniqBy } from "lodash";
import { AnyObjectSchema } from "yup";

export const validateForm = (schema: AnyObjectSchema) => (values: any) => {
  let errors: { [index: string]: string } = {};

  try {
    schema.validateSync(values, { abortEarly: false });
    //@ts-ignore
  } catch (e: any) {
    const FEEDBACK_FIELDS_MESSAGE = "Feedback fields must have at least 1 item";
    e.inner.forEach((item: any) => {
      let message: string = item.message;
      const isFeedbackFieldsPath = item.path === "feedback_fields" || item.path === "feedbackFields";
      if (isFeedbackFieldsPath && (message.includes("1 items") || message.includes("item is required"))) {
        message = FEEDBACK_FIELDS_MESSAGE;
      }
      errors[item.path] = message;
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
 * convert object keys to snake_case
 * @param obj
 * @returns obj with snake_case keys
 */
export const keysToSnakeCase = (obj: unknown): unknown => {
  if (Array.isArray(obj)) {
    return obj.map(v => keysToSnakeCase(v));
  } else if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(Object.entries(obj).map(([key, value]) => [c.snake(key), keysToSnakeCase(value)]));
  } else {
    return obj;
  }
};
