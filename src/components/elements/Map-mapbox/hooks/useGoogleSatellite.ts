import { Map as MapboxMap } from "mapbox-gl";
import { useEffect, useRef } from "react";

import { MapStyle } from "../MapControls/types";
import { addGoogleSatelliteLayer, removeGoogleSatelliteLayer, updateMapProjection } from "../utils";

export const useGoogleSatellite = (
  currentStyle: MapStyle,
  styleReady: boolean,
  styleVersion: number,
  map: React.RefObject<MapboxMap | null>,
  mapContainer: React.RefObject<HTMLDivElement | null>
) => {
  const currentStyleRef = useRef(currentStyle);
  currentStyleRef.current = currentStyle;

  useEffect(() => {
    const currentMap = map.current;
    const currentContainer = mapContainer.current;
    if (!currentMap || !currentContainer || !styleReady) return;

    if (currentStyle === MapStyle.GoogleSatellite) {
      const GOOGLE_RASTER_LAYER_ID = "google-satellite-layer";
      if (!currentMap.getLayer(GOOGLE_RASTER_LAYER_ID)) {
        addGoogleSatelliteLayer(currentMap);
        updateMapProjection(currentMap, MapStyle.GoogleSatellite);
      }
    } else {
      removeGoogleSatelliteLayer(currentMap);
    }

    const applyAttribution = (): boolean => {
      const attributionInner = currentContainer.querySelector(".mapboxgl-ctrl-attrib-inner");
      if (attributionInner == null) return false;

      const existingGoogle = attributionInner.querySelector(".google-attribution-text");
      if (currentStyleRef.current === MapStyle.GoogleSatellite) {
        if (existingGoogle == null) {
          const span = document.createElement("span");
          span.className = "google-attribution-text";
          span.textContent = " © Google";
          attributionInner.appendChild(span);
        }
      } else {
        existingGoogle?.remove();
      }
      return true;
    };

    const observer = new MutationObserver(applyAttribution);
    observer.observe(currentContainer, { childList: true, subtree: true });
    applyAttribution();
    return () => observer.disconnect();
  }, [currentStyle, styleReady, styleVersion, map, mapContainer]);
};
