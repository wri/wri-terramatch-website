import { Canvg } from "canvg";
import { EventData, GeoJSONSourceRaw, Map, MapboxEvent, MapMouseEvent } from "mapbox-gl";
import { useEffect } from "react";

import ImageGalleryPreviewer from "@/components/elements/ImageGallery/ImageGalleryPreviewer";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useMapContext } from "@/context/map.provider";
import { useModalContext } from "@/context/modal.provider";
import { toDataURL } from "@/utils/image";

interface ImagesLayerProps extends Omit<GeoJSONSourceRaw, "cluster" | "type"> {
  source: string;
  onDeleteImage?: (uuid: string) => void;
}

export const ImagesLayer = ({ source, data, onDeleteImage }: ImagesLayerProps) => {
  const { map } = useMapContext();
  const { openModal } = useModalContext();

  useEffect(() => {
    if (!map) return;

    const onRenderListener = async () => {
      const allFeatures = map.queryRenderedFeatures();
      //@ts-ignore
      for (const feature of allFeatures.filter(f => !!f.properties.id && !!f.properties.thumb_url)) {
        const props: any = feature.properties;
        await loadImage(map, props.id, markerSVG(await toDataURL(props.thumb_url)));
      }
    };
    map.on("render", onRenderListener);

    const onClickListener = async (e: MapMouseEvent) => {
      const map = e.target;
      const features = map?.queryRenderedFeatures(e.point);
      const properties = features?.[0]?.properties;

      if (properties?.image_url) {
        openModal(
          ModalId.IMAGE_GALLERY_PREVIEWER,
          <ImageGalleryPreviewer
            data={{
              uuid: properties.uuid,
              fullImageUrl: properties?.image_url
            }}
            onDelete={onDeleteImage}
          />
        );
      }
    };
    map.on("click", onClickListener);

    return () => {
      map.off("render", onRenderListener);
      map.off("click", onClickListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  useEffect(() => {
    if (!map) return;
    const onLoadListener = (e: MapboxEvent & EventData) => {
      const map = e.target;

      // Add a new source from our GeoJSON data and
      // set the 'cluster' option to true. GL-JS will
      // add the point_count property to your source data.
      map.addSource(source, {
        type: "geojson",
        // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
        data,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source,
        filter: ["has", "point_count"],
        paint: {
          // Use step expressions (https://docs.mapbox.com/style-spec/reference/expressions/#step)
          // with three steps to implement three types of circles:
          //   * Blue, 20px circles when point count is less than 100
          //   * Yellow, 30px circles when point count is between 100 and 750
          //   * Pink, 40px circles when point count is greater than or equal to 750
          "circle-color": "#27A9E0",
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20, //output
            25, //threshold
            40, //output
            50, //threshold
            80 // output
          ]
        }
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source,
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 18
        },
        paint: {
          "text-color": "white"
        }
      });

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source,
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#11b4da",
          "circle-radius": 4,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff"
        }
      });
      // Add a layer to use the image to represent the data.
      map.addLayer({
        id: "image",
        type: "symbol",
        filter: ["!", ["has", "point_count"]],
        source, // reference the data source
        layout: {
          "icon-image": ["get", "id"], // reference the image
          "icon-size": 1
        }
      });
    };
    map.on("load", onLoadListener);

    return () => {
      map.off("load", onLoadListener);
    };
  }, [map, data, source]);

  return null;
};

const loadImage = async (map: Map, imageName: string, svgString: string) => {
  if (!!imageName && !!svgString && !map?.hasImage(imageName)) {
    const marker = new Image();
    const canvas = document.createElement("canvas");

    const v = await Canvg.fromString(canvas.getContext("2d")!, svgString);
    await v.render({ ignoreAnimation: true });

    canvas.toBlob(blob => {
      if (!blob) return;
      marker.src = URL.createObjectURL(blob);
      marker.onload = () => map?.addImage(imageName, marker);
    });
  }
};

const markerSVG = (imageUri: string) => `
  <svg width="85" height="92" viewBox="0 0 85 92" fill="none" xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink">
    <rect width="15.9435" height="15.9435" transform="matrix(0.709613 -0.704591 0.709613 0.704591 31.5 79.8594)"
        fill="white" />
    <rect x="2" y="1.59375" width="81" height="80.448" rx="13.5" fill="white" />
    <rect x="9.5" y="9.09375" width="66" height="66" rx="10" fill="url(#pattern0)" stroke="#27A9E0" stroke-width="4" />
    <rect x="2" y="1.59375" width="81" height="80.448" rx="13.5" stroke="white" stroke-width="3" />
    <defs>
      <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="80" height="80">
      <use xlink:href="#image_id" />
      </pattern>
        <image id="image_id" xlink:href="${imageUri}" />
    </defs>
  </svg>
`;
