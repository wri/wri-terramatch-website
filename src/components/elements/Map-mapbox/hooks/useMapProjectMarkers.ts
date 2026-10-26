import { Map as MapboxMap } from "mapbox-gl";
import { MutableRefObject, useEffect } from "react";

import { ProjectMarkerPoint, removeProjectMarkerLayer, upsertProjectMarkerLayer } from "../layers/projectMarkerLayer";

type UseMapProjectMarkersParams = {
  map: MutableRefObject<MapboxMap | null>;
  styleReady: boolean;
  styleVersion: number;
  projectMarkers?: ProjectMarkerPoint[];
  onViewProjectPolygons?: (projectUuid: string) => void;
};

export function useMapProjectMarkers({
  map,
  styleReady,
  styleVersion,
  projectMarkers,
  onViewProjectPolygons
}: UseMapProjectMarkersParams) {
  useEffect(
    () => () => {
      const mapInstance = map.current;
      if (mapInstance != null) removeProjectMarkerLayer(mapInstance);
    },
    [map]
  );

  useEffect(() => {
    const mapInstance = map.current;
    if (mapInstance == null || !styleReady) return;

    if (projectMarkers == null) {
      removeProjectMarkerLayer(mapInstance);
    } else {
      upsertProjectMarkerLayer(mapInstance, projectMarkers, onViewProjectPolygons);
    }
  }, [map, onViewProjectPolygons, projectMarkers, styleReady, styleVersion]);
}
