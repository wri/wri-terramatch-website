import { Canvg } from "canvg";
import { GeoJSONSourceSpecification, Map as MapboxMap, MapMouseEvent } from "mapbox-gl";
import { useEffect } from "react";

import ImageGalleryPreviewer from "@/components/elements/ImageGallery/ImageGalleryPreviewer";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useMapContext } from "@/context/map.provider";
import { useModalContext } from "@/context/modal.provider";
import { toDataURL } from "@/utils/image";

interface ImagesLayerProps extends Omit<GeoJSONSourceSpecification, "cluster" | "type"> {
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
      const properties: { image_url?: string; uuid?: string } = features?.[0]?.properties ?? {};
      const { image_url: fullImageUrl, uuid } = properties;

      if (fullImageUrl != null && uuid != null) {
        openModal(
          ModalId.IMAGE_GALLERY_PREVIEWER,
          <ImageGalleryPreviewer data={{ uuid, fullImageUrl }} onDelete={onDeleteImage} />
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
    const onLoadListener = () => {
      const currentMap = map;

      currentMap.addSource(source, {
        type: "geojson",
        data,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      });

      currentMap.addLayer({
        id: "clusters",
        type: "circle",
        source,
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#27A9E0",
          "circle-radius": ["step", ["get", "point_count"], 20, 25, 40, 50, 80]
        }
      });

      currentMap.addLayer({
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

      currentMap.addLayer({
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
      currentMap.addLayer({
        id: "image",
        type: "symbol",
        filter: ["!", ["has", "point_count"]],
        source,
        layout: {
          "icon-image": ["get", "id"],
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

const loadImage = async (map: MapboxMap, imageName: string, svgString: string) => {
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
