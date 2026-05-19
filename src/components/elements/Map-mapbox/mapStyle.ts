import resolveConfig from "tailwindcss/resolveConfig";

// @ts-ignore
import tailwindConfig from "@/tailwind.config";

const { theme } = resolveConfig(tailwindConfig);
const colors = theme?.colors as any;

const editMapStyle = [
  {
    id: "gl-draw-polygon-fill",
    type: "fill",
    filter: ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
    paint: {
      "fill-color": ["case", ["==", ["feature-state", "error"], true], colors.error[500], colors.primary[500]],
      "fill-outline-color": ["case", ["==", ["feature-state", "error"], true], colors.error[500], colors.primary[500]],
      "fill-opacity": 0.1
    }
  },
  {
    id: "gl-draw-polygon-and-line-vertex-halo-active",
    type: "circle",
    filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
    paint: {
      "circle-radius": 10,
      "circle-color": colors.primary[500]
    }
  },
  {
    id: "gl-draw-polygon-and-line-vertex-active",
    type: "circle",
    filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
    paint: {
      "circle-radius": 3,
      "circle-color": colors.primary[500]
    }
  },
  // First closing edge uses line stroke, not this layer.
  {
    id: "gl-draw-polygon-stroke-active",
    type: "line",
    filter: ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
    layout: {
      "line-cap": "round",
      "line-join": "round"
    },
    paint: {
      "line-color": ["case", ["==", ["feature-state", "error"], true], colors.error[500], colors.primary[500]],
      "line-dasharray": [0.2, 2],
      "line-width": 2
    }
  },
  {
    id: "gl-draw-polygon-midpoint",
    type: "circle",
    filter: ["all", ["==", "$type", "Point"], ["==", "meta", "midpoint"]],
    paint: {
      "circle-radius": 10,
      "circle-color": colors.primary[500],
      "circle-opacity": 0.5
    }
  }
];

const staticMapStyles = [
  {
    id: "gl-draw-polygon-fill-static",
    type: "fill",
    filter: ["all", ["==", "$type", "Polygon"], ["==", "mode", "static"]],
    paint: {
      "fill-color": ["case", ["==", ["feature-state", "error"], true], colors.error[500], colors.primary[500]],
      "fill-outline-color": [
        "case",
        ["==", ["feature-state", "clicked"], true],
        colors.error[500],
        colors.primary[500]
      ],
      "fill-opacity": [
        "case",
        ["==", ["feature-state", "clicked"], true],
        0.75,
        ["==", ["feature-state", "hover"], true],
        0.5,
        0.25
      ]
    }
  },
  {
    id: "gl-draw-polygon-stroke-static",
    type: "line",
    filter: ["all", ["==", "$type", "Polygon"], ["==", "mode", "static"]],
    layout: {
      "line-cap": "round",
      "line-join": "round"
    },
    paint: {
      "line-color": ["case", ["==", ["feature-state", "error"], true], colors.error[500], colors.primary[500]],
      "line-width": [
        "case",
        ["==", ["feature-state", "clicked"], true],
        4,
        ["==", ["feature-state", "hover"], true],
        4,
        2
      ]
    }
  }
];

export default [...editMapStyle, ...staticMapStyles];
