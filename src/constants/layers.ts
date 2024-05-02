export const LAYERS_NAMES = {
  WORLD_COUNTRIES: "world_countries_generalized",
  POLYGON_GEOMETRY: "polygon_geometry"
};

export const layersList = [
  {
    name: LAYERS_NAMES.POLYGON_GEOMETRY,
    styles: [
      {
        metadata: { polygonStatus: "Submitted" },
        type: "fill",
        layout: {},
        paint: {
          "fill-color": "#2398d8",
          "fill-opacity": 0.7
        },
        filter: ["==", ["get", "uuid"], ""]
      },
      {
        metadata: { polygonStatus: "Submitted" },
        type: "line",
        layout: {},
        paint: {
          "line-color": "#2398d8",
          "line-width": 2
        },
        filter: ["==", ["get", "uuid"], ""]
      },
      {
        metadata: { polygonStatus: "Approved" },
        type: "fill",
        layout: {},
        paint: {
          "fill-color": "#72d961",
          "fill-opacity": 0.7
        },
        filter: ["==", ["get", "uuid"], ""]
      },
      {
        metadata: { polygonStatus: "Approved" },
        type: "line",
        layout: {},
        paint: {
          "line-color": "#72d961",
          "line-width": 2
        },
        filter: ["==", ["get", "uuid"], ""]
      },
      {
        metadata: { polygonStatus: "Needs More Info" },
        type: "fill",
        layout: {},
        paint: {
          "fill-color": "#ff8938",
          "fill-opacity": 0.7
        },
        filter: ["==", ["get", "uuid"], ""]
      },
      {
        metadata: { polygonStatus: "Needs More Info" },
        type: "line",
        layout: {},
        paint: {
          "line-color": "#ff8938",
          "line-width": 2
        },
        filter: ["==", ["get", "uuid"], ""]
      }
    ]
  }
];
