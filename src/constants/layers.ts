import mapboxgl from "mapbox-gl";

import type { LayerType } from "@/components/elements/Map-mapbox/Map.d";

export const LAYERS_NAMES = {
  WORLD_COUNTRIES: "world_countries_generalized",
  POLYGON_GEOMETRY: "polygon_geometry",
  MEDIA_IMAGES: "media_images",
  DELETED_GEOMETRIES: "deleted_geometries"
};

export const layersList: LayerType[] = [
  {
    name: LAYERS_NAMES.POLYGON_GEOMETRY,
    layerName: LAYERS_NAMES.POLYGON_GEOMETRY,
    styles: [
      {
        metadata: { polygonStatus: "draft" },
        type: "fill",
        layout: {},
        paint: {
          "fill-color": "#E468EF",
          "fill-opacity": 0.7
        },
        filter: ["==", ["get", "uuid"], ""]
      } as mapboxgl.Style & mapboxgl.FillLayer,
      {
        metadata: { polygonStatus: "draft" },
        type: "line",
        layout: {},
        paint: {
          "line-color": "#E468EF",
          "line-width": 2
        },
        filter: ["==", ["get", "uuid"], ""]
      } as mapboxgl.Style & mapboxgl.LineLayer,
      {
        metadata: { polygonStatus: "submitted" },
        type: "fill",
        layout: {},
        paint: {
          "fill-color": "#2398d8",
          "fill-opacity": 0.7
        },
        filter: ["==", ["get", "uuid"], ""]
      } as mapboxgl.Style & mapboxgl.FillLayer,
      {
        metadata: { polygonStatus: "submitted" },
        type: "line",
        layout: {},
        paint: {
          "line-color": "#2398d8",
          "line-width": 2
        },
        filter: ["==", ["get", "uuid"], ""]
      } as mapboxgl.Style & mapboxgl.LineLayer,
      {
        metadata: { polygonStatus: "approved" },
        type: "fill",
        layout: {},
        paint: {
          "fill-color": "#72d961",
          "fill-opacity": 0.7
        },
        filter: ["==", ["get", "uuid"], ""]
      } as mapboxgl.Style & mapboxgl.FillLayer,
      {
        metadata: { polygonStatus: "approved" },
        type: "line",
        layout: {},
        paint: {
          "line-color": "#72d961",
          "line-width": 2
        },
        filter: ["==", ["get", "uuid"], ""]
      } as mapboxgl.Style & mapboxgl.LineLayer,
      {
        metadata: { polygonStatus: "needs-more-information" },
        type: "fill",
        layout: {},
        paint: {
          "fill-color": "#ff8938",
          "fill-opacity": 0.7
        },
        filter: ["==", ["get", "uuid"], ""]
      } as mapboxgl.Style & mapboxgl.FillLayer,
      {
        metadata: { polygonStatus: "needs-more-information" },
        type: "line",
        layout: {},
        paint: {
          "line-color": "#ff8938",
          "line-width": 2
        },
        filter: ["==", ["get", "uuid"], ""]
      } as mapboxgl.Style & mapboxgl.LineLayer,
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
    layerName: LAYERS_NAMES.POLYGON_GEOMETRY,
    styles: [
      {
        metadata: { polygonStatus: "delete-polygons" },
        type: "fill",
        layout: {},
        paint: {
          "fill-color": "#E42222",
          "fill-opacity": 0.05
        },
        filter: ["==", ["get", "uuid"], ""]
      } as mapboxgl.Style & mapboxgl.FillLayer,
      {
        metadata: { polygonStatus: "delete-polygons" },
        type: "line",
        layout: {},
        paint: {
          "line-color": "#E42222",
          "line-width": 2
        },
        filter: ["==", ["get", "uuid"], ""]
      } as mapboxgl.Style & mapboxgl.LineLayer
    ]
  }
];
