// eslint-disable-next-line no-unused-vars
import { uniqBy } from "lodash";
import { AnyObjectSchema } from "yup";

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
export const maxFileSize = (maxSize: number) => (value: any, values: any, props: any) => {
  if (value?.rawFile?.size > maxSize * 1024 * 1024) return `Maximum allowed file size is ${maxSize}Mb`;
};

/**
 * react-admin duplication validator
 * @param maxSize in Mb
 * @returns
 */
export const noDuplication = (key: string) => (value: any, values: any, props: any) => {
  if (uniqBy(value, key).length !== value.length) {
    return "Duplicated options are not allowed.";
  }
  return null;
};

/**
 * react-admin duplication validator
 * @param maxSize in Mb
 * @returns
 */
export const noEmptyElement = (key: string) => (value: any, values: any, props: any) => {
  if (value.filter((v: any) => v[key] === "").length > 0) {
    return "Empty options are not allowed.";
  }
  return null;
};

/**
 * react-admin duplication validator
 * @param maxSize in Mb
 * @returns
 */
export const minArrayLength = (min: number, title: string) => (value: any, values: any, props: any) => {
  if (!value || value?.length === 0) {
    return `At least ${min} ${title} is required`;
  }
  return null;
};
