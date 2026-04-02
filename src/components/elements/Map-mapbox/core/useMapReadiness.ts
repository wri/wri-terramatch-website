import mapboxgl from "mapbox-gl";
import { useEffect, useState } from "react";

export type MapReadiness = {
  /** True after style.load fires. Resets to false on each style switch (LC-3). */
  styleReady: boolean;
  /** True after the caller has finished adding sources and layers (LC-2). */
  sourcesReady: boolean;
  /** Called by useMapLayers once addSourcesToLayers completes. */
  setSourcesReady: (value: boolean) => void;
};

/**
 * Single source of truth for map readiness (contracts LC-2, LC-3, LC-4).
 *
 * Replaces the scattered mix of isStyleLoaded(), loaded(), idle, and rAF polling
 * that previously lived in three different places inside Map.tsx.
 *
 * Usage:
 *   const { styleReady, sourcesReady, setSourcesReady } = useMapReadiness(map.current);
 *   // Gate any layer-add effect on styleReady.
 *   // Call setSourcesReady(true) once sources are added.
 *   // Gate border/overlay effects on sourcesReady.
 */
export function useMapReadiness(map: mapboxgl.Map | null | undefined): MapReadiness {
  const [styleReady, setStyleReady] = useState(false);
  const [sourcesReady, setSourcesReady] = useState(false);

  useEffect(() => {
    if (map == null) return;

    const handleStyleLoad = () => {
      setStyleReady(true);
      setSourcesReady(false);
    };

    if (map.isStyleLoaded()) {
      setStyleReady(true);
    } else {
      setStyleReady(false);
    }

    map.on("style.load", handleStyleLoad);

    return () => {
      map.off("style.load", handleStyleLoad);
    };
  }, [map]);

  return { styleReady, sourcesReady, setSourcesReady };
}
