import type { FeatureCollection, Point as GeoJsonPoint } from "geojson";
import type { Map as MapboxMap, SymbolLayerSpecification } from "mapbox-gl";

import { LAYERS_NAMES } from "@/constants/layers";
import { getThemedColor } from "@/lib/theme";
import {
  TREE_PLANTING_ICON_PATHS,
  TREE_PLANTING_ICON_SIZE
} from "@/redesignComponents/foundations/Icons/RestorationAndLand/TreePlantingIcon";

import { CIRCLE_ICON_MARKER_PIXEL_RATIO, renderCircleIconMarker } from "./circleIconMarkerImage";
import { isStyleAlive } from "./styleGuards";

export type ProjectMarkerPoint = {
  uuid: string;
  lat: number;
  lng: number;
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

// Matches the design-system PointMarker "md" icon variant: 2.5rem circle at 80% opacity.
const getProjectMarkerImage = (): ImageData => {
  projectMarkerImage ??= renderCircleIconMarker(
    {
      radiusPx: 20,
      fillColor: getThemedColor("secondary", 600),
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
  features: points.map(({ uuid, lng, lat }) => ({
    type: "Feature",
    geometry: { type: "Point", coordinates: [lng, lat] },
    properties: { uuid }
  }))
});

export const addProjectMarkerLayer = (map: MapboxMap, points: ProjectMarkerPoint[]): void => {
  if (!map.hasImage(PROJECT_MARKER_IMAGE_NAME)) {
    map.addImage(PROJECT_MARKER_IMAGE_NAME, getProjectMarkerImage(), { pixelRatio: CIRCLE_ICON_MARKER_PIXEL_RATIO });
  }
  map.addSource(PROJECT_MARKER_ID, { type: "geojson", data: toFeatureCollection(points), promoteId: "uuid" });
  map.addLayer(PROJECT_MARKER_LAYER);
};

export const removeProjectMarkerLayer = (map: MapboxMap): void => {
  if (!isStyleAlive(map)) return;
  if (map.getLayer(PROJECT_MARKER_ID) != null) map.removeLayer(PROJECT_MARKER_ID);
  if (map.getSource(PROJECT_MARKER_ID) != null) map.removeSource(PROJECT_MARKER_ID);
  if (map.hasImage(PROJECT_MARKER_IMAGE_NAME)) map.removeImage(PROJECT_MARKER_IMAGE_NAME);
};
