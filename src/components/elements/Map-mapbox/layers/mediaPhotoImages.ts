import type { Map as MapboxMap } from "mapbox-gl";

import {
  PHOTOS_ICON_HEIGHT,
  PHOTOS_ICON_PATH,
  PHOTOS_ICON_WIDTH
} from "@/redesignComponents/foundations/Icons/Function/PhotosIcon";

const MARKER_RADIUS_PX = 14;
const MARKER_BORDER_PX = 2;
const MARKER_FILL_COLOR = "#2A698D";
const MARKER_FOREGROUND_COLOR = "#FFFFFF";
const MARKER_ICON_BOX_PX = 14;
const RESTING_OPACITY = 0.8;
const ACTIVE_SCALE = 1.25;
const SELECTED_RING_PX = 2;
const SELECTED_RING_COLOR = "#50B6E2";
const PIXEL_RATIO = 3;
const SHADOW_CASTER_OFFSET_PX = 1000;

export const MEDIA_PHOTO_HIT_RADIUS_PX = MARKER_RADIUS_PX;

export const MEDIA_PHOTO_ACTIVE_HIT_RADIUS_PX = MARKER_RADIUS_PX * ACTIVE_SCALE;

type CssShadow = {
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
};

const MARKER_SHADOWS: CssShadow[] = [
  { offsetY: 1, blur: 2, spread: -1, color: "rgba(0, 0, 0, 0.1)" },
  { offsetY: 1, blur: 3, spread: 0, color: "rgba(0, 0, 0, 0.1)" }
];

const SELECTED_SHADOW: CssShadow = { offsetY: 2, blur: 2, spread: 4, color: "rgba(0, 0, 0, 0.05)" };

type MarkerAppearance = {
  scale: number;
  opacity: number;
  hasRing: boolean;
};

export const MEDIA_PHOTO_APPEARANCES = ["default", "hovered", "selected", "selectedHovered"] as const;

export type MediaPhotoAppearance = (typeof MEDIA_PHOTO_APPEARANCES)[number];

const MARKER_APPEARANCES: Record<MediaPhotoAppearance, MarkerAppearance> = {
  default: { scale: 1, opacity: RESTING_OPACITY, hasRing: false },
  hovered: { scale: ACTIVE_SCALE, opacity: 1, hasRing: false },
  selected: { scale: ACTIVE_SCALE, opacity: RESTING_OPACITY, hasRing: true },
  selectedHovered: { scale: ACTIVE_SCALE, opacity: 1, hasRing: true }
};

export const getMediaPhotoImageName = (appearance: MediaPhotoAppearance): string => `media-photo-${appearance}`;

const shadowReach = ({ offsetY, blur, spread }: CssShadow): number =>
  MARKER_RADIUS_PX + spread + Math.abs(offsetY) + blur;

const getHalfExtentPx = ({ scale, hasRing }: MarkerAppearance): number => {
  const reaches = MARKER_SHADOWS.map(shadowReach);
  if (hasRing) reaches.push(MARKER_RADIUS_PX + SELECTED_RING_PX, shadowReach(SELECTED_SHADOW));
  return Math.ceil(scale * Math.max(...reaches)) + 1;
};

const createContext = (sizePx: number): CanvasRenderingContext2D => {
  const canvas = document.createElement("canvas");
  canvas.width = sizePx;
  canvas.height = sizePx;
  const context = canvas.getContext("2d");
  if (context == null) throw new Error("2D canvas context is unavailable");
  return context;
};

type Painter = { context: CanvasRenderingContext2D; deviceScale: number };

const createPainter = (sizePx: number, scale: number): Painter => {
  const context = createContext(sizePx);
  const deviceScale = PIXEL_RATIO * scale;
  context.setTransform(deviceScale, 0, 0, deviceScale, sizePx / 2, sizePx / 2);
  return { context, deviceScale };
};

const fillCircle = (context: CanvasRenderingContext2D, x: number, radius: number, color: string): void => {
  context.beginPath();
  context.arc(x, 0, radius, 0, Math.PI * 2);
  context.fillStyle = color;
  context.fill();
};

const paintOuterShadow = ({ context, deviceScale }: Painter, halfExtent: number, shadow: CssShadow): void => {
  context.save();
  context.beginPath();
  context.rect(-halfExtent, -halfExtent, halfExtent * 2, halfExtent * 2);
  context.arc(0, 0, MARKER_RADIUS_PX, 0, Math.PI * 2);
  context.clip("evenodd");
  context.shadowColor = shadow.color;
  context.shadowBlur = shadow.blur * deviceScale;
  context.shadowOffsetX = SHADOW_CASTER_OFFSET_PX * deviceScale;
  context.shadowOffsetY = shadow.offsetY * deviceScale;
  fillCircle(context, -SHADOW_CASTER_OFFSET_PX, MARKER_RADIUS_PX + shadow.spread, "#000000");
  context.restore();
};

const paintButton = (painter: Painter, halfExtent: number): void => {
  const { context } = painter;
  MARKER_SHADOWS.forEach(shadow => paintOuterShadow(painter, halfExtent, shadow));
  fillCircle(context, 0, MARKER_RADIUS_PX, MARKER_FOREGROUND_COLOR);
  fillCircle(context, 0, MARKER_RADIUS_PX - MARKER_BORDER_PX, MARKER_FILL_COLOR);

  const iconScale = MARKER_ICON_BOX_PX / Math.max(PHOTOS_ICON_WIDTH, PHOTOS_ICON_HEIGHT);
  context.save();
  context.scale(iconScale, iconScale);
  context.translate(-PHOTOS_ICON_WIDTH / 2, -PHOTOS_ICON_HEIGHT / 2);
  context.fillStyle = MARKER_FOREGROUND_COLOR;
  context.fill(new Path2D(PHOTOS_ICON_PATH));
  context.restore();
};

const renderMarker = (appearance: MarkerAppearance): ImageData => {
  const halfExtent = getHalfExtentPx(appearance);
  const sizePx = halfExtent * 2 * PIXEL_RATIO;
  const target = createPainter(sizePx, appearance.scale);

  if (appearance.hasRing) paintOuterShadow(target, halfExtent, SELECTED_SHADOW);

  const button = createPainter(sizePx, appearance.scale);
  paintButton(button, halfExtent);
  target.context.save();
  target.context.resetTransform();
  target.context.globalAlpha = appearance.opacity;
  target.context.drawImage(button.context.canvas, 0, 0);
  target.context.restore();

  if (appearance.hasRing) {
    target.context.beginPath();
    target.context.arc(0, 0, MARKER_RADIUS_PX + SELECTED_RING_PX / 2, 0, Math.PI * 2);
    target.context.lineWidth = SELECTED_RING_PX;
    target.context.strokeStyle = SELECTED_RING_COLOR;
    target.context.stroke();
  }

  return target.context.getImageData(0, 0, sizePx, sizePx);
};

const renderedImages = new Map<MediaPhotoAppearance, ImageData>();

const getMarkerImage = (appearance: MediaPhotoAppearance): ImageData => {
  let image = renderedImages.get(appearance);
  if (image == null) {
    image = renderMarker(MARKER_APPEARANCES[appearance]);
    renderedImages.set(appearance, image);
  }
  return image;
};

export const addMediaPhotoImages = (map: MapboxMap): void => {
  for (const appearance of MEDIA_PHOTO_APPEARANCES) {
    const name = getMediaPhotoImageName(appearance);
    if (!map.hasImage(name)) {
      map.addImage(name, getMarkerImage(appearance), { pixelRatio: PIXEL_RATIO });
    }
  }
};

export const removeMediaPhotoImages = (map: MapboxMap): void => {
  for (const appearance of MEDIA_PHOTO_APPEARANCES) {
    const name = getMediaPhotoImageName(appearance);
    if (map.hasImage(name)) map.removeImage(name);
  }
};
