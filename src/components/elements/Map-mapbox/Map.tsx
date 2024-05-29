import "mapbox-gl/dist/mapbox-gl.css";

//@ts-ignore
//@ts-ignore
import mapboxgl from "mapbox-gl";
//@ts-ignore
import React, { useEffect } from "react";
import { DetailedHTMLProps, HTMLAttributes, useState } from "react";
import { When } from "react-if";
import { twMerge } from "tailwind-merge";
import { ValidationError } from "yup";

import ControlGroup from "@/components/elements/Map-mapbox/components/ControlGroup";
import { AdditionalPolygonProperties } from "@/components/elements/Map-mapbox/MapLayers/ShapePropertiesModal";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { LAYERS_NAMES, layersList } from "@/constants/layers";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import { fetchGetV2TerrafundPolygonGeojsonUuid, fetchPutV2TerrafundPolygonUuid } from "@/generated/apiComponents";
import { SitePolygonsDataResponse } from "@/generated/apiSchemas";

import { AdminPopup } from "./components/AdminPopup";
import { useMap } from "./hooks/useMap";
import CheckPolygonControl from "./MapControls/CheckPolygonControl";
import EditControl from "./MapControls/EditControl";
import { FilterControl } from "./MapControls/FilterControl";
import ImageControl from "./MapControls/ImageControl";
import PolygonCheck from "./MapControls/PolygonCheck";
import { StyleControl } from "./MapControls/StyleControl";
import { MapStyle } from "./MapControls/types";
import ViewImageCarousel from "./MapControls/ViewImageCarousel";
import { ZoomControl } from "./MapControls/ZoomControl";
import {
  addFilterOfPolygonsData,
  addFilterOnLayer,
  addGeojsonToDraw,
  addPopupsToMap,
  addSourcesToLayers,
  removePopups,
  startDrawing,
  stopDrawing,
  zoomToBbox
} from "./utils";

mapboxgl.accessToken =
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ||
  "pk.eyJ1IjoiM3NpZGVkY3ViZSIsImEiOiJjam55amZrdjIwaWY3M3FueDAzZ3ZjeGR2In0.DhSsxs-8XhbTgoVmFcs94Q";

interface LegendItem {
  color: string;
  text: string;
  uuid: string;
}

interface MapProps extends Omit<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "onError"> {
  geojson?: any;
  imageLayerGeojson?: any;
  editable?: boolean;

  onGeojsonChange?: (featuresCollection?: GeoJSON.FeatureCollection | null) => void;
  onError?: (hasError: boolean, errors: { [index: string | number]: ValidationError | undefined }) => void;
  onDeleteImage?: (uuid: string) => void;
  additionalPolygonProperties?: AdditionalPolygonProperties;
  captureAdditionalPolygonProperties?: boolean;
  hasControls?: boolean;
  siteData?: boolean;
  status?: boolean;
  editPolygon?: boolean;
  polygonChecks?: boolean;
  legend?: LegendItem[];
  centroids?: any;
  polygonsData?: SitePolygonsDataResponse;
  bbox?: any;
  setPolygonFromMap?: React.Dispatch<React.SetStateAction<{ uuid: string; isOpen: boolean }>>;
  polygonFromMap?: { uuid: string; isOpen: boolean };
  record?: any;
  isUserDrawing?: boolean;
  setIsUserDrawing?: React.Dispatch<React.SetStateAction<boolean>>;
  showPopups?: boolean;
}

export const MapContainer = ({
  onError: _onError,
  editable,
  geojson,
  imageLayerGeojson,
  onGeojsonChange,
  className,
  onDeleteImage,
  hasControls = true,
  additionalPolygonProperties,
  captureAdditionalPolygonProperties,
  siteData = false,
  status = false,
  editPolygon = false,
  polygonChecks = false,
  record,
  isUserDrawing = false,
  setIsUserDrawing,
  showPopups = false,
  ...props
}: MapProps) => {
  const [viewImages, setViewImages] = useState(false);
  const [currentStyle, setCurrentStyle] = useState(MapStyle.Satellite);
  const { polygonsData, bbox, setPolygonFromMap, polygonFromMap } = props;
  const context = useSitePolygonData();
  const sitePolygonData = context?.sitePolygonData;
  const { isUserDrawingEnabled } = isUserDrawing
    ? { isUserDrawingEnabled: isUserDrawing }
    : context || { isUserDrawingEnabled: false };
  const { toggleUserDrawing, toggleAttribute, reloadSiteData } = context || {};
  const { map, mapContainer, draw, onCancel, styleLoaded } = useMap(polygonsData, setPolygonFromMap);

  useEffect(() => {
    if (isUserDrawing) {
      toggleUserDrawing?.(isUserDrawing);
      toggleAttribute?.(true);
    }
  }, [isUserDrawing]);

  useEffect(() => {
    if (map?.current && draw?.current) {
      if (isUserDrawingEnabled) {
        startDrawing(draw.current, map.current);
      } else {
        stopDrawing(draw.current, map.current);
      }
    }
  }, [isUserDrawingEnabled]);

  useEffect(() => {
    if (map?.current && styleLoaded && showPopups) {
      const currentMap = map.current;

      map.current.on("load", () => {
        addPopupsToMap(currentMap, AdminPopup, setPolygonFromMap, sitePolygonData);
      });
    }
  }, [styleLoaded, sitePolygonData]);

  useEffect(() => {
    if (map?.current) {
      const currentMap = map.current as mapboxgl.Map;
      addFilterOfPolygonsData(currentMap, polygonsData);
    }
  }, [sitePolygonData, currentStyle]);

  useEffect(() => {
    if (bbox && map.current && map) {
      zoomToBbox(bbox, map.current, hasControls);
    }
  }, [bbox]);

  function handleAddGeojsonToDraw(polygonuuid: string) {
    if (polygonsData && map.current && draw.current) {
      const currentMap = map.current;
      const newPolygonData = JSON.parse(JSON.stringify(polygonsData));
      const statuses = ["submitted", "approved", "need-more-info"];
      statuses.forEach(status => {
        if (newPolygonData[status]) {
          newPolygonData[status] = newPolygonData[status].filter((feature: string) => feature !== polygonuuid);
        }
      });
      addFilterOnLayer(
        layersList.find(layer => layer.name === LAYERS_NAMES.POLYGON_GEOMETRY),
        "uuid",
        newPolygonData,
        currentMap
      );
    }
  }

  const handleEditPolygon = async () => {
    removePopups();
    if (polygonFromMap?.isOpen && polygonFromMap?.uuid !== "") {
      const polygonuuid = polygonFromMap.uuid;
      const polygonGeojson = await fetchGetV2TerrafundPolygonGeojsonUuid({
        pathParams: { uuid: polygonuuid }
      });
      if (map.current && draw.current && polygonGeojson) {
        addGeojsonToDraw(polygonGeojson.geojson, polygonuuid, () => handleAddGeojsonToDraw(polygonuuid), draw.current);
      }
    }
  };

  const onSaveEdit = async () => {
    if (map.current && draw.current) {
      const geojson = draw.current.getAll();
      if (geojson) {
        if (polygonFromMap?.uuid) {
          const feature = geojson.features[0];
          const response = await fetchPutV2TerrafundPolygonUuid({
            body: { geometry: JSON.stringify(feature) },
            pathParams: { uuid: polygonFromMap?.uuid }
          });
          reloadSiteData?.();
          if (response.message == "Geometry updated successfully.") {
            onCancel(map.current, draw.current);
            addSourcesToLayers(map.current);
          }
        }
      }
    }
  };

  const onCancelEdit = () => {
    if (map.current && draw.current) {
      onCancel(map.current, draw.current);
    }
  };

  return (
    <div ref={mapContainer} className={twMerge("h-[500px] wide:h-[700px]", className)} id="mapContainer">
      <When condition={hasControls}>
        <When condition={polygonFromMap?.isOpen}>
          <ControlGroup position="top-center">
            <EditControl onClick={handleEditPolygon} onSave={onSaveEdit} onCancel={onCancelEdit} />
          </ControlGroup>
        </When>
        <ControlGroup position="top-right">
          <StyleControl map={map.current} currentStyle={currentStyle} setCurrentStyle={setCurrentStyle} />
        </ControlGroup>
        <ControlGroup position="top-right" className="top-21">
          <ZoomControl map={map.current} />
        </ControlGroup>
        <When condition={!!status && !!record.uuid}>
          <ControlGroup position="top-left">
            <CheckPolygonControl siteRecord={record} />
          </ControlGroup>
        </When>
        <When condition={!editable && !viewImages && !status}>
          <ControlGroup position={siteData ? "bottom-left-site" : "bottom-left"}>
            <FilterControl />
          </ControlGroup>
        </When>
        <When condition={!!viewImages}>
          <ControlGroup position={siteData ? "bottom-left-site" : "bottom-left"}>
            <ImageControl viewImages={viewImages} setViewImages={setViewImages} />
          </ControlGroup>
        </When>
        <When condition={editPolygon}>
          <ControlGroup position="top-right" className="top-64">
            <button type="button" className="rounded-lg bg-white p-2.5 text-primary hover:text-primary ">
              <Icon name={IconNames.EDIT} className="h-5 w-5 lg:h-6 lg:w-6" />
            </button>
          </ControlGroup>
        </When>
        <When condition={!editable && !viewImages}>
          <ControlGroup position={siteData ? "bottom-left-site" : "bottom-left"}></ControlGroup>
        </When>
        <ControlGroup position="top-right" className="top-48">
          <button
            type="button"
            className="rounded-lg bg-white p-2.5 text-darkCustom-100 hover:bg-neutral-200 "
            onClick={() => bbox && map.current && zoomToBbox(bbox, map.current, hasControls)}
          >
            <Icon name={IconNames.IC_EARTH_MAP} className="h-5 w-5 lg:h-6 lg:w-6" />
          </button>
        </ControlGroup>
        <ControlGroup position="bottom-right" className="bottom-8">
          <ViewImageCarousel viewImages={viewImages} setViewImages={setViewImages} />
        </ControlGroup>
      </When>
      <When condition={captureAdditionalPolygonProperties}>
        <ControlGroup position="bottom-right"></ControlGroup>
      </When>
      <When condition={polygonChecks}>
        <ControlGroup position="bottom-left" className="bottom-13">
          <PolygonCheck />
        </ControlGroup>
      </When>
      <When condition={!!siteData}>
        <div className="absolute z-10 h-full w-[23vw] bg-[#ffffff26] backdrop-blur-md" />
      </When>
    </div>
  );
};

export default MapContainer;
