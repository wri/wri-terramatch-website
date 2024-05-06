import "mapbox-gl/dist/mapbox-gl.css";

//@ts-ignore
//@ts-ignore
import mapboxgl from "mapbox-gl";
//@ts-ignore
import React, { useEffect, useId, useRef } from "react";
import { DetailedHTMLProps, HTMLAttributes, useState } from "react";
import { useRefresh } from "react-admin";
import { When } from "react-if";
import { twMerge } from "tailwind-merge";
import { ValidationError } from "yup";

import ControlGroup from "@/components/elements/Map-mapbox/components/ControlGroup";
import { AdditionalPolygonProperties } from "@/components/elements/Map-mapbox/MapLayers/ShapePropertiesModal";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { LAYERS_NAMES, layersList } from "@/constants/layers";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import {
  fetchGetV2TerrafundPolygonGeojsonUuid,
  fetchPostV2TerrafundPolygon,
  fetchPutV2TerrafundPolygonUuid
} from "@/generated/apiComponents";

import EditControl from "./MapControls/EditControl";
import { FilterControl } from "./MapControls/FilterControl";
// import { useSitePolygonData } from "@/context/sitePolygon.provider";
// import { fetchGetV2TerrafundPolygonGeojsonUuid } from "@/generated/apiComponents";
import ImageControl from "./MapControls/ImageControl";
import PolygonCheck from "./MapControls/PolygonCheck";
import SiteStatus from "./MapControls/SiteStatus";
import { StyleControl } from "./MapControls/StyleControl";
import ViewImageCarousel from "./MapControls/ViewImageCarousel";
import { ZoomControl } from "./MapControls/ZoomControl";
import { GeoJSONLayer } from "./MapLayers/GeoJSONLayer";
import _MapService from "./MapService";

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
  polygonsData?: any[];
  bbox?: any;
  setPolygonFromMap?: React.Dispatch<React.SetStateAction<{ uuid: string; isOpen: boolean }>>;
  polygonFromMap?: { uuid: string; isOpen: boolean };
}

export const Map = ({
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
  ...props
}: MapProps) => {
  const ref = useRef<typeof _MapService | null>(null);
  const [viewImages, setViewImages] = useState(false);
  const { polygonsData, bbox, setPolygonFromMap, polygonFromMap } = props;
  const mapId = useId();
  const context = useSitePolygonData();
  const sitePolygonData = context?.sitePolygonData;
  const { isUserDrawingEnabled } = context || { isUserDrawingEnabled: false };
  // const { toggleUserDrawing } = context || {};

  const refresh = useRefresh();
  useEffect(() => {
    if (ref.current && isUserDrawingEnabled && ref.current.draw) {
      ref.current.startDrawing();
    } else {
      ref.current?.stopDrawing();
    }
  }, [isUserDrawingEnabled]);
  const storePolygon = async (geojson: any) => {
    console.log("Store polygon", geojson);
    if (geojson && geojson[0]) {
      const response = await fetchPostV2TerrafundPolygon({
        body: { geometry: JSON.stringify(geojson[0].geometry) }
      });
      console.log("response", response);
    }
  };
  useEffect(() => {
    if (!ref.current) {
      ref.current = _MapService;
      ref.current.initMap(mapId, storePolygon);
      const onLoad = () => {
        layersList.forEach((layer: any) => {
          if (ref.current) {
            ref.current.addSource(layer, sitePolygonData, setPolygonFromMap, hasControls);
          }
        });
      };

      if (ref.current && ref.current.map) {
        ref.current.map.on("style.load", onLoad);
      }
    }
    return () => {
      if (ref.current && ref.current.map) {
        ref.current.map.remove();
        ref.current = null;
      }
    };
  }, []);
  const addFilterOfPolygonsData = () => {
    if (ref.current && ref.current.map) {
      if (ref.current && ref.current.map.loaded()) {
        ref.current.addFilterOnLayer(
          layersList.find(layer => layer.name === LAYERS_NAMES.POLYGON_GEOMETRY),
          polygonsData ? polygonsData : [],
          "uuid"
        );
      } else {
        ref.current?.map.on("load", () => {
          ref.current?.addFilterOnLayer(
            layersList.find(layer => layer.name === LAYERS_NAMES.POLYGON_GEOMETRY),
            polygonsData ? polygonsData : [],
            "uuid"
          );
        });
      }
    }
  };
  useEffect(() => {
    if (polygonsData) {
      addFilterOfPolygonsData();
    }
  }, [polygonsData]);

  const zoomToBbox = (bbox: any) => {
    if (ref.current && ref.current.map && bbox) {
      ref.current.map.fitBounds(bbox, {
        padding: hasControls ? 100 : 30,
        linear: false,
        animate: hasControls ? true : false
      });
    }
  };
  useEffect(() => {
    if (bbox && ref.current && ref.current.map) {
      zoomToBbox(bbox);
    }
  }, [bbox]);
  const handleEditPolygon = async () => {
    if (polygonFromMap?.isOpen && polygonFromMap?.uuid !== "") {
      const polygonuuid = polygonFromMap.uuid;
      const polygonGeojson = await fetchGetV2TerrafundPolygonGeojsonUuid({
        pathParams: { uuid: polygonuuid }
      });
      if (ref.current && ref.current.draw && polygonGeojson) {
        ref.current.addGeojsonToDraw(polygonGeojson.geojson, polygonuuid, () => {
          if (polygonsData) {
            const newPolygonData = JSON.parse(JSON.stringify(polygonsData));
            const statuses = ["Submitted", "Approved", "Need More Info"];
            statuses.forEach(status => {
              if (newPolygonData[status]) {
                newPolygonData[status] = newPolygonData[status].filter((feature: string) => feature !== polygonuuid);
              }
            });
            ref.current?.addFilterOnLayer(
              layersList.find(layer => layer.name === LAYERS_NAMES.POLYGON_GEOMETRY),
              newPolygonData,
              "uuid"
            );
          }
        });
      }
    }
  };
  const onSave = async () => {
    if (ref.current && ref.current.draw) {
      const geojson = ref.current.draw.getAll();
      if (geojson) {
        if (polygonFromMap?.uuid) {
          const feature = geojson.features[0];
          const response = await fetchPutV2TerrafundPolygonUuid({
            body: { geometry: JSON.stringify(feature) },
            pathParams: { uuid: polygonFromMap?.uuid }
          });
          if (response.message == "Geometry updated successfully.") {
            layersList.forEach((layer: any) => {
              if (ref.current && ref.current.map) {
                ref.current.addSource(layer, polygonsData, setPolygonFromMap, true);
                if (setPolygonFromMap) {
                  setPolygonFromMap({ uuid: "", isOpen: false });
                }
                ref.current.map.once("idle", () => {
                  refresh();
                });
              }
            });
            onCancel();
          }
        }
      }
    }
  };
  const onCancel = () => {
    if (ref.current && ref.current.draw) {
      ref.current.draw.deleteAll();
      addFilterOfPolygonsData();
    }
  };

  return (
    <div id={mapId} className={twMerge("h-[500px] wide:h-[700px]", className)}>
      {ref.current && ref.current.map && <GeoJSONLayer mapRef={ref} geojson={geojson} />}
      <When condition={hasControls}>
        <When condition={polygonFromMap?.isOpen}>
          <ControlGroup position="top-center">
            <EditControl onClick={handleEditPolygon} onSave={onSave} onCancel={onCancel} />
          </ControlGroup>
        </When>
        <ControlGroup position="top-right">
          <StyleControl mapRef={ref} />
        </ControlGroup>
        <ControlGroup position="top-right" className="top-21">
          <ZoomControl mapRef={ref} />
        </ControlGroup>
        <When condition={!!status}>
          <ControlGroup position="top-left">
            <SiteStatus />
          </ControlGroup>
        </When>
        <When condition={!editable && !viewImages}>
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
            onClick={() => zoomToBbox(bbox)}
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

export default Map;
