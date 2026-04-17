import * as turfHelper from "@turf/helpers";
import type { Feature as GeoJsonFeature } from "geojson";

import { FeatureCollection } from "../GeoJSON";

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

export const convertToGeoJSON = (featureCollection: FeatureCollection) => {
  const { features } = featureCollection;
  return features.reduce((acc: GeoJsonFeature[], feature) => {
    const { geometry, properties } = feature;
    const coordinates = geometry.coordinates;
    const type = geometry.type;
    acc.push(turfHelper.feature({ type, coordinates }, properties));
    return acc;
  }, []);
};
