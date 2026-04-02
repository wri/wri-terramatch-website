import mapboxgl, { LngLat } from "mapbox-gl";

import Log from "@/utils/log";

import { BBox } from "../GeoJSON";
import { MapStyle } from "../MapControls/types";

const isValidGeographicBBox = (bbox: BBox): boolean => {
  const [minLng, minLat, maxLng, maxLat] = bbox;
  const isValidLng = minLng >= -180 && minLng <= 180 && maxLng >= -180 && maxLng <= 180;
  const isValidLat = minLat >= -90 && minLat <= 90 && maxLat >= -90 && maxLat <= 90;
  const isOrdered = minLng < maxLng && minLat < maxLat;
  return isValidLng && isValidLat && isOrdered;
};

/** Animates the map to fit the given bounding box (contract CZ-1). */
export const zoomToBbox = (
  bbox: BBox,
  map: mapboxgl.Map,
  hasControls: boolean,
  _currentStyle = MapStyle.Satellite
): void => {
  if (map == null || bbox == null) return;

  if (!isValidGeographicBBox(bbox)) {
    Log.warn("zoomToBbox: invalid geographic coordinates:", bbox);
    return;
  }

  try {
    map.fitBounds(bbox, { padding: hasControls ? 100 : 30, linear: false, animate: true });
  } catch (error) {
    Log.warn("zoomToBbox: error fitting bounds:", error);
  }
};

/** Moves the camera to an exact center+zoom position (contract CZ-2). */
export const zoomToCenter = (center: [number, number], zoom: number, map: mapboxgl.Map): void => {
  if (map == null || center == null || zoom === undefined) return;

  const [lng, lat] = center;
  if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
    Log.warn("zoomToCenter: invalid coordinates:", center);
    return;
  }
  if (zoom < 0 || zoom > 22) {
    Log.warn("zoomToCenter: invalid zoom level:", zoom);
    return;
  }

  try {
    map.setCenter([lng, lat]);
    map.setZoom(zoom);
  } catch (error) {
    Log.warn("zoomToCenter: error:", error);
  }
};

/** Places a red marker and zooms to a lat/lng location (contract CZ-4). */
export const addMarkerAndZoom = (map: mapboxgl.Map, location: { lng: number; lat: number }): void => {
  if (map == null) return;
  const { lng, lat } = location;
  const lngLat = new mapboxgl.LngLat(lng, lat);
  createMarker(lngLat, map);
  map.setCenter([lng, lat]);
  map.setZoom(14);
};

export const createMarker = (lngLat: LngLat, map: mapboxgl.Map): mapboxgl.Marker => {
  return new mapboxgl.Marker({ color: "#ba5856" }).setLngLat(lngLat).addTo(map);
};
