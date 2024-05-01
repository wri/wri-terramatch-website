import "mapbox-gl/dist/mapbox-gl.css";

//@ts-ignore
//@ts-ignore
import mapboxgl from "mapbox-gl";
//@ts-ignore
import React, { useEffect, useId, useRef } from "react";
import { DetailedHTMLProps, HTMLAttributes, useState } from "react";
import { When } from "react-if";
import { twMerge } from "tailwind-merge";
import { ValidationError } from "yup";

import ControlGroup from "@/components/elements/Map-mapbox/components/ControlGroup";
import { AdditionalPolygonProperties } from "@/components/elements/Map-mapbox/MapLayers/ShapePropertiesModal";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { LAYERS_NAMES, layersList } from "@/constants/layers";
import { useSitePolygonData } from "@/context/sitePolygon.provider";

// import { useSitePolygonData } from "@/context/sitePolygon.provider";
// import { fetchGetV2TerrafundPolygonGeojsonUuid } from "@/generated/apiComponents";
import ImageControl from "./MapControls/ImageControl";
import PolygonCheck from "./MapControls/PolygonCheck";
import SiteStatus from "./MapControls/SiteStatus";
import { StyleControl } from "./MapControls/StyleControl";
import ViewImageCarousel from "./MapControls/ViewImageCarousel";
import { ZoomControl } from "./MapControls/ZoomControl";
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
  setPolygonMap?: React.Dispatch<React.SetStateAction<{ uuid: string; isOpen: boolean }>>;
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
  // const { polygonsData, bbox, setPolygonMap } = props;
  const ref = useRef<typeof _MapService | null>(null);
  // const onError = useDebounce((hasError, errors) => _onError?.(hasError, errors), 250);
  const [viewImages, setViewImages] = useState(false);
  const { polygonsData, bbox, setPolygonMap } = props;
  const mapId = useId();
  // const { openModal, closeModal } = useModalContext();
  // const [tooltipOpen, setTooltipOpen] = useState(true);
  const sitePolygonData = useSitePolygonData();
  const [isOpenEditPolygon, setIsOpenEditPolygon] = useState({ uuid: "", isOpen: false });

  useEffect(() => {
    if (!ref.current) {
      ref.current = _MapService;
      ref.current.initMap(mapId);
      const onLoad = () => {
        layersList.forEach((layer: any) => {
          if (ref.current) {
            ref.current.addSource(layer, sitePolygonData, setIsOpenEditPolygon);
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

  useEffect(() => {
    if (polygonsData && ref.current && ref.current.map) {
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
  }, [polygonsData]);

  useEffect(() => {
    if (setPolygonMap) {
      setPolygonMap(isOpenEditPolygon);
    }
  }, [isOpenEditPolygon]);

  const zoomToBbox = (bbox: any) => {
    if (ref.current && ref.current.map && bbox) {
      ref.current.map.fitBounds(bbox, {
        padding: 100,
        linear: false
      });
    }
  };
  useEffect(() => {
    if (bbox && ref.current && ref.current.map) {
      zoomToBbox(bbox);
    }
  }, [bbox]);
  // const validateGeoJSON = function (map: IMap, source: string) {
  //   if (!editable) return;

  //   const errors: { [index: string | number]: ValidationError | undefined } = {};
  //   const features = map.querySourceFeatures(source);

  //   for (const feature of features) {
  //     if (typeof feature.id === "undefined" || feature.id === null || feature.properties?.meta !== "feature") return;

  //     try {
  //       user_shapePropertiesValidationSchema.validateSync(feature.properties);
  //       errors[feature.id!] = undefined;
  //       map.setFeatureState({ id: feature.id, source }, { error: false });
  //     } catch (error) {
  //       map.setFeatureState({ id: feature.id, source }, { error: true });
  //       errors[feature.id!] = error as ValidationError;
  //     }
  //   }

  //   onError(Object.values(errors).filter(error => !!error).length > 0, errors);
  // };

  // const onLoadMap = (map: IMap, draw?: MapboxDraw) => {
  //   map.on("draw.selectionchange", function (e) {
  //     const isSelected = e.features.length > 0;

  //     if (isSelected && draw?.getMode() === "simple_select") {
  //       draw.changeMode(draw.modes.DIRECT_SELECT, { featureId: e.features[0].id });
  //     }
  //   });

  //   map.on("draw.upload", function () {
  //     onGeojsonChange?.(draw?.getAll());
  //   });

  //   map.on("draw.clear", function () {
  //     onGeojsonChange?.(null);
  //   });

  //   map.on("draw.create", function () {
  //     onGeojsonChange?.(draw?.getAll());
  //   });

  //   map.on("draw.update", function () {
  //     onGeojsonChange?.(draw?.getAll());
  //   });

  //   if (captureAdditionalPolygonProperties) {
  //     map.on("data", function () {
  //       validateGeoJSON(map, MapboxDraw.constants.sources.COLD);
  //     });
  //   }
  // };

  return (
    <div id={mapId} className={twMerge("h-[500px] wide:h-[700px]")}>
      {/* <GeoJSONLayer geojson={geojson} /> */}
      <When condition={hasControls}>
        <ControlGroup position="top-right">
          {ref.current && ref.current.map && <StyleControl mapRef={ref} />}
        </ControlGroup>
        <ControlGroup position="top-right" className="top-21">
          {ref.current && ref.current.map && <ZoomControl mapRef={ref} />}
        </ControlGroup>
        <When condition={!!status}>
          <ControlGroup position="top-left">
            <SiteStatus />
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
            // onClick={() => zoomToBbox(bbox)}
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
