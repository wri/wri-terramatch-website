import { Map as MapboxMap } from "mapbox-gl";
import { MutableRefObject, useEffect } from "react";

import { addProjectMarkerLayer, ProjectMarkerPoint, removeProjectMarkerLayer } from "../layers/projectMarkerLayer";

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
  useEffect(() => {
    const mapInstance = map.current;
    if (mapInstance == null || !styleReady || projectMarkers == null || onViewProjectPolygons == null) return;

    addProjectMarkerLayer(mapInstance, projectMarkers, onViewProjectPolygons);
    return () => removeProjectMarkerLayer(mapInstance);
  }, [map, onViewProjectPolygons, projectMarkers, styleReady, styleVersion]);
}
