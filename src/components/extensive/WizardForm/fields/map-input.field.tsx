import RHFMap from "@/components/elements/Inputs/Map/RHFMap";
import MapContainer from "@/components/elements/Map-mapbox/Map";
import { addEntryWith } from "@/components/extensive/WizardForm/FormSummaryRow/types";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { MapAreaProvider } from "@/context/mapArea.provider";
import { addValidationWith, objectValidator } from "@/utils/yup";

export const MapInputField: FormFieldFactory = {
  addValidation: addValidationWith(objectValidator),

  renderInput: ({ name, model }, sharedProps) => (
    <MapAreaProvider>
      <RHFMap {...sharedProps} model={model!} inputId={name} />
    </MapAreaProvider>
  ),

  getAnswer: () => undefined,

  appendAnswers: () => undefined,

  addFormEntries: addEntryWith((field, formValues, { entityPolygonData, bbox, type, mapFunctions, record, entity }) => {
    const entityData =
      entity != null
        ? {
            entityName: entity.entityName,
            entityUUID: entity.entityUUID
          }
        : undefined;

    return (
      <MapContainer
        polygonsData={entityPolygonData ?? {}}
        bbox={bbox}
        className="h-[240px] w-full flex-1"
        hasControls={false}
        showPopups={type === "sites"}
        showLegend={type === "sites"}
        mapFunctions={mapFunctions}
        showDownloadPolygons={!!(entityPolygonData && Object.keys(entityPolygonData).length > 0)}
        record={record}
        entityData={entityData}
      />
    );
  }),

  formBuilderDefaults: ({ formModelType }) => ({ model: formModelType })
};
