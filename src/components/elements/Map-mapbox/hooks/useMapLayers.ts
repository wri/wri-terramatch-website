import MapboxDraw from "@mapbox/mapbox-gl-draw";
import _ from "lodash";
import { Map as MapboxMap } from "mapbox-gl";
import { MutableRefObject, useEffect, useRef, useState } from "react";

import { LAYERS_NAMES, layersList } from "@/constants/layers";
import { DELETED_POLYGONS } from "@/constants/statuses";

import { addDeleteLayer, addFilterOnLayer, addSourcesToLayers } from "../layers/polygonLayers";
import { DashboardGetProjectsData, PolygonCentroid } from "../Map.d";

type UseMapLayersParams = {
  map: MutableRefObject<MapboxMap | null>;
  draw: MutableRefObject<MapboxDraw | null>;
  styleReady: boolean;
  styleVersion: number;
  polygonsData?: Record<string, string[]>;
  centroids?: DashboardGetProjectsData[];
  polygonsCentroids?: PolygonCentroid[];
  dashboardMode?: string;
  projectUUID?: string;
  hasAccess?: boolean;
  selectedPolygonsInCheckbox?: string[];
  initialTileVersion?: string;
  initialPolygonFingerprint?: string;
};

export const hashString = (value: string): number => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

export const computePolygonFingerprint = (polygonsData?: Record<string, string[]>): string => {
  if (polygonsData == null) return "0:0:0";
  const statuses = Object.keys(polygonsData).sort();
  let combinedHash = 2166136261;
  let totalUuids = 0;

  for (const status of statuses) {
    const uuids = polygonsData[status] ?? [];
    let statusHash = hashString(status);
    let statusLength = 0;

    for (const uuid of uuids) {
      statusHash ^= hashString(uuid);
      statusLength += uuid.length;
      totalUuids++;
    }

    combinedHash ^= statusHash ^ statusLength ^ uuids.length;
    combinedHash = Math.imul(combinedHash, 16777619);
  }

  return `${combinedHash >>> 0}:${totalUuids}:${statuses.length}`;
};

export function useMapLayers({
  map,
  draw: _draw,
  styleReady,
  styleVersion,
  polygonsData,
  centroids,
  polygonsCentroids,
  dashboardMode,
  projectUUID,
  hasAccess,
  selectedPolygonsInCheckbox,
  initialTileVersion,
  initialPolygonFingerprint
}: UseMapLayersParams) {
  const [sourcesAdded, setSourcesAdded] = useState(false);

  const prevPolygonFingerprintRef = useRef<string>(initialPolygonFingerprint ?? "");
  const tileVersionRef = useRef<string>(initialTileVersion ?? "0");

  useEffect(() => {
    if (!styleReady || map.current == null || (!dashboardMode && _.isEmpty(polygonsData))) {
      setSourcesAdded(false);
      return;
    }

    const fingerprint = computePolygonFingerprint(polygonsData);
    if (fingerprint !== prevPolygonFingerprintRef.current) {
      prevPolygonFingerprintRef.current = fingerprint;
      tileVersionRef.current = String(Date.now());
    }

    const zoomFilter = dashboardMode ? 9 : undefined;
    const polygonsDataToUse = dashboardMode != null && projectUUID != null && hasAccess === false ? {} : polygonsData;

    addSourcesToLayers(
      map.current,
      polygonsDataToUse,
      centroids,
      zoomFilter,
      dashboardMode,
      polygonsCentroids,
      tileVersionRef.current
    );
    setSourcesAdded(true);
  }, [
    map,
    styleReady,
    styleVersion,
    polygonsData,
    polygonsCentroids,
    centroids,
    dashboardMode,
    projectUUID,
    hasAccess
  ]);

  useEffect(() => {
    if (!styleReady || selectedPolygonsInCheckbox == null || map.current == null) return;
    const deleteLayer = layersList.find(layer => layer.name === LAYERS_NAMES.DELETED_GEOMETRIES);
    if (deleteLayer == null) return;
    addDeleteLayer(deleteLayer, map.current, { [DELETED_POLYGONS]: selectedPolygonsInCheckbox });
  }, [map, selectedPolygonsInCheckbox, styleReady, styleVersion]);

  return { sourcesAdded };
}

export function filterPolygonFromLayers(
  polygonuuid: string,
  polygonsData: Record<string, string[]> | undefined,
  map: MapboxMap
) {
  if (polygonsData == null) return;

  const newPolygonData: Record<string, string[]> = JSON.parse(JSON.stringify(polygonsData));
  Object.keys(newPolygonData).forEach(status => {
    newPolygonData[status] = (newPolygonData[status] ?? []).filter(uuid => uuid !== polygonuuid);
  });

  const polygonLayer = layersList.find(layer => layer.name === LAYERS_NAMES.POLYGON_GEOMETRY);
  if (polygonLayer != null) addFilterOnLayer(polygonLayer, newPolygonData, map);
}
