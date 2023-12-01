import tailwindConfig from "tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";

const { theme } = resolveConfig(tailwindConfig);
const colors = theme?.colors as any;

const editMapStyle = [
  // polygon fill
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
  // vertex point halos
  {
    id: "gl-draw-polygon-and-line-vertex-halo-active",
    type: "circle",
    filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
    paint: {
      "circle-radius": 10,
      "circle-color": colors.primary[500]
    }
  },
  // vertex points
  {
    id: "gl-draw-polygon-and-line-vertex-active",
    type: "circle",
    filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
    paint: {
      "circle-radius": 3,
      "circle-color": colors.primary[500]
    }
  },
  // polygon outline stroke
  // This doesn't style the first edge of the polygon, which uses the line stroke styling instead
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
  // polygon mid points
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
  // polygon fill
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
        0.75, // on click fill-opacity
        ["==", ["feature-state", "hover"], true],
        0.5, // on hover fill-opacity
        0.25 // default fill-opacity
      ]
    }
  },
  // polygon outline
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
        4, // on click line-width
        ["==", ["feature-state", "hover"], true],
        4, // on hover line-width
        2 // default line-width
      ]
    }
  }
];

export default [...editMapStyle, ...staticMapStyles];
