import {
  CircleLayerSpecification,
  FillLayerSpecification,
  LayerSpecification,
  LineLayerSpecification
} from "mapbox-gl";

import type { LayerType } from "@/components/elements/Map-mapbox/Map.d";
import { POLYGON_INFORMATION_REQUIRED, POLYGON_PENDING_APPROVAL } from "@/constants/polygonStatuses";

import { DELETED_POLYGONS } from "./statuses";

type LayerStyleFragment<T extends LayerSpecification> = Omit<T, "id" | "source" | "source-layer"> & {
  metadata?: unknown;
};

type FillStyle = LayerStyleFragment<FillLayerSpecification>;
type LineStyle = LayerStyleFragment<LineLayerSpecification>;
type CircleStyle = LayerStyleFragment<CircleLayerSpecification>;

const fillStyle = (style: FillStyle) => style;
const lineStyle = (style: LineStyle) => style;
const circleStyle = (style: CircleStyle) => style;

export const LAYERS_NAMES = {
  POLYGON_GEOMETRY: "polygon_geometry",
  MEDIA_IMAGES: "media_images",
  DELETED_GEOMETRIES: "deleted_geometries",
  CENTROIDS: "centroids",
  LANDSCAPES: "landscape_geom",
  POLYGON_CENTROIDS: "polygon_centroids"
};
export const layersList: LayerType[] = [
  {
    name: LAYERS_NAMES.POLYGON_GEOMETRY,
    geoserverLayerName: LAYERS_NAMES.POLYGON_GEOMETRY,
    styles: [
      fillStyle({
        metadata: { polygonStatus: "draft" },
        type: "fill",
        layout: {},
        paint: {
          "fill-color": "#E468EF",
          "fill-opacity": 0.5
        },
        filter: ["==", ["get", "uuid"], ""]
      }),
      lineStyle({
        metadata: { polygonStatus: "draft" },
        type: "line",
        layout: {},
        paint: {
          "line-color": "#E468EF",
          "line-width": 2,
          "line-dasharray": [2, 4]
        },
        filter: ["==", ["get", "uuid"], ""]
      }),
      fillStyle({
        metadata: { polygonStatus: POLYGON_PENDING_APPROVAL },
        type: "fill",
        layout: {},
        paint: {
          "fill-color": "#2398D8",
          "fill-opacity": 0.5
        },
        filter: ["==", ["get", "uuid"], ""]
      }),
      lineStyle({
        metadata: { polygonStatus: POLYGON_PENDING_APPROVAL },
        type: "line",
        layout: {},
        paint: {
          "line-color": "#2398D8",
          "line-width": 2,
          "line-dasharray": [4, 2]
        },
        filter: ["==", ["get", "uuid"], ""]
      }),
      fillStyle({
        metadata: { polygonStatus: "approved" },
        type: "fill",
        layout: {},
        paint: {
          "fill-color": "#72D961",
          "fill-opacity": 0.5
        },
        filter: ["==", ["get", "uuid"], ""]
      }),
      lineStyle({
        metadata: { polygonStatus: "approved" },
        type: "line",
        layout: {},
        paint: {
          "line-color": "#72D961",
          "line-width": 2,
          "line-dasharray": [1, 3]
        },
        filter: ["==", ["get", "uuid"], ""]
      }),
      fillStyle({
        metadata: { polygonStatus: POLYGON_INFORMATION_REQUIRED },
        type: "fill",
        layout: {},
        paint: {
          "fill-color": "#FF8938",
          "fill-opacity": 0.5
        },
        filter: ["==", ["get", "uuid"], ""]
      }),
      lineStyle({
        metadata: { polygonStatus: POLYGON_INFORMATION_REQUIRED },
        type: "line",
        layout: {},
        paint: {
          "line-color": "#FF8938",
          "line-width": 2,
          "line-dasharray": [3, 1]
        },
        filter: ["==", ["get", "uuid"], ""]
      }),
      fillStyle({
        metadata: { polygonStatus: "form-polygons" },
        type: "fill",
        layout: {},
        paint: {
          "fill-color": "#3bb2d0",
          "fill-opacity": 0.1
        },
        filter: ["==", ["get", "uuid"], ""]
      }),
      lineStyle({
        metadata: { polygonStatus: "form-polygons" },
        type: "line",
        layout: {},
        paint: {
          "line-color": "#3bb2d0",
          "line-width": 2
        },
        filter: ["==", ["get", "uuid"], ""]
      })
    ]
  },
  {
    name: LAYERS_NAMES.DELETED_GEOMETRIES,
    geoserverLayerName: LAYERS_NAMES.POLYGON_GEOMETRY,
    styles: [
      fillStyle({
        metadata: { polygonStatus: DELETED_POLYGONS },
        type: "fill",
        layout: {},
        paint: {
          "fill-color": "#E42222",
          "fill-opacity": 0.5
        },
        filter: ["==", ["get", "uuid"], ""]
      }),
      lineStyle({
        metadata: { polygonStatus: DELETED_POLYGONS },
        type: "line",
        layout: {},
        paint: {
          "line-color": "#E42222",
          "line-width": 2
        },
        filter: ["==", ["get", "uuid"], ""]
      })
    ]
  },
  {
    name: LAYERS_NAMES.CENTROIDS,
    geoserverLayerName: "",
    styles: [
      circleStyle({
        metadata: { type: "big-circle" },
        type: "circle",
        filter: ["==", ["get", "type"], "non-profit-organization"],
        paint: {
          "circle-color": "#795305",
          "circle-opacity": 0.2,
          "circle-radius": 9
        }
      }),
      circleStyle({
        type: "circle",
        filter: ["==", ["get", "type"], "non-profit-organization"],
        paint: {
          "circle-color": "white",
          "circle-radius": 4.5,
          "circle-opacity": 1
        }
      }),
      circleStyle({
        type: "circle",
        filter: ["==", ["get", "type"], "non-profit-organization"],
        paint: {
          "circle-color": "#795305",
          "circle-radius": 3,
          "circle-opacity": 1
        }
      }),
      circleStyle({
        metadata: { type: "big-circle" },
        type: "circle",
        filter: ["==", ["get", "type"], "for-profit-organization"],
        paint: {
          "circle-color": "#0179FE",
          "circle-opacity": 0.2,
          "circle-radius": 8
        }
      }),
      circleStyle({
        type: "circle",
        filter: ["==", ["get", "type"], "for-profit-organization"],
        paint: {
          "circle-color": "white",
          "circle-radius": 4.5,
          "circle-opacity": 1
        }
      }),
      circleStyle({
        type: "circle",
        filter: ["==", ["get", "type"], "for-profit-organization"],
        paint: {
          "circle-color": "#0179FE",
          "circle-radius": 3,
          "circle-opacity": 1
        }
      })
    ],
    hover: true
  },
  {
    geoserverLayerName: LAYERS_NAMES.LANDSCAPES,
    name: `${LAYERS_NAMES.LANDSCAPES}`,
    styles: [
      {
        type: "line",
        layout: {},
        paint: {
          "line-color": "#fC5a5f",
          "line-width": 2
        }
      }
    ],
    hover: false
  }
];
