import MapboxDraw from "@mapbox/mapbox-gl-draw";
import type { DataDrivenPropertyValueSpecification, MapMouseEvent } from "mapbox-gl";
import { Map as MapboxMap } from "mapbox-gl";
import { MutableRefObject, useEffect, useRef } from "react";

import {
  getPolygonGeometryFillLayerConfigs,
  getPolygonGeometryLineLayerConfigs,
  pickPolygonGeometryIdFromProperties
} from "@/components/elements/Map-mapbox/layers/polygonLayers";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import Log from "@/utils/log";

import { BBox } from "../GeoJSON";
import { fetchMultiplePolygonsGeoJson } from "../utils";

const POLYGON_FILL_LAYER_IDS = getPolygonGeometryFillLayerConfigs().map(c => c.layerId);
const EMPTY_SELECTION: string[] = [];

const HOVER_FILL_OPACITY = 0.6;
const SELECTED_FILL_OPACITY = 1;
const HIGHLIGHT_LINE_WIDTH = 2;

const TILE_POLYGON_ID_EXPR: unknown[] = ["coalesce", ["get", "uuid"], ["get", "polygonUuid"]];

const TRANSIENT_MAPBOX_ERROR_PATTERNS = [
  "style is not done loading",
  "style not done loading",
  "style is not loaded",
  "style not loaded",
  "does not exist in the map's style",
  "source",
  "layer",
  "Cannot read properties of undefined"
] as const;

function isTransientMapboxError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? "");
  const lower = message.toLowerCase();
  return TRANSIENT_MAPBOX_ERROR_PATTERNS.some(pattern => lower.includes(pattern.toLowerCase()));
}

function buildFillOpacityExpression(
  baseOpacity: number,
  hoveredUuid: string | null | undefined,
  selectedUuids: string[]
): number | DataDrivenPropertyValueSpecification<number> {
  const hasSelected = selectedUuids.length > 0;
  const hasHover = hoveredUuid != null && hoveredUuid !== "";
  if (!hasSelected && !hasHover) {
    return baseOpacity;
  }
  const expr: unknown[] = ["case"];
  if (hasSelected) {
    expr.push(["in", TILE_POLYGON_ID_EXPR, ["literal", selectedUuids]], SELECTED_FILL_OPACITY);
  }
  if (hasHover) {
    expr.push(["==", TILE_POLYGON_ID_EXPR, hoveredUuid], HOVER_FILL_OPACITY);
  }
  expr.push(baseOpacity);
  return expr as DataDrivenPropertyValueSpecification<number>;
}

function buildLineWidthExpression(
  baseLineWidth: number,
  hoveredUuid: string | null | undefined,
  selectedUuids: string[]
): number | DataDrivenPropertyValueSpecification<number> {
  const hasSelected = selectedUuids.length > 0;
  const hasHover = hoveredUuid != null && hoveredUuid !== "";
  if (!hasSelected && !hasHover) {
    return baseLineWidth;
  }
  const expr: unknown[] = ["case"];
  if (hasSelected) {
    expr.push(["in", TILE_POLYGON_ID_EXPR, ["literal", selectedUuids]], HIGHLIGHT_LINE_WIDTH);
  }
  if (hasHover) {
    expr.push(["==", TILE_POLYGON_ID_EXPR, hoveredUuid], HIGHLIGHT_LINE_WIDTH);
  }
  expr.push(baseLineWidth);
  return expr as DataDrivenPropertyValueSpecification<number>;
}

type PolygonTableHighlight = {
  hoveredPolygonUuid: string | null;
  selectedPolygonUuids: string[];
  onHoveredPolygonFromMap?: (uuid: string | null) => void;
  onPolygonClickedFromMap?: (uuid: string) => void;
};

type UsePolygonTableHighlightStyleParams = {
  map: MutableRefObject<MapboxMap | null>;
  styleReady: boolean;
  styleVersion: number;
  sourcesAdded: boolean;
  highlight: PolygonTableHighlight | undefined;
};

export function usePolygonTableHighlightStyle({
  map,
  styleReady,
  styleVersion,
  sourcesAdded,
  highlight
}: UsePolygonTableHighlightStyleParams): void {
  const lastAppliedRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    if (!styleReady || !sourcesAdded || map.current == null) return;

    const m = map.current;
    const fillConfigs = getPolygonGeometryFillLayerConfigs();
    const lineConfigs = getPolygonGeometryLineLayerConfigs();
    const hoveredUuid = highlight?.hoveredPolygonUuid ?? null;
    const selectedUuids = highlight?.selectedPolygonUuids ?? EMPTY_SELECTION;
    const fingerprint = `${hoveredUuid ?? ""}|${selectedUuids.join(",")}`;

    for (const { layerId, baseFillOpacity } of fillConfigs) {
      if (m.getLayer(layerId) == null) continue;
      const key = `${layerId}:fill-opacity@${baseFillOpacity}`;
      if (lastAppliedRef.current.get(key) === fingerprint) continue;
      try {
        const value = buildFillOpacityExpression(baseFillOpacity, hoveredUuid, selectedUuids);
        m.setPaintProperty(layerId, "fill-opacity", value);
        lastAppliedRef.current.set(key, fingerprint);
      } catch (error) {
        if (!isTransientMapboxError(error)) {
          Log.warn("usePolygonTableHighlightStyle: set fill-opacity failed", {
            layerId,
            hoveredUuid,
            selectedCount: selectedUuids.length,
            error
          });
        }
      }
    }

    for (const { layerId, baseLineWidth } of lineConfigs) {
      if (m.getLayer(layerId) == null) continue;
      const key = `${layerId}:line-width@${baseLineWidth}`;
      if (lastAppliedRef.current.get(key) === fingerprint) continue;
      try {
        const value = buildLineWidthExpression(baseLineWidth, hoveredUuid, selectedUuids);
        m.setPaintProperty(layerId, "line-width", value);
        lastAppliedRef.current.set(key, fingerprint);
      } catch (error) {
        if (!isTransientMapboxError(error)) {
          Log.warn("usePolygonTableHighlightStyle: set line-width failed", {
            layerId,
            hoveredUuid,
            selectedCount: selectedUuids.length,
            error
          });
        }
      }
    }
  }, [map, styleReady, styleVersion, sourcesAdded, highlight]);

  useEffect(() => {
    lastAppliedRef.current = new Map();
  }, [styleVersion, sourcesAdded]);
}

type UsePolygonSelectionZoomParams = {
  map: MutableRefObject<MapboxMap | null>;
  styleReady: boolean;
  sourcesAdded: boolean;
  selectedPolygonUuids: string[] | undefined;
  sitePolygonData: SitePolygonLightDto[] | undefined;
};

function computeBBoxFromFeatures(features: GeoJSON.Feature[]): BBox | null {
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  const processCoord = (coord: number[]) => {
    const [lng, lat] = coord;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  };

  const processCoords = (coords: number[][]) => {
    for (const coord of coords) processCoord(coord);
  };

  for (const feature of features) {
    const geom = feature.geometry;
    if (geom == null) continue;
    switch (geom.type) {
      case "Polygon":
        for (const ring of geom.coordinates) processCoords(ring);
        break;
      case "MultiPolygon":
        for (const polygon of geom.coordinates) {
          for (const ring of polygon) processCoords(ring);
        }
        break;
      case "Point":
        processCoord(geom.coordinates);
        break;
      case "LineString":
        processCoords(geom.coordinates);
        break;
    }
  }

  if (!isFinite(minLng) || !isFinite(minLat) || !isFinite(maxLng) || !isFinite(maxLat)) {
    return null;
  }

  if (minLng === maxLng && minLat === maxLat) {
    const BUFFER = 0.002;
    return [minLng - BUFFER, minLat - BUFFER, maxLng + BUFFER, maxLat + BUFFER] as BBox;
  }

  return [minLng, minLat, maxLng, maxLat] as BBox;
}

function computeBBoxFromCentroids(
  selectedUuids: string[],
  sitePolygonData: SitePolygonLightDto[] | undefined
): BBox | null {
  if (sitePolygonData == null || sitePolygonData.length === 0) return null;

  const selectedSet = new Set(selectedUuids);
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;
  let count = 0;

  for (const polygon of sitePolygonData) {
    const uuid = polygon.polygonUuid ?? polygon.uuid;
    if (uuid == null || !selectedSet.has(uuid)) continue;
    const lng = polygon.long;
    const lat = polygon.lat;
    if (lng == null || lat == null || isNaN(lng) || isNaN(lat)) continue;

    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    count++;
  }

  if (count === 0) return null;

  if (minLng === maxLng && minLat === maxLat) {
    const BUFFER = 0.005;
    return [minLng - BUFFER, minLat - BUFFER, maxLng + BUFFER, maxLat + BUFFER] as BBox;
  }

  const lngPad = (maxLng - minLng) * 0.1;
  const latPad = (maxLat - minLat) * 0.1;
  return [minLng - lngPad, minLat - latPad, maxLng + lngPad, maxLat + latPad] as BBox;
}

function mergeBBoxes(bboxes: BBox[]): BBox | null {
  if (bboxes.length === 0) return null;

  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  for (const [west, south, east, north] of bboxes) {
    if (west < minLng) minLng = west;
    if (south < minLat) minLat = south;
    if (east > maxLng) maxLng = east;
    if (north > maxLat) maxLat = north;
  }

  return [minLng, minLat, maxLng, maxLat] as BBox;
}

function fitMapToBBox(map: MapboxMap, bbox: BBox): void {
  map.fitBounds([bbox[0], bbox[1], bbox[2], bbox[3]], {
    padding: 100,
    linear: false,
    animate: true
  });
}

export function usePolygonSelectionZoom({
  map,
  styleReady,
  sourcesAdded,
  selectedPolygonUuids,
  sitePolygonData
}: UsePolygonSelectionZoomParams): void {
  const lastZoomedSelectionRef = useRef<string>("");
  const polygonBBoxCacheRef = useRef<Map<string, BBox | null>>(new Map());
  const requestSequenceRef = useRef(0);

  useEffect(() => {
    polygonBBoxCacheRef.current.clear();
    lastZoomedSelectionRef.current = "";
  }, [sitePolygonData]);

  useEffect(() => {
    const uuids = Array.from(new Set(selectedPolygonUuids ?? []));
    const selectionKey = uuids.length > 0 ? uuids.slice().sort().join(",") : "";

    if (uuids.length === 0) {
      lastZoomedSelectionRef.current = "";
      requestSequenceRef.current += 1;
      return;
    }

    if (!styleReady || !sourcesAdded || map.current == null) return;

    if (selectionKey === lastZoomedSelectionRef.current) return;

    const m = map.current;
    const requestSequence = requestSequenceRef.current + 1;
    requestSequenceRef.current = requestSequence;
    let cancelled = false;

    const isStale = () =>
      cancelled || requestSequence !== requestSequenceRef.current || map.current == null || map.current !== m;

    const attemptZoom = async () => {
      if (isStale()) return;

      const missingUuids = uuids.filter(uuid => !polygonBBoxCacheRef.current.has(uuid));
      if (missingUuids.length > 0) {
        try {
          const geojson = await fetchMultiplePolygonsGeoJson(missingUuids, false);
          if (isStale()) return;

          const missingSet = new Set(missingUuids);
          const featuresByUuid = new Map<string, GeoJSON.Feature[]>();
          for (const uuid of missingUuids) featuresByUuid.set(uuid, []);

          for (const feature of geojson.features) {
            const uuid = pickPolygonGeometryIdFromProperties(feature.properties);
            if (uuid == null || !missingSet.has(uuid)) continue;
            featuresByUuid.get(uuid)?.push(feature);
          }

          for (const uuid of missingUuids) {
            polygonBBoxCacheRef.current.set(uuid, computeBBoxFromFeatures(featuresByUuid.get(uuid) ?? []));
          }
        } catch (error) {
          if (isStale()) return;
          Log.warn("usePolygonSelectionZoom: failed to fetch selected polygon geometries", error);
        }
      }

      let bbox = mergeBBoxes(
        uuids.flatMap(uuid => {
          const cached = polygonBBoxCacheRef.current.get(uuid);
          return cached == null ? [] : [cached];
        })
      );

      if (bbox == null) {
        bbox = computeBBoxFromCentroids(uuids, sitePolygonData);
      }

      if (isStale()) return;

      if (bbox == null) {
        return;
      }

      fitMapToBBox(m, bbox);
      lastZoomedSelectionRef.current = selectionKey;
    };

    if (m.loaded()) {
      void attemptZoom();
    } else {
      m.once("idle", attemptZoom);
    }

    return () => {
      cancelled = true;
      m.off("idle", attemptZoom);
      requestSequenceRef.current += 1;
    };
  }, [map, styleReady, sourcesAdded, selectedPolygonUuids, sitePolygonData]);
}

type UsePolygonTableHighlightPointerParams = {
  map: MutableRefObject<MapboxMap | null>;
  draw: MutableRefObject<MapboxDraw | null>;
  styleReady: boolean;
  styleVersion: number;
  sourcesAdded: boolean;
  highlight: PolygonTableHighlight | undefined;
};

export function usePolygonTableHighlightPointer({
  map,
  draw,
  styleReady,
  styleVersion,
  sourcesAdded,
  highlight
}: UsePolygonTableHighlightPointerParams): void {
  const onHoveredPolygonFromMap = highlight?.onHoveredPolygonFromMap;
  const onPolygonClickedFromMap = highlight?.onPolygonClickedFromMap;
  const lastReportedRef = useRef<string | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (
      onHoveredPolygonFromMap == null ||
      !styleReady ||
      !sourcesAdded ||
      map.current == null ||
      POLYGON_FILL_LAYER_IDS.length === 0
    ) {
      return;
    }

    const m = map.current;
    const canvas = m.getCanvas();

    const pickUuid = (e: MapMouseEvent) => {
      const mode = draw.current?.getMode();
      if (mode === "draw_polygon" || mode === "draw_line_string") {
        return null;
      }
      try {
        const features = m.queryRenderedFeatures(e.point, { layers: POLYGON_FILL_LAYER_IDS });
        return pickPolygonGeometryIdFromProperties(features[0]?.properties ?? null);
      } catch (error) {
        if (!isTransientMapboxError(error)) {
          Log.warn("usePolygonTableHighlightPointer: queryRenderedFeatures failed", { error });
        }
        return null;
      }
    };

    const flushHover = (uuid: string | null) => {
      if (lastReportedRef.current === uuid) return;
      lastReportedRef.current = uuid;
      onHoveredPolygonFromMap(uuid);
    };

    const onMove = (e: MapMouseEvent) => {
      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        flushHover(pickUuid(e));
      });
    };

    const onMapLeave = () => {
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      flushHover(null);
    };

    const onClick = (e: MapMouseEvent) => {
      if (onPolygonClickedFromMap == null) return;
      const uuid = pickUuid(e);
      if (uuid != null) {
        onPolygonClickedFromMap(uuid);
      }
    };

    m.on("mousemove", onMove);
    m.on("click", onClick);
    canvas.addEventListener("mouseleave", onMapLeave);

    return () => {
      m.off("mousemove", onMove);
      m.off("click", onClick);
      canvas.removeEventListener("mouseleave", onMapLeave);
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (lastReportedRef.current != null) {
        lastReportedRef.current = null;
        onHoveredPolygonFromMap(null);
      }
    };
  }, [map, draw, styleReady, styleVersion, sourcesAdded, onHoveredPolygonFromMap, onPolygonClickedFromMap]);
}
