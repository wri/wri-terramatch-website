import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";

import Log from "@/utils/log";

import { MapStyle } from "../MapControls/types";
import { addGoogleSatelliteLayer, removeGoogleSatelliteLayer, updateMapProjection } from "../utils";

export const useGoogleSatellite = (
  currentStyle: MapStyle,
  styleLoaded: boolean,
  map: React.RefObject<mapboxgl.Map | null>,
  mapContainer: React.RefObject<HTMLDivElement | null>
) => {
  const currentStyleRef = useRef(currentStyle);
  currentStyleRef.current = currentStyle;

  useEffect(() => {
    const currentMap = map.current;
    const currentContainer = mapContainer.current;
    if (!currentMap || !currentContainer) return;

    let isEffectActive = true;
    let rafId: number | null = null;

    const addGoogleLayer = () => {
      if (!isEffectActive) return true;
      if (currentMap.isStyleLoaded()) {
        addGoogleSatelliteLayer(currentMap);
        updateMapProjection(currentMap, MapStyle.GoogleSatellite);
        return true;
      }
      return false;
    };

    const updateAttribution = () => {
      const attributionInner = currentContainer.querySelector(".mapboxgl-ctrl-attrib-inner");
      if (!attributionInner) return false;

      const existingGoogle = attributionInner.querySelector(".google-attribution-text");

      if (currentStyleRef.current === MapStyle.GoogleSatellite) {
        if (!existingGoogle) {
          const googleText = document.createElement("span");
          googleText.className = "google-attribution-text";
          googleText.textContent = " © Google";
          attributionInner.appendChild(googleText);
        }
        return true;
      } else {
        existingGoogle?.remove();
        return true;
      }
    };

    const pollForGoogleSetup = (attemptsLeft = 120) => {
      if (!isEffectActive) return;
      if (currentStyleRef.current !== MapStyle.GoogleSatellite) return;

      const layerAdded = addGoogleLayer();
      const attributionAdded = updateAttribution();

      if (layerAdded && attributionAdded) return;

      if (attemptsLeft > 0) {
        rafId = requestAnimationFrame(() => pollForGoogleSetup(attemptsLeft - 1));
      } else {
        if (!layerAdded) {
          Log.error("Failed to add Google layer after 120 attempts");
        }
      }
    };

    if (currentStyle === MapStyle.GoogleSatellite) {
      const handleStyleLoad = () => {
        if (isEffectActive && currentStyleRef.current === MapStyle.GoogleSatellite) {
          pollForGoogleSetup();
        }
      };

      const layerAdded = addGoogleLayer();
      const attributionAdded = updateAttribution();

      if (!layerAdded || !attributionAdded) {
        pollForGoogleSetup();
      }

      currentMap.on("style.load", handleStyleLoad);

      return () => {
        isEffectActive = false;
        currentMap.off("style.load", handleStyleLoad);
        if (rafId != null) {
          cancelAnimationFrame(rafId);
        }
      };
    } else {
      removeGoogleSatelliteLayer(currentMap);
      updateAttribution();
    }
  }, [currentStyle, styleLoaded, map, mapContainer]);
};
