import React, { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

import MapService from "./MapService";

interface LegendItem {
  color: string;
  text: string;
  uuid: string;
}

interface MapProps {
  legend?: LegendItem[];
  centroids?: any;
  polygonsData?: any[];
  bbox?: any;
}

export const LAYERS_NAMES = {
  WORLD_COUNTRIES: "world_countries_generalized",
  POLYGON_GEOMETRY: "polygon_geometry"
};

export const layersList = [
  {
    name: LAYERS_NAMES.POLYGON_GEOMETRY,
    styles: [
      {
        type: "fill",
        layout: {},
        paint: {
          "fill-color": "rgba(200, 100, 240, 0.4)",
          "fill-outline-color": "rgba(200, 100, 240, 1)"
        },
        minzoom: 1
      },
      {
        type: "line",
        layout: {},
        paint: {
          "line-color": "rgba(200, 100, 240, 1)",
          "line-width": {
            base: 1.5,
            stops: [
              [0, 7],
              [5, 6],
              [8, 4],
              [10, 1]
            ]
          }
        },
        minzoom: 1
      }
    ],
    hover: true
  }
];

const MapSite: React.FC<MapProps> = props => {
  const { polygonsData, bbox } = props;
  const ref = useRef<typeof MapService | null>(null);

  useEffect(() => {
    ref.current = MapService;
    ref.current.initMap();

    const onLoad = () => {
      layersList.forEach((layer: any) => {
        if (ref.current) {
          ref.current.addSource(layer);
        }
      });
    };

    if (ref.current && ref.current.map) {
      ref.current.map.on("style.load", onLoad);
    }

    return () => {
      if (ref.current && ref.current.map) {
        ref.current.map.on("style.load", onLoad);
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
    if (bbox && ref.current && ref.current.map) {
      ref.current.map.fitBounds(bbox, {
        padding: 100,
        linear: false
      });
    }
  }, [bbox]);
  return (
    <>
      <div id="mapSite" className={twMerge("h-[500px] wide:h-[700px]")}></div>
    </>
  );
};

export default MapSite;
