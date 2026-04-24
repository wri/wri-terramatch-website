import { useT } from "@transifex/react";
import { kebabCase } from "lodash";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import InputWrapper, { InputWrapperProps } from "@/components/elements/Inputs/InputElements/InputWrapper";
import MapContainer from "@/components/elements/Map-mapbox/Map";
import { useBoundingBox } from "@/connections/BoundingBox";
import { FormModelType } from "@/connections/Form";
import { useProjectPolygonByPitch } from "@/connections/ProjectPolygons";
import { FORM_POLYGONS } from "@/constants/statuses";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useMonitoredDataContext } from "@/context/monitoredData.provider";
import { SitePolygonDataProvider } from "@/context/sitePolygon.provider";
import { useFormModelUuid } from "@/context/wizardForm.provider";
import { singularEntityName } from "@/helpers/entity";
import ApiSlice from "@/store/apiSlice";
import { Entity, EntityName } from "@/types/common";

import { useBaseMap } from "../../Map-mapbox/hooks/useBaseMap";
import { storePolygonProject } from "../../Map-mapbox/utils";

export interface RHFMapProps extends UseControllerProps, InputWrapperProps {
  onChangeCapture?: () => void;
  formHook: UseFormReturn;
  captureInterventionTypes?: boolean;
  model: FormModelType;
}

const RHFMap = ({
  captureInterventionTypes,
  onChangeCapture,
  formHook,
  model,
  ...inputWrapperProps
}: PropsWithChildren<RHFMapProps>) => {
  const entityUUID = useFormModelUuid(model);
  const entityName = useMemo(() => singularEntityName(kebabCase(model) as EntityName), [model]);
  const onSave = (geojson: any) => {
    if (entityName != null && entityUUID != null) {
      storePolygonProject(geojson, entityUUID, entityName, refetchData, setPolygonFromMap);
    }
  };
  const mapFunctions = useBaseMap(onSave);
  const t = useT();
  const {
    field: { value }
  } = useController(inputWrapperProps);
  const [polygonDataMap, setPolygonDataMap] = useState<any>({});
  const [polygonFromMap, setPolygonFromMap] = useState<any>(null);
  const { setSiteData } = useMapAreaContext();
  const { setSelectPolygonFromMap } = useMonitoredDataContext();

  const refetchData = () => {
    mapFunctions?.onCancel(polygonDataMap);
    if (entityName === "project-pitch" && entityUUID != null) {
      ApiSlice.pruneCache("boundingBoxes", [entityUUID]);
      ApiSlice.pruneCache("projectPolygons", [entityUUID]);
    }
  };

  const reloadSiteDataWithBoundingBox = () => {
    if (entityName === "project-pitch" && entityUUID != null) {
      ApiSlice.pruneCache("boundingBoxes", [entityUUID]);
      ApiSlice.pruneCache("projectPolygons", [entityUUID]);
    }
  };

  const enabled = entityName != null && entityUUID != null;
  const [, { data: projectPolygon, isLoading: isFetching }] = useProjectPolygonByPitch({
    filter: { projectPitchUuid: entityUUID },
    enabled
  });

  const bbox = useBoundingBox(
    entityName == "project-pitch" ? { projectPitchUuid: entityUUID } : { polygonUuid: polygonFromMap?.uuid }
  );

  // Ensure bbox has exactly 4 elements for BBox type
  const validBbox =
    bbox && Array.isArray(bbox) && bbox.length === 4 ? (bbox as [number, number, number, number]) : undefined;

  useEffect(() => {
    const getDataProjectPolygon = async () => {
      if (!projectPolygon?.polygonUuid) {
        setPolygonDataMap({ [FORM_POLYGONS]: [] });
        setPolygonFromMap({ isOpen: false, uuid: "" });
        setSelectPolygonFromMap?.({ uuid: "", isOpen: false });
      } else {
        setPolygonDataMap({ [FORM_POLYGONS]: [projectPolygon.polygonUuid] });
        setPolygonFromMap({
          isOpen: true,
          uuid: projectPolygon.polygonUuid,
          entityName: "project-pitches",
          projectPitchUuid: projectPolygon.projectPitchUuid ?? entityUUID ?? undefined
        });
      }
    };

    getDataProjectPolygon();
  }, [projectPolygon, isFetching, setSelectPolygonFromMap, entityUUID]);

  useEffect(() => {
    const apiPolygonUuid = projectPolygon?.polygonUuid;
    const fieldName = inputWrapperProps.name;

    if (apiPolygonUuid != null) {
      let shouldUpdate = false;
      if (value == null) {
        shouldUpdate = true;
      } else if (typeof value === "object" && (value as any)?.polygonUuid !== apiPolygonUuid) {
        shouldUpdate = true;
      }

      if (shouldUpdate) {
        formHook.setValue(fieldName, { polygonUuid: apiPolygonUuid }, { shouldValidate: true, shouldDirty: true });
        onChangeCapture?.();
      }
    } else {
      if (enabled && !isFetching && value != null) {
        formHook.setValue(fieldName, null, { shouldValidate: true, shouldDirty: true });
        onChangeCapture?.();
      }
    }
  }, [enabled, formHook, inputWrapperProps.name, isFetching, onChangeCapture, projectPolygon, value]);

  useEffect(() => {
    if (entityName != null && entityUUID != null) {
      const entity: Entity = { entityName, entityUUID };
      setSiteData(entity);
    }
  }, [entityName, entityUUID, setSiteData]);

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

  return (
    <SitePolygonDataProvider sitePolygonData={undefined} reloadSiteData={reloadSiteDataWithBoundingBox}>
      <InputWrapper {...inputWrapperProps}>
        <MapContainer
          polygonsData={polygonDataMap}
          bbox={validBbox}
          polygonFromMap={polygonFromMap}
          setPolygonFromMap={setPolygonFromMap}
          editable
          onError={onError}
          captureAdditionalPolygonProperties={entityName != null && entityName !== "project"}
          mapFunctions={mapFunctions}
          showLegend={false}
          formMap={true}
        />
      </InputWrapper>
    </SitePolygonDataProvider>
  );
};

export default RHFMap;
