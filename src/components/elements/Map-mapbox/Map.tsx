import "mapbox-gl/dist/mapbox-gl.css";

//@ts-ignore
import MapboxDraw from "@mapbox/mapbox-gl-draw";
//@ts-ignore
import StaticMode from "@mapbox/mapbox-gl-draw-static-mode";
import mapboxgl, { Map as IMap } from "mapbox-gl";
//@ts-ignore
import { CircleMode, DirectMode, DragCircleMode, SimpleSelectMode } from "mapbox-gl-draw-circle";
import { DetailedHTMLProps, HTMLAttributes, useState } from "react";
import { When } from "react-if";
import { twMerge } from "tailwind-merge";
import { ValidationError } from "yup";

import ControlGroup from "@/components/elements/Map-mapbox/components/ControlGroup";
import { EditControl } from "@/components/elements/Map-mapbox/MapControls/EditControl";
import { FeatureDetailCard } from "@/components/elements/Map-mapbox/MapControls/FeatureDetailCard";
import { FilterControl } from "@/components/elements/Map-mapbox/MapControls/FilterLayer";
import { StyleControl } from "@/components/elements/Map-mapbox/MapControls/StyleControl";
import { MapStyle } from "@/components/elements/Map-mapbox/MapControls/types";
import { ZoomControl } from "@/components/elements/Map-mapbox/MapControls/ZoomControl";
import { GeoJSONLayer } from "@/components/elements/Map-mapbox/MapLayers/GeoJsonLayer";
import { ImagesLayer } from "@/components/elements/Map-mapbox/MapLayers/ImagesLayer";
import {
  AdditionalPolygonProperties,
  user_shapePropertiesValidationSchema
} from "@/components/elements/Map-mapbox/MapLayers/ShapePropertiesModal";
import mapStyles from "@/components/elements/Map-mapbox/mapStyle";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import MapProvider from "@/context/map.provider";
import { useDebounce } from "@/hooks/useDebounce";

import Text from "../Text/Text";
import ImageControl from "./MapControls/ImageControl";
import PolygonCheck from "./MapControls/PolygonCheck";
import SiteStatus from "./MapControls/SiteStatus";
import ViewImageCarousel from "./MapControls/ViewImageCarousel";

mapboxgl.accessToken =
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ||
  "pk.eyJ1IjoiM3NpZGVkY3ViZSIsImEiOiJjam55amZrdjIwaWY3M3FueDAzZ3ZjeGR2In0.DhSsxs-8XhbTgoVmFcs94Q";

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
  const onError = useDebounce((hasError, errors) => _onError?.(hasError, errors), 250);
  const [viewImages, setViewImages] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(true);

  const validateGeoJSON = function (map: IMap, source: string) {
    if (!editable) return;

    const errors: { [index: string | number]: ValidationError | undefined } = {};
    const features = map.querySourceFeatures(source);

    for (const feature of features) {
      if (typeof feature.id === "undefined" || feature.id === null || feature.properties?.meta !== "feature") return;

      try {
        user_shapePropertiesValidationSchema.validateSync(feature.properties);
        errors[feature.id!] = undefined;
        map.setFeatureState({ id: feature.id, source }, { error: false });
      } catch (error) {
        map.setFeatureState({ id: feature.id, source }, { error: true });
        errors[feature.id!] = error as ValidationError;
      }
    }

    onError(Object.values(errors).filter(error => !!error).length > 0, errors);
  };

  const onLoadMap = (map: IMap, draw?: MapboxDraw) => {
    map.on("draw.selectionchange", function (e) {
      const isSelected = e.features.length > 0;

      if (isSelected && draw?.getMode() === "simple_select") {
        draw.changeMode(draw.modes.DIRECT_SELECT, { featureId: e.features[0].id });
      }
    });

    map.on("draw.upload", function () {
      onGeojsonChange?.(draw?.getAll());
    });

    map.on("draw.clear", function () {
      onGeojsonChange?.(null);
    });

    map.on("draw.create", function () {
      onGeojsonChange?.(draw?.getAll());
    });

    map.on("draw.update", function () {
      onGeojsonChange?.(draw?.getAll());
    });

    if (captureAdditionalPolygonProperties) {
      map.on("data", function () {
        validateGeoJSON(map, MapboxDraw.constants.sources.COLD);
      });
    }
  };

  return (
    <MapProvider
      {...props}
      initialState={{ geoJson: geojson }}
      mapOptions={{
        style: MapStyle.Satellite,
        zoom: 1
      }}
      drawOptions={{
        displayControlsDefault: false,
        userProperties: true,
        defaultMode: editable ? "simple_select" : "static",
        modes: {
          ...MapboxDraw.modes,
          static: StaticMode,
          draw_circle: CircleMode,
          drag_circle: DragCircleMode,
          direct_select: DirectMode,
          simple_select: SimpleSelectMode
        },
        styles: mapStyles
      }}
      onLoadMap={onLoadMap}
      className={twMerge("h-[500px] wide:h-[700px]", className)}
    >
      <GeoJSONLayer geojson={geojson} />
      <When condition={hasControls}>
        <ControlGroup position="top-right">
          <StyleControl />
        </ControlGroup>
        <ControlGroup position="top-right" className="top-21">
          <ZoomControl />
          <When condition={editable}>
            <EditControl />
          </When>
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
        {/* Toltip Map */}
        <When condition={!editPolygon && !!siteData && tooltipOpen}>
          <div className="absolute left-2/4 top-36 z-20 rounded border-t-4 border-t-primary bg-white p-3">
            <button
              onClick={() => {
                setTooltipOpen(false);
              }}
              className="absolute right-2 top-2 ml-2 rounded p-1 hover:bg-grey-800"
            >
              <Icon name={IconNames.CLEAR} className="h-3 w-3 text-grey-400" />
            </button>

            <div className="text-10 flex items-center justify-center gap-1">
              <Text variant="text-10">ISEME SITE </Text>
              <div className="text-10">&#8226;</div>
              <Text variant="text-10"> FAJA LOB PROJECT</Text>
            </div>
            <Text variant="text-10-bold" className="text-center">
              Elom
            </Text>
            <hr className="my-2 border border-grey-750" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text variant="text-10-light">Restoration Practice</Text>
                <Text variant="text-10-bold">Tree Planting</Text>
              </div>
              <div>
                <Text variant="text-10-light">Target Land Use System</Text>
                <Text variant="text-10-bold">Riparian Area</Text>
              </div>
              <div>
                <Text variant="text-10-light">Tree Distribution</Text>
                <Text variant="text-10-bold">Single Line</Text>
              </div>
              <div>
                <Text variant="text-10-light">Planting Start Date</Text>
                <Text variant="text-10-bold">March 26, 2024</Text>
              </div>
            </div>

            <hr className="my-2 border border-grey-750" />
          </div>
        </When>

        <When condition={!editable && !viewImages}>
          <ControlGroup position={siteData ? "bottom-left-site" : "bottom-left"}>
            <FilterControl />
          </ControlGroup>
          <ImagesLayer source="images" data={imageLayerGeojson} onDeleteImage={onDeleteImage} />
        </When>
        <ControlGroup position="top-right" className="top-48">
          <button type="button" className="rounded-lg bg-white p-2.5 text-darkCustom-100 hover:bg-neutral-200 ">
            <Icon name={IconNames.IC_EARTH_MAP} className="h-5 w-5 lg:h-6 lg:w-6" />
          </button>
        </ControlGroup>
        <ControlGroup position="bottom-right" className="bottom-8">
          <ViewImageCarousel viewImages={viewImages} setViewImages={setViewImages} />
        </ControlGroup>
      </When>
      <When condition={captureAdditionalPolygonProperties}>
        <ControlGroup position="bottom-right">
          <FeatureDetailCard editable={editable} additionalPolygonProperties={additionalPolygonProperties} />
        </ControlGroup>
      </When>
      <When condition={polygonChecks}>
        <ControlGroup position="bottom-left" className="bottom-13">
          <PolygonCheck />
        </ControlGroup>
      </When>
      <When condition={!!siteData}>
        <div className="absolute z-10 h-full w-[23vw] bg-[#ffffff26] backdrop-blur-md" />
      </When>
    </MapProvider>
  );
};

export default Map;
