import "mapbox-gl/dist/mapbox-gl.css";

//@ts-ignore
import MapboxDraw from "@mapbox/mapbox-gl-draw";
//@ts-ignore
import StaticMode from "@mapbox/mapbox-gl-draw-static-mode";
import mapboxgl, { Map as IMap } from "mapbox-gl";
//@ts-ignore
import { CircleMode, DirectMode, DragCircleMode, SimpleSelectMode } from "mapbox-gl-draw-circle";
import { DetailedHTMLProps, HTMLAttributes } from "react";
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
import MapProvider from "@/context/map.provider";
import { useDebounce } from "@/hooks/useDebounce";

import PolygonStatus from "./MapControls/PolygonStatus";

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
  ...props
}: MapProps) => {
  const onError = useDebounce((hasError, errors) => _onError?.(hasError, errors), 250);

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
      className={twMerge("h-[500px]", className)}
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
        <ControlGroup position={"top-left"}>
          <PolygonStatus></PolygonStatus>
        </ControlGroup>
        <When condition={!editable}>
          <ControlGroup position="bottom-left">
            <FilterControl />
          </ControlGroup>
          <ImagesLayer source="images" data={imageLayerGeojson} onDeleteImage={onDeleteImage} />
        </When>
      </When>
      <When condition={captureAdditionalPolygonProperties}>
        <ControlGroup position="bottom-right">
          <FeatureDetailCard editable={editable} additionalPolygonProperties={additionalPolygonProperties} />
        </ControlGroup>
      </When>
    </MapProvider>
  );
};

export default Map;
