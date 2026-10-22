/** Map images are painted at 3x so markers stay sharp on high-density screens. */
export const CIRCLE_ICON_MARKER_PIXEL_RATIO = 3;

const MARKER_BORDER_PX = 2;
const MARKER_FOREGROUND_COLOR = "#FFFFFF";
const SELECTED_RING_PX = 2;
const SELECTED_RING_COLOR = "#50B6E2";
const SHADOW_CASTER_OFFSET_PX = 1000;

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

/** A white-bordered circle filled with `fillColor`, with a white icon drawn from SVG path data. */
export type CircleIconMarkerStyle = {
  radiusPx: number;
  fillColor: string;
  iconPaths: string[];
  iconWidth: number;
  iconHeight: number;
  iconBoxPx: number;
};

export type CircleIconMarkerAppearance = {
  scale: number;
  opacity: number;
  hasRing: boolean;
};

const shadowReach = (radiusPx: number, { offsetY, blur, spread }: CssShadow): number =>
  radiusPx + spread + Math.abs(offsetY) + blur;

const getHalfExtentPx = ({ radiusPx }: CircleIconMarkerStyle, { scale, hasRing }: CircleIconMarkerAppearance) => {
  const reaches = MARKER_SHADOWS.map(shadow => shadowReach(radiusPx, shadow));
  if (hasRing) reaches.push(radiusPx + SELECTED_RING_PX, shadowReach(radiusPx, SELECTED_SHADOW));
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
  const deviceScale = CIRCLE_ICON_MARKER_PIXEL_RATIO * scale;
  context.setTransform(deviceScale, 0, 0, deviceScale, sizePx / 2, sizePx / 2);
  return { context, deviceScale };
};

const fillCircle = (context: CanvasRenderingContext2D, x: number, radius: number, color: string): void => {
  context.beginPath();
  context.arc(x, 0, radius, 0, Math.PI * 2);
  context.fillStyle = color;
  context.fill();
};

const paintOuterShadow = (
  { context, deviceScale }: Painter,
  halfExtent: number,
  radiusPx: number,
  shadow: CssShadow
): void => {
  context.save();
  context.beginPath();
  context.rect(-halfExtent, -halfExtent, halfExtent * 2, halfExtent * 2);
  context.arc(0, 0, radiusPx, 0, Math.PI * 2);
  context.clip("evenodd");
  context.shadowColor = shadow.color;
  context.shadowBlur = shadow.blur * deviceScale;
  context.shadowOffsetX = SHADOW_CASTER_OFFSET_PX * deviceScale;
  context.shadowOffsetY = shadow.offsetY * deviceScale;
  fillCircle(context, -SHADOW_CASTER_OFFSET_PX, radiusPx + shadow.spread, "#000000");
  context.restore();
};

const paintButton = (painter: Painter, halfExtent: number, style: CircleIconMarkerStyle): void => {
  const { context } = painter;
  const { radiusPx, fillColor, iconPaths, iconWidth, iconHeight, iconBoxPx } = style;
  MARKER_SHADOWS.forEach(shadow => paintOuterShadow(painter, halfExtent, radiusPx, shadow));
  fillCircle(context, 0, radiusPx, MARKER_FOREGROUND_COLOR);
  fillCircle(context, 0, radiusPx - MARKER_BORDER_PX, fillColor);

  const iconScale = iconBoxPx / Math.max(iconWidth, iconHeight);
  context.save();
  context.scale(iconScale, iconScale);
  context.translate(-iconWidth / 2, -iconHeight / 2);
  context.fillStyle = MARKER_FOREGROUND_COLOR;
  iconPaths.forEach(path => context.fill(new Path2D(path)));
  context.restore();
};

/** Paints a marker for a Mapbox symbol layer; register the result with `pixelRatio: CIRCLE_ICON_MARKER_PIXEL_RATIO`. */
export const renderCircleIconMarker = (
  style: CircleIconMarkerStyle,
  appearance: CircleIconMarkerAppearance
): ImageData => {
  const halfExtent = getHalfExtentPx(style, appearance);
  const sizePx = halfExtent * 2 * CIRCLE_ICON_MARKER_PIXEL_RATIO;
  const target = createPainter(sizePx, appearance.scale);

  if (appearance.hasRing) paintOuterShadow(target, halfExtent, style.radiusPx, SELECTED_SHADOW);

  const button = createPainter(sizePx, appearance.scale);
  paintButton(button, halfExtent, style);
  target.context.save();
  target.context.resetTransform();
  target.context.globalAlpha = appearance.opacity;
  target.context.drawImage(button.context.canvas, 0, 0);
  target.context.restore();

  if (appearance.hasRing) {
    target.context.beginPath();
    target.context.arc(0, 0, style.radiusPx + SELECTED_RING_PX / 2, 0, Math.PI * 2);
    target.context.lineWidth = SELECTED_RING_PX;
    target.context.strokeStyle = SELECTED_RING_COLOR;
    target.context.stroke();
  }

  return target.context.getImageData(0, 0, sizePx, sizePx);
};
