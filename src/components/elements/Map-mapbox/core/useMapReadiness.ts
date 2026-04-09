import mapboxgl from "mapbox-gl";
import { useEffect, useState } from "react";

/**
 * WHY styleVersion exists:
 *   Mapbox v2 fires style.load on every style switch. After the first load, styleReady
 *   stays `true` — so `useEffect([styleReady])` won't re-run on subsequent style switches.
 *   styleVersion increments on every style.load, so effects that add layers always re-run
 *   after a style switch even though styleReady never went false.
 *
 * WHY this receives map?.current (a value, not the MutableRefObject):
 *   Passing the ref makes the effect dep [mapRef] stable.
 * Passing map?.current means the effect re-runs when Map.tsx re-renders with
 *   the live instance (triggered by useMap.ts → setStyleLoaded(true)). Do NOT change this.
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
