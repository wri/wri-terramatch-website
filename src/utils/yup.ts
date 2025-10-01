import { useT } from "@transifex/react";
import * as yup from "yup";

import { FieldDefinition } from "@/components/extensive/WizardForm/types";

export const UrlRegex =
  /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?(\/.+)?$/gi;

export const urlValidator = ({ validation }: FieldDefinition, t: typeof useT) => {
  const validator = yup.string().matches(UrlRegex, { message: t("URL is not valid."), excludeEmptyString: true });
  return validation?.required === true ? validator.required() : validator;
};

export const arrayValidator = ({ validation }: FieldDefinition) => {
  let validator = yup.array();
  if (validation?.required === true) {
    const min = validation?.min ?? 1;
    validator = validator.min(min).required();
  }
  return validator;
};

export const stringValidator = ({ validation }: FieldDefinition) => {
  const validator = yup.string();
  return validation?.required === true ? validator.required() : validator;
};

export const selectValidator = ({ multiChoice, validation }: FieldDefinition) => {
  if (multiChoice) {
    const validator = yup.array(yup.string().required());
    return validation?.required === true ? validator.min(1).required() : validator;
  } else {
    const validator = yup.string();
    return validation?.required === true ? validator.required() : validator;
  }
};

export const objectValidator = ({ validation }: FieldDefinition) => {
  const validator = yup.object();
  return validation?.required === true ? validator.required() : validator;
};

export const booleanValidator = ({ validation }: FieldDefinition) => {
  const validator = yup.boolean();
  return validation?.required === true ? validator.required() : validator;
};
