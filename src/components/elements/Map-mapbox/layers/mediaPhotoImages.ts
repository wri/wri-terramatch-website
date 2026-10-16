import type { Map as MapboxMap } from "mapbox-gl";

import {
  PHOTOS_ICON_HEIGHT,
  PHOTOS_ICON_PATH,
  PHOTOS_ICON_WIDTH
} from "@/redesignComponents/foundations/Icons/Function/PhotosIcon";

import {
  CIRCLE_ICON_MARKER_PIXEL_RATIO,
  CircleIconMarkerAppearance,
  CircleIconMarkerStyle,
  renderCircleIconMarker
} from "./circleIconMarkerImage";

const MARKER_RADIUS_PX = 14;
const RESTING_OPACITY = 0.8;
const ACTIVE_SCALE = 1.25;

const MEDIA_PHOTO_MARKER_STYLE: CircleIconMarkerStyle = {
  radiusPx: MARKER_RADIUS_PX,
  fillColor: "#2A698D",
  iconPaths: [PHOTOS_ICON_PATH],
  iconWidth: PHOTOS_ICON_WIDTH,
  iconHeight: PHOTOS_ICON_HEIGHT,
  iconBoxPx: 14
};

export const MEDIA_PHOTO_HIT_RADIUS_PX = MARKER_RADIUS_PX;

export const MEDIA_PHOTO_ACTIVE_HIT_RADIUS_PX = MARKER_RADIUS_PX * ACTIVE_SCALE;

export const MEDIA_PHOTO_APPEARANCES = ["default", "hovered", "selected", "selectedHovered"] as const;

export type MediaPhotoAppearance = (typeof MEDIA_PHOTO_APPEARANCES)[number];

const MARKER_APPEARANCES: Record<MediaPhotoAppearance, CircleIconMarkerAppearance> = {
  default: { scale: 1, opacity: RESTING_OPACITY, hasRing: false },
  hovered: { scale: ACTIVE_SCALE, opacity: 1, hasRing: false },
  selected: { scale: ACTIVE_SCALE, opacity: RESTING_OPACITY, hasRing: true },
  selectedHovered: { scale: ACTIVE_SCALE, opacity: 1, hasRing: true }
};

export const getMediaPhotoImageName = (appearance: MediaPhotoAppearance): string => `media-photo-${appearance}`;

const renderedImages = new Map<MediaPhotoAppearance, ImageData>();

const getMarkerImage = (appearance: MediaPhotoAppearance): ImageData => {
  let image = renderedImages.get(appearance);
  if (image == null) {
    image = renderCircleIconMarker(MEDIA_PHOTO_MARKER_STYLE, MARKER_APPEARANCES[appearance]);
    renderedImages.set(appearance, image);
  }
  return image;
};

export const addMediaPhotoImages = (map: MapboxMap): void => {
  for (const appearance of MEDIA_PHOTO_APPEARANCES) {
    const name = getMediaPhotoImageName(appearance);
    if (!map.hasImage(name)) {
      map.addImage(name, getMarkerImage(appearance), { pixelRatio: CIRCLE_ICON_MARKER_PIXEL_RATIO });
    }
  }
};

export const removeMediaPhotoImages = (map: MapboxMap): void => {
  for (const appearance of MEDIA_PHOTO_APPEARANCES) {
    const name = getMediaPhotoImageName(appearance);
    if (map.hasImage(name)) map.removeImage(name);
  }
};
