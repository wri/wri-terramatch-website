import MapboxDraw from "@mapbox/mapbox-gl-draw";
import type { DataDrivenPropertyValueSpecification, MapMouseEvent } from "mapbox-gl";
import { Map as MapboxMap } from "mapbox-gl";
import { MutableRefObject, useCallback, useEffect, useRef } from "react";

import {
  getPolygonGeometryFillLayerConfigs,
  getPolygonGeometryLineLayerConfigs,
  pickPolygonGeometryIdFromProperties
} from "@/components/elements/Map-mapbox/layers/polygonLayers";
import { loadBoundingBox, normalizeBoundingBoxDto } from "@/connections/BoundingBox";
import { setPolygonTableHoveredUuid, usePolygonTableHoveredUuid } from "@/context/polygonTableInteraction.store";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import Log from "@/utils/log";

import { BBox } from "../GeoJSON";
import type { MapEditFocusState } from "../hooks/useMapEditFocus";
import { INACTIVE_MAP_EDIT_FOCUS } from "../hooks/useMapEditFocus";
import { polygonSelectionZoomBboxCache } from "../polygonSelectionZoomBboxCache";

const POLYGON_FILL_LAYER_IDS = getPolygonGeometryFillLayerConfigs().map(c => c.layerId);
const EMPTY_SELECTION: string[] = [];

const HOVER_FILL_OPACITY = 0.6;
const SELECTED_FILL_OPACITY = 1;
const HIGHLIGHT_LINE_WIDTH = 2;

// Edit-focus dimming: neighbors fade so the polygon being edited stands out.
const EDIT_NEIGHBOR_FILL_DIM_FACTOR = 1 / 3;
const EDIT_NEIGHBOR_LINE_OPACITY = 0.4;
const BASE_LINE_OPACITY = 1;

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

/** Value for the edited polygon vs. a dimmed value for every other polygon. */
function buildEditFocusExpression(
  focusedValue: number,
  dimmedValue: number,
  editedPolygonUuid: string | null
): number | DataDrivenPropertyValueSpecification<number> {
  if (editedPolygonUuid == null) {
    return dimmedValue;
  }
  return [
    "case",
    ["==", TILE_POLYGON_ID_EXPR, editedPolygonUuid],
    focusedValue,
    dimmedValue
  ] as DataDrivenPropertyValueSpecification<number>;
}

function buildFillOpacityExpression(
  baseOpacity: number,
  hoveredUuid: string | null | undefined,
  selectedUuids: string[],
  editFocus: MapEditFocusState
): number | DataDrivenPropertyValueSpecification<number> {
  if (editFocus.isEditFocusActive) {
    return buildEditFocusExpression(
      baseOpacity,
      baseOpacity * EDIT_NEIGHBOR_FILL_DIM_FACTOR,
      editFocus.editedPolygonUuid
    );
  }
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
  selectedUuids: string[],
  editFocus: MapEditFocusState
): number | DataDrivenPropertyValueSpecification<number> {
  if (editFocus.isEditFocusActive) {
    // No hover/selection emphasis while editing; keep the base outline width.
    return baseLineWidth;
  }
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

function buildLineOpacityExpression(
  editFocus: MapEditFocusState
): number | DataDrivenPropertyValueSpecification<number> {
  if (!editFocus.isEditFocusActive) {
    return BASE_LINE_OPACITY;
  }
  return buildEditFocusExpression(BASE_LINE_OPACITY, EDIT_NEIGHBOR_LINE_OPACITY, editFocus.editedPolygonUuid);
}

type PolygonTableHighlight = {
  selectedPolygonUuids: string[];
  onPolygonClickedFromMap?: (uuid: string) => void;
  focusPolygonUuid?: string | null;
  onFocusPolygonConsumed?: () => void;
};

type UsePolygonTableHighlightStyleParams = {
  map: MutableRefObject<MapboxMap | null>;
  styleReady: boolean;
  styleVersion: number;
  sourcesAdded: boolean;
  highlight: PolygonTableHighlight | undefined;
  editFocus?: MapEditFocusState;
};

export function usePolygonTableHighlightStyle({
  map,
  styleReady,
  styleVersion,
  sourcesAdded,
  highlight,
  editFocus = INACTIVE_MAP_EDIT_FOCUS
}: UsePolygonTableHighlightStyleParams): void {
  const lastAppliedRef = useRef<Map<string, string>>(new Map());
  const isHighlightActive = highlight != null;
  const { isEditFocusActive, editedPolygonUuid } = editFocus;
  // Hover has no visual effect while editing, so skip store subscriptions entirely.
  const hoveredUuid = usePolygonTableHoveredUuid(isHighlightActive && !isEditFocusActive);
  const selectedUuids = highlight?.selectedPolygonUuids ?? EMPTY_SELECTION;

  useEffect(() => {
    const isStyleActive = isHighlightActive || isEditFocusActive;
    if (!styleReady || !sourcesAdded || map.current == null) return;
    // Once deactivated, run one final pass so paints restore to base values.
    if (!isStyleActive && lastAppliedRef.current.size === 0) return;

    const m = map.current;
    const currentEditFocus: MapEditFocusState = isStyleActive
      ? { isEditFocusActive, editedPolygonUuid }
      : INACTIVE_MAP_EDIT_FOCUS;
    const effectiveHovered = isStyleActive ? hoveredUuid : null;
    const effectiveSelected = isStyleActive && !isEditFocusActive ? selectedUuids : EMPTY_SELECTION;
    const fillConfigs = getPolygonGeometryFillLayerConfigs();
    const lineConfigs = getPolygonGeometryLineLayerConfigs();
    const fingerprint = `${isEditFocusActive ? `E:${editedPolygonUuid ?? ""}` : ""}|${
      effectiveHovered ?? ""
    }|${effectiveSelected.join(",")}`;

    for (const { layerId, baseFillOpacity } of fillConfigs) {
      if (m.getLayer(layerId) == null) continue;
      const key = `${layerId}:fill-opacity@${baseFillOpacity}`;
      if (lastAppliedRef.current.get(key) === fingerprint) continue;
      try {
        const value = buildFillOpacityExpression(
          baseFillOpacity,
          effectiveHovered,
          effectiveSelected,
          currentEditFocus
        );
        m.setPaintProperty(layerId, "fill-opacity", value);
        lastAppliedRef.current.set(key, fingerprint);
      } catch (error) {
        if (!isTransientMapboxError(error)) {
          Log.warn("usePolygonTableHighlightStyle: set fill-opacity failed", {
            layerId,
            hoveredUuid: effectiveHovered,
            selectedCount: effectiveSelected.length,
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
        m.setPaintProperty(
          layerId,
          "line-width",
          buildLineWidthExpression(baseLineWidth, effectiveHovered, effectiveSelected, currentEditFocus)
        );
        m.setPaintProperty(layerId, "line-opacity", buildLineOpacityExpression(currentEditFocus));
        lastAppliedRef.current.set(key, fingerprint);
      } catch (error) {
        if (!isTransientMapboxError(error)) {
          Log.warn("usePolygonTableHighlightStyle: set line-width failed", {
            layerId,
            hoveredUuid: effectiveHovered,
            selectedCount: effectiveSelected.length,
            error
          });
        }
      }
    }

    if (!isStyleActive) {
      lastAppliedRef.current = new Map();
    }
  }, [
    map,
    styleReady,
    styleVersion,
    sourcesAdded,
    isHighlightActive,
    hoveredUuid,
    selectedUuids,
    isEditFocusActive,
    editedPolygonUuid
  ]);

  useEffect(() => {
    lastAppliedRef.current = new Map();
  }, [styleVersion, sourcesAdded]);
}

type UsePolygonSelectionZoomParams = {
  map: MutableRefObject<MapboxMap | null>;
  styleReady: boolean;
  sourcesAdded: boolean;
  selectedPolygonUuids: string[] | undefined;
  focusPolygonUuid?: string | null;
  onFocusPolygonConsumed?: () => void;
  validationZoomPolygonUuids?: string[] | null;
  onValidationZoomConsumed?: () => void;
  sitePolygonData: SitePolygonLightDto[] | undefined;
};

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

const buildSitePolygonIdsFingerprint = (sitePolygonData: SitePolygonLightDto[] | undefined): string => {
  if (sitePolygonData == null || sitePolygonData.length === 0) {
    return "";
  }

  return sitePolygonData
    .map(polygon => polygon.polygonUuid ?? polygon.uuid ?? "")
    .filter(id => id.length > 0)
    .sort()
    .join(",");
};

const getSortedSelectionKey = (uuids: string[]): string => uuids.slice().sort().join(",");

const fetchSinglePolygonBoundingBox = async (uuid: string): Promise<BBox | null> => {
  try {
    const result = await loadBoundingBox({ filter: { polygonUuid: uuid }, enabled: true });
    return normalizeBoundingBoxDto(result?.data?.bbox);
  } catch (error) {
    Log.warn("usePolygonSelectionZoom: failed to load single polygon bounding box", { uuid, error });
    return null;
  }
};

const fetchSelectionBoundingBox = async (uuids: string[]): Promise<BBox | null> => {
  if (uuids.length === 0) {
    return null;
  }

  try {
    const result = await loadBoundingBox({
      filter: { polygonUuids: uuids },
      enabled: true
    });
    const bbox = normalizeBoundingBoxDto(result?.data?.bbox);
    if (bbox != null) {
      return bbox;
    }
  } catch (error) {
    Log.warn("usePolygonSelectionZoom: combined polygonUuids bbox request failed, falling back", { error });
  }

  if (uuids.length === 1) {
    return fetchSinglePolygonBoundingBox(uuids[0]);
  }

  const perPolygonBboxes = await Promise.all(uuids.map(uuid => fetchSinglePolygonBoundingBox(uuid)));
  return mergeBBoxes(perPolygonBboxes.flatMap(bbox => (bbox == null ? [] : [bbox])));
};

export function usePolygonSelectionZoom({
  map,
  styleReady,
  sourcesAdded,
  selectedPolygonUuids,
  focusPolygonUuid,
  onFocusPolygonConsumed,
  validationZoomPolygonUuids,
  onValidationZoomConsumed,
  sitePolygonData
}: UsePolygonSelectionZoomParams): void {
  const lastZoomedSelectionRef = useRef<string>("");
  const lastValidationZoomKeyRef = useRef<string>("");
  const requestSequenceRef = useRef(0);
  const sitePolygonIdsFingerprint = buildSitePolygonIdsFingerprint(sitePolygonData);

  useEffect(() => {
    polygonSelectionZoomBboxCache.clear();
  }, [sitePolygonIdsFingerprint]);

  const zoomToUuids = useCallback(async (uuids: string[], m: MapboxMap, isStale: () => boolean): Promise<boolean> => {
    if (isStale()) return false;

    const selectionKey = getSortedSelectionKey(uuids);
    if (!polygonSelectionZoomBboxCache.has(selectionKey)) {
      const selectionBbox = await fetchSelectionBoundingBox(uuids);
      if (isStale()) return false;
      polygonSelectionZoomBboxCache.set(selectionKey, selectionBbox);
    }

    let bbox = polygonSelectionZoomBboxCache.get(selectionKey) ?? null;

    if (isStale() || bbox == null) return false;

    fitMapToBBox(m, bbox);
    return true;
  }, []);

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
      const zoomed = await zoomToUuids(uuids, m, isStale);
      if (zoomed) {
        lastZoomedSelectionRef.current = selectionKey;
      }
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
  }, [map, styleReady, sourcesAdded, selectedPolygonUuids, zoomToUuids]);

  useEffect(() => {
    if (focusPolygonUuid == null || focusPolygonUuid === "") return;

    if (!styleReady || !sourcesAdded || map.current == null) return;

    const m = map.current;
    const requestSequence = requestSequenceRef.current + 1;
    requestSequenceRef.current = requestSequence;
    let cancelled = false;

    const isStale = () =>
      cancelled || requestSequence !== requestSequenceRef.current || map.current == null || map.current !== m;

    const attemptZoom = async () => {
      await zoomToUuids([focusPolygonUuid], m, isStale);
      if (!isStale()) {
        onFocusPolygonConsumed?.();
      }
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
  }, [map, styleReady, sourcesAdded, focusPolygonUuid, onFocusPolygonConsumed, zoomToUuids]);

  useEffect(() => {
    const uuids = (validationZoomPolygonUuids ?? []).filter(uuid => uuid !== "");
    if (uuids.length === 0) {
      lastValidationZoomKeyRef.current = "";
      return;
    }

    if (!styleReady || !sourcesAdded || map.current == null) {
      return;
    }

    const selectionKey = getSortedSelectionKey(uuids);
    if (selectionKey === lastValidationZoomKeyRef.current) {
      return;
    }

    const m = map.current;
    const requestSequence = requestSequenceRef.current + 1;
    requestSequenceRef.current = requestSequence;
    let cancelled = false;

    const isStale = () =>
      cancelled || requestSequence !== requestSequenceRef.current || map.current == null || map.current !== m;

    const attemptZoom = async () => {
      polygonSelectionZoomBboxCache.delete(selectionKey);
      const zoomed = await zoomToUuids(uuids, m, isStale);
      if (zoomed && !isStale()) {
        lastValidationZoomKeyRef.current = selectionKey;
        onValidationZoomConsumed?.();
      }
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
  }, [map, onValidationZoomConsumed, sourcesAdded, styleReady, validationZoomPolygonUuids, zoomToUuids]);
}

type UsePolygonTableHighlightPointerParams = {
  map: MutableRefObject<MapboxMap | null>;
  draw: MutableRefObject<MapboxDraw | null>;
  styleReady: boolean;
  styleVersion: number;
  sourcesAdded: boolean;
  highlight: PolygonTableHighlight | undefined;
  editFocus?: MapEditFocusState;
};

export function usePolygonTableHighlightPointer({
  map,
  draw,
  styleReady,
  styleVersion,
  sourcesAdded,
  highlight,
  editFocus = INACTIVE_MAP_EDIT_FOCUS
}: UsePolygonTableHighlightPointerParams): void {
  const isHighlightActive = highlight != null;
  // While editing, only the edited polygon (handled by MapboxDraw) is interactive:
  // no hover feedback and no click-to-select on neighboring polygons.
  const isPointerActive = isHighlightActive && !editFocus.isEditFocusActive;
  const onPolygonClickedFromMap = highlight?.onPolygonClickedFromMap;
  const lastReportedRef = useRef<string | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (
      !isPointerActive ||
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
      setPolygonTableHoveredUuid(uuid);
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
        setPolygonTableHoveredUuid(null);
      }
    };
  }, [map, draw, styleReady, styleVersion, sourcesAdded, isPointerActive, onPolygonClickedFromMap]);
}
