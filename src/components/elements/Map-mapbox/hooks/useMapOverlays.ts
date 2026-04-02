import mapboxgl from "mapbox-gl";
import { MutableRefObject, useEffect } from "react";

import {
  addBorderCountry,
  addBorderLandscape,
  removeAnrPlotGeometryOverlay,
  removeBorderCountry,
  removeBorderLandscape,
  upsertAnrPlotGeometryOverlay
} from "../layers/overlayLayers";

type AnrMapOverlay = {
  drawerOpen?: boolean;
  anrTabActive?: boolean;
  showPlotsOnMap?: boolean;
} | null;

type UseMapOverlaysParams = {
  map: MutableRefObject<mapboxgl.Map | null>;
  selectedCountry?: string | null;
  selectedLandscapes?: string[];
  anrMapOverlay?: AnrMapOverlay;
  anrPlotGeometryDto?: { geojson?: any } | null;
  styleLoaded: boolean;
  sourcesAdded: boolean;
};

/**
 * Manages all overlay contracts:
 * - OV-1/OV-2: Country and landscape borders appear/disappear when selection changes
 * - OV-3/OV-4: ANR plot overlay is added or removed based on drawer state
 * - OV-4: Custom layers reappear after a style switch
 */
export function useMapOverlays({
  map,
  selectedCountry,
  selectedLandscapes,
  anrMapOverlay,
  anrPlotGeometryDto,
  styleLoaded,
  sourcesAdded
}: UseMapOverlaysParams) {
  // ANR overlay: add/remove when drawer state or geometry changes
  useEffect(() => {
    if (map.current == null) return;
    const currentMap = map.current;

    const applyAnrOverlay = () => {
      const features = anrPlotGeometryDto?.geojson?.features;
      const shouldShow =
        anrMapOverlay != null &&
        anrMapOverlay.drawerOpen === true &&
        anrMapOverlay.anrTabActive === true &&
        anrMapOverlay.showPlotsOnMap === true &&
        features != null &&
        features.length > 0;

      if (!shouldShow) {
        removeAnrPlotGeometryOverlay(currentMap);
        return;
      }
      upsertAnrPlotGeometryOverlay(currentMap, anrPlotGeometryDto?.geojson, { visible: true });
    };

    currentMap.on("style.load", applyAnrOverlay);
    applyAnrOverlay();

    return () => {
      currentMap.off("style.load", applyAnrOverlay);
      removeAnrPlotGeometryOverlay(currentMap);
    };
  }, [map, anrMapOverlay, anrPlotGeometryDto, styleLoaded, sourcesAdded]);

  // Country border
  useEffect(() => {
    if (map.current == null || !sourcesAdded) return;

    const setupBorders = () => {
      if (selectedCountry) {
        addBorderCountry(map.current!, selectedCountry);
      } else {
        removeBorderCountry(map.current!);
      }
    };

    if (map.current.isStyleLoaded()) {
      setupBorders();
    } else {
      map.current.once("render", setupBorders);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry, styleLoaded, sourcesAdded]);

  // Landscape border
  useEffect(() => {
    if (map.current == null || !sourcesAdded) return;

    const setupBorders = () => {
      if (selectedLandscapes != null && selectedLandscapes.length > 0) {
        addBorderLandscape(map.current!, selectedLandscapes);
      } else {
        removeBorderLandscape(map.current!);
      }
    };

    if (map.current.isStyleLoaded()) {
      setupBorders();
    } else {
      map.current.once("render", setupBorders);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLandscapes, styleLoaded, sourcesAdded]);
}
