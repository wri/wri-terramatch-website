import { Map as MapboxMap } from "mapbox-gl";

const DRAWING_CURSOR_PEN_ICON_URL = "/images/pen_icon.png";
const SOURCE_ICON_SIZE = 32;
/** 21px display size for the 32px pen_icon.png source asset. */
const DISPLAY_ICON_SIZE = 21;
/** Hotspot tuned on the 32×32 asset; scaled with the display size. */
const SOURCE_HOTSPOT_X = 11;
const SOURCE_HOTSPOT_Y = 2;

const DISPLAY_HOTSPOT_X = Math.round((SOURCE_HOTSPOT_X * DISPLAY_ICON_SIZE) / SOURCE_ICON_SIZE);
const DISPLAY_HOTSPOT_Y = Math.round((SOURCE_HOTSPOT_Y * DISPLAY_ICON_SIZE) / SOURCE_ICON_SIZE);

let cachedCursorValue: string | null = null;
let preloadPromise: Promise<string> | null = null;

const buildCursorValue = (imageUrl: string): string =>
  `url("${imageUrl}") ${DISPLAY_HOTSPOT_X} ${DISPLAY_HOTSPOT_Y}, default`;

const setElementCursor = (element: HTMLElement, cursor: string): void => {
  element.style.setProperty("cursor", cursor, "important");
};

const createScaledCursorDataUrl = (image: HTMLImageElement): string => {
  const canvas = document.createElement("canvas");
  canvas.width = DISPLAY_ICON_SIZE;
  canvas.height = DISPLAY_ICON_SIZE;

  const context = canvas.getContext("2d");
  if (context == null) return DRAWING_CURSOR_PEN_ICON_URL;

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, 0, 0, DISPLAY_ICON_SIZE, DISPLAY_ICON_SIZE);

  return canvas.toDataURL("image/png");
};

export const preloadMapDrawingCursor = (): Promise<string> => {
  if (cachedCursorValue != null) return Promise.resolve(cachedCursorValue);
  if (preloadPromise != null) return preloadPromise;

  preloadPromise = new Promise(resolve => {
    const image = new Image();
    image.onload = () => {
      const dataUrl = createScaledCursorDataUrl(image);
      cachedCursorValue = buildCursorValue(dataUrl);
      resolve(cachedCursorValue);
    };
    image.onerror = () => {
      cachedCursorValue = buildCursorValue(DRAWING_CURSOR_PEN_ICON_URL);
      resolve(cachedCursorValue);
    };
    image.src = DRAWING_CURSOR_PEN_ICON_URL;
  });

  return preloadPromise;
};

export const applyMapDrawingCursor = (map: MapboxMap): void => {
  const apply = (cursor: string): void => {
    setElementCursor(map.getCanvas(), cursor);
    setElementCursor(map.getCanvasContainer(), cursor);
  };

  if (cachedCursorValue != null) {
    apply(cachedCursorValue);
    return;
  }

  void preloadMapDrawingCursor().then(apply);
};

export const resetMapDrawingCursor = (map: MapboxMap): void => {
  map.getCanvas().style.removeProperty("cursor");
  map.getCanvasContainer().style.removeProperty("cursor");
};

if (typeof window !== "undefined") {
  void preloadMapDrawingCursor();
}
