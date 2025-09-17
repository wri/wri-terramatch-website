import RHFMap from "@/components/elements/Inputs/Map/RHFMap";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { MapAreaProvider } from "@/context/mapArea.provider";
import { objectValidation } from "@/utils/yup";

export const MapInputField: FormFieldFactory = {
  createValidator: ({ validation, linkedFieldKey }) =>
    linkedFieldKey === "pro-pit-proj-boundary" ? undefined : objectValidation(validation),

  renderInput: ({ uuid }, sharedProps) => (
    <MapAreaProvider>
      <RHFMap {...sharedProps} inputId={uuid} />
    </MapAreaProvider>
  )
};
