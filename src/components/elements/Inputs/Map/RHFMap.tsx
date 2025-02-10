import { useT } from "@transifex/react";
import { PropsWithChildren, useEffect, useState } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import InputWrapper, { InputWrapperProps } from "@/components/elements/Inputs/InputElements/InputWrapper";
import MapContainer from "@/components/elements/Map-mapbox/Map";
import { FORM_POLYGONS } from "@/constants/statuses";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useMonitoredDataContext } from "@/context/monitoredData.provider";
import { SitePolygonDataProvider } from "@/context/sitePolygon.provider";
import { fetchGetV2TerrafundPolygonBboxUuid, useGetV2TerrafundProjectPolygon } from "@/generated/apiComponents";
import { SitePolygonsDataResponse } from "@/generated/apiSchemas";
import { Entity } from "@/types/common";

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
  const [polygonBbox, setPolygonBbox] = useState<any>(null);
  const [polygonDataMap, setPolygonDataMap] = useState<any>({});
  const [polygonFromMap, setPolygonFromMap] = useState<any>(null);
  const { setSiteData } = useMapAreaContext();
  const { setSelectPolygonFromMap } = useMonitoredDataContext();

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

  useEffect(() => {
    const setBbboxAndZoom = async () => {
      if (projectPolygon?.project_polygon?.poly_uuid) {
        const bbox = await fetchGetV2TerrafundPolygonBboxUuid({
          pathParams: { uuid: projectPolygon.project_polygon?.poly_uuid ?? "" }
        });
        const bounds: any = bbox.bbox;
        setPolygonBbox(bounds);
      }
    };

    const getDataProjectPolygon = async () => {
      if (!projectPolygon?.project_polygon) {
        setPolygonDataMap({ [FORM_POLYGONS]: [] });
        setPolygonFromMap({ isOpen: false, uuid: "" });
        setSelectPolygonFromMap?.({ uuid: "", isOpen: false });
      } else {
        setBbboxAndZoom();
        setPolygonDataMap({ [FORM_POLYGONS]: [projectPolygon?.project_polygon?.poly_uuid] });
        setPolygonFromMap({ isOpen: true, uuid: projectPolygon?.project_polygon?.poly_uuid });
      }
    };

    getDataProjectPolygon();
  }, [projectPolygon, isRefetching, setSelectPolygonFromMap]);

  useEffect(() => {
    if (entity) {
      setSiteData(entity);
    }
  }, [entity, setSiteData]);

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
