import { Map as MapboxMap } from "mapbox-gl";
import { MutableRefObject, useEffect } from "react";

import {
  addBorderLandscape,
  removeAnrPlotGeometryOverlay,
  removeBorderLandscape,
  upsertAnrPlotGeometryOverlay
} from "../layers/overlayLayers";

type AnrMapOverlay = {
  drawerOpen?: boolean;
  anrTabActive?: boolean;
  showPlotsOnMap?: boolean;
  polygonStatus?: string | null;
  polygonName?: string | null;
} | null;

type UseMapOverlaysParams = {
  map: MutableRefObject<MapboxMap | null>;
  selectedLandscapes?: string[];
  anrMapOverlay?: AnrMapOverlay;
  anrPlotGeometryDto?: { geojson?: any } | null;
  styleReady: boolean;
  styleVersion: number;
  sourcesAdded: boolean;
};

export function useMapOverlays({
  map,
  selectedLandscapes,
  anrMapOverlay,
  anrPlotGeometryDto,
  styleReady,
  styleVersion,
  sourcesAdded
}: UseMapOverlaysParams) {
  const selectedLandscapeKey = selectedLandscapes?.join("|") ?? "";

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
    upsertAnrPlotGeometryOverlay(currentMap, anrPlotGeometryDto?.geojson, {
      visible: true,
      polygonStatus: anrMapOverlay?.polygonStatus ?? null,
      polygonName: anrMapOverlay?.polygonName ?? null
    });

    return () => {
      removeAnrPlotGeometryOverlay(currentMap);
    };
  }, [map, anrMapOverlay, anrPlotGeometryDto, styleReady, styleVersion, sourcesAdded]);

  useEffect(() => {
    const currentMap = map.current;
    if (currentMap == null) return;

    if (selectedLandscapes == null || selectedLandscapes.length === 0) {
      removeBorderLandscape(currentMap);
      return;
    }

    if (!styleReady || !sourcesAdded) return;

    addBorderLandscape(currentMap, selectedLandscapes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLandscapeKey, styleReady, styleVersion, sourcesAdded]);
}
