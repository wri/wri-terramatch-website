import { Map as MapboxMap } from "mapbox-gl";
import { MutableRefObject, useEffect } from "react";

import { addProjectMarkerLayer, ProjectMarkerPoint, removeProjectMarkerLayer } from "../layers/projectMarkerLayer";

type UseMapProjectMarkersParams = {
  map: MutableRefObject<MapboxMap | null>;
  styleReady: boolean;
  styleVersion: number;
  projectMarkers?: ProjectMarkerPoint[];
};

export function useMapProjectMarkers({ map, styleReady, styleVersion, projectMarkers }: UseMapProjectMarkersParams) {
  useEffect(() => {
    const mapInstance = map.current;
    if (mapInstance == null || !styleReady || projectMarkers == null) return;

    addProjectMarkerLayer(mapInstance, projectMarkers);
    return () => removeProjectMarkerLayer(mapInstance);
  }, [map, projectMarkers, styleReady, styleVersion]);
}
