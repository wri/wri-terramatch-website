//@ts-ignore
import normalize from "@mapbox/geojson-normalize";

/**
 * Merge a series of GeoJSON objects into one FeatureCollection containing all
 * features in all files.  The objects can be any valid GeoJSON root object,
 * including FeatureCollection, Feature, and Geometry types.
 *
 * @param {Array<Object>} inputs a list of GeoJSON objects of any type
 * @return {Object} a geojson FeatureCollection.
 * @example
 * var geojsonMerge = require('@mapbox/geojson-merge');
 *
 * var mergedGeoJSON = geojsonMerge.merge([
 *   { type: 'Point', coordinates: [0, 1] },
 *   { type: 'Feature', geometry: { type: 'Point', coordinates: [0, 1] }, properties: {} }
 * ]);
 *
 * console.log(JSON.stringify(mergedGeoJSON));
 */
export const merge = (inputs: any) => {
  var output: any = {
    type: "FeatureCollection",
    features: []
  };
  for (var i = 0; i < inputs.length; i++) {
    var normalized: any = normalize(inputs[i]);
    for (var j = 0; j < normalized.features.length; j++) {
      output.features.push(normalized.features[j]);
    }
  }
  return output;
};
