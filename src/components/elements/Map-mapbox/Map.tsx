import "mapbox-gl/dist/mapbox-gl.css";

import { useT } from "@transifex/react";
import _ from "lodash";
import mapboxgl from "mapbox-gl";
import React, { useEffect } from "react";
import { DetailedHTMLProps, HTMLAttributes, useState } from "react";
import { When } from "react-if";
import { twMerge } from "tailwind-merge";
import { ValidationError } from "yup";

import ControlGroup from "@/components/elements/Map-mapbox/components/ControlGroup";
import { AdditionalPolygonProperties } from "@/components/elements/Map-mapbox/MapLayers/ShapePropertiesModal";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { LAYERS_NAMES, layersList } from "@/constants/layers";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import {
  fetchGetV2TerrafundPolygonGeojsonUuid,
  fetchPutV2TerrafundPolygonUuid,
  GetV2MODELUUIDFilesResponse
} from "@/generated/apiComponents";
import { SitePolygonsDataResponse } from "@/generated/apiSchemas";

import useAlertHook from "../MapPolygonPanel/hooks/useAlertHook";
import { AdminPopup } from "./components/AdminPopup";
import { BBox } from "./GeoJSON";
import type { TooltipType } from "./Map.d";
import CheckIndividualPolygonControl from "./MapControls/CheckIndividualPolygonControl";
import CheckPolygonControl from "./MapControls/CheckPolygonControl";
import EditControl from "./MapControls/EditControl";
import EmptyStateDisplay from "./MapControls/EmptyStateDisplay";
import { FilterControl } from "./MapControls/FilterControl";
import ImageCheck from "./MapControls/ImageCheck";
import ImageControl from "./MapControls/ImageControl";
import PolygonCheck from "./MapControls/PolygonCheck";
import { StyleControl } from "./MapControls/StyleControl";
import { MapStyle } from "./MapControls/types";
import ViewImageCarousel from "./MapControls/ViewImageCarousel";
import { ZoomControl } from "./MapControls/ZoomControl";
import {
  addFilterOnLayer,
  addGeojsonToDraw,
  addMediaSourceAndLayer,
  addPopupsToMap,
  addSourcesToLayers,
  drawTemporaryPolygon,
  removeMediaLayer,
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
  validationType?: string;
  editPolygon?: boolean;
  polygonChecks?: boolean;
  legend?: LegendItem[];
  centroids?: any;
  polygonsData?: Record<string, string[]>;
  bbox?: BBox;
  setPolygonFromMap?: React.Dispatch<React.SetStateAction<{ uuid: string; isOpen: boolean }>>;
  polygonFromMap?: { uuid: string; isOpen: boolean };
  record?: any;
  showPopups?: boolean;
  showLegend?: boolean;
  mapFunctions?: any;
  tooltipType?: TooltipType;
  sitePolygonData?: SitePolygonsDataResponse;
  polygonsExists?: boolean;
  shouldBboxZoom?: boolean;
  modelFilesData?: GetV2MODELUUIDFilesResponse["data"];
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
  validationType = "bulkValidation",
  editPolygon = false,
  polygonChecks = false,
  record,
  showPopups = false,
  showLegend = false,
  mapFunctions,
  tooltipType = "view",
  polygonsExists = true,
  shouldBboxZoom = true,
  ...props
}: MapProps) => {
  const [showMediaPopups, setShowMediaPopups] = useState<boolean>(true);
  const [viewImages, setViewImages] = useState(false);
  const [currentStyle, setCurrentStyle] = useState(MapStyle.Satellite);
  const { polygonsData, bbox, setPolygonFromMap, polygonFromMap, sitePolygonData } = props;
  const context = useSitePolygonData();
  const contextMapArea = useMapAreaContext();
  const { reloadSiteData } = context ?? {};
  const t = useT();
  const { isUserDrawingEnabled, selectedPolyVersion } = contextMapArea;
  const { displayNotification } = useAlertHook();

  if (!mapFunctions) {
    return null;
  }
  const { map, mapContainer, draw, onCancel, styleLoaded, initMap, setStyleLoaded, setChangeStyle, changeStyle } =
    mapFunctions;

  useEffect(() => {
    initMap();
  }, []);

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
        addPopupsToMap(currentMap, AdminPopup, setPolygonFromMap, sitePolygonData, tooltipType);
      });
    }
  }, [styleLoaded, sitePolygonData]);

  useEffect(() => {
    if (map?.current && styleLoaded && !_.isEmpty(polygonsData)) {
      const currentMap = map.current as mapboxgl.Map;
      addSourcesToLayers(currentMap, polygonsData);
      setChangeStyle(true);
    }
  }, [sitePolygonData, styleLoaded, polygonsData]);

  useEffect(() => {
    if (currentStyle) {
      setChangeStyle(false);
    }
  }, [currentStyle]);

  useEffect(() => {
    if (!changeStyle) {
      setStyleLoaded(false);
    }
  }, [changeStyle]);

  useEffect(() => {
    if (bbox && map.current && map && shouldBboxZoom) {
      zoomToBbox(bbox, map.current, hasControls);
    }
  }, [bbox]);

  useEffect(() => {
    if (map?.current && styleLoaded && props?.modelFilesData) {
      if (showMediaPopups) {
        addMediaSourceAndLayer(map.current, props?.modelFilesData);
      } else {
        removePopups("MEDIA");
        removeMediaLayer(map.current);
      }
    }
  }, [props?.modelFilesData, showMediaPopups, styleLoaded]);

  useEffect(() => {
    if (geojson && map.current && draw.current) {
      addGeojsonToDraw(geojson, "", () => {}, draw.current, map.current);
    }
  }, [showMediaPopups]);

  function handleAddGeojsonToDraw(polygonuuid: string) {
    if (polygonsData && map.current && draw.current) {
      const currentMap = map.current;
      const newPolygonData = JSON.parse(JSON.stringify(polygonsData));
      const statuses = ["submitted", "approved", "need-more-info", "draft"];
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
    removePopups("POLYGON");
    // if ((polygonFromMap?.isOpen && polygonFromMap?.uuid !== "") || selectedPolyVersion?.uuid) {
    if (polygonFromMap?.isOpen && polygonFromMap?.uuid !== "") {
      const polygonuuid = polygonFromMap?.uuid as string;
      const polygonGeojson = await fetchGetV2TerrafundPolygonGeojsonUuid({
        // pathParams: { uuid: selectedPolyVersion?.poly_id ?? polygonuuid }
        pathParams: { uuid: polygonuuid }
      });
      if (map.current && draw.current && polygonGeojson) {
        addGeojsonToDraw(
          polygonGeojson.geojson,
          // selectedPolyVersion?.poly_id ?? polygonuuid,
          // () => handleAddGeojsonToDraw(selectedPolyVersion?.poly_id ?? polygonuuid),
          polygonuuid,
          () => handleAddGeojsonToDraw(polygonuuid),
          draw.current
        );
      }
    }
    // if (selectedPolyVersion?.uuid) {
    //   const polygonGeojson = await fetchGetV2TerrafundPolygonGeojsonUuid({
    //     pathParams: { uuid: selectedPolyVersion?.poly_id as string }
    //   });
    //   if (map.current && draw.current && polygonGeojson) {
    //     addGeojsonToDraw(
    //       polygonGeojson.geojson,
    //       selectedPolyVersion?.poly_id as string,
    //       () => handleAddGeojsonToDraw(selectedPolyVersion?.poly_id as string),
    //       draw.current
    //     );
    //   }
    // }
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
            onCancel(polygonsData);
            addSourcesToLayers(map.current, polygonsData);
            displayNotification(t("Geometry updated successfully."), "success", t("Success"));
          } else {
            displayNotification(t("Please try again later."), "error", t("Error"));
          }
        }
      }
    }
  };

  const onCancelEdit = () => {
    onCancel(polygonsData);
  };

  const addGeometryVersion = async () => {
    const polygonGeojson = await fetchGetV2TerrafundPolygonGeojsonUuid({
      pathParams: { uuid: selectedPolyVersion?.poly_id as string }
    });
    drawTemporaryPolygon(
      polygonGeojson.geojson,
      selectedPolyVersion?.poly_id as string,
      () => handleAddGeojsonToDraw(selectedPolyVersion?.poly_id as string),
      draw.current
    );
  };

  useEffect(() => {
    if (selectedPolyVersion?.poly_id) {
      addGeometryVersion();
    } else {
      onCancel(selectedPolyVersion?.poly_id);
    }
  }, [selectedPolyVersion]);

  return (
    <div ref={mapContainer} className={twMerge("h-[500px] wide:h-[700px]", className)} id="map-container">
      <When condition={hasControls}>
        <When condition={polygonFromMap?.isOpen}>
          <ControlGroup position={siteData ? "top-centerSite" : "top-center"}>
            <EditControl onClick={handleEditPolygon} onSave={onSaveEdit} onCancel={onCancelEdit} />
          </ControlGroup>
        </When>
        <ControlGroup position="top-right">
          <StyleControl map={map.current} currentStyle={currentStyle} setCurrentStyle={setCurrentStyle} />
        </ControlGroup>
        <ControlGroup position="top-right" className="top-21">
          <ZoomControl map={map.current} />
        </ControlGroup>
        <When condition={!!record?.uuid && validationType === "bulkValidation"}>
          <ControlGroup position={siteData ? "top-left-site" : "top-left"}>
            <CheckPolygonControl siteRecord={record} polygonCheck={!siteData} />
          </ControlGroup>
        </When>
        <When condition={!!status && validationType === "individualValidation"}>
          <ControlGroup position={siteData ? "top-left-site" : "top-left"}>
            <CheckIndividualPolygonControl viewRequestSuport={!siteData} />
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
        <ControlGroup position="bottom-right" className="bottom-8 flex flex-row gap-2">
          <ImageCheck showMediaPopups={showMediaPopups} setShowMediaPopups={setShowMediaPopups} />
          <ViewImageCarousel modelFilesData={props?.modelFilesData} />
        </ControlGroup>
      </When>
      <When condition={showLegend}>
        <ControlGroup position={siteData ? "bottom-left-site" : "bottom-left"}>
          <FilterControl />
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
      <When condition={!polygonsExists}>
        <EmptyStateDisplay />
      </When>
    </div>
  );
};

export default MapContainer;
