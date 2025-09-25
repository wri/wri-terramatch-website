import { useT } from "@transifex/react";
import { Dictionary } from "lodash";
import * as yup from "yup";

export const UrlRegex =
  /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?(\/.+)?$/gi;

export const urlValidation = (t: typeof useT) =>
  yup.string().matches(UrlRegex, { message: t("URL is not valid."), excludeEmptyString: true });

export const arrayValidation = (validation?: Dictionary<any> | null) => {
  let validator = yup.array();
  if (validation?.required === true) {
    const min = validation?.min ?? 1;
    validator = validator.min(min).required();
  }
  return validator;
};

export const stringValidation = (validation?: Dictionary<any> | null) => {
  const validator = yup.string();
  return validation?.required === true ? validator.required() : validator;
};

export const selectValidation = (multiChoice?: boolean | null, validation?: Dictionary<any> | null) => {
  if (multiChoice) {
    const validator = yup.array(yup.string().required());
    return validation?.required === true ? validator.required() : validator;
  } else {
    const validator = yup.string();
    return validation?.required === true ? validator.required() : validator;
  }
};

export const objectValidation = (validation?: Dictionary<any> | null) => {
  const validator = yup.object();
  return validation?.required === true ? validator.required() : validator;
};

export const booleanValidation = (validation?: Dictionary<any> | null) => {
  const validator = yup.boolean();
  return validation?.required === true ? validator.required() : validator;
};
