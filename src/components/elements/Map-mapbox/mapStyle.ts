import { Map as MapboxMap } from "mapbox-gl";

import { APPROVED, DRAFT, NEEDS_MORE_INFORMATION, SUBMITTED } from "@/constants/statuses";
import { getThemedColor } from "@/lib/theme";

export type PolygonDrawStatus = typeof DRAFT | typeof SUBMITTED | typeof APPROVED | typeof NEEDS_MORE_INFORMATION;
type DrawStyle = Record<string, unknown>;

const STATUS_COLOR_MAP: Record<PolygonDrawStatus, string> = {
  [DRAFT]: getThemedColor("neutralActive", 3),
  [SUBMITTED]: getThemedColor("neutralActive", 1),
  [APPROVED]: getThemedColor("positive", 1),
  [NEEDS_MORE_INFORMATION]: getThemedColor("attention", 1)
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
  if (status === DRAFT || status === SUBMITTED || status === APPROVED || status === NEEDS_MORE_INFORMATION) {
    return STATUS_COLOR_MAP[status];
  }
  return STATUS_COLOR_MAP[DRAFT];
};

export const isPolygonDrawStatus = (status: string | null | undefined): status is PolygonDrawStatus =>
  status === DRAFT || status === SUBMITTED || status === APPROVED || status === NEEDS_MORE_INFORMATION;

export const applyMapDrawStatusStyles = (
  map: MapboxMap | null | undefined,
  status: PolygonDrawStatus = DRAFT
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
  const draftColor = STATUS_COLOR_MAP[DRAFT];

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
