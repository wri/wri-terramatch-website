import { Map as MapboxMap } from "mapbox-gl";

import {
  POLYGON_APPROVED,
  POLYGON_DRAFT,
  POLYGON_INFORMATION_REQUIRED,
  POLYGON_PENDING_APPROVAL
} from "@/constants/polygonStatuses";
import { getThemedColor } from "@/lib/theme";

export type PolygonDrawStatus =
  | typeof POLYGON_DRAFT
  | typeof POLYGON_PENDING_APPROVAL
  | typeof POLYGON_APPROVED
  | typeof POLYGON_INFORMATION_REQUIRED;
type DrawStyle = Record<string, unknown>;

const STATUS_COLOR_MAP: Record<PolygonDrawStatus, string> = {
  [POLYGON_DRAFT]: getThemedColor("neutralActive", 3),
  [POLYGON_PENDING_APPROVAL]: getThemedColor("neutralActive", 1),
  [POLYGON_APPROVED]: getThemedColor("positive", 1),
  [POLYGON_INFORMATION_REQUIRED]: getThemedColor("attention", 1)
};

const DRAW_SOURCE_BUCKETS = ["cold", "hot"] as const;

const drawLayerIds = (baseLayerId: string): string[] => DRAW_SOURCE_BUCKETS.map(bucket => `${baseLayerId}.${bucket}`);

const DRAW_STATUS_PAINT_LAYERS: { baseLayerId: string; paintProperty: string }[] = [
  { baseLayerId: "gl-draw-polygon-fill-active", paintProperty: "fill-color" },
  { baseLayerId: "gl-draw-polygon-fill-active", paintProperty: "fill-outline-color" },
  { baseLayerId: "gl-draw-polygon-stroke-active", paintProperty: "line-color" },
  { baseLayerId: "gl-draw-line-active", paintProperty: "line-color" },
  { baseLayerId: "gl-draw-polygon-and-line-vertex-active", paintProperty: "circle-color" },
  { baseLayerId: "gl-draw-polygon-midpoint", paintProperty: "circle-color" },
  { baseLayerId: "gl-draw-polygon-fill-static", paintProperty: "fill-color" },
  { baseLayerId: "gl-draw-polygon-fill-static", paintProperty: "fill-outline-color" },
  { baseLayerId: "gl-draw-polygon-stroke-static", paintProperty: "line-color" }
];

export const getPolygonStatusColor = (status: string | null | undefined): string => {
  if (
    status === POLYGON_DRAFT ||
    status === POLYGON_PENDING_APPROVAL ||
    status === POLYGON_APPROVED ||
    status === POLYGON_INFORMATION_REQUIRED
  ) {
    return STATUS_COLOR_MAP[status];
  }
  return STATUS_COLOR_MAP[POLYGON_DRAFT];
};

export const isPolygonDrawStatus = (status: string | null | undefined): status is PolygonDrawStatus =>
  status === POLYGON_DRAFT ||
  status === POLYGON_PENDING_APPROVAL ||
  status === POLYGON_APPROVED ||
  status === POLYGON_INFORMATION_REQUIRED;

export const applyMapDrawStatusStyles = (
  map: MapboxMap | null | undefined,
  status: PolygonDrawStatus = POLYGON_DRAFT
): void => {
  if (map == null) return;

  const color = STATUS_COLOR_MAP[status];
  DRAW_STATUS_PAINT_LAYERS.forEach(({ baseLayerId, paintProperty }) => {
    drawLayerIds(baseLayerId).forEach(layerId => {
      if (map.getLayer(layerId) != null) {
        map.setPaintProperty(layerId, paintProperty as Parameters<MapboxMap["setPaintProperty"]>[1], color);
      }
    });
  });
};

export const createMapDrawStyles = (): DrawStyle[] => {
  const draftColor = STATUS_COLOR_MAP[POLYGON_DRAFT];

  return [
    {
      id: "gl-draw-polygon-fill-active",
      type: "fill",
      filter: ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
      paint: {
        "fill-color": draftColor,
        "fill-outline-color": draftColor,
        "fill-opacity": 0.28
      }
    },
    {
      id: "gl-draw-polygon-stroke-active",
      type: "line",
      filter: ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-color": draftColor,
        "line-width": 2,
        "line-dasharray": [0.2, 2]
      }
    },
    {
      id: "gl-draw-line-active",
      type: "line",
      filter: ["all", ["==", "$type", "LineString"], ["!=", "mode", "static"]],
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-color": draftColor,
        "line-width": 2,
        "line-dasharray": [0.2, 2]
      }
    },
    {
      id: "gl-draw-polygon-and-line-vertex-stroke-active",
      type: "circle",
      filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
      paint: { "circle-radius": 7, "circle-color": "#ffffff" }
    },
    {
      id: "gl-draw-polygon-and-line-vertex-active",
      type: "circle",
      filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
      paint: { "circle-radius": 5, "circle-color": draftColor }
    },
    {
      id: "gl-draw-polygon-midpoint",
      type: "circle",
      filter: ["all", ["==", "$type", "Point"], ["==", "meta", "midpoint"]],
      paint: { "circle-radius": 5, "circle-color": draftColor, "circle-opacity": 0.45 }
    },
    {
      id: "gl-draw-polygon-fill-static",
      type: "fill",
      filter: ["all", ["==", "mode", "static"], ["==", "$type", "Polygon"]],
      paint: {
        "fill-color": draftColor,
        "fill-outline-color": draftColor,
        "fill-opacity": 0.18
      }
    },
    {
      id: "gl-draw-polygon-stroke-static",
      type: "line",
      filter: ["all", ["==", "mode", "static"], ["==", "$type", "Polygon"]],
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": draftColor, "line-width": 2 }
    }
  ];
};
