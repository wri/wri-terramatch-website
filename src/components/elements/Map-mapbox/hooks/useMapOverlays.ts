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
  /** True when style.load fired — from core/useMapReadiness. */
  styleReady: boolean;
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
  styleReady,
  sourcesAdded
}: UseMapOverlaysParams) {
  // ANR overlay: add/remove when drawer state or geometry changes (OV-3, OV-4).
  // upsertAnrPlotGeometryOverlay already handles its own "idle" retry internally
  // for the edge case where the map is mid-render when the overlay is requested.
  useEffect(() => {
    if (map.current == null) return;
    const currentMap = map.current;

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

    return () => {
      removeAnrPlotGeometryOverlay(currentMap);
    };
  }, [map, anrMapOverlay, anrPlotGeometryDto, styleReady, sourcesAdded]);

  // Country border (OV-1): gated on sourcesAdded so the source exists before the border is added.
  useEffect(() => {
    if (map.current == null || !sourcesAdded) return;
    if (selectedCountry) {
      addBorderCountry(map.current, selectedCountry);
    } else {
      removeBorderCountry(map.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry, styleReady, sourcesAdded]);

  // Landscape border (OV-2)
  useEffect(() => {
    if (map.current == null || !sourcesAdded) return;
    if (selectedLandscapes != null && selectedLandscapes.length > 0) {
      addBorderLandscape(map.current, selectedLandscapes);
    } else {
      removeBorderLandscape(map.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLandscapes, styleReady, sourcesAdded]);
}
