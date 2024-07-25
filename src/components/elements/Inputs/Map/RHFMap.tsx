import { useT } from "@transifex/react";
import { PropsWithChildren, useEffect, useState } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import InputWrapper, { InputWrapperProps } from "@/components/elements/Inputs/InputElements/InputWrapper";
import MapContainer from "@/components/elements/Map-mapbox/Map";
import { AdditionalPolygonProperties } from "@/components/elements/Map-mapbox/MapLayers/ShapePropertiesModal";
import { FORM_POLYGONS } from "@/constants/statuses";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { SitePolygonDataProvider } from "@/context/sitePolygon.provider";
import {
  fetchGetV2TerrafundPolygonBboxUuid,
  useGetV2ENTITYUUID,
  useGetV2TerrafundProjectPolygon
} from "@/generated/apiComponents";
import { SitePolygonsDataResponse } from "@/generated/apiSchemas";
import { singularEntityNameToPlural } from "@/helpers/entity";
import { useDebounce } from "@/hooks/useDebounce";
import { Entity, SingularEntityName } from "@/types/common";

import { useMap } from "../../Map-mapbox/hooks/useMap";
import { storePolygonProject } from "../../Map-mapbox/utils";

export interface RHFMapProps extends UseControllerProps, InputWrapperProps {
  onChangeCapture?: () => void;
  formHook: UseFormReturn;
  captureInterventionTypes?: boolean;
  entity?: Entity;
  model?: string;
  uuid?: string;
}

const RHFMap = ({
  captureInterventionTypes,
  onChangeCapture,
  formHook,
  entity,
  model,
  uuid,
  ...inputWrapperProps
}: PropsWithChildren<RHFMapProps>) => {
  const onSave = (geojson: any) => {
    if (entity?.entityUUID && entity?.entityName) {
      storePolygonProject(geojson, entity.entityUUID, entity.entityName, refetchData, setPolygonFromMap);
    }
  };

  const mapFunctions = useMap(onSave);
  const t = useT();
  const {
    field: { onChange }
  } = useController(inputWrapperProps);
  const values = formHook.watch();
  const [polygonBbox, setPolygonBbox] = useState<any>(null);
  const [polygonDataMap, setPolygonDataMap] = useState<any>({});
  const [polygonFromMap, setPolygonFromMap] = useState<any>(null);
  const { setSiteData } = useMapAreaContext();

  const { data, refetch } = useGetV2ENTITYUUID(
    {
      pathParams: {
        entity: singularEntityNameToPlural(entity?.entityName as SingularEntityName),
        uuid: entity?.entityUUID ?? ""
      }
    },
    {
      enabled: entity?.entityName != null && entity?.entityUUID != null,
      staleTime: 0,
      cacheTime: 0
    }
  );

  const refetchData = () => {
    reloadProjectPolygonData();
    mapFunctions?.onCancel(polygonDataMap);
  };

  const {
    data: projectPolygon,
    refetch: reloadProjectPolygonData,
    isRefetching
  } = useGetV2TerrafundProjectPolygon(
    {
      queryParams: {
        entityType: entity?.entityName ?? "",
        uuid: entity?.entityUUID ?? ""
      }
    },
    {
      enabled: entity?.entityName != null && entity?.entityUUID != null,
      staleTime: 0,
      cacheTime: 0
    }
  );
  const setBbboxAndZoom = async () => {
    if (projectPolygon?.project_polygon?.poly_uuid) {
      const bbox = await fetchGetV2TerrafundPolygonBboxUuid({
        pathParams: { uuid: projectPolygon.project_polygon?.poly_uuid ?? "" }
      });
      const bounds: any = bbox.bbox;
      setPolygonBbox(bounds);
    }
  };
  useEffect(() => {
    const getDataProjectPolygon = async () => {
      if (!projectPolygon?.project_polygon) {
        setPolygonDataMap({ [FORM_POLYGONS]: [] });
        setPolygonFromMap({ isOpen: false, uuid: "" });
      } else {
        setBbboxAndZoom();
        setPolygonDataMap({ [FORM_POLYGONS]: [projectPolygon?.project_polygon?.poly_uuid] });
        setPolygonFromMap({ isOpen: true, uuid: projectPolygon?.project_polygon?.poly_uuid });
      }
    };
    getDataProjectPolygon();
  }, [projectPolygon, isRefetching]);

  useEffect(() => {
    if (entity) {
      setSiteData(entity);
    }
  }, [entity, setSiteData]);
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
    if (entity) {
      debouncedRefetch();
    }
  }, [values, debouncedRefetch, entity]);

  return (
    <SitePolygonDataProvider
      sitePolygonData={projectPolygon?.project_polygon as SitePolygonsDataResponse}
      reloadSiteData={reloadProjectPolygonData}
    >
      <InputWrapper {...inputWrapperProps}>
        <MapContainer
          polygonsData={polygonDataMap}
          bbox={polygonBbox}
          polygonFromMap={polygonFromMap}
          setPolygonFromMap={setPolygonFromMap}
          onGeojsonChange={_onChange}
          editable
          onError={onError}
          additionalPolygonProperties={additionalPolygonProperties}
          captureAdditionalPolygonProperties={!!entity && entity.entityName !== "project"}
          mapFunctions={mapFunctions}
          showLegend={false}
          formMap={true}
        />
      </InputWrapper>
    </SitePolygonDataProvider>
  );
};

export default RHFMap;
