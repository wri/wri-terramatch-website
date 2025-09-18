import { isNumber } from "lodash";
import * as yup from "yup";

import Input from "@/components/elements/Inputs/Input/Input";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";

export const NumberField: FormFieldFactory = {
  createValidator: ({ validation, linkedFieldKey }) => {
    let validator = yup.number();
    if (validation?.required === true) validator = validator.required();
    if (isNumber(validation?.min)) validator = validator.min(validation?.min!);
    if (isNumber(validation?.max)) validator = validator.max(validation?.max!);
    if (linkedFieldKey?.includes("-lat-") || linkedFieldKey?.includes("-long-")) {
      validator = validator
        .transform((value, originalValue) => (originalValue === "" || originalValue == null ? undefined : value))
        .test("coordinates-validation", function (value) {
          if (value == null) return true;
          if (linkedFieldKey?.includes("-lat-") && (value < -90 || value > 90)) {
            return this.createError({ message: "Latitude must be between -90 and 90 degrees" });
          }
          if (linkedFieldKey?.includes("-long-") && (value < -180 || value > 180)) {
            return this.createError({ message: "Longitude must be between -180 and 180 degrees" });
          }
          if (!/^-?\d+(\.\d{1,2})?$/.test(`${value}`)) {
            return this.createError({ message: "Maximum 2 decimal places are allowed" });
          }
          return true;
        });
    }
    return validator;
  },

  renderInput: ({ linkedFieldKey, additionalProps }, sharedProps) => {
    if (linkedFieldKey?.includes("-lat-")) {
      return <Input {...sharedProps} type="number" min={-90} max={90} allowNegative />;
    }
    if (linkedFieldKey?.includes("-long-")) {
      return <Input {...sharedProps} type="number" min={-180} max={180} allowNegative />;
    }
    return <Input {...sharedProps} type="number" step={additionalProps?.step} />;
  }
};
