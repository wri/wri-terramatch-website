import { Map as MapboxMap } from "mapbox-gl";
import { useEffect, useState } from "react";

// Bump on every `style.load` so layers re-attach after `setStyle` (not only the first load).
export function useMapReadiness(map: MapboxMap | null | undefined): {
  styleReady: boolean;
  styleVersion: number;
} {
  const [styleReady, setStyleReady] = useState(false);
  const [styleVersion, setStyleVersion] = useState(0);

  useEffect(() => {
    if (map == null) return;

    let cancelled = false;

    const bump = () => {
      if (cancelled || map == null) return;
      setStyleReady(true);
      setStyleVersion(v => v + 1);
    };

    if (map.isStyleLoaded()) {
      bump();
    } else {
      setStyleReady(false);
    }

    const onStyleLoad = () => bump();

    const onMapLoad = () => {
      if (cancelled || map == null) return;
      setStyleReady(true);
    };

    map.on("style.load", onStyleLoad);
    map.on("load", onMapLoad);
    map.once("idle", () => {
      if (cancelled || map == null) return;
      setStyleReady(true);
    });

    return () => {
      cancelled = true;
      map.off("style.load", onStyleLoad);
      map.off("load", onMapLoad);
      setStyleReady(false);
    };
  }, [map]);

  return { styleReady, styleVersion };
}
