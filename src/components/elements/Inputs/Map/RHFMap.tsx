import { useT } from "@transifex/react";
import { kebabCase } from "lodash";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import InputWrapper, { InputWrapperProps } from "@/components/elements/Inputs/InputElements/InputWrapper";
import MapContainer from "@/components/elements/Map-mapbox/Map";
import { useBoundingBox } from "@/connections/BoundingBox";
import { FormModelType } from "@/connections/util/Form";
import { FORM_POLYGONS } from "@/constants/statuses";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useMonitoredDataContext } from "@/context/monitoredData.provider";
import { SitePolygonDataProvider } from "@/context/sitePolygon.provider";
import { useFormModelUuid } from "@/context/wizardForm.provider";
import { useGetV2TerrafundProjectPolygon } from "@/generated/apiComponents";
import { pluralEntityNameToSingular } from "@/helpers/entity";
import ApiSlice from "@/store/apiSlice";
import { Entity, EntityName } from "@/types/common";

import { useMap } from "../../Map-mapbox/hooks/useMap";
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
  const entityName = useMemo(() => pluralEntityNameToSingular(kebabCase(model) as EntityName), [model]);
  const onSave = (geojson: any) => {
    if (entityName != null && entityUUID != null) {
      storePolygonProject(geojson, entityUUID, entityName, refetchData, setPolygonFromMap);
    }
  };
  const mapFunctions = useMap(onSave);
  const t = useT();
  const {
    field: { onChange, value }
  } = useController(inputWrapperProps);
  const [polygonDataMap, setPolygonDataMap] = useState<any>({});
  const [polygonFromMap, setPolygonFromMap] = useState<any>(null);
  const { setSiteData } = useMapAreaContext();
  const { setSelectPolygonFromMap } = useMonitoredDataContext();

  const refetchData = () => {
    reloadProjectPolygonData();
    mapFunctions?.onCancel(polygonDataMap);
    if (entityName === "project-pitch" && entityUUID != null) {
      ApiSlice.pruneCache("boundingBoxes", [entityUUID]);
    }
  };

  const reloadSiteDataWithBoundingBox = () => {
    reloadProjectPolygonData();
    if (entityName === "project-pitch" && entityUUID != null) {
      ApiSlice.pruneCache("boundingBoxes", [entityUUID]);
    }
  };

  const {
    data: projectPolygon,
    refetch: reloadProjectPolygonData,
    isRefetching
  } = useGetV2TerrafundProjectPolygon(
    {
      queryParams: {
        entityType: entityName ?? "",
        uuid: entityUUID ?? ""
      }
    },
    {
      enabled: entityName != null && entityUUID != null,
      staleTime: 0,
      cacheTime: 0
    }
  );

  const bbox = useBoundingBox(
    entityName == "project-pitch" ? { projectPitchUuid: entityUUID } : { polygonUuid: polygonFromMap?.uuid }
  );

  // Ensure bbox has exactly 4 elements for BBox type
  const validBbox =
    bbox && Array.isArray(bbox) && bbox.length === 4 ? (bbox as [number, number, number, number]) : undefined;

  useEffect(() => {
    const getDataProjectPolygon = async () => {
      if (!projectPolygon?.project_polygon) {
        setPolygonDataMap({ [FORM_POLYGONS]: [] });
        setPolygonFromMap({ isOpen: false, uuid: "" });
        setSelectPolygonFromMap?.({ uuid: "", isOpen: false });
      } else {
        setPolygonDataMap({ [FORM_POLYGONS]: [projectPolygon?.project_polygon?.poly_uuid] });
        setPolygonFromMap({ isOpen: true, uuid: projectPolygon?.project_polygon?.poly_uuid });
      }
    };

    getDataProjectPolygon();
  }, [projectPolygon, isRefetching, setSelectPolygonFromMap]);

  useEffect(() => {
    const apiPolyUuid = projectPolygon?.project_polygon?.poly_uuid;
    const fieldName = inputWrapperProps.name;

    if (apiPolyUuid != null) {
      let shouldUpdate = false;
      if (value == null) {
        shouldUpdate = true;
      } else if (typeof value === "object" && (value as any)?.poly_uuid !== apiPolyUuid) {
        shouldUpdate = true;
      }

      if (shouldUpdate) {
        formHook.setValue(fieldName, { poly_uuid: apiPolyUuid }, { shouldValidate: true, shouldDirty: true });
      }
    } else {
      if (value != null) {
        formHook.setValue(fieldName, null, { shouldValidate: true, shouldDirty: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectPolygon?.project_polygon?.poly_uuid]);

  useEffect(() => {
    if (entityName != null && entityUUID != null) {
      const entity: Entity = { entityName, entityUUID };
      setSiteData(entity);
    }
  }, [entityName, entityUUID, setSiteData]);

  const _onChange = (value: any) => {
    onChange(value);
    onChangeCapture?.();
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
  return (
    <SitePolygonDataProvider sitePolygonData={undefined} reloadSiteData={reloadSiteDataWithBoundingBox}>
      <InputWrapper {...inputWrapperProps}>
        <MapContainer
          polygonsData={polygonDataMap}
          bbox={validBbox}
          polygonFromMap={polygonFromMap}
          setPolygonFromMap={setPolygonFromMap}
          onGeojsonChange={_onChange}
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
