import type { FeatureCollection, Point as GeoJsonPoint } from "geojson";
import { GeoJSONSource, Map as MapboxMap, MapMouseEvent, Marker, SymbolLayerSpecification } from "mapbox-gl";
import { createElement } from "react";
import { createRoot } from "react-dom/client";

import { LAYERS_NAMES } from "@/constants/layers";
import { ProjectMapEntryDto } from "@/generated/v3/researchService/researchServiceSchemas";
import {
  TREE_PLANTING_ICON_PATHS,
  TREE_PLANTING_ICON_SIZE
} from "@/redesignComponents/foundations/Icons/RestorationAndLand/TreePlantingIcon";

import PopupProviders from "../components/PopupProviders";
import ProjectMarkerPopup from "../components/ProjectMarkerPopup";
import { clearActivePopup, setActivePopup } from "../interactions/popupCoordinator";
import { CIRCLE_ICON_MARKER_PIXEL_RATIO, renderCircleIconMarker } from "./circleIconMarkerImage";
import { isStyleAlive } from "./styleGuards";

export type ProjectMarkerPoint = {
  project: ProjectMapEntryDto;
  lat: number;
  lng: number;
};

type ViewProjectPolygons = (projectUuid: string) => void;

type ProjectTooltip = {
  uuid: string;
  close: () => void;
};

type ProjectMarkerHandlers = {
  markerClick: (e: MapMouseEvent) => void;
  mapClick: (e: MapMouseEvent) => void;
  enter: () => void;
  leave: () => void;
};

type ProjectMarkerState = {
  pointsByUuid: Map<string, ProjectMarkerPoint>;
  onViewProjectPolygons?: ViewProjectPolygons;
  tooltip: ProjectTooltip | null;
  handlers: ProjectMarkerHandlers;
};

const PROJECT_MARKER_ID = LAYERS_NAMES.PROJECT_MARKERS;
const PROJECT_MARKER_IMAGE_NAME = "project-marker";

const PROJECT_MARKER_LAYER: SymbolLayerSpecification = {
  id: PROJECT_MARKER_ID,
  type: "symbol",
  source: PROJECT_MARKER_ID,
  layout: {
    "icon-image": PROJECT_MARKER_IMAGE_NAME,
    "icon-allow-overlap": true,
    "icon-ignore-placement": true
  }
};

let projectMarkerImage: ImageData | null = null;

const projectMarkerStates = new WeakMap<MapboxMap, ProjectMarkerState>();

// Matches the design-system PointMarker "md" icon variant: 2.5rem circle at 80% opacity.
const getProjectMarkerImage = (): ImageData => {
  projectMarkerImage ??= renderCircleIconMarker(
    {
      radiusPx: 20,
      // Theme secondary.600. Canvas can't resolve the CSS variable that getThemedColor returns.
      fillColor: "#8ECA3F",
      iconPaths: TREE_PLANTING_ICON_PATHS,
      iconWidth: TREE_PLANTING_ICON_SIZE,
      iconHeight: TREE_PLANTING_ICON_SIZE,
      iconBoxPx: 18
    },
    { scale: 1, opacity: 0.8, hasRing: false }
  );
  return projectMarkerImage;
};

const toFeatureCollection = (points: ProjectMarkerPoint[]): FeatureCollection<GeoJsonPoint, { uuid: string }> => ({
  type: "FeatureCollection",
  features: points.map(({ project, lng, lat }) => ({
    type: "Feature",
    geometry: { type: "Point", coordinates: [lng, lat] },
    properties: { uuid: project.uuid }
  }))
});

const openProjectTooltip = (map: MapboxMap, state: ProjectMarkerState, point: ProjectMarkerPoint): void => {
  state.tooltip?.close();

  const element = document.createElement("div");
  element.style.pointerEvents = "none";
  element.addEventListener("click", e => e.stopPropagation());
  const root = createRoot(element);
  const marker = new Marker({ element }).setLngLat([point.lng, point.lat]).addTo(map);

  const tooltip: ProjectTooltip = {
    uuid: point.project.uuid,
    close: () => {
      if (state.tooltip !== tooltip) return;
      state.tooltip = null;
      clearActivePopup(map, "PROJECT");
      marker.remove();
      queueMicrotask(() => root.unmount());
    }
  };
  state.tooltip = tooltip;
  setActivePopup(map, "PROJECT", tooltip.close);

  root.render(
    createElement(
      PopupProviders,
      null,
      createElement(ProjectMarkerPopup, {
        project: point.project,
        onClose: tooltip.close,
        onViewProjectPolygons: uuid => state.onViewProjectPolygons?.(uuid)
      })
    )
  );
};

const createProjectMarkerState = (map: MapboxMap): ProjectMarkerState => {
  const state: ProjectMarkerState = {
    pointsByUuid: new Map(),
    tooltip: null,
    handlers: {
      markerClick: e => {
        e.preventDefault();
        if (state.onViewProjectPolygons == null) return;
        const uuid = e.features?.[0]?.properties?.uuid;
        const point = typeof uuid === "string" ? state.pointsByUuid.get(uuid) : undefined;
        if (point != null) openProjectTooltip(map, state, point);
      },
      mapClick: e => {
        if (!e.defaultPrevented) state.tooltip?.close();
      },
      enter: () => {
        if (state.onViewProjectPolygons != null) map.getCanvas().style.setProperty("cursor", "pointer");
      },
      leave: () => map.getCanvas().style.removeProperty("cursor")
    }
  };

  map.on("click", PROJECT_MARKER_ID, state.handlers.markerClick);
  map.on("click", state.handlers.mapClick);
  map.on("mouseenter", PROJECT_MARKER_ID, state.handlers.enter);
  map.on("mouseleave", PROJECT_MARKER_ID, state.handlers.leave);
  return state;
};

export const upsertProjectMarkerLayer = (
  map: MapboxMap,
  points: ProjectMarkerPoint[],
  onViewProjectPolygons?: ViewProjectPolygons
): void => {
  let state = projectMarkerStates.get(map);
  if (state == null) {
    state = createProjectMarkerState(map);
    projectMarkerStates.set(map, state);
  }
  state.pointsByUuid = new Map(points.map(point => [point.project.uuid, point]));
  state.onViewProjectPolygons = onViewProjectPolygons;
  if (state.tooltip != null && (onViewProjectPolygons == null || !state.pointsByUuid.has(state.tooltip.uuid))) {
    state.tooltip.close();
  }

  if (!isStyleAlive(map)) return;

  const data = toFeatureCollection(points);
  const source = map.getSource<GeoJSONSource>(PROJECT_MARKER_ID);
  if (source != null) {
    source.setData(data);
    return;
  }

  if (!map.hasImage(PROJECT_MARKER_IMAGE_NAME)) {
    map.addImage(PROJECT_MARKER_IMAGE_NAME, getProjectMarkerImage(), { pixelRatio: CIRCLE_ICON_MARKER_PIXEL_RATIO });
  }
  map.addSource(PROJECT_MARKER_ID, { type: "geojson", data, promoteId: "uuid" });
  map.addLayer(PROJECT_MARKER_LAYER);
};

export const removeProjectMarkerLayer = (map: MapboxMap): void => {
  const state = projectMarkerStates.get(map);
  if (state != null) {
    map.off("click", PROJECT_MARKER_ID, state.handlers.markerClick);
    map.off("click", state.handlers.mapClick);
    map.off("mouseenter", PROJECT_MARKER_ID, state.handlers.enter);
    map.off("mouseleave", PROJECT_MARKER_ID, state.handlers.leave);
    state.handlers.leave();
    state.tooltip?.close();
    projectMarkerStates.delete(map);
  }

  if (!isStyleAlive(map)) return;
  if (map.getLayer(PROJECT_MARKER_ID) != null) map.removeLayer(PROJECT_MARKER_ID);
  if (map.getSource(PROJECT_MARKER_ID) != null) map.removeSource(PROJECT_MARKER_ID);
  if (map.hasImage(PROJECT_MARKER_IMAGE_NAME)) map.removeImage(PROJECT_MARKER_IMAGE_NAME);
};
