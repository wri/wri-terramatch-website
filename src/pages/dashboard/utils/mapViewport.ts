import {
  MAP_MAX_LATITUDE,
  MAP_MAX_LONGITUDE,
  MAP_MIN_LATITUDE,
  MAP_MIN_LONGITUDE
} from "@/pages/dashboard/constants/contentOverviewConstants";

export function clampLongitudeLatitude(longitude: number, latitude: number): [number, number] {
  const clampedLongitude = Math.max(MAP_MIN_LONGITUDE, Math.min(longitude, MAP_MAX_LONGITUDE));
  const clampedLatitude = Math.max(MAP_MIN_LATITUDE, Math.min(latitude, MAP_MAX_LATITUDE));
  return [clampedLongitude, clampedLatitude];
}
