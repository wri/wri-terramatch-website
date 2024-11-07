import mapboxgl from "mapbox-gl";

import type { LayerType } from "@/components/elements/Map-mapbox/Map.d";

import { DELETED_POLYGONS } from "./statuses";

export const LAYERS_NAMES = {
  WORLD_COUNTRIES: "world_countries_generalized",
  POLYGON_GEOMETRY: "polygon_geometry",
  MEDIA_IMAGES: "media_images",
  DELETED_GEOMETRIES: "deleted_geometries",
  CENTROIDS: "centroids"
};
export const layersList: LayerType[] = [
  {
    name: LAYERS_NAMES.POLYGON_GEOMETRY,
    geoserverLayerName: LAYERS_NAMES.POLYGON_GEOMETRY,
    styles: [
      {
        metadata: { polygonStatus: "draft" },
        type: "fill",
        layout: {},
        paint: {
          "fill-color": "#E468EF",
          "fill-opacity": 0.5
        },
        filter: ["==", ["get", "uuid"], ""]
      } as mapboxgl.Style & mapboxgl.FillLayer,
      {
        metadata: { polygonStatus: "draft" },
        type: "line",
        layout: {},
        paint: {
          "line-color": "#E468EF",
          "line-width": 2,
          "line-dasharray": [2, 4]
        },
        filter: ["==", ["get", "uuid"], ""]
      } as unknown as mapboxgl.Style & mapboxgl.LineLayer,
      {
        metadata: { polygonStatus: "submitted" },
        type: "fill",
        layout: {},
        paint: {
          "fill-color": "#2398D8",
          "fill-opacity": 0.5
        },
        filter: ["==", ["get", "uuid"], ""]
      } as mapboxgl.Style & mapboxgl.FillLayer,
      {
        metadata: { polygonStatus: "submitted" },
        type: "line",
        layout: {},
        paint: {
          "line-color": "#2398D8",
          "line-width": 2,
          "line-dasharray": [4, 2]
        },
        filter: ["==", ["get", "uuid"], ""]
      } as unknown as mapboxgl.Style & mapboxgl.LineLayer,
      {
        metadata: { polygonStatus: "approved" },
        type: "fill",
        layout: {},
        paint: {
          "fill-color": "#72D961",
          "fill-opacity": 0.5
        },
        filter: ["==", ["get", "uuid"], ""]
      } as mapboxgl.Style & mapboxgl.FillLayer,
      {
        metadata: { polygonStatus: "approved" },
        type: "line",
        layout: {},
        paint: {
          "line-color": "#72D961",
          "line-width": 2,
          "line-dasharray": [1, 3]
        },
        filter: ["==", ["get", "uuid"], ""]
      } as unknown as mapboxgl.Style & mapboxgl.LineLayer,
      {
        metadata: { polygonStatus: "needs-more-information" },
        type: "fill",
        layout: {},
        paint: {
          "fill-color": "#FF8938",
          "fill-opacity": 0.5
        },
        filter: ["==", ["get", "uuid"], ""]
      } as mapboxgl.Style & mapboxgl.FillLayer,
      {
        metadata: { polygonStatus: "needs-more-information" },
        type: "line",
        layout: {},
        paint: {
          "line-color": "#FF8938",
          "line-width": 2,
          "line-dasharray": [3, 1]
        },
        filter: ["==", ["get", "uuid"], ""]
      } as unknown as mapboxgl.Style & mapboxgl.LineLayer,
      {
        metadata: { polygonStatus: "form-polygons" },
        type: "fill",
        layout: {},
        paint: {
          "fill-color": "#3bb2d0",
          "fill-opacity": 0.1
        },
        filter: ["==", ["get", "uuid"], ""]
      } as mapboxgl.Style & mapboxgl.FillLayer,
      {
        metadata: { polygonStatus: "form-polygons" },
        type: "line",
        layout: {},
        paint: {
          "line-color": "#3bb2d0",
          "line-width": 2
        },
        filter: ["==", ["get", "uuid"], ""]
      } as mapboxgl.Style & mapboxgl.LineLayer
    ]
  },
  {
    name: LAYERS_NAMES.DELETED_GEOMETRIES,
    geoserverLayerName: LAYERS_NAMES.POLYGON_GEOMETRY,
    styles: [
      {
        metadata: { polygonStatus: DELETED_POLYGONS },
        type: "fill",
        layout: {},
        paint: {
          "fill-color": "#E42222",
          "fill-opacity": 0.5
        },
        filter: ["==", ["get", "uuid"], ""]
      } as mapboxgl.Style & mapboxgl.FillLayer,
      {
        metadata: { polygonStatus: DELETED_POLYGONS },
        type: "line",
        layout: {},
        paint: {
          "line-color": "#E42222",
          "line-width": 2
        },
        filter: ["==", ["get", "uuid"], ""]
      } as mapboxgl.Style & mapboxgl.LineLayer
    ]
  },
  {
    name: LAYERS_NAMES.WORLD_COUNTRIES,
    geoserverLayerName: LAYERS_NAMES.WORLD_COUNTRIES,
    styles: [
      {
        type: "line",
        paint: {
          "line-color": "#ff5a5f",
          "line-width": ["case", ["boolean", ["feature-state", "hover"], false], 2, 0]
        }
      } as unknown as mapboxgl.Style & mapboxgl.LineLayer,
      {
        type: "fill",
        paint: {
          "fill-color": "#ff5a5f",
          "fill-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.4, 0]
        }
      } as unknown as mapboxgl.FillLayer
    ],
    hover: true
  },
  {
    geoserverLayerName: LAYERS_NAMES.WORLD_COUNTRIES,
    name: `${LAYERS_NAMES.WORLD_COUNTRIES}-line`,
    styles: [
      {
        type: "line",
        layout: {},
        paint: {
          "line-color": "#ff5a5f",
          "line-width": 2
        }
      }
    ],
    hover: false
  },
  {
    name: LAYERS_NAMES.CENTROIDS,
    geoserverLayerName: "",
    styles: [
      {
        type: "circle",
        filter: ["==", ["get", "type"], "non-profit-organization"],
        paint: {
          "circle-color": "#795305",
          "circle-opacity": 0.2,
          "circle-radius": 8
        }
      } as mapboxgl.Style & mapboxgl.CircleLayer,
      {
        type: "circle",
        filter: ["==", ["get", "type"], "non-profit-organization"],
        paint: {
          "circle-color": "white",
          "circle-radius": 4.5,
          "circle-opacity": 1
        }
      } as mapboxgl.Style & mapboxgl.CircleLayer,
      {
        type: "circle",
        filter: ["==", ["get", "type"], "non-profit-organization"],
        paint: {
          "circle-color": "#795305",
          "circle-radius": 3,
          "circle-opacity": 1
        }
      } as mapboxgl.Style & mapboxgl.CircleLayer,
      {
        type: "circle",
        filter: ["==", ["get", "type"], "for-profit-organization"],
        paint: {
          "circle-color": "#0179FE",
          "circle-opacity": 0.2,
          "circle-radius": 8
        }
      } as mapboxgl.Style & mapboxgl.CircleLayer,
      {
        type: "circle",
        filter: ["==", ["get", "type"], "for-profit-organization"],
        paint: {
          "circle-color": "white",
          "circle-radius": 4.5,
          "circle-opacity": 1
        }
      } as mapboxgl.Style & mapboxgl.CircleLayer,
      {
        type: "circle",
        filter: ["==", ["get", "type"], "for-profit-organization"],
        paint: {
          "circle-color": "#0179FE",
          "circle-radius": 3,
          "circle-opacity": 1
        }
      } as mapboxgl.Style & mapboxgl.CircleLayer
    ],
    hover: true
  }
];
