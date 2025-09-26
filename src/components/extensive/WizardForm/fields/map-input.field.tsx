import { isString } from "lodash";

import RHFMap from "@/components/elements/Inputs/Map/RHFMap";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { MapAreaProvider } from "@/context/mapArea.provider";
import Log from "@/utils/log";
import { objectValidation } from "@/utils/yup";

export const MapInputField: FormFieldFactory = {
  createValidator: ({ validation, linkedFieldKey }) =>
    linkedFieldKey === "pro-pit-proj-boundary" ? undefined : objectValidation(validation),

  renderInput: ({ name, model }, sharedProps) => (
    <MapAreaProvider>
      <RHFMap {...sharedProps} model={model!} inputId={name} />
    </MapAreaProvider>
  ),

  getAnswer: () => undefined,

  appendAnswers: () => undefined,

  defaultValue: ({ name }, formValues) => {
    const value = formValues[name];
    let defaultValue: object | undefined = undefined;
    if (isString(value)) {
      try {
        defaultValue = JSON.parse(value);
      } catch (e) {
        Log.warn("Unable to parse map value", { e, value });
      }
    }
    return { ...formValues, [name]: defaultValue };
  },

  normalizeValue: ({ name }, formValues) => {
    const value = formValues[name];
    if (typeof value === "object") {
      try {
        formValues[name] = JSON.stringify(value);
      } catch (e) {
        formValues[name] = "";
      }
    }
    return formValues;
  }
};
