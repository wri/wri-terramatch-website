import type { Map as MapboxMap, Point } from "mapbox-gl";

import { LAYERS_NAMES } from "@/constants/layers";

import { MEDIA_PHOTO_ACTIVE_HIT_RADIUS_PX, MEDIA_PHOTO_HIT_RADIUS_PX } from "./mediaPhotoImages";

export const MEDIA_PHOTO_SOURCE_ID = LAYERS_NAMES.MEDIA_IMAGES;

export const MEDIA_PHOTO_BASE_LAYER_ID = LAYERS_NAMES.MEDIA_IMAGES;

const isActive = (state: Record<string, unknown> | undefined): boolean =>
  state?.hovered === true || state?.selected === true;

export const findMediaPhotoAt = (map: MapboxMap, point: Point): string | null => {
  if (map.getLayer(MEDIA_PHOTO_BASE_LAYER_ID) == null) return null;

  let closest: { uuid: string; distance: number } | null = null;
  for (const { id, geometry, state } of map.queryRenderedFeatures(point, { layers: [MEDIA_PHOTO_BASE_LAYER_ID] })) {
    if (typeof id !== "string" || geometry.type !== "Point") continue;

    const [lng, lat] = geometry.coordinates;
    const distance = map.project([lng, lat]).dist(point);
    const radius = isActive(state) ? MEDIA_PHOTO_ACTIVE_HIT_RADIUS_PX : MEDIA_PHOTO_HIT_RADIUS_PX;
    if (distance <= radius && (closest == null || distance < closest.distance)) {
      closest = { uuid: id, distance };
    }
  }
  return closest?.uuid ?? null;
};

export const isMediaPhotoAt = (map: MapboxMap, point: Point): boolean => findMediaPhotoAt(map, point) != null;
