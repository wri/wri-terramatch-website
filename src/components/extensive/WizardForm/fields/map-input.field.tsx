import { isString } from "lodash";

import RHFMap from "@/components/elements/Inputs/Map/RHFMap";
import MapContainer from "@/components/elements/Map-mapbox/Map";
import { addEntryWith } from "@/components/extensive/WizardForm/FormSummaryRow/types";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { MapAreaProvider } from "@/context/mapArea.provider";
import Log from "@/utils/log";
import { addValidationWith, objectValidator } from "@/utils/yup";

export const MapInputField: FormFieldFactory = {
  addValidation: addValidationWith(field =>
    field.linkedFieldKey === "pro-pit-proj-boundary" ? undefined : objectValidator(field)
  ),

  renderInput: ({ name, model }, sharedProps) => (
    <MapAreaProvider>
      <RHFMap {...sharedProps} model={model!} inputId={name} />
    </MapAreaProvider>
  ),

  getAnswer: () => undefined,

  appendAnswers: () => undefined,

  addFormEntries: addEntryWith((field, formValues, { entityPolygonData, bbox, type, mapFunctions, record }) => {
    if (Object.keys(entityPolygonData ?? {}).length === 0) return null;
    return (
      <MapContainer
        polygonsData={entityPolygonData}
        bbox={bbox}
        className="h-[240px] flex-1"
        hasControls={false}
        showPopups={type === "sites"}
        showLegend={type === "sites"}
        mapFunctions={mapFunctions}
        showDownloadPolygons={true}
        record={record}
      />
    );
  }),

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
  },

  formBuilderDefaults: ({ formModelType }) => ({ model: formModelType })
};
