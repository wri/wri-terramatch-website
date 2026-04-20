import mapboxgl from "mapbox-gl";
import { useEffect, useState } from "react";

/** styleVersion re-triggers deps after each style.load; `map` (instance) must be the effect dep, not the ref. */
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
