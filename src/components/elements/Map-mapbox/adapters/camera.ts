import { LngLat, Map as MapboxMap, Marker as MapboxMarker } from "mapbox-gl";

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

// Drops altitude values from a potentially 3D bbox to produce a 2D bounds
const to2DBounds = (bbox: BBox): [number, number, number, number] => {
  const [minLng, minLat, , , maxLng, maxLat] = bbox.length === 6 ? bbox : [bbox[0], bbox[1], 0, 0, bbox[2], bbox[3]];
  return [minLng, minLat, maxLng, maxLat];
};

export const zoomToBbox = (
  bbox: BBox,
  map: MapboxMap,
  hasControls: boolean,
  _currentStyle = MapStyle.Satellite
): void => {
  if (map == null || bbox == null) return;

  if (!isValidGeographicBBox(bbox)) {
    Log.warn("zoomToBbox: invalid geographic coordinates:", bbox);
    return;
  }

  try {
    map.fitBounds(to2DBounds(bbox), { padding: hasControls ? 100 : 30, linear: false, animate: true });
  } catch (error) {
    Log.warn("zoomToBbox: error fitting bounds:", error);
  }
};

export const zoomToCenter = (center: [number, number], zoom: number, map: MapboxMap): void => {
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
export const addMarkerAndZoom = (map: MapboxMap, location: { lng: number; lat: number }): void => {
  if (map == null) return;
  const { lng, lat } = location;
  const lngLat = new LngLat(lng, lat);
  createMarker(lngLat, map);
  map.setCenter([lng, lat]);
  map.setZoom(14);
};

export const addOrUpdateMarkerAndZoom = (
  map: MapboxMap,
  location: { lng: number; lat: number },
  marker: MapboxMarker | null
): MapboxMarker => {
  const { lng, lat } = location;
  const lngLat = new LngLat(lng, lat);
  const nextMarker = marker == null ? createMarker(lngLat, map) : marker.setLngLat(lngLat);
  map.setCenter([lng, lat]);
  map.setZoom(14);
  return nextMarker;
};

export const createMarker = (lngLat: LngLat, map: MapboxMap): MapboxMarker => {
  return new MapboxMarker({ color: "#ba5856" }).setLngLat(lngLat).addTo(map);
};
