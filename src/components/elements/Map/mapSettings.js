import L from "leaflet";

export const POLYGON_STYLES = {
  color: "#27A9E0",
  opacity: 1,
  fillColor: "#27A9E0",
  fillOpacity: 0.3,
  weight: 1
};

export const POLYGON_STYLES_ERROR = {
  color: "#ffffff",
  opacity: 1,
  fillColor: "#f15656",
  fillOpacity: 0.5,
  weight: 2
};

export const BLOB_CONFIG = {
  style: {
    width: "100%",
    height: "100%",
    position: "relative"
  }
};

// Leaflet Draw
export const DRAW_CONTROL = {
  position: "bottomright",
  draw: {
    polyline: false,
    marker: {
      // shapeOptions: { color: "red" },
      icon: new L.DivIcon({
        iconSize: new L.Point(12, 12),
        className: "leaflet-div-icon leaflet-editing-icon"
      })
    },
    polygon: {
      allowIntersection: false,
      drawError: {
        color: "#f15656",
        message: "You can't draw an area that intersects"
      },
      shapeOptions: POLYGON_STYLES,
      showArea: true,
      metric: true,
      icon: new L.DivIcon({
        iconSize: new L.Point(12, 12),
        className: "leaflet-div-icon leaflet-editing-icon"
      })
    },
    circle: {
      shapeOptions: POLYGON_STYLES,
      showArea: true,
      showRadius: true,
      metric: true,
      icon: new L.DivIcon({
        iconSize: new L.Point(12, 12),
        className: "leaflet-div-icon leaflet-editing-icon"
      })
    },
    rectangle: false,
    circleMarker: {
      icon: new L.DivIcon({
        iconSize: new L.Point(12, 12),
        className: "leaflet-div-icon leaflet-editing-icon"
      })
    }
  },
  edit: {
    featureGroup: {},
    remove: true,
    allowIntersection: false
  }
};

export const DRAW_CONTROL_DISABLED = {
  position: "bottomright",
  draw: {
    polyline: false,
    polygon: false,
    circle: false,
    rectangle: false,
    marker: false,
    circlemarker: false
  },
  edit: {
    featureGroup: {},
    remove: true,
    allowIntersection: false
  }
};

export const AREAS = {
  minSize: 9600 // square meters (same as a circle with a radius of 56m) - rounded to work with leaflet
};

const settings = { BLOB_CONFIG, POLYGON_STYLES, POLYGON_STYLES_ERROR, DRAW_CONTROL, DRAW_CONTROL_DISABLED, AREAS };

export default settings;
