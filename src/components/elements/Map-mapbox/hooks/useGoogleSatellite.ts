import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";

import { MapStyle } from "../MapControls/types";
import { addGoogleSatelliteLayer, removeGoogleSatelliteLayer, updateMapProjection } from "../utils";

export const useGoogleSatellite = (
  currentStyle: MapStyle,
  styleReady: boolean,
  styleVersion: number,
  map: React.RefObject<mapboxgl.Map | null>,
  mapContainer: React.RefObject<HTMLDivElement | null>
) => {
  const currentStyleRef = useRef(currentStyle);
  currentStyleRef.current = currentStyle;

  useEffect(() => {
    const currentMap = map.current;
    const currentContainer = mapContainer.current;
    if (!currentMap || !currentContainer || !styleReady) return;

    // The effect only runs after styleReady=true and styleVersion bump, which means
    // style.load has already fired. addGoogleSatelliteLayer's internal isStyleLoaded()
    // guard is therefore always true here — no polling needed.
    if (currentStyle === MapStyle.GoogleSatellite) {
      const GOOGLE_RASTER_LAYER_ID = "google-satellite-layer";
      if (!currentMap.getLayer(GOOGLE_RASTER_LAYER_ID)) {
        addGoogleSatelliteLayer(currentMap);
        updateMapProjection(currentMap, MapStyle.GoogleSatellite);
      }
    } else {
      removeGoogleSatelliteLayer(currentMap);
    }

    // Attribution DOM query is deferred because .mapboxgl-ctrl-attrib-inner is
    // rendered asynchronously by Mapbox's attribution control — it may not exist at
    // the exact frame style.load fires. 50ms covers the DOM render lag without
    // a busy rAF loop (the original reason for 180-frame polling).
    const timeoutId = setTimeout(() => {
      const attributionInner = currentContainer.querySelector(".mapboxgl-ctrl-attrib-inner");
      if (!attributionInner) return;

      const existingGoogle = attributionInner.querySelector(".google-attribution-text");
      if (currentStyleRef.current === MapStyle.GoogleSatellite) {
        if (!existingGoogle) {
          const googleText = document.createElement("span");
          googleText.className = "google-attribution-text";
          googleText.textContent = " © Google";
          attributionInner.appendChild(googleText);
        }
      } else {
        existingGoogle?.remove();
      }
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [currentStyle, styleReady, styleVersion, map, mapContainer]);
};
