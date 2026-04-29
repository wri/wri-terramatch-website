import { Map as MapboxMap } from "mapbox-gl";
import { MutableRefObject, useEffect, useState } from "react";

import { getCurrentMapStyle, setMapStyle } from "../layers/overlayLayers";
import { MapStyle } from "../MapControls/types";

type UseMapStyleParams = {
  map: MutableRefObject<MapboxMap | null>;
  mapStyleProp?: MapStyle;
  styleReady: boolean;
  projectUUID?: string;
  dashboardMode?: string;
  onStyleChange?: (style: MapStyle) => void;
};

type UseMapStyleReturn = {
  currentStyle: MapStyle;
  handleStyleChange: (newStyle: MapStyle) => void;
};

export function useMapStyle({
  map,
  mapStyleProp,
  styleReady,
  projectUUID,
  dashboardMode,
  onStyleChange
}: UseMapStyleParams): UseMapStyleReturn {
  const [currentStyle, setCurrentStyle] = useState<MapStyle>(() => {
    return mapStyleProp !== undefined ? mapStyleProp : dashboardMode ? MapStyle.Street : MapStyle.Satellite;
  });
  const [userChangedStyle, setUserChangedStyle] = useState(false);

  const handleStyleChange = (newStyle: MapStyle) => {
    setCurrentStyle(newStyle);
    setUserChangedStyle(true);
    onStyleChange?.(newStyle);
  };

  useEffect(() => {
    if (map.current == null || !styleReady) return;
    if (mapStyleProp != null && mapStyleProp !== currentStyle) {
      const actualStyle = getCurrentMapStyle(map.current);
      if (actualStyle !== mapStyleProp) {
        setMapStyle(mapStyleProp, map.current, setCurrentStyle, currentStyle);
      } else {
        setCurrentStyle(mapStyleProp);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapStyleProp, map, styleReady]);

  useEffect(() => {
    setUserChangedStyle(false);
  }, [projectUUID]);

  useEffect(() => {
    if (map.current == null || projectUUID == null || projectUUID === "" || userChangedStyle || !styleReady) return;
    setMapStyle(MapStyle.Satellite, map.current, setCurrentStyle, currentStyle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectUUID, userChangedStyle, styleReady]);

  return { currentStyle, handleStyleChange };
}
