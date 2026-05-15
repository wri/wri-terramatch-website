import { APPROVED, DRAFT, NEEDS_MORE_INFORMATION, SUBMITTED } from "@/constants/statuses";
import { getThemedColor } from "@/lib/theme";

export type PolygonDrawStatus = typeof DRAFT | typeof SUBMITTED | typeof APPROVED | typeof NEEDS_MORE_INFORMATION;
type DrawStyle = Record<string, unknown>;
type DrawExpression = unknown[];

const STATUS_COLOR_MAP: Record<PolygonDrawStatus, string> = {
  [DRAFT]: getThemedColor("neutralActive", 3),
  [SUBMITTED]: getThemedColor("neutralActive", 1),
  [APPROVED]: getThemedColor("positive", 1),
  [NEEDS_MORE_INFORMATION]: getThemedColor("attention", 1)
};

const statusColorExpression = (defaultStatus: PolygonDrawStatus): DrawExpression => [
  "match",
  ["coalesce", ["get", "user_polygonStatus"], defaultStatus],
  DRAFT,
  STATUS_COLOR_MAP[DRAFT],
  SUBMITTED,
  STATUS_COLOR_MAP[SUBMITTED],
  APPROVED,
  STATUS_COLOR_MAP[APPROVED],
  NEEDS_MORE_INFORMATION,
  STATUS_COLOR_MAP[NEEDS_MORE_INFORMATION],
  STATUS_COLOR_MAP[defaultStatus]
];

export const getPolygonStatusColor = (status: string | null | undefined): string => {
  if (status === DRAFT || status === SUBMITTED || status === APPROVED || status === NEEDS_MORE_INFORMATION) {
    return STATUS_COLOR_MAP[status];
  }
  return STATUS_COLOR_MAP[DRAFT];
};

export const createMapDrawStyles = (defaultStatus: PolygonDrawStatus = DRAFT): DrawStyle[] => {
  const colorExpr = statusColorExpression(defaultStatus);

  return [
    {
      id: "gl-draw-polygon-fill-active",
      type: "fill",
      filter: ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
      paint: {
        "fill-color": colorExpr,
        "fill-outline-color": colorExpr,
        "fill-opacity": 0.28
      }
    },
    {
      id: "gl-draw-polygon-stroke-active",
      type: "line",
      filter: ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
      layout: {
        "line-cap": "round",
        "line-join": "round"
      },
      paint: {
        "line-color": colorExpr,
        "line-width": 2,
        "line-dasharray": [0.2, 2]
      }
    },
    {
      id: "gl-draw-line-active",
      type: "line",
      filter: ["all", ["==", "$type", "LineString"], ["!=", "mode", "static"]],
      layout: {
        "line-cap": "round",
        "line-join": "round"
      },
      paint: {
        "line-color": colorExpr,
        "line-width": 2,
        "line-dasharray": [0.2, 2]
      }
    },
    {
      id: "gl-draw-polygon-and-line-vertex-stroke-active",
      type: "circle",
      filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
      paint: {
        "circle-radius": 7,
        "circle-color": "#ffffff"
      }
    },
    {
      id: "gl-draw-polygon-and-line-vertex-active",
      type: "circle",
      filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
      paint: {
        "circle-radius": 5,
        "circle-color": colorExpr
      }
    },
    {
      id: "gl-draw-polygon-midpoint",
      type: "circle",
      filter: ["all", ["==", "$type", "Point"], ["==", "meta", "midpoint"]],
      paint: {
        "circle-radius": 5,
        "circle-color": colorExpr,
        "circle-opacity": 0.45
      }
    },
    {
      id: "gl-draw-polygon-fill-static",
      type: "fill",
      filter: ["all", ["==", "mode", "static"], ["==", "$type", "Polygon"]],
      paint: {
        "fill-color": colorExpr,
        "fill-outline-color": colorExpr,
        "fill-opacity": 0.18
      }
    },
    {
      id: "gl-draw-polygon-stroke-static",
      type: "line",
      filter: ["all", ["==", "mode", "static"], ["==", "$type", "Polygon"]],
      layout: {
        "line-cap": "round",
        "line-join": "round"
      },
      paint: {
        "line-color": colorExpr,
        "line-width": 2
      }
    }
  ];
};
