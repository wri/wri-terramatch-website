import MapboxDraw from "@mapbox/mapbox-gl-draw";
import _ from "lodash";
import mapboxgl from "mapbox-gl";
import { MutableRefObject, useEffect, useRef, useState } from "react";

import { LAYERS_NAMES, layersList } from "@/constants/layers";
import { DELETED_POLYGONS } from "@/constants/statuses";

import { addDeleteLayer, addFilterOnLayer, addSourcesToLayers } from "../layers/polygonLayers";
import { DashboardGetProjectsData } from "../Map.d";

type UseMapLayersParams = {
  map: MutableRefObject<mapboxgl.Map | null>;
  draw: MutableRefObject<MapboxDraw | null>;
  styleReady: boolean;
  styleVersion: number;
  polygonsData?: Record<string, string[]>;
  centroids?: DashboardGetProjectsData[];
  polygonsCentroids?: any[];
  isDashboard?: string;
  projectUUID?: string;
  hasAccess?: boolean;
  selectedPolygonsInCheckbox?: string[];
};

export function useMapLayers({
  map,
  draw: _draw,
  styleReady,
  styleVersion,
  polygonsData,
  centroids,
  polygonsCentroids,
  isDashboard,
  projectUUID,
  hasAccess,
  selectedPolygonsInCheckbox
}: UseMapLayersParams) {
  const [sourcesAdded, setSourcesAdded] = useState(false);

  const prevPolygonFingerprintRef = useRef<string>("");
  const tileVersionRef = useRef<string>("0");

  useEffect(() => {
    if (!styleReady || map.current == null || (!isDashboard && _.isEmpty(polygonsData))) {
      setSourcesAdded(false);
      return;
    }

    const fingerprint = Object.values(polygonsData ?? {})
      .flat()
      .sort()
      .join(",");
    if (fingerprint !== prevPolygonFingerprintRef.current) {
      prevPolygonFingerprintRef.current = fingerprint;
      tileVersionRef.current = String(Date.now());
    }

    const zoomFilter = isDashboard ? 9 : undefined;
    const polygonsDataToUse = isDashboard != null && projectUUID != null && hasAccess === false ? {} : polygonsData;

    addSourcesToLayers(
      map.current,
      polygonsDataToUse,
      centroids,
      zoomFilter,
      isDashboard,
      polygonsCentroids,
      tileVersionRef.current
    );
    setSourcesAdded(true);
  }, [map, styleReady, styleVersion, polygonsData, polygonsCentroids, centroids, isDashboard, projectUUID, hasAccess]);

  useEffect(() => {
    if (!styleReady || selectedPolygonsInCheckbox == null || map.current == null) return;
    addDeleteLayer(
      layersList.find(layer => layer.name === LAYERS_NAMES.DELETED_GEOMETRIES),
      map.current,
      { [DELETED_POLYGONS]: selectedPolygonsInCheckbox }
    );
  }, [map, selectedPolygonsInCheckbox, styleReady, styleVersion]);

  return { sourcesAdded };
}

export function filterPolygonFromLayers(
  polygonuuid: string,
  polygonsData: Record<string, string[]> | undefined,
  map: mapboxgl.Map
) {
  if (polygonsData == null) return;
  const newPolygonData: Record<string, string[]> = JSON.parse(JSON.stringify(polygonsData));
  const statuses = ["submitted", "approved", "need-more-info", "draft", "form-polygons"];
  statuses.forEach(status => {
    if (newPolygonData[status] != null) {
      newPolygonData[status] = newPolygonData[status].filter((feature: string) => feature !== polygonuuid);
    }
  });
  addFilterOnLayer(
    layersList.find(layer => layer.name === LAYERS_NAMES.POLYGON_GEOMETRY),
    newPolygonData,
    map
  );
}
