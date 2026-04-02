import * as turfHelper from "@turf/helpers";

import { FeatureCollection } from "../GeoJSON";

/**
 * Converts any raw GeoJSON shape (Geometry, GeometryCollection, or FeatureCollection)
 * into a FeatureCollection so it can be passed to Mapbox Draw or addSource.
 */
export const convertToAcceptedGEOJSON = (geojson: any): any => {
  if (geojson.type !== "FeatureCollection" && geojson.type !== "GeometryCollection") {
    return {
      type: "FeatureCollection",
      features: [{ type: "Feature", properties: {}, geometry: geojson }]
    };
  }
  if (geojson.type === "GeometryCollection") {
    return {
      type: "FeatureCollection",
      features: geojson.geometries.map((geometry: any) => ({ type: "Feature", properties: {}, geometry }))
    };
  }
  return geojson;
};

/**
 * Unpacks a FeatureCollection into an array of Turf Feature objects.
 * Used by the draw save flow to extract individual feature geometries.
 */
export const convertToGeoJSON = (featureCollection: FeatureCollection) => {
  const { features } = featureCollection;
  return features.reduce((acc: turfHelper.Feature[], feature) => {
    const { geometry, properties } = feature;
    const coordinates = geometry.coordinates;
    const type = geometry.type;
    acc.push(turfHelper.feature({ type, coordinates }, properties));
    return acc;
  }, []);
};
