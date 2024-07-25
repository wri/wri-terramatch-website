import { useT } from "@transifex/react";
import { PropsWithChildren, useEffect } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import InputWrapper, { InputWrapperProps } from "@/components/elements/Inputs/InputElements/InputWrapper";
import MapContainer from "@/components/elements/Map-mapbox/Map";
import { AdditionalPolygonProperties } from "@/components/elements/Map-mapbox/MapLayers/ShapePropertiesModal";
import { useGetV2ENTITYUUID } from "@/generated/apiComponents";
import { singularEntityNameToPlural } from "@/helpers/entity";
import { useDebounce } from "@/hooks/useDebounce";
import { Entity, SingularEntityName } from "@/types/common";

import { useMap } from "../../Map-mapbox/hooks/useMap";

export interface RHFMapProps extends UseControllerProps, InputWrapperProps {
  onChangeCapture?: () => void;
  formHook: UseFormReturn;
  captureInterventionTypes?: boolean;
  entity?: Entity;
}

const RHFMap = ({
  captureInterventionTypes,
  onChangeCapture,
  formHook,
  entity,
  ...inputWrapperProps
}: PropsWithChildren<RHFMapProps>) => {
  const mapFunctions = useMap();
  const t = useT();
  const {
    field: { value, onChange }
  } = useController(inputWrapperProps);
  const values = formHook.watch();

  const { data, refetch } = useGetV2ENTITYUUID(
    {
      pathParams: {
        entity: singularEntityNameToPlural(entity?.entityName as SingularEntityName),
        uuid: entity?.entityUUID || ""
      }
    },
    {
      enabled: !!entity,
      staleTime: 0,
      cacheTime: 0
    }
  );
  const debouncedRefetch = useDebounce(refetch, 500);
  const entityData: any = data?.data || {};

  const additionalPolygonProperties: AdditionalPolygonProperties = {
    Framework: entityData.framework_key,
    Country: entityData.project?.country,
    Org_Name: entityData.organisation?.name,
    Plant_Date: entityData.start_date,
    Project_ID: entityData.project?.ppc_external_id,
    Project_UUID: entityData.project?.uuid,
    Site_ID: entityData.ppc_external_id,
    Site_UUID: entityData.uuid,
    Project_Name: entityData.project?.name,
    Site_Name: entityData.name
  };

  const _onChange = (value: any) => {
    onChange(value);
    onChangeCapture?.();
    refetch();
  };

  const onError = (hasError: boolean) => {
    if (hasError) {
      formHook.setError(inputWrapperProps.name, {
        type: "validate",
        message: t("Polygons are missing additional information.")
      });
    } else {
      formHook.clearErrors();
    }
  };

  useEffect(() => {
    //To make sure additionalPolygonProperties is always up to date
    if (entity) {
      debouncedRefetch();
    }
  }, [values, debouncedRefetch, entity]);

  return (
    <InputWrapper {...inputWrapperProps}>
      <MapContainer
        geojson={value}
        onGeojsonChange={_onChange}
        editable
        onError={onError}
        additionalPolygonProperties={additionalPolygonProperties}
        captureAdditionalPolygonProperties={!!entity && entity.entityName !== "project"}
        mapFunctions={mapFunctions}
        hasControls={false}
        showLegend={false}
      />
    </InputWrapper>
  );
};

export default RHFMap;
