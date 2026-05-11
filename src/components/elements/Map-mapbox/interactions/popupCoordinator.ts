import type { Map as MapboxMap, MapMouseEvent } from "mapbox-gl";

type PopupCloser = () => void;
export type PopupKind = "POLYGON" | "MEDIA";

const closersByMap = new WeakMap<MapboxMap, Map<PopupKind, PopupCloser>>();

const getClosers = (map: MapboxMap): Map<PopupKind, PopupCloser> => {
  let entry = closersByMap.get(map);
  if (entry == null) {
    entry = new Map();
    closersByMap.set(map, entry);
  }
  return entry;
};

export const setActivePopup = (map: MapboxMap, kind: PopupKind, closer: PopupCloser): void => {
  const closers = getClosers(map);
  const otherKinds: PopupKind[] = [];
  closers.forEach((_value, existingKind) => {
    if (existingKind !== kind) otherKinds.push(existingKind);
  });
  for (const otherKind of otherKinds) {
    const existingCloser = closers.get(otherKind);
    closers.delete(otherKind);
    existingCloser?.();
  }
  closers.set(kind, closer);
};

export const clearActivePopup = (map: MapboxMap, kind: PopupKind): void => {
  closersByMap.get(map)?.delete(kind);
};

export const closeAllPopups = (map: MapboxMap): void => {
  const closers = closersByMap.get(map);
  if (closers == null) return;
  const snapshot = Array.from(closers.values());
  closers.clear();
  snapshot.forEach(closer => closer());
};

const backgroundClickHandlers = new WeakMap<MapboxMap, (e: MapMouseEvent) => void>();

// Close popups on map click unless the event was `preventDefault`ed (layer hit).
export const enableBackgroundClickClose = (map: MapboxMap): void => {
  if (backgroundClickHandlers.has(map)) return;
  const handler = (e: MapMouseEvent): void => {
    if (e.defaultPrevented) return;
    closeAllPopups(map);
  };
  backgroundClickHandlers.set(map, handler);
  map.on("click", handler);
};

export const disableBackgroundClickClose = (map: MapboxMap): void => {
  const handler = backgroundClickHandlers.get(map);
  if (handler == null) return;
  try {
    map.off("click", handler);
  } catch {
    // map already removed
  }
  backgroundClickHandlers.delete(map);
};
