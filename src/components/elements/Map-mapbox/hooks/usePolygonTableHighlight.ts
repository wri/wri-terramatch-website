import MapboxDraw from "@mapbox/mapbox-gl-draw";
import type { DataDrivenPropertyValueSpecification, MapMouseEvent } from "mapbox-gl";
import { Map as MapboxMap } from "mapbox-gl";
import { MutableRefObject, useEffect, useRef } from "react";

import {
  getPolygonGeometryFillLayerConfigs,
  pickPolygonGeometryIdFromProperties
} from "@/components/elements/Map-mapbox/layers/polygonLayers";
import Log from "@/utils/log";

const POLYGON_FILL_LAYER_IDS = getPolygonGeometryFillLayerConfigs().map(c => c.layerId);

const HOVER_FILL_OPACITY = 0.6;
const SELECTED_FILL_OPACITY = 1;

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

type PolygonTableHighlight = {
  hoveredPolygonUuid: string | null;
  selectedPolygonUuids: string[];
  onHoveredPolygonFromMap?: (uuid: string | null) => void;
  onPolygonClickedFromMap?: (uuid: string) => void;
};

type UsePolygonTableHighlightFillParams = {
  map: MutableRefObject<MapboxMap | null>;
  styleReady: boolean;
  styleVersion: number;
  sourcesAdded: boolean;
  highlight: PolygonTableHighlight | undefined;
};

export function usePolygonTableHighlightFill({
  map,
  styleReady,
  styleVersion,
  sourcesAdded,
  highlight
}: UsePolygonTableHighlightFillParams): void {
  useEffect(() => {
    if (highlight == null || !styleReady || !sourcesAdded || map.current == null) return;

    const m = map.current;
    const configs = getPolygonGeometryFillLayerConfigs();
    const { hoveredPolygonUuid, selectedPolygonUuids } = highlight;

    for (const { layerId, baseFillOpacity } of configs) {
      if (m.getLayer(layerId) == null) continue;
      try {
        const value = buildFillOpacityExpression(baseFillOpacity, hoveredPolygonUuid, selectedPolygonUuids);
        m.setPaintProperty(layerId, "fill-opacity", value);
      } catch (error) {
        if (!isTransientMapboxError(error)) {
          Log.warn("usePolygonTableHighlightFill: setPaintProperty failed", {
            layerId,
            hoveredPolygonUuid,
            selectedCount: selectedPolygonUuids.length,
            error
          });
        }
      }
    }
  }, [map, styleReady, styleVersion, sourcesAdded, highlight]);

  useEffect(() => {
    if (highlight != null || !styleReady || !sourcesAdded || map.current == null) return;

    const m = map.current;
    for (const { layerId, baseFillOpacity } of getPolygonGeometryFillLayerConfigs()) {
      if (m.getLayer(layerId) == null) continue;
      try {
        m.setPaintProperty(layerId, "fill-opacity", baseFillOpacity);
      } catch (error) {
        if (!isTransientMapboxError(error)) {
          Log.warn("usePolygonTableHighlightFill: restore fill-opacity failed", { layerId, error });
        }
      }
    }
  }, [highlight, map, styleReady, styleVersion, sourcesAdded]);
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
