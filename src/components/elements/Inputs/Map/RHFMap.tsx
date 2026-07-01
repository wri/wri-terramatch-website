import { useT } from "@transifex/react";
import { kebabCase } from "lodash";
import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import InputWrapper, { InputWrapperProps } from "@/components/elements/Inputs/InputElements/InputWrapper";
import MapContainer from "@/components/elements/Map-mapbox/Map";
import { useBoundingBox } from "@/connections/BoundingBox";
import { FormModelType } from "@/connections/Form";
import { useProjectPolygonsByPitch } from "@/connections/ProjectPolygons";
import { FORM_POLYGONS } from "@/constants/statuses";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useMonitoredDataContext } from "@/context/monitoredData.provider";
import { SitePolygonDataProvider } from "@/context/sitePolygon.provider";
import { useFormModelUuid } from "@/context/wizardForm.provider";
import { singularEntityName } from "@/helpers/entity";
import ApiSlice from "@/store/apiSlice";
import { Entity, EntityName } from "@/types/common";

import { useBaseMap } from "../../Map-mapbox/hooks/useBaseMap";
import type { PolygonFromMapState } from "../../Map-mapbox/Map.d";
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
  const [polygonFromMap, setPolygonFromMapState] = useState<PolygonFromMapState>({ isOpen: false, uuid: "" });
  const { setSiteData } = useMapAreaContext();
  const { setSelectPolygonFromMap } = useMonitoredDataContext();

  const setPolygonFromMap = useCallback(
    (value: PolygonFromMapState | ((prev: PolygonFromMapState) => PolygonFromMapState)) => {
      setPolygonFromMapState(prev => {
        const next = typeof value === "function" ? value(prev) : value;
        return {
          ...next,
          entityName: "project-pitches",
          projectPitchUuid: entityUUID ?? next.projectPitchUuid
        };
      });
    },
    [entityUUID]
  );

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
  const [, { data: projectPolygons, isLoading: isFetching }] = useProjectPolygonsByPitch({
    projectPitchUuid: entityUUID,
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
      if (projectPolygons == null || projectPolygons.length === 0) {
        setPolygonDataMap({ [FORM_POLYGONS]: [] });
        setPolygonFromMap({ isOpen: false, uuid: "" });
        setSelectPolygonFromMap?.({ uuid: "", isOpen: false });
      } else {
        setPolygonDataMap({
          [FORM_POLYGONS]: projectPolygons
            .map(polygon => polygon.polygonUuid)
            .filter((polygonUuid): polygonUuid is string => polygonUuid != null)
        });
        setPolygonFromMap(prev => ({
          isOpen: prev.uuid !== "" ? prev.isOpen : false,
          uuid: prev.uuid !== "" ? prev.uuid : projectPolygons[0].polygonUuid ?? ""
        }));
      }
    };

    getDataProjectPolygon();
  }, [projectPolygons, isFetching, setSelectPolygonFromMap, entityUUID, setPolygonFromMap]);

  useEffect(() => {
    const apiPolygonUuid = projectPolygons?.[0]?.polygonUuid;
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
  }, [enabled, formHook, inputWrapperProps.name, isFetching, onChangeCapture, projectPolygons, value]);

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

  const selectedPolygonUuid = polygonFromMap.uuid !== "" ? polygonFromMap.uuid : undefined;

  const polygonTableHighlight = useMemo(
    () =>
      selectedPolygonUuid != null
        ? {
            selectedPolygonUuids: [selectedPolygonUuid],
            onPolygonClickedFromMap: (uuid: string) => {
              setPolygonFromMap({ isOpen: true, uuid });
            }
          }
        : {
            onPolygonClickedFromMap: (uuid: string) => {
              setPolygonFromMap({ isOpen: true, uuid });
            }
          },
    [selectedPolygonUuid, setPolygonFromMap]
  );

  return (
    <SitePolygonDataProvider sitePolygonData={undefined} reloadSiteData={reloadSiteDataWithBoundingBox}>
      <InputWrapper {...inputWrapperProps}>
        <MapContainer
          entityData={{
            entityName,
            entityUUID
          }}
          polygonsData={polygonDataMap}
          bbox={validBbox}
          polygonFromMap={polygonFromMap}
          setPolygonFromMap={setPolygonFromMap}
          editable
          showPopups
          polygonTableHighlight={polygonTableHighlight}
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
