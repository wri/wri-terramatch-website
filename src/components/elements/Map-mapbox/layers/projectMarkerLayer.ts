import type { FeatureCollection, Point as GeoJsonPoint } from "geojson";
import { Map as MapboxMap, MapMouseEvent, Marker, SymbolLayerSpecification } from "mapbox-gl";
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

type ProjectMarkerHandlers = {
  click: (e: MapMouseEvent) => void;
  enter: () => void;
  leave: () => void;
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

const projectMarkerHandlers = new WeakMap<MapboxMap, ProjectMarkerHandlers>();
const projectTooltipClosers = new WeakMap<MapboxMap, () => void>();

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

const closeProjectTooltip = (map: MapboxMap): void => {
  const close = projectTooltipClosers.get(map);
  projectTooltipClosers.delete(map);
  close?.();
};

const openProjectTooltip = (
  map: MapboxMap,
  point: ProjectMarkerPoint,
  onViewProjectPolygons: (projectUuid: string) => void
): void => {
  closeProjectTooltip(map);

  const element = document.createElement("div");
  element.style.pointerEvents = "none";
  const root = createRoot(element);
  const marker = new Marker({ element }).setLngLat([point.lng, point.lat]).addTo(map);

  const close = () => {
    projectTooltipClosers.delete(map);
    clearActivePopup(map, "PROJECT");
    marker.remove();
    queueMicrotask(() => root.unmount());
  };
  projectTooltipClosers.set(map, close);
  setActivePopup(map, "PROJECT", () => closeProjectTooltip(map));

  root.render(
    createElement(
      PopupProviders,
      null,
      createElement(ProjectMarkerPopup, { project: point.project, onClose: close, onViewProjectPolygons })
    )
  );
};

const removeProjectMarkerHandlers = (map: MapboxMap): void => {
  const handlers = projectMarkerHandlers.get(map);
  if (handlers == null) return;

  map.off("click", PROJECT_MARKER_ID, handlers.click);
  map.off("mouseenter", PROJECT_MARKER_ID, handlers.enter);
  map.off("mouseleave", PROJECT_MARKER_ID, handlers.leave);
  handlers.leave();
  projectMarkerHandlers.delete(map);
};

const addProjectMarkerHandlers = (
  map: MapboxMap,
  points: ProjectMarkerPoint[],
  onViewProjectPolygons: (projectUuid: string) => void
): void => {
  const pointsByUuid = new Map(points.map(point => [point.project.uuid, point]));
  const handlers: ProjectMarkerHandlers = {
    click: e => {
      e.preventDefault();
      const uuid = e.features?.[0]?.properties?.uuid;
      const point = typeof uuid === "string" ? pointsByUuid.get(uuid) : undefined;
      if (point != null) openProjectTooltip(map, point, onViewProjectPolygons);
    },
    enter: () => map.getCanvas().style.setProperty("cursor", "pointer"),
    leave: () => map.getCanvas().style.removeProperty("cursor")
  };

  map.on("click", PROJECT_MARKER_ID, handlers.click);
  map.on("mouseenter", PROJECT_MARKER_ID, handlers.enter);
  map.on("mouseleave", PROJECT_MARKER_ID, handlers.leave);
  projectMarkerHandlers.set(map, handlers);
};

export const addProjectMarkerLayer = (
  map: MapboxMap,
  points: ProjectMarkerPoint[],
  onViewProjectPolygons: (projectUuid: string) => void
): void => {
  if (!map.hasImage(PROJECT_MARKER_IMAGE_NAME)) {
    map.addImage(PROJECT_MARKER_IMAGE_NAME, getProjectMarkerImage(), { pixelRatio: CIRCLE_ICON_MARKER_PIXEL_RATIO });
  }
  map.addSource(PROJECT_MARKER_ID, { type: "geojson", data: toFeatureCollection(points), promoteId: "uuid" });
  map.addLayer(PROJECT_MARKER_LAYER);
  addProjectMarkerHandlers(map, points, onViewProjectPolygons);
};

export const removeProjectMarkerLayer = (map: MapboxMap): void => {
  removeProjectMarkerHandlers(map);
  closeProjectTooltip(map);
  if (!isStyleAlive(map)) return;
  if (map.getLayer(PROJECT_MARKER_ID) != null) map.removeLayer(PROJECT_MARKER_ID);
  if (map.getSource(PROJECT_MARKER_ID) != null) map.removeSource(PROJECT_MARKER_ID);
  if (map.hasImage(PROJECT_MARKER_IMAGE_NAME)) map.removeImage(PROJECT_MARKER_IMAGE_NAME);
};
