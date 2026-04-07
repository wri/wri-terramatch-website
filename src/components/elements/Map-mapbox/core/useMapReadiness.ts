import mapboxgl from "mapbox-gl";
import { useEffect, useState } from "react";

/**
 * Single source of truth for style readiness (contracts LC-2, LC-3, LC-4).
 *
 * Returns:
 *   - `styleReady` boolean: true while the basemap style is safe to write to.
 *   - `styleVersion` number: increments on every style.load (0 = never loaded).
 *
 * WHY styleVersion instead of just styleReady:
 *   Mapbox v2 fires style.load on every style switch. After the first load styleReady
 *   stays `true` — so `useEffect([styleReady])` won't re-run on the second load.
 *   `styleVersion` gives each load a unique number, so effects that add layers will
 *   always re-run after a style switch, even though styleReady never went false.
 *
 * WHY this receives map?.current (a value, not the MutableRefObject):
 *   The effect dep array is `[map]`. Passing the ref (stable identity) means the
 *   effect runs once on mount when map.current is still null — no listener is registered.
 *   Passing map?.current means the effect re-runs when Map.tsx re-renders with the
 *   live instance (triggered by useMap.ts → setStyleLoaded(true)). Do NOT change this.
 *
 * "Sources added" state belongs to useMapLayers — not here. This hook has one job:
 * track whether the basemap style is safe to write to.
 */
export function useMapReadiness(map: mapboxgl.Map | null | undefined): {
  styleReady: boolean;
  styleVersion: number;
} {
  const [styleReady, setStyleReady] = useState(false);
  const [styleVersion, setStyleVersion] = useState(0);

  useEffect(() => {
    if (map == null) return;

    const handleStyleLoad = () => {
      setStyleReady(true);
      setStyleVersion(v => v + 1);
    };

    // Synchronous check: if style was already loaded when this effect ran
    // (common on re-renders after initMap completes).
    if (map.isStyleLoaded()) {
      handleStyleLoad();
    } else {
      setStyleReady(false);
    }

    map.on("style.load", handleStyleLoad);

    return () => {
      map.off("style.load", handleStyleLoad);
      setStyleReady(false);
    };
  }, [map]);

  return { styleReady, styleVersion };
}
