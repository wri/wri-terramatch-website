import "mapbox-gl/dist/mapbox-gl.css";

//@ts-ignore
import MapboxDraw from "@mapbox/mapbox-gl-draw";
//@ts-ignore
import StaticMode from "@mapbox/mapbox-gl-draw-static-mode";
import { t } from "@transifex/native";
import classNames from "classnames";
import mapboxgl, { Map as IMap } from "mapbox-gl";
//@ts-ignore
import { CircleMode, DirectMode, DragCircleMode, SimpleSelectMode } from "mapbox-gl-draw-circle";
import { DetailedHTMLProps, HTMLAttributes, useState } from "react";
import { When } from "react-if";
import { Navigation } from "swiper";
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
import Carousel from "@/components/extensive/Carousel/Carousel";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { dataImageGallery } from "@/components/extensive/Modal/ModalContent/MockedData";
import ModalImageGallery from "@/components/extensive/Modal/ModalImageGallery";
import ModalWithLogo from "@/components/extensive/Modal/ModalWithLogo";
import MapProvider from "@/context/map.provider";
import { useModalContext } from "@/context/modal.provider";
import { useDebounce } from "@/hooks/useDebounce";
import { uploadImageData } from "@/pages/site/[uuid]/components/MockecData";

import Text from "../Text/Text";
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
  siteData?: boolean;
  status?: boolean;
  editPolygon?: boolean;
  polygonChecks?: boolean;
}

const polygonCheckData = [
  {
    id: "1",
    status: true,
    label: "GeoJSON Format"
  },
  {
    id: "2",
    status: true,
    label: "WGS84 Projection"
  },
  {
    id: "3",
    status: false,
    label: "Earth Location"
  },
  {
    id: "4",
    status: false,
    label: "Country"
  },
  {
    id: "5",
    status: true,
    label: "Reasonable Size Self-Intersecting Topology"
  },
  {
    id: "6",
    status: false,
    label: "Overlapping Polygons"
  },
  {
    id: "7",
    status: true,
    label: "Spike"
  },
  {
    id: "8",
    status: true,
    label: "Polygon Integrity"
  },
  {
    id: "9",
    status: true,
    label: "Feature Type"
  }
];

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
  const { openModal, closeModal } = useModalContext();

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

  const openFormModalHandlerUploadImages = () => {
    openModal(
      <ModalWithLogo
        title="Upload Images"
        onCLose={closeModal}
        content={
          <Text variant="text-12-light" className="mt-1 mb-4" containHtml>
            Start by adding images for processing.
          </Text>
        }
        primaryButtonText="Close"
        primaryButtonProps={{ className: "px-8 py-3", variant: "primary", onClick: closeModal }}
      >
        <div className="mb-8 flex flex-col items-center justify-center rounded-lg border border-grey-750 py-8 px-[215px]">
          <Icon name={IconNames.UPLOAD_CLOUD} className="mb-4 h-5 w-5" />
          <div className="flex flex-col">
            <Text variant="text-12-bold" className="text-center text-primary">
              Click to upload
            </Text>
            <Text variant="text-12-light" className="text-center">
              or
            </Text>
            <Text variant="text-12-light" className="max-w-[210px] text-center">
              Drag and drop.
            </Text>
          </div>
        </div>
        <div>
          <div className="mb-4 flex justify-between">
            <Text variant="text-12-bold">Uploaded Files</Text>
            <Text variant="text-12-bold" className="w-[146px] whitespace-nowrap pr-6 text-primary">
              Confirming Geolocation
            </Text>
          </div>
          <div className="mb-6 flex flex-col gap-4">
            {uploadImageData.map(image => (
              <div
                key={image.id}
                className="border-grey-75 flex items-center justify-between rounded-lg border border-grey-750 py-[10px] pr-6 pl-4"
              >
                <div className="flex gap-3">
                  <div className="rounded-lg bg-neutral-150 p-2">
                    <Icon name={IconNames.IMAGE} className="h-6 w-6 text-grey-720" />
                  </div>
                  <div>
                    <Text variant="text-12">{image.name}</Text>
                    <Text variant="text-12" className="opacity-50">
                      {image.status}
                    </Text>
                  </div>
                </div>
                <div
                  className={classNames("flex w-[146px] items-center justify-center rounded border py-2", {
                    "border-green-400": image.isVerified,
                    "border-red": !image.isVerified
                  })}
                >
                  <Text
                    variant="text-12-bold"
                    className={classNames({ "text-green-400": image.isVerified, "text-red": !image.isVerified })}
                  >
                    {image.isVerified ? "GeoTagged Verified" : "Not Verified"}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ModalWithLogo>
    );
  };

  const openFormModalHandlerImageGallery = () => {
    openModal(<ModalImageGallery onCLose={closeModal} tabItems={dataImageGallery} title={""} />);
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
            <PolygonStatus />
          </ControlGroup>
        </When>
        <When condition={!!viewImages}>
          <ControlGroup position={siteData ? "bottom-left-site" : "bottom-left"}>
            <div className="flex gap-4">
              <button
                className="text-12-bold h-fit rounded-lg bg-white px-5 py-2 shadow hover:bg-neutral-200"
                onClick={() => setViewImages(!viewImages)}
              >
                {t("Close Images")}
              </button>
              <button
                className="text-12-bold h-fit rounded-lg bg-white px-5 py-2 shadow hover:bg-neutral-200"
                onClick={openFormModalHandlerUploadImages}
              >
                {t("Add Images")}
              </button>
            </div>
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
        <When condition={!editPolygon && !!siteData}>
          <div className="absolute left-2/4 top-36 z-20 rounded border-t-4 border-t-primary bg-white p-3">
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
          <div className="relative">
            <div
              className={classNames("absolute right-1/2 bottom-0 h-[250px] w-[200px] rounded-lg bg-white p-2", {
                hidden: !viewImages
              })}
            >
              <div className="relative h-[calc(100%_-_48px)]">
                <Carousel
                  className="test mb-2 h-full"
                  swiperClassName="h-full"
                  swiperSlideClassName="h-full"
                  items={dataImageGallery[0].images}
                  carouselItem={item => <img className="h-full" alt="" src={item.src} />}
                  modules={[Navigation]}
                  slidesPerView={1}
                  spaceBetween={10}
                  hidePaginationBullet
                  smallSwiperButtons
                />
                <button
                  onClick={() => setViewImages(false)}
                  className="absolute right-1 top-1 z-10 rounded bg-grey-750 p-1 drop-shadow-md"
                >
                  <Icon name={IconNames.CLEAR} className="h-4 w-4 text-grey-400" />
                </button>
              </div>
              <button onClick={openFormModalHandlerImageGallery}>
                <Text variant="text-12-bold">TerraMatch Sample</Text>
                <Text variant="text-12-light"> December 29, 2023</Text>
              </button>
            </div>
            <button
              className="text-12-bold h-fit rounded-lg bg-white px-5 py-2 shadow hover:bg-neutral-200"
              onClick={() => setViewImages(!viewImages)}
            >
              {t("View Images")}
            </button>
          </div>
        </ControlGroup>
      </When>
      <When condition={captureAdditionalPolygonProperties}>
        <ControlGroup position="bottom-right">
          <FeatureDetailCard editable={editable} additionalPolygonProperties={additionalPolygonProperties} />
        </ControlGroup>
      </When>
      <When condition={polygonChecks}>
        <ControlGroup position="bottom-left" className="bottom-13">
          <div className="relative flex w-[231px] flex-col gap-2 rounded-xl p-3">
            <div className="absolute top-0 left-0 -z-10 h-full w-full rounded-xl bg-[#FFFFFF33] backdrop-blur-md" />
            <Text variant="text-10-bold" className="text-white">
              Polygon Checks
            </Text>
            {polygonCheckData.map(polygon => (
              <div key={polygon.id} className="flex items-center gap-2">
                <Icon
                  name={polygon.status ? IconNames.ROUND_GREEN_TICK : IconNames.ROUND_RED_CROSS}
                  className="h-4 w-4"
                />
                <Text variant="text-10-light" className="text-white">
                  {polygon.label}
                </Text>
              </div>
            ))}
          </div>
        </ControlGroup>
      </When>
      <When condition={!!siteData}>
        <div className="absolute z-10 h-full w-[23vw] bg-[#ffffff26] backdrop-blur-md" />
      </When>
    </MapProvider>
  );
};

export default Map;
