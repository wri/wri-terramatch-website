import type { Map as MapboxMap } from "mapbox-gl";

export const isStyleAlive = (map: MapboxMap): boolean => {
  try {
    return map.getStyle() != null;
  } catch {
    return false;
  }
};
