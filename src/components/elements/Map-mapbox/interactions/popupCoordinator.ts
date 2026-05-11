import type { Map as MapboxMap, MapMouseEvent } from "mapbox-gl";

/**
 * Coordinates "single open popup" behavior across heterogeneous popup sources on the same map
 * (e.g. polygon Mapbox Popups, media DOM-marker MapPopUps, future centroid popups).
 *
 * Contract:
 * - Each popup source registers a `kind` and a `closer` when it opens its popup.
 * - Opening a popup of any `kind` closes (and unregisters) every other registered kind.
 * - Within the same `kind`, this module does not reset state; the opener is responsible for
 *   replacing its own popup (e.g. Mapbox Popup `removePopups("POLYGON")` before adding,
 *   selection store `set(uuid)` replacing the previous selection).
 * - A popup that closes via user action calls `clearActivePopup(kind)` to release its slot
 *   without re-invoking its own closer.
 */

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
  // Snapshot keys before iterating; closers may re-enter and mutate the map.
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

/**
 * Wires a global `map.click` listener that closes every active popup whenever the user clicks
 * the map background. Distinguishes layer clicks from background clicks via Mapbox's
 * `MapMouseEvent.defaultPrevented` flag — layer click handlers must call `e.preventDefault()`
 * to mark the click as consumed. DOM markers must `stopPropagation()` on their host element so
 * Mapbox never synthesizes a `map.click` for them in the first place.
 *
 * Idempotent per map.
 */
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
    // Map may already be removed; safe to ignore.
  }
  backgroundClickHandlers.delete(map);
};
